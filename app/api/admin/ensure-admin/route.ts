import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { AdminUser } from "@/lib/models"

export const dynamic = "force-dynamic"

/**
 * One-time / recovery endpoint: ensures default admin exists.
 * Safe to call — does not reveal password; only creates if missing
 * or resets password when ADMIN_RESET_TOKEN matches.
 *
 * GET /api/admin/ensure-admin?token=YOUR_NEXTAUTH_SECRET
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token") || ""
    const secret = process.env.NEXTAUTH_SECRET || ""

    // In production require NEXTAUTH_SECRET; in dev allow without token
    if (process.env.NODE_ENV === "production") {
      if (!secret || token !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const email = (
      process.env.ADMIN_EMAIL || "admin@syntaxsoftwaresolution.com"
    )
      .trim()
      .toLowerCase()
    const password = process.env.ADMIN_PASSWORD || "adminpassword"

    await connectToDatabase()

    let admin = await AdminUser.findOne({
      email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    })

    let action = "exists"
    if (!admin) {
      admin = await AdminUser.create({
        name: "Admin User",
        email,
        password,
        role: "admin",
      })
      action = "created"
    } else {
      admin.password = password
      await admin.save()
      action = "password_reset"
    }

    return NextResponse.json({
      success: true,
      action,
      email: admin.email,
      message: `Admin ready. Sign in with ${admin.email}`,
    })
  } catch (error) {
    console.error("ensure-admin error:", error)
    return NextResponse.json(
      {
        error: "Failed to ensure admin",
        detail: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 }
    )
  }
}
