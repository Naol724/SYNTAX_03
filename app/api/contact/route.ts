import { NextRequest, NextResponse } from "next/server";
import { createContactMessage } from "@/lib/storage";
import { insertContactMessageSchema } from "@/shared/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = insertContactMessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input. Please fill in all required fields.", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const msg = await createContactMessage(result.data);
    return NextResponse.json(
      { success: true, message: "Message received successfully", data: msg },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}