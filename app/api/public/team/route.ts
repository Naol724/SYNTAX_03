import { NextResponse } from "next/server"
import { listResource } from "@/lib/content-repo"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    let teamMembers = await listResource("team")
    teamMembers = teamMembers.filter((m: any) => m.active !== false)
    return NextResponse.json(
      { teamMembers },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
        },
      }
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
  }
}
