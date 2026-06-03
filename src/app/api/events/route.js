import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🟢 GET API: Database theke shob Event anbe main website-e dekhanor jonno
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" }, // Notun gulo aage ashbe
    });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 🔵 POST API: Admin portal theke notun Event add korar jonno
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, tag, time, image, description, extraNote, category } = body;

    if (!title || !image || !description) {
      return NextResponse.json({ success: false, message: "Title, Image and Description are required!" }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        tag: tag || "Upcoming",
        time: time || "TBA",
        image,
        description,
        extraNote: extraNote || null,
        category: category || "upcoming",
      },
    });

    return NextResponse.json({ success: true, data: newEvent });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}