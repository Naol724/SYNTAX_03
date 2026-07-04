import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { Service } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    const query: any = { active: true }
    if (category) query.category = category

    const services = await Service.find(query)
      .sort({ order: 1, createdAt: -1 })

    return NextResponse.json({ services })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
