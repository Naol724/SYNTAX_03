import { NextRequest, NextResponse } from "next/server"
import { syncAllDefaults, getDefaultCounts, CONTENT_SEED_VERSION } from "@/lib/seed-content"
import { listResource, getActiveStoreInfo } from "@/lib/content-repo"
import { resetStoreModeCache } from "@/lib/file-store"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * Public bootstrap — upgrades incomplete Mongo catalogs to the full local list.
 * Open once after deploy:
 *   https://syntax-03.onrender.com/api/sync-content
 */
export async function GET(_req: NextRequest) {
  try {
    resetStoreModeCache()
    const results = await syncAllDefaults({ replace: false })

    const [services, portfolio, blog, testimonials, team] = await Promise.all([
      listResource("services", { bypassCache: true }),
      listResource("portfolio", { bypassCache: true }),
      listResource("blog", { bypassCache: true }),
      listResource("testimonials", { bypassCache: true }),
      listResource("team", { bypassCache: true }),
    ])

    const counts = {
      services: services.length,
      portfolio: portfolio.length,
      blog: blog.length,
      testimonials: testimonials.length,
      team: team.length,
    }

    return NextResponse.json({
      ok: true,
      seedVersion: CONTENT_SEED_VERSION,
      message:
        "Content synced. Services/projects/blog/testimonials/team should now match the full local catalog.",
      store: getActiveStoreInfo(),
      counts,
      defaults: getDefaultCounts(),
      results,
    })
  } catch (error: any) {
    console.error("[sync-content]", error)
    return NextResponse.json(
      { ok: false, error: error?.message || "Sync failed" },
      { status: 500 }
    )
  }
}
