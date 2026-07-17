import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongoose"
import Blog from "@/models/Blog"

// GET - List all blog posts (admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const query: Record<string, unknown> = {}
    if (status) query.status = status
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ]
    }

    const total = await Blog.countDocuments(query)
    const posts = await Blog.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch posts"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST - Create new blog post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const body = await req.json()
    const { title, slug, content, excerpt, coverImage, categories, tags, status, seo } = body

    if (!title || !slug || !content || !excerpt || !coverImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existing = await Blog.findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const post = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      author: session.user.id,
      categories: categories || [],
      tags: tags || [],
      status: status || "draft",
      seo: seo || {},
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create post"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
