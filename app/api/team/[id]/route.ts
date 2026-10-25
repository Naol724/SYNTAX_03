import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { deleteResource, updateResource } from "@/lib/content-repo"

export const dynamic = "force-dynamic"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const member = await updateResource("team", params.id, body)

    if (!member) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json(member)
  } catch (error: any) {
    console.error("Team PATCH error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to update team member" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ok = await deleteResource("team", params.id)
    if (!ok) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Team member deleted" })
  } catch (error: any) {
    console.error("Team DELETE error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to delete team member" },
      { status: 500 }
    )
  }
}
