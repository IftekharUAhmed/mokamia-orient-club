 import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    
    // 🌟 Next.js 16 Rules: params ke 'await' korte hobe
    const resolvedParams = await params; 
    const id = resolvedParams.id;

    const updatedMsg = await prisma.message.update({
      where: { id: id },
      data: { content: body.content },
    });
    
    return NextResponse.json({ success: true, data: updatedMsg });
  } catch (error) {
    console.error("Chat Edit Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    // 🌟 Next.js 16 Rules: params ke 'await' korte hobe
    const resolvedParams = await params; 
    const id = resolvedParams.id;

    await prisma.message.delete({ where: { id: id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat Delete Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}