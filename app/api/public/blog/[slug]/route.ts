import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { BlogPost, Comment } from "@/lib/models"

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToDatabase()

    const post = await BlogPost.findOne({ slug: params.slug, published: true })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Increment views
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } })

    // Get related posts
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      published: true,
      $or: [
        { category: post.category },
        { tags: { $in: post.tags } },
      ],
    })
      .limit(4)
      .sort({ createdAt: -1 })

    // Get comments
    const comments = await Comment.find({
      postId: post._id,
      approved: true,
    }).sort({ createdAt: -1 })

    return NextResponse.json({
      post,
      relatedPosts,
      comments,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}
