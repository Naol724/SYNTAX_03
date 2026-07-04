import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongoose"
import { Testimonial } from "@/lib/models"

// GET all testimonials (admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 })

    return NextResponse.json({ testimonials })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

// POST new testimonial (admin)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const body = await req.json()
    const testimonial = await Testimonial.create(body)

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}
