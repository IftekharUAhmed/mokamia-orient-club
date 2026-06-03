import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔴 DELETE API: Admin portal theke purano/shesh howa event muchhe feler jonno
export async function DELETE(req, props) {
  try {
    const params = await props.params;
    const { id } = params;
    
    if (!id) return NextResponse.json({ success: false, message: "Event ID is missing!" }, { status: 400 });

    await prisma.event.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true, message: "Event deleted successfully!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
// 🔵 EDIT/UPDATE API: Admin portal theke event update korar jonno
export async function PATCH(req, props) {
  try {
    const params = await props.params;
    const { id } = params;
    
    if (!id) return NextResponse.json({ success: false, message: "Event ID is missing!" }, { status: 400 });

    const body = await req.json();
    
    const updatedEvent = await prisma.event.update({
      where: { id: id },
      data: body
    });

    return NextResponse.json({ success: true, data: updatedEvent });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}