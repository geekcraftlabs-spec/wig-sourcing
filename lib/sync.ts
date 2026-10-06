"use client";
import {
  getPending,
  clearPending,
  readShops,
  writeShops,
  readEntries,
  writeEntries,
} from "./offline";
import { Shop, PriceEntry } from "@/types";

export async function syncAll() {
  const pending = getPending();
  if (pending.length === 0) return { ok: true, synced: 0 };

  const res = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries: pending }),
  });
  if (!res.ok) return { ok: false, synced: 0 };
  clearPending();
  return { ok: true, synced: pending.length };
}

export async function pushShops() {
  const shops = readShops();
  if (shops.length === 0) return;
  try {
    await fetch("/api/shops/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shops }),
    });
  } catch (err) {
    console.error("[pushShops] error:", err);
  }
}

export async function pullFromServer() {
  try {
    const [sRes, eRes] = await Promise.all([
      fetch("/api/shops", { cache: "no-store" }),
      fetch("/api/entries", { cache: "no-store" }),
    ]);

    const localShops = readShops();
    const localEntries = readEntries();

    if (sRes.ok) {
      const serverShops: Shop[] = (await sRes.json()).shops || [];
      const merged = [...serverShops];
      const serverIds = new Set(serverShops.map((s) => s.id));
      for (const local of localShops) {
        if (!serverIds.has(local.id)) {
          merged.push(local);
        } else {
          const idx = merged.findIndex((s) => s.id === local.id);
          if (idx >= 0) merged[idx] = { ...merged[idx], ...local };
        }
      }
      writeShops(merged);
    }

    if (eRes.ok) {
      const serverEntries: PriceEntry[] = (await eRes.json()).entries || [];
      const merged = [...serverEntries];
      const serverKeys = new Set(
        serverEntries.map(
          (e) =>
            `${e.shopId}::${e.hairType}::${e.laceType}::${e.texture}::${e.size}::${e.colorCode}`
        )
      );
      for (const local of localEntries) {
        const key = `${local.shopId}::${local.hairType}::${local.laceType}::${local.texture}::${local.size}::${local.colorCode}`;
        if (!serverKeys.has(key)) {
          merged.push(local);
        }
      }
      writeEntries(merged);
    }
  } catch (err) {
    console.error("[pullFromServer] error:", err);
  }
}