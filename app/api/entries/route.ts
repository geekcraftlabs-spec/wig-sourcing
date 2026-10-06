import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const entries = await prisma.priceEntry.findMany();
  return NextResponse.json({ entries });
}