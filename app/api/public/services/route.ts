import { NextRequest, NextResponse } from "next/server"
import { listResource } from "@/lib/content-repo"
import { syncResourceDefaults } from "@/lib/seed-content"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    // Upgrade incomplete deploy catalogs (3 → 8 services) before listing
    await syncResourceDefaults("services", { replace: false })

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    let services = await listResource("services", { bypassCache: true })
    services = services.filter((s: any) => s.active !== false)
    if (category) {
      services = services.filter(
        (s: any) => String(s.category || "").toLowerCase() === category.toLowerCase()
      )
    }

    return NextResponse.json(
      { services },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
        },
      }
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
