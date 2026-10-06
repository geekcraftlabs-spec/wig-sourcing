import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { entries } = await req.json();

  for (const e of entries) {
    await prisma.shop.upsert({
      where: { id: e.shopId },
      create: { id: e.shopId, name: "Unknown (synced)" },
      update: {},
    });

    await prisma.priceEntry.upsert({
      where: { id: e.id },
      create: {
        id: e.id,
        shopId: e.shopId,
        hairType: e.hairType,
        laceType: e.laceType,
        texture: e.texture,
        size: e.size,
        colorCode: e.colorCode,
        price: e.price,
        bulkPrice: e.bulkPrice,
        bulkQuantity: e.bulkQuantity,
        note: e.note,
      },
      update: {
        price: e.price,
        bulkPrice: e.bulkPrice,
        bulkQuantity: e.bulkQuantity,
        note: e.note,
      },
    });
  }
  return NextResponse.json({ ok: true, synced: entries.length });
}