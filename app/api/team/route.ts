import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createResource, listResource, getActiveStoreInfo } from "@/lib/content-repo"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const members = await listResource("team")
    return NextResponse.json({ members, store: getActiveStoreInfo() })
  } catch (error: any) {
    console.error("Team GET error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch team members" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    if (!body.name?.trim() || !body.role?.trim()) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 })
    }

    const member = await createResource("team", {
      name: body.name.trim(),
      role: body.role.trim(),
      bio: body.bio || "",
      image: body.image || "",
      email: body.email || "",
      skills: Array.isArray(body.skills) ? body.skills : [],
      yearsExperience: Number(body.yearsExperience) || 0,
      linkedin: body.linkedin || "",
      github: body.github || "",
      twitter: body.twitter || "",
      active: body.active !== false,
      order: Number(body.order) || 0,
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error: any) {
    console.error("Team POST error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create team member" },
      { status: 500 }
    )
  }
}
