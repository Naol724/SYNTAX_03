import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createResource, listResource, getActiveStoreInfo } from "@/lib/content-repo"
import { slugify } from "@/lib/admin-api"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const published = searchParams.get("published")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    let posts = await listResource("blog")

    if (published === "true") posts = posts.filter((p: any) => p.published)
    if (published === "false") posts = posts.filter((p: any) => !p.published)

    if (search?.trim()) {
      const q = search.trim().toLowerCase()
      posts = posts.filter(
        (p: any) =>
          String(p.title || "").toLowerCase().includes(q) ||
          String(p.excerpt || "").toLowerCase().includes(q)
      )
    }

    const total = posts.length
    const sliced = posts.slice((page - 1) * limit, page * limit)

    return NextResponse.json({
      posts: sliced,
      total,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      store: getActiveStoreInfo(),
    })
  } catch (error: any) {
    console.error("Blog GET error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const slug = body.slug?.trim() || slugify(body.title)

    const post = await createResource("blog", {
      title: body.title.trim(),
      slug,
      excerpt: body.excerpt || "",
      content: body.content.trim(),
      featuredImage: body.featuredImage || "",
      category: body.category || "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      author: body.author || session.user?.name || "Admin",
      published: !!body.published,
      featured: !!body.featured,
      views: 0,
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error("Blog POST error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create post" },
      { status: 500 }
    )
  }
}
