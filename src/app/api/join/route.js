import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Check korbe ei number theke aage keu apply koreche ki na
    const existingApplication = await prisma.clubMemberApplication.findUnique({
      where: { mobileNumber: body.mobileNumber }
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, message: "An application with this mobile number already exists." },
        { status: 400 }
      );
    }

    // Database e notun data entry
    const newApplication = await prisma.clubMemberApplication.create({
      data: {
        fullName: body.fullName,
        mobileNumber: body.mobileNumber,
        bloodGroup: body.bloodGroup,
        presentAddress: body.presentAddress,
        occupation: body.occupation || "", // Occupation na dile faka thakbe
      }
    });

    return NextResponse.json({ success: true, data: newApplication }, { status: 201 });
  } catch (error) {
    console.error("Database Error (Join Club):", error);
    return NextResponse.json({ success: false, message: "Server Error! Could not save data." }, { status: 500 });
  }
 }
 // Data anar jonno GET method
export async function GET() {
  try {
    const applications = await prisma.clubMemberApplication.findMany({
      orderBy: { applicationDate: 'desc' }
    });
    return NextResponse.json({ success: true, data: applications }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching data" }, { status: 500 });
  }
}
