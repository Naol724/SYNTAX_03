import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { Testimonial } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const featured = searchParams.get("featured")
    const limit = parseInt(searchParams.get("limit") || "10")

    const query: any = { active: true }
    if (featured === "true") query.featured = true

    const testimonials = await Testimonial.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)

    return NextResponse.json({ testimonials })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}
