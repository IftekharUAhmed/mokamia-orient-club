import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const players = await prisma.tacticalPlayer.findMany({ orderBy: { slot: "asc" } });
    return NextResponse.json({ success: true, data: players });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newPlayer = await prisma.tacticalPlayer.create({ data: body });
    return NextResponse.json({ success: true, data: newPlayer });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}