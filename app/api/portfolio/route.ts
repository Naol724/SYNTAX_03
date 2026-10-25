import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createResource, listResource, getActiveStoreInfo } from "@/lib/content-repo"
import { slugify } from "@/lib/admin-api"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await listResource("portfolio")
    return NextResponse.json({
      projects,
      total: projects.length,
      store: getActiveStoreInfo(),
    })
  } catch (error: any) {
    console.error("Portfolio GET error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to fetch projects" },
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

    if (!body.title?.trim() || !body.description?.trim() || !body.category?.trim()) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      )
    }

    const slug = body.slug?.trim() || slugify(body.title)
    const images = Array.isArray(body.images)
      ? body.images.filter(Boolean)
      : body.thumbnail
        ? [body.thumbnail]
        : []

    const project = await createResource("portfolio", {
      title: body.title.trim(),
      slug,
      description: body.description.trim(),
      category: body.category.trim(),
      images,
      thumbnail: body.thumbnail || images[0] || "",
      client: body.client || "",
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      projectUrl: body.projectUrl || "",
      githubUrl: body.githubUrl || "",
      featured: !!body.featured,
      active: body.active !== false,
      order: Number(body.order) || 0,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error: any) {
    console.error("Portfolio POST error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create project" },
      { status: 500 }
    )
  }
}
