"use client";
import { getPending, clearPending, writeEntries, writeShops } from "./offline";

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

export async function pullFromServer() {
  try {
    const [sRes, eRes] = await Promise.all([
      fetch("/api/shops", { cache: "no-store" }),
      fetch("/api/entries", { cache: "no-store" }),
    ]);
    if (sRes.ok) writeShops((await sRes.json()).shops);
    if (eRes.ok) writeEntries((await eRes.json()).entries);
  } catch {}
}