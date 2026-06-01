  import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 🟢 ALBUM DELETE API 🟢
export async function DELETE(req, props) {
  try {
    const params = await props.params;
    const id = params.id;
    if (!id) return NextResponse.json({ success: false, message: "ID is missing!" }, { status: 400 });

    // Aage chobi muchte hobe
    await prisma.photo.deleteMany({ where: { albumId: id } });
    // Tarpor Album muchte hobe
    await prisma.album.delete({ where: { id: id } });

    return NextResponse.json({ success: true, message: "Album permanently deleted!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 🔵 ALBUM EDIT/UPDATE API (NEW) 🔵
export async function PATCH(req, props) {
  try {
    const params = await props.params;
    const id = params.id;
    if (!id) return NextResponse.json({ success: false, message: "ID is missing!" }, { status: 400 });

    const body = await req.json();
    const { title, category } = body;

    // Database-e Title ar Category update kora hocche
    const updatedAlbum = await prisma.album.update({
      where: { id: id },
      data: { title, category }
    });

    return NextResponse.json({ success: true, data: updatedAlbum });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}