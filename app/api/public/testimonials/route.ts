import { NextRequest, NextResponse } from "next/server"
import { listResource } from "@/lib/content-repo"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get("featured")
    const limit = parseInt(searchParams.get("limit") || "50")

    let testimonials = await listResource("testimonials")
    testimonials = testimonials.filter((t: any) => t.active !== false)
    if (featured === "true") {
      testimonials = testimonials.filter((t: any) => t.featured)
    }

    return NextResponse.json(
      { testimonials: testimonials.slice(0, limit) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
        },
      }
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}
