import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  syncAllDefaults,
  ensureAllSeeded,
  getDefaultCounts,
  CONTENT_SEED_VERSION,
} from "@/lib/seed-content"
import { listResource, getActiveStoreInfo } from "@/lib/content-repo"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * POST /api/admin/seed
 * Body: { replace?: boolean }  — replace=true wipes & loads full local defaults
 * Default: upgrade incomplete collections + insert any missing defaults
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let replace = false
    try {
      const body = await req.json()
      replace = !!body?.replace
    } catch {
      // empty body OK
    }

    // Always upgrade partial deploys to the full local catalog
    const results = await syncAllDefaults({ replace })

    const [services, portfolio, blog, testimonials, team] = await Promise.all([
      listResource("services", { bypassCache: true }),
      listResource("portfolio", { bypassCache: true }),
      listResource("blog", { bypassCache: true }),
      listResource("testimonials", { bypassCache: true }),
      listResource("team", { bypassCache: true }),
    ])

    return NextResponse.json({
      ok: true,
      seedVersion: CONTENT_SEED_VERSION,
      replace,
      message: replace
        ? "Replaced content with full local defaults."
        : "Synced missing content so deploy matches the full site catalog.",
      store: getActiveStoreInfo(),
      results,
      counts: {
        services: services.length,
        portfolio: portfolio.length,
        blog: blog.length,
        testimonials: testimonials.length,
        team: team.length,
      },
      defaults: getDefaultCounts(),
    })
  } catch (error: any) {
    console.error("Admin seed error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to seed content" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureAllSeeded()

    const [services, portfolio, blog, testimonials, team] = await Promise.all([
      listResource("services"),
      listResource("portfolio"),
      listResource("blog"),
      listResource("testimonials"),
      listResource("team"),
    ])

    const defaults = getDefaultCounts()
    const counts = {
      services: services.length,
      portfolio: portfolio.length,
      blog: blog.length,
      testimonials: testimonials.length,
      team: team.length,
    }

    const incomplete =
      counts.services < defaults.services ||
      counts.portfolio < defaults.portfolio ||
      counts.blog < defaults.blog ||
      counts.testimonials < defaults.testimonials ||
      counts.team < defaults.team

    return NextResponse.json({
      seedVersion: CONTENT_SEED_VERSION,
      store: getActiveStoreInfo(),
      counts,
      defaults,
      incomplete,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to read seed status" },
      { status: 500 }
    )
  }
}
