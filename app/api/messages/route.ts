import { NextResponse } from "next/server";
import { getContactMessages } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const messages = await getContactMessages();
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
