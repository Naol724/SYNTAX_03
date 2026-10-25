import { NextRequest, NextResponse } from "next/server"
import { listResource } from "@/lib/content-repo"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    let posts = await listResource("blog")
    posts = posts.filter((p: any) => p.published)

    if (category) {
      posts = posts.filter(
        (p: any) => String(p.category || "").toLowerCase() === category.toLowerCase()
      )
    }
    if (featured === "true") posts = posts.filter((p: any) => p.featured)
    if (search) {
      const q = search.toLowerCase()
      posts = posts.filter(
        (p: any) =>
          String(p.title || "").toLowerCase().includes(q) ||
          String(p.excerpt || "").toLowerCase().includes(q)
      )
    }

    const total = posts.length
    const sliced = posts.slice((page - 1) * limit, page * limit)

    return NextResponse.json(
      {
        posts: sliced,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
        },
      }
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}
