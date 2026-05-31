import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE Method (Membership Application Delete korar jonno)
export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    if (!id) return NextResponse.json({ success: false, message: "ID missing!" }, { status: 400 });

    await prisma.clubMemberApplication.delete({ where: { id: id } });
    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// PATCH Method (Membership Data Edit ba Status Update korar jonno)
export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    if (!id) return NextResponse.json({ success: false, message: "ID missing!" }, { status: 400 });

    // Ekhane status update ashte pare (approve button theke) ba full edit ashte pare (edit form theke)
    const updatedData = await prisma.clubMemberApplication.update({
      where: { id: id },
      data: {
        status: body.status !== undefined ? body.status : undefined,
        fullName: body.fullName !== undefined ? body.fullName : undefined,
        mobileNumber: body.mobileNumber !== undefined ? body.mobileNumber : undefined,
        bloodGroup: body.bloodGroup !== undefined ? body.bloodGroup : undefined,
        presentAddress: body.presentAddress !== undefined ? body.presentAddress : undefined,
      }
    });
    return NextResponse.json({ success: true, data: updatedData }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: "Server error during update" }, { status: 500 });
  }
}