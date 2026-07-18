import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getContactMessages, getContactMessageCount } from "@/lib/storage";
import { ContactMessage } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

function serializeMessage(msg: ContactMessage) {
  return {
    ...msg,
    _id: msg._id?.toString(),
    receivedAt:
      msg.receivedAt instanceof Date
        ? msg.receivedAt.toISOString()
        : msg.receivedAt,
  };
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const [messages, total] = await Promise.all([
      getContactMessages(),
      getContactMessageCount(),
    ]);

    return NextResponse.json({
      messages: messages.slice(0, limit).map(serializeMessage),
      total,
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
