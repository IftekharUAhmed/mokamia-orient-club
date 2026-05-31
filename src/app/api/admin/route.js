import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const registrations = await prisma.reunionRegistration.findMany({
      orderBy: { registrationDate: 'desc' }
    });
    return NextResponse.json({ success: true, data: registrations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Data fetch error!" }, { status: 500 });
  }
}