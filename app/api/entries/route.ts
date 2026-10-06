import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const entries = await prisma.priceEntry.findMany();
    return NextResponse.json({ entries });
  } catch (err) {
    console.error("[GET /api/entries] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch entries", detail: String(err) },
      { status: 500 }
    );
  }
}