import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE Method (Committee Member Delete Korar Jonno)
export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ success: false, message: "Member ID missing!" }, { status: 400 });
    }

    // Database theke delete kora
    await prisma.committeeMember.delete({
      where: { id: id }
    });

    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: "Server error during deletion" }, { status: 500 });
  }
}
// PATCH Method (Committee Member Edit/Update Korar Jonno)
export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();

    if (!id) return NextResponse.json({ success: false, message: "Member ID missing!" }, { status: 400 });

    // Database e data update kora
    const updatedMember = await prisma.committeeMember.update({
      where: { id: id },
      data: {
        fullName: body.fullName,
        designation: body.designation,
        bloodGroup: body.bloodGroup,
        mobileNumber: body.mobileNumber,
        email: body.email,
      }
    });

    return NextResponse.json({ success: true, data: updatedMember }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: "Server error during update" }, { status: 500 });
  }
}