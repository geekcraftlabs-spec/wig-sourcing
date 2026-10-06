"use client";
import { PriceEntry, Shop } from "@/types";

const SHOPS_KEY = "ws-shops";
const ENTRIES_KEY = "ws-entries";
const PENDING_KEY = "ws-pending";

export function readShops(): Shop[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SHOPS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeShops(s: Shop[]) {
  localStorage.setItem(SHOPS_KEY, JSON.stringify(s));
}

export function readEntries(): PriceEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ENTRIES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeEntries(e: PriceEntry[]) {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(e));
}

function entryKey(e: PriceEntry) {
  return `${e.shopId}::${e.hairType}::${e.laceType}::${e.texture}::${e.size}::${e.colorCode}`;
}

export function upsertEntry(entry: PriceEntry) {
  const list = readEntries();
  const idx = list.findIndex((e) => entryKey(e) === entryKey(entry));
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  writeEntries(list);

  const pending = getPending();
  const fidx = pending.findIndex((e) => entryKey(e) === entryKey(entry));
  if (fidx >= 0) pending[fidx] = entry;
  else pending.push(entry);
  localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}

export function getPending(): PriceEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearPending() {
  localStorage.setItem(PENDING_KEY, "[]");
}

export function deleteEntry(id: string) {
  const list = readEntries().filter((e) => e.id !== id);
  writeEntries(list);
}