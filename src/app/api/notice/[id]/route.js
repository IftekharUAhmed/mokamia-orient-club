import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params; 
    const id = resolvedParams.id;

    await prisma.notice.delete({ where: { id: id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notice Delete Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}