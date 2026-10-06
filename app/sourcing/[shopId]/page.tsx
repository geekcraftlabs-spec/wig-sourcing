"use client";
import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff, Pencil, Loader2 } from "lucide-react";
import { SyncIndicator } from "@/components/sourcing/SyncIndicator";
import { PriceTable } from "@/components/sourcing/PriceTable";
import { EntryModal } from "@/components/sourcing/EntryModal";
import { NewShopDialog } from "@/components/sourcing/NewShopDialog";
import {
  readShops,
  readEntries,
  upsertEntry,
  deleteEntry,
  writeShops,
} from "@/lib/offline";
import { pullFromServer, syncAll, pushShops } from "@/lib/sync";
import {
  HAIR_TYPES,
  LACE_TYPES,
  TEXTURES,
  SIZES,
  COLORS,
} from "@/lib/data";
import { Shop, PriceEntry, HairType, LaceType } from "@/types";
import { cn } from "@/lib/utils";

export default function ShopPage({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = use(params);
  const [shop, setShop] = useState<Shop | null>(null);
  const [entries, setEntries] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hairType, setHairType] = useState<HairType>("human");
  const [laceType, setLaceType] = useState<LaceType>("13x4");
  const [texture, setTexture] = useState("body-wave");
  const [showAllColors, setShowAllColors] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    size: number;
    colorCode: string;
    colorName: string;
  }>({ open: false, size: 0, colorCode: "", colorName: "" });

  const refresh = () => {
    setShop(readShops().find((s) => s.id === shopId) ?? null);
    setEntries(readEntries().filter((e) => e.shopId === shopId));
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const localShop = readShops().find((s) => s.id === shopId);
      if (localShop) {
        if (!cancelled) {
          setShop(localShop);
          setEntries(readEntries().filter((e) => e.shopId === shopId));
          setLoading(false);
        }
        return;
      }

      try {
        await pushShops();
        await pullFromServer();
      } catch (err) {
        console.error("[shop page] sync failed:", err);
      }

      const fetched = readShops().find((s) => s.id === shopId) ?? null;
      if (!cancelled) {
        setShop(fetched);
        setEntries(readEntries().filter((e) => e.shopId === shopId));
        setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [shopId]);

  const visibleColors = useMemo(() => {
    if (showAllColors) return COLORS.map((c) => c.code);
    return COLORS.filter(
      (c) =>
        c.group === "core" ||
        (hairType === "futura" && c.group === "futura")
    ).map((c) => c.code);
  }, [showAllColors, hairType]);

  const sortedTextures = useMemo(
    () => [...TEXTURES].sort((a, b) => Number(b.popular) - Number(a.popular)),
    []
  );

  const filledCount = entries.filter(
    (e) =>
      e.hairType === hairType &&
      e.laceType === laceType &&
      e.texture === texture
  ).length;

  const currentEntry =
    entries.find(
      (e) =>
        e.hairType === hairType &&
        e.laceType === laceType &&
        e.texture === texture &&
        e.size === modal.size &&
        e.colorCode === modal.colorCode
    ) ?? null;

  const handleSave = async (entry: PriceEntry) => {
    upsertEntry(entry);
    refresh();
    try {
      await pushShops();
      const result = await syncAll();
      if (!result.ok) {
        console.warn("[shop page] sync failed, will retry");
      }
    } catch (err) {
      console.error("[shop page] save sync error:", err);
    }
  };

  const handleDelete = () => {
    if (currentEntry) {
      deleteEntry(currentEntry.id);
      refresh();
    }
  };

  const handleShopEdited = (updated: Shop) => {
    const all = readShops();
    const idx = all.findIndex((s) => s.id === updated.id);
    if (idx >= 0) all[idx] = updated;
    writeShops(all);
    refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 size={24} className="mx-auto text-orange-500 animate-spin" />
          <p className="text-sm text-neutral-500">Loading shop...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-neutral-300 font-medium">Shop not found</p>
          <p className="text-sm text-neutral-500">
            This shop may have been created on another device. Try refreshing,
            or go back to the list.
          </p>
          <Link
            href="/sourcing"
            className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm"
          >
            <ChevronLeft size={14} /> Back to shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/sourcing"
              className="flex items-center gap-1 text-neutral-400 hover:text-neutral-100"
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-neutral-100 font-medium truncate">
                {shop.name}
              </p>
              <SyncIndicator />
            </div>
            <button
              onClick={() => setEditOpen(true)}
              className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-neutral-400 hover:text-orange-400 hover:border-orange-400/40 transition"
              aria-label="Edit shop"
            >
              <Pencil size={14} />
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-2 flex gap-1">
          {HAIR_TYPES.map((h) => (
            <button
              key={h.id}
              onClick={() => setHairType(h.id)}
              className={cn(
                "flex-1 text-xs uppercase tracking-widest py-2.5 rounded-lg transition",
                hairType === h.id
                  ? "bg-orange-500 text-white font-medium"
                  : "text-neutral-400 hover:bg-white/5"
              )}
            >
              {h.label}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-2 flex gap-1">
          {LACE_TYPES.map((l) => (
            <button
              key={l.id}
              onClick={() => setLaceType(l.id)}
              className={cn(
                "flex-1 text-xs py-2 rounded-lg transition",
                laceType === l.id
                  ? "bg-white/10 text-neutral-100 font-medium"
                  : "text-neutral-500 hover:bg-white/5"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-3 overflow-x-auto">
          <div className="flex gap-2">
            {sortedTextures.map((t) => (
              <button
                key={t.id}
                onClick={() => setTexture(t.id)}
                className={cn(
                  "whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition",
                  texture === t.id
                    ? "bg-orange-500/20 border-orange-500/50 text-orange-300"
                    : "border-white/10 text-neutral-500 hover:text-neutral-200"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            {filledCount} of {SIZES.length * visibleColors.length} cells filled
          </p>
          <button
            onClick={() => setShowAllColors(!showAllColors)}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-orange-400"
          >
            {showAllColors ? <EyeOff size={12} /> : <Eye size={12} />}
            {showAllColors ? "Core colors" : "All colors"}
          </button>
        </div>

        <PriceTable
          sizes={SIZES}
          entries={entries}
          filter={{ hairType, laceType, texture }}
          onCellTap={(size, colorCode, colorName) =>
            setModal({ open: true, size, colorCode, colorName })
          }
          visibleColors={visibleColors}
        />
      </main>

      <EntryModal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        context={{
          hairType,
          laceType,
          texture,
          size: modal.size,
          colorCode: modal.colorCode,
          colorName: modal.colorName,
        }}
        existing={currentEntry}
        shopId={shopId}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <NewShopDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onCreated={handleShopEdited}
        editingShop={shop}
      />
    </div>
  );
}