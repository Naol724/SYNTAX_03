import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { TeamMember } from "@/lib/models"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const teamMembers = await TeamMember.find({ active: true })
      .sort({ order: 1, createdAt: -1 })

    return NextResponse.json({ teamMembers })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 })
  }
}
