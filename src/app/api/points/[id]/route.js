import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req, props) {
  try {
    const params = await props.params;
    const body = await req.json();
    const updatedPoint = await prisma.pointTable.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, data: updatedPoint });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, props) {
  try {
    const params = await props.params;
    await prisma.pointTable.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Deleted!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}