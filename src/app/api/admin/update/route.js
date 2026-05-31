import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body; 

    const updatedRegistration = await prisma.reunionRegistration.update({
      where: { id: id },
      data: { paymentStatus: status },
    });
    return NextResponse.json({ success: true, data: updatedRegistration }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed!" }, { status: 500 });
  }
}