import { NextResponse } from "next/server"
import { syncAllDefaults, getDefaultCounts, CONTENT_SEED_VERSION } from "@/lib/seed-content"
import { listResource, getActiveStoreInfo } from "@/lib/content-repo"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  let counts: Record<string, number> | null = null
  try {
    await syncAllDefaults({ replace: false })
    const [services, portfolio, blog, testimonials, team] = await Promise.all([
      listResource("services", { bypassCache: true }),
      listResource("portfolio", { bypassCache: true }),
      listResource("blog", { bypassCache: true }),
      listResource("testimonials", { bypassCache: true }),
      listResource("team", { bypassCache: true }),
    ])
    counts = {
      services: services.length,
      portfolio: portfolio.length,
      blog: blog.length,
      testimonials: testimonials.length,
      team: team.length,
    }
  } catch (error) {
    console.error("[health] sync failed:", error)
  }

  return NextResponse.json(
    {
      status: "ok",
      timestamp: Date.now(),
      seedVersion: CONTENT_SEED_VERSION,
      store: getActiveStoreInfo(),
      counts,
      defaults: getDefaultCounts(),
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  )
}
