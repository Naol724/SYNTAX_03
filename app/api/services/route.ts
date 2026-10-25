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

    const services = await listResource("services")
    return NextResponse.json({
      services,
      total: services.length,
      store: getActiveStoreInfo(),
    })
  } catch (error: any) {
    console.error("Services GET error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch services" },
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

    if (!body.name?.trim() || !body.description?.trim()) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      )
    }

    const service = await createResource("services", {
      name: body.name.trim(),
      description: body.description.trim(),
      shortDescription: body.shortDescription || "",
      icon: body.icon || "",
      price: body.price || "",
      category: body.category || "",
      languages: Array.isArray(body.languages) ? body.languages : [],
      active: body.active !== false,
      featured: !!body.featured,
      order: Number(body.order) || 0,
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error: any) {
    console.error("Services POST error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create service" },
      { status: 500 }
    )
  }
}
