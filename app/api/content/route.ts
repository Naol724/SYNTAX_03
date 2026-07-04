import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongoose"
import { Content } from "@/lib/models"

// GET all content (admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const section = searchParams.get("section")

    const query: any = {}
    if (section) query.section = section

    const content = await Content.find(query).sort({ section: 1, key: 1 })

    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

// POST new content (admin)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const body = await req.json()
    const content = await Content.create(body)

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  }
}
