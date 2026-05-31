import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    
    const newRegistration = await prisma.reunionRegistration.create({
      data: {
        fullName: body.fullName,
        mobileNumber: body.mobileNumber,
        batchPassingYear: body.batchPassingYear,
        tShirtSize: body.tShirtSize,
        currentLocation: body.currentLocation,
        transactionId: body.transactionId,
        foodPreference: "Standard/Regular", // <-- ERROR ER FIX: Database ke default food item diye dilam
      }
    });

    return NextResponse.json({ success: true, data: newRegistration }, { status: 201 });
  } catch (error) {
    // Ebar kono error khele terminal e clear dekhabe
    console.error("Prisma Database Error:", error); 
    return NextResponse.json({ success: false, message: "Server Error!" }, { status: 500 });
  }
}
// Data anar jonno GET method
export async function GET() {
  try {
    const registrations = await prisma.reunionRegistration.findMany({
      orderBy: { registrationDate: 'desc' }
    });
    return NextResponse.json({ success: true, data: registrations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching data" }, { status: 500 });
  }
}
