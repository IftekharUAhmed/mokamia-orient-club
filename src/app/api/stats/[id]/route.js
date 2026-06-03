// File: src/app/api/stats/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🟡 PATCH API: Stat update korar jonno
export async function PATCH(req, props) {
  try {
    const params = await props.params;
    const body = await req.json();
    
    const updatedStat = await prisma.stat.update({
      where: { id: params.id },
      data: body
    });

    return NextResponse.json({ success: true, data: updatedStat });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 🔴 DELETE API: Stat delete korar jonno
export async function DELETE(req, props) {
  try {
    const params = await props.params;
    await prisma.stat.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, message: "Stat deleted successfully!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}