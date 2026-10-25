import { NextResponse } from "next/server"
import { ensureAllSeeded } from "@/lib/seed-content"
import { getActiveStoreInfo } from "@/lib/content-repo"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  // Warm / sync default content so public + admin stay aligned after deploy
  try {
    await ensureAllSeeded()
  } catch (error) {
    console.error("[health] seed warm-up failed:", error)
  }

  return NextResponse.json(
    {
      status: "ok",
      timestamp: Date.now(),
      store: getActiveStoreInfo(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}
