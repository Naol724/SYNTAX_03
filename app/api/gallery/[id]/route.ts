import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongoose"
import { Gallery } from "@/lib/models"

// PATCH update gallery item (admin)
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
    const item = await Gallery.findByIdAndUpdate(params.id, body, { new: true })

    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}

// DELETE gallery item (admin)
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

    const item = await Gallery.findByIdAndDelete(params.id)

    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Gallery item deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}
