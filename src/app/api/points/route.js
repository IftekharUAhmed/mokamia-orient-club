import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const points = await prisma.pointTable.findMany({ orderBy: { points: "desc" } }); // Beshi point jar se upore thakbe
    return NextResponse.json({ success: true, data: points });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newPoint = await prisma.pointTable.create({ data: body });
    return NextResponse.json({ success: true, data: newPoint });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}