import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { Portfolio } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = parseInt(searchParams.get("limit") || "10")

    const query: any = { active: true }
    if (category) query.category = category
    if (featured === "true") query.featured = true

    const projects = await Portfolio.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)

    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}
