 import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { memberId, password } = body;

    // 🚀 MASTER KEY (SUPER ADMIN)
    if (memberId === "admin" && password === "admin123") {
      const res = NextResponse.json({ 
        success: true, 
        message: "Super Admin Login",
        user: { name: "System Admin", designation: "Super Admin", id: "admin" }
      }, { status: 200 });
      
      // 🔑 브라উজারকে চাবি (Cookie) দেওয়া হচ্ছে ১ দিনের জন্য (86400 seconds)
      res.cookies.set("moc_session", "admin", { path: "/", maxAge: 86400 });
      return res;
    }

    // 1. Database e check kora
    const user = await prisma.committeeMember.findUnique({
      where: { memberId: memberId }
    });

    // 2. Jodi user na thake ba password na mile
    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, message: "Invalid ID or Password!" }, { status: 401 });
    }

    // 3. Shob thik thakle success
    const res = NextResponse.json({ 
      success: true, 
      message: "Login successful",
      user: { name: user.fullName, designation: user.designation, id: user.memberId }
    }, { status: 200 });

    // 🔑 আসল ইউজারকেও চাবি (Cookie) দেওয়া হলো
    res.cookies.set("moc_session", user.memberId, { path: "/", maxAge: 86400 });
    return res;

  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}