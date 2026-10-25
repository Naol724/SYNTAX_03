import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createResource, listResource, getActiveStoreInfo } from "@/lib/content-repo"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const testimonials = await listResource("testimonials")
    return NextResponse.json({
      testimonials,
      total: testimonials.length,
      store: getActiveStoreInfo(),
    })
  } catch (error: any) {
    console.error("Testimonials GET error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    if (!body.name?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "Name and feedback content are required" },
        { status: 400 }
      )
    }

    const testimonial = await createResource("testimonials", {
      name: body.name.trim(),
      company: body.company || "",
      content: body.content.trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      image: body.image || "",
      active: body.active !== false,
      featured: !!body.featured,
      order: Number(body.order) || 0,
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error: any) {
    console.error("Testimonials POST error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create testimonial" },
      { status: 500 }
    )
  }
}
