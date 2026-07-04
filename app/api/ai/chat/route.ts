import { NextRequest, NextResponse } from "next/server"

const responses: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["service", "services", "offer", "provide", "do you do", "what do you"],
    reply: `We offer the following services at Syntax Software Solutions:

🌐 **Web Development** — Modern, responsive websites built with Next.js & React
📱 **Mobile App Development** — Cross-platform apps with React Native
🎮 **Gaming Platforms** — Custom gaming solutions and platforms
🏢 **Enterprise Systems** — ERP, CRM, and custom business software
🤖 **AI-Powered Bots** — Intelligent chatbots and automation tools

Would you like more details about any of these services?`,
  },
  {
    keywords: ["location", "where", "address", "based", "office", "ethiopia", "addis"],
    reply: `We are based in **Addis Ababa, Ethiopia** 🇪🇹

Our team works with clients locally and internationally. Feel free to reach out to us!`,
  },
  {
    keywords: ["contact", "reach", "email", "phone", "call", "whatsapp"],
    reply: `You can reach us through:

📧 **Email:** syntaxsoftwaresolution@gmail.com
📞 **Phone:** +251 945 455 141
🌐 **Website:** https://syntaxsoftwaresolution.com

We typically respond within 24 hours.`,
  },
  {
    keywords: ["price", "cost", "how much", "pricing", "rate", "charge", "fee"],
    reply: `Our pricing depends on the project scope:

🌐 **Web Development** — Starting at $500
📱 **Mobile Apps** — Starting at $1,000
🏢 **Enterprise Systems** — Custom quote
🤖 **AI Bots** — Starting at $300

Contact us at syntaxsoftwaresolution@gmail.com for a free custom quote!`,
  },
  {
    keywords: ["tech", "technology", "stack", "framework", "language", "tools"],
    reply: `We work with modern technologies:

**Frontend:** Next.js, React, React Native, TypeScript
**Backend:** Node.js, Express, Python
**Database:** MongoDB, PostgreSQL
**Cloud:** AWS, Vercel, Render
**AI/ML:** TensorFlow, OpenAI, custom models`,
  },
  {
    keywords: ["portfolio", "project", "work", "example", "case study", "built"],
    reply: `We have built a variety of projects including:

🛒 E-Commerce platforms with payment integration
🍔 Food delivery mobile apps
🏥 Healthcare management systems
📊 Business analytics dashboards
🎮 Online gaming platforms

Visit our portfolio page for detailed case studies!`,
  },
  {
    keywords: ["team", "who", "founder", "staff", "people", "developer"],
    reply: `Syntax Software Solutions is a team of passionate developers, designers, and engineers based in Addis Ababa, Ethiopia.

We specialize in delivering high-quality digital solutions for businesses of all sizes — from startups to enterprises.`,
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "start"],
    reply: `Hello! 👋 Welcome to Syntax Software Solutions!

I'm here to help you learn about our services, pricing, and how we can help your business grow digitally.

What can I help you with today?`,
  },
  {
    keywords: ["thank", "thanks", "appreciate", "great", "awesome", "perfect"],
    reply: `You're welcome! 😊 

Is there anything else I can help you with? Feel free to ask about our services, pricing, or how to get in touch with our team.`,
  },
  {
    keywords: ["time", "how long", "duration", "deadline", "timeline", "deliver"],
    reply: `Project timelines vary by complexity:

🌐 **Simple Website** — 1–2 weeks
🌐 **Complex Web App** — 4–8 weeks
📱 **Mobile App** — 6–12 weeks
🏢 **Enterprise System** — 3–6 months

We always discuss timelines upfront and keep you updated throughout the project.`,
  },
  {
    keywords: ["booking", "book", "appointment", "schedule", "consultation", "meeting"],
    reply: `You can book a free consultation with our team!

📅 Visit our **Booking page** on the website, or contact us directly:
📧 syntaxsoftwaresolution@gmail.com
📞 +251 945 455 141

We'd love to discuss your project!`,
  },
]

function getResponse(message: string): string {
  const lower = message.toLowerCase()

  for (const item of responses) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.reply
    }
  }

  return `Thanks for your message! I can help you with information about:

• Our **services** (web, mobile, AI, enterprise)
• **Pricing** and timelines
• **Contact** information
• Our **location** and team
• **Technology** stack

Or contact us directly:
📧 syntaxsoftwaresolution@gmail.com
📞 +251 945 455 141`
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 })
    }

    // Small delay to feel more natural
    await new Promise((resolve) => setTimeout(resolve, 600))

    const reply = getResponse(message)
    return NextResponse.json({ message: reply })
  } catch (error: any) {
    console.error("Chat Error:", error?.message)
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
