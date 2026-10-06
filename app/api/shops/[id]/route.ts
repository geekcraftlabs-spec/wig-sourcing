import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const shop = await prisma.shop.update({ where: { id }, data: body });
    return NextResponse.json({ shop });
  } catch (err) {
    console.error("[PATCH /api/shops/[id]] error:", err);
    return NextResponse.json(
      { error: "Failed to update shop", detail: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.shop.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/shops/[id]] error:", err);
    return NextResponse.json(
      { error: "Failed to delete shop", detail: String(err) },
      { status: 500 }
    );
  }
}