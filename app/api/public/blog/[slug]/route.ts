import { NextRequest, NextResponse } from "next/server"
import { listResource, updateResource } from "@/lib/content-repo"

export const dynamic = "force-dynamic"

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const posts = await listResource("blog")
    const post = posts.find(
      (p: any) => p.slug === params.slug && p.published
    )

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Best-effort view increment
    try {
      await updateResource("blog", String(post._id), {
        views: Number(post.views || 0) + 1,
      })
    } catch {
      /* ignore */
    }

    const relatedPosts = posts
      .filter(
        (p: any) =>
          p.published &&
          p._id !== post._id &&
          (p.category === post.category ||
            (Array.isArray(p.tags) &&
              Array.isArray(post.tags) &&
              p.tags.some((t: string) => post.tags.includes(t))))
      )
      .slice(0, 4)

    return NextResponse.json({
      post: { ...post, views: Number(post.views || 0) + 1 },
      relatedPosts,
      comments: [],
    })
  } catch (error) {
    console.error("Public blog slug error:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}
