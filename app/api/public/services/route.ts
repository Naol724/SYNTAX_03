import { NextRequest, NextResponse } from "next/server"
import { listResource } from "@/lib/content-repo"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    let services = await listResource("services")
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
