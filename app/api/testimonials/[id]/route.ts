import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongoose"
import { Testimonial } from "@/lib/models"

// PATCH update testimonial (admin)
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
    const testimonial = await Testimonial.findByIdAndUpdate(params.id, body, { new: true })

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}

// DELETE testimonial (admin)
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

    const testimonial = await Testimonial.findByIdAndDelete(params.id)

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Testimonial deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 })
  }
}
