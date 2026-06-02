import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Shobcheye notun 50-ta message nibe
    const messages = await prisma.message.findMany({
      take: 50,
      orderBy: { createdAt: "asc" }, // Purano theke notun order-e sajano
    });
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, imageUrl, senderName, senderRole } = body;

    const newMessage = await prisma.message.create({
      data: { content, imageUrl, senderName, senderRole },
    });

    return NextResponse.json({ success: true, data: newMessage });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}