import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import { Newsletter } from "@/lib/models"
import { sendEmail } from "@/lib/email"

// POST subscribe to newsletter (public)
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const body = await req.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email })
    if (existing) {
      if (existing.active) {
        return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
      } else {
        // Reactivate
        await Newsletter.findByIdAndUpdate(existing._id, { active: true })
        return NextResponse.json({ message: "Subscription reactivated" })
      }
    }

    // Create new subscription
    const subscription = await Newsletter.create({
      email,
      name: name || "",
      active: true,
      source: "website",
    })

    // Send confirmation email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Syntax Newsletter!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll receive the latest tech insights, company updates, and industry trends directly in your inbox.</p>
        <p>Stay tuned for exciting content!</p>
        <p style="margin-top: 30px;">Best regards,<br>The Syntax Software Solutions Team</p>
      </div>
    `

    await sendEmail({
      to: email,
      subject: "Welcome to Syntax Newsletter",
      html,
    })

    return NextResponse.json({ message: "Successfully subscribed" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
