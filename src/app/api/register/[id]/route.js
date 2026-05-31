import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE Method (Reunion Registration Delete korar jonno)
export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    if (!id) return NextResponse.json({ success: false, message: "ID missing!" }, { status: 400 });

    await prisma.reunionRegistration.delete({ where: { id: id } });
    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// PATCH Method (Reunion Data Edit korar jonno)
export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    if (!id) return NextResponse.json({ success: false, message: "ID missing!" }, { status: 400 });

    const updatedData = await prisma.reunionRegistration.update({
      where: { id: id },
      data: {
        fullName: body.fullName,
        batchPassingYear: body.batchPassingYear,
        mobileNumber: body.mobileNumber,
        transactionId: body.transactionId,
        tShirtSize: body.tShirtSize,
      }
    });
    return NextResponse.json({ success: true, data: updatedData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}