import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const shops = await prisma.shop.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ shops });
  } catch (err) {
    console.error("[GET /api/shops] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch shops", detail: String(err) },
      { status: 500 }
    );
  }
}