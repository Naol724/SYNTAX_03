import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongoose"
import Blog from "@/models/Blog"

// GET - Get single blog post
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const post = await Blog.findById(params.id).populate("author", "name email")

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch post"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PUT - Update blog post
export async function PUT(
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

    const post = await Blog.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update post"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE - Delete blog post
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const post = await Blog.findByIdAndDelete(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete post"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
