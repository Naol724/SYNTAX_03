import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongoose"
import { Content } from "@/lib/models"

// PATCH update content (admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const body = await req.json()
    const content = await Content.findByIdAndUpdate(params.id, body, { new: true })

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

// DELETE content (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const content = await Content.findByIdAndDelete(params.id)

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Content deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
  }
}
