import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getContactMessages } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await getContactMessages();
    return NextResponse.json({
      success: true,
      data: messages.map((msg) => ({
        ...msg,
        _id: msg._id?.toString(),
        receivedAt:
          msg.receivedAt instanceof Date
            ? msg.receivedAt.toISOString()
            : msg.receivedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
