import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { shops } = await req.json();
    if (!Array.isArray(shops)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const results = [];
    for (const s of shops) {
      try {
        const upserted = await prisma.shop.upsert({
          where: { id: s.id },
          create: {
            id: s.id,
            name: s.name,
            location: s.location,
            staff: s.staff,
            whatsapp: s.whatsapp,
            notes: s.notes,
            createdAt: new Date(s.createdAt),
          },
          update: {
            name: s.name,
            location: s.location,
            staff: s.staff,
            whatsapp: s.whatsapp,
            notes: s.notes,
          },
        });
        results.push({ id: upserted.id, ok: true });
      } catch (inner) {
        console.error(`[bulk] failed for shop ${s.id}:`, inner);
        results.push({ id: s.id, ok: false, error: String(inner) });
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("[POST /api/shops/bulk] error:", err);
    return NextResponse.json(
      { error: "Failed to bulk-sync shops", detail: String(err) },
      { status: 500 }
    );
  }
}