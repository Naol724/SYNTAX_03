import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  ensureAllSeeded,
  resetSeedFlags,
  getDefaultCounts,
} from "@/lib/seed-content"
import { listResource, getActiveStoreInfo } from "@/lib/content-repo"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * POST /api/admin/seed — fill empty collections with the site's default content
 * so admin lists match public pages after deploy.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    resetSeedFlags()
    await ensureAllSeeded()

    const [services, portfolio, blog, testimonials, team] = await Promise.all([
      listResource("services", { bypassCache: true }),
      listResource("portfolio", { bypassCache: true }),
      listResource("blog", { bypassCache: true }),
      listResource("testimonials", { bypassCache: true }),
      listResource("team", { bypassCache: true }),
    ])

    return NextResponse.json({
      ok: true,
      message: "Content synced. Empty collections were filled with site defaults.",
      store: getActiveStoreInfo(),
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

    return NextResponse.json({
      store: getActiveStoreInfo(),
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
    return NextResponse.json(
      { error: error?.message || "Failed to read seed status" },
      { status: 500 }
    )
  }
}
