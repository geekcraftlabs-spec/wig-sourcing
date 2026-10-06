import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { entries } = await req.json();
    if (!Array.isArray(entries)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const results = [];
    for (const e of entries) {
      try {
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
        results.push({ id: e.id, ok: true });
      } catch (inner) {
        console.error(`[sync] failed for entry ${e.id}:`, inner);
        results.push({ id: e.id, ok: false, error: String(inner) });
      }
    }

    return NextResponse.json({ ok: true, synced: results.length, results });
  } catch (err) {
    console.error("[POST /api/sync] error:", err);
    return NextResponse.json(
      { error: "Failed to sync entries", detail: String(err) },
      { status: 500 }
    );
  }
}