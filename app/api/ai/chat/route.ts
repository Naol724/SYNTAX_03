import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── System prompt ────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a friendly and professional AI assistant for Syntax Software Solutions, a software company based in Addis Ababa, Ethiopia (founded 2019).

Your job is to help website visitors learn about the company, its services, pricing, and how to get started. Keep responses concise, helpful, and professional. Use bullet points and bold text for clarity when appropriate.

COMPANY INFO:
- Name: Syntax Software Solutions
- Location: Addis Ababa, Ethiopia 🇪🇹
- Founded: 2019
- Email: syntaxsoftwaresolution@gmail.com
- Phone: +251 945 455 141
- Website: https://syntaxsoftwaresolution.com

SERVICES:
- Web Development (Next.js, React) — starting from $500
- Mobile App Development (React Native, iOS & Android) — starting from $1,000
- Gaming Platforms (multiplayer bingo, lottery, real-time games)
- Enterprise Systems (POS, inventory, rental, debt tracking, ERP/CRM)
- AI-Powered Bots (Telegram bots, chatbots, automation)
- Cloud & DevOps (AWS, Firebase, Docker, CI/CD)

TECH STACK: React, Next.js, TypeScript, Node.js, Python, Java, Laravel, Spring Boot, MongoDB, PostgreSQL, Docker, AWS, Firebase, Tailwind CSS

TIMELINES:
- Simple website: 1–2 weeks
- Complex web app: 4–8 weeks
- Mobile app: 6–12 weeks
- Enterprise system: 3–6 months

STATS: 50+ projects delivered, 100+ happy clients, 5+ years of excellence, 30+ expert developers

If asked about something unrelated to the company or software development, politely redirect the conversation back to how Syntax can help them.`;

// ─── Keyword fallback ─────────────────────────────────────────
const KEYWORD_RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["service", "services", "offer", "provide", "do you do", "what do you"],
    reply: `We offer the following services at Syntax Software Solutions:\n\n🌐 **Web Development** — Modern, responsive websites built with Next.js & React\n📱 **Mobile App Development** — Cross-platform apps with React Native\n🎮 **Gaming Platforms** — Custom gaming solutions and platforms\n🏢 **Enterprise Systems** — ERP, CRM, and custom business software\n🤖 **AI-Powered Bots** — Intelligent chatbots and automation tools\n☁️ **Cloud & DevOps** — AWS, Firebase, Docker, CI/CD pipelines\n\nWould you like more details about any of these?`,
  },
  {
    keywords: ["location", "where", "address", "based", "office", "ethiopia", "addis"],
    reply: `We are based in **Addis Ababa, Ethiopia** 🇪🇹\n\nOur team works with clients locally and internationally. Feel free to reach out!`,
  },
  {
    keywords: ["contact", "reach", "email", "phone", "call", "whatsapp"],
    reply: `You can reach us through:\n\n📧 **Email:** syntaxsoftwaresolution@gmail.com\n📞 **Phone:** +251 945 455 141\n🌐 **Website:** https://syntaxsoftwaresolution.com\n\nWe typically respond within 24 hours.`,
  },
  {
    keywords: ["price", "cost", "how much", "pricing", "rate", "charge", "fee"],
    reply: `Our pricing depends on the project scope:\n\n🌐 **Web Development** — Starting at $500\n📱 **Mobile Apps** — Starting at $1,000\n🏢 **Enterprise Systems** — Custom quote\n🤖 **AI Bots** — Starting at $300\n\nContact us at syntaxsoftwaresolution@gmail.com for a free custom quote!`,
  },
  {
    keywords: ["portfolio", "project", "work", "example", "case study", "built"],
    reply: `We have built a variety of projects including:\n\n🛒 E-Commerce platforms with payment integration\n🍔 Food delivery mobile apps\n🏥 Healthcare management systems (Saron Orthopedic)\n🎰 Online gaming platforms (King Bingo)\n🛋️ Furniture e-commerce (Dubai Furniture)\n\nVisit our portfolio page for more details!`,
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    reply: `Hello! 👋 Welcome to Syntax Software Solutions!\n\nI'm here to help you learn about our services, pricing, and how we can help your business grow.\n\nWhat can I help you with today?`,
  },
  {
    keywords: ["thank", "thanks", "appreciate", "great", "awesome", "perfect"],
    reply: `You're welcome! 😊\n\nIs there anything else I can help you with? Feel free to ask about our services, pricing, or how to get in touch with our team.`,
  },
  {
    keywords: ["time", "how long", "duration", "deadline", "timeline", "deliver"],
    reply: `Project timelines vary by complexity:\n\n🌐 **Simple Website** — 1–2 weeks\n🌐 **Complex Web App** — 4–8 weeks\n📱 **Mobile App** — 6–12 weeks\n🏢 **Enterprise System** — 3–6 months\n\nWe always discuss timelines upfront and keep you updated throughout.`,
  },
  {
    keywords: ["booking", "book", "appointment", "schedule", "consultation", "meeting"],
    reply: `You can book a free consultation with our team!\n\n📅 Visit our **Booking page** on the website, or contact us directly:\n📧 syntaxsoftwaresolution@gmail.com\n📞 +251 945 455 141\n\nWe'd love to discuss your project!`,
  },
  {
    keywords: ["tech", "technology", "stack", "framework", "language", "tools"],
    reply: `We work with modern technologies:\n\n**Frontend:** Next.js, React, React Native, TypeScript\n**Backend:** Node.js, Express, Python, Java\n**Database:** MongoDB, PostgreSQL\n**Cloud:** AWS, Firebase, Docker, Vercel, Render\n**AI/ML:** Google Gemini, custom models`,
  },
];

function keywordFallback(message: string): string {
  const lower = message.toLowerCase();
  for (const item of KEYWORD_RESPONSES) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.reply;
    }
  }
  return `Thanks for your message! I can help you with:\n\n• Our **services** (web, mobile, AI, enterprise)\n• **Pricing** and timelines\n• **Contact** information\n• Our **portfolio** and past projects\n\nOr reach us directly:\n📧 syntaxsoftwaresolution@gmail.com\n📞 +251 945 455 141`;
}

// ─── Route handler ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = body.message?.trim();

    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    // ── Use Gemini if key is available ──────────────────────
    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: "Hello" }],
            },
            {
              role: "model",
              parts: [{ text: SYSTEM_PROMPT }],
            },
          ],
        });

        const result = await chat.sendMessage(message);
        const text = result.response.text();

        return NextResponse.json({
          message: text,
          chat_id: `gemini-${Date.now()}`,
          ai_response: text,
        });
      } catch (geminiError: any) {
        console.error("Gemini error, falling back to keyword matching:", geminiError?.message);
        // Fall through to keyword matching
      }
    }

    // ── Keyword fallback (no key or Gemini failed) ──────────
    await new Promise((resolve) => setTimeout(resolve, 400));
    const reply = keywordFallback(message);

    return NextResponse.json({
      message: reply,
      chat_id: `kw-${Date.now()}`,
      ai_response: reply,
    });
  } catch (error: any) {
    console.error("Chat route error:", error?.message);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
