import { NextRequest, NextResponse } from "next/server"
import { listResource } from "@/lib/content-repo"
import { syncResourceDefaults } from "@/lib/seed-content"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    // Upgrade incomplete deploy catalogs (2 → 12 projects) before listing
    await syncResourceDefaults("portfolio", { replace: false })

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = parseInt(searchParams.get("limit") || "50")

    let projects = await listResource("portfolio", { bypassCache: true })
    projects = projects.filter((p: any) => p.active !== false)
    if (category) {
      projects = projects.filter(
        (p: any) => String(p.category || "").toLowerCase() === category.toLowerCase()
      )
    }
    if (featured === "true") {
      projects = projects.filter((p: any) => p.featured)
    }

    return NextResponse.json(
      { projects: projects.slice(0, limit) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
        },
      }
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}
