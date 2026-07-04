import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongoose"
import { Gallery } from "@/lib/models"

// GET all gallery items (admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const items = await Gallery.find().sort({ order: 1, createdAt: -1 })

    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
  }
}

// POST new gallery item (admin)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const body = await req.json()
    const item = await Gallery.create(body)

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 })
  }
}
