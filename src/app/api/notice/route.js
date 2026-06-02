import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: "desc" }, // Notun notice aage ashbe
    });
    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, content, isUrgent, authorName, authorRole } = body;

    const newNotice = await prisma.notice.create({
      data: { title, content, isUrgent, authorName, authorRole },
    });

    return NextResponse.json({ success: true, data: newNotice });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}