 import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
 
   

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, category, images } = body;

    // Check jodi data na ashe
    if (!title || !category || !images || images.length === 0) {
      return NextResponse.json({ success: false, message: "Bhai, kono chobi ba title missing!" }, { status: 400 });
    }

    // Ekta Album toiri hobe, ar tar vitore shob Photo toiri hobe
    const newAlbum = await prisma.album.create({
      data: {
        title,
        category,
        coverImage: images[0], // Prothom chobita hobe Album-er Cover (Profile)
        photos: {
          create: images.map((url) => ({ imageUrl: url })),
        },
      },
      include: {
        photos: true, // Return korar shomoy chobi guloo eksathe anbo
      }
    });

    return NextResponse.json({ success: true, data: newAlbum });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      include: { photos: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: albums });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}