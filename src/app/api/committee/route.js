import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.committeeMember.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json({ success: true, data: members }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const count = await prisma.committeeMember.count();
    const newIdNumber = (count + 1).toString().padStart(3, '0');
    const memberId = `MOC-26-${newIdNumber}`; 

    const newMember = await prisma.committeeMember.create({
      data: {
        memberId: memberId,
        password: body.password,
        fullName: body.fullName,
        designation: body.designation,
        bloodGroup: body.bloodGroup || "A+",
        mobileNumber: body.mobileNumber,
        email: body.email || "",
        role: "COMMITTEE"
      }
    });
    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}