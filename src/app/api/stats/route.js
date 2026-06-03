// File: src/app/api/stats/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🟢 GET API: Main website e stats dekhanor jonno
export async function GET() {
  try {
    const stats = await prisma.stat.findMany({
      orderBy: { createdAt: "asc" }, 
    });
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 🔵 POST API: Admin portal theke notun stat add korar jonno
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, value, icon } = body;

    if (!title || !value) {
      return NextResponse.json({ success: false, message: "Title and Value are required!" }, { status: 400 });
    }

    const newStat = await prisma.stat.create({
      data: {
        title,
        value,
        icon: icon || "📌",
      },
    });

    return NextResponse.json({ success: true, data: newStat });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}