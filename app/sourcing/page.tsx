/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Store, Trash2 } from "lucide-react";
import { SyncIndicator } from "@/components/sourcing/SyncIndicator";
import { NewShopDialog } from "@/components/sourcing/NewShopDialog";
import { Shop } from "@/types";
import { readShops, writeShops, readEntries, writeEntries } from "@/lib/offline";
import { pullFromServer } from "@/lib/sync";

export default function SourcingHome() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const refresh = () => setShops(readShops());

  useEffect(() => {
    refresh();
    pullFromServer().then(refresh);
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and all its prices? This can't be undone.`)) {
      return;
    }
    const next = readShops().filter((s) => s.id !== id);
    writeShops(next);
    const remainingEntries = readEntries().filter((e) => e.shopId !== id);
    writeEntries(remainingEntries);
    refresh();
    try {
      await fetch(`/api/shops/${id}`, { method: "DELETE" });
    } catch {}
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-neutral-100">
            Wig Sourcing
          </h1>
          <SyncIndicator />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        {shops.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <Store size={32} className="mx-auto text-neutral-700" />
            <p className="text-neutral-500">
              No shops yet. Add your first one.
            </p>
          </div>
        )}

        {shops.map((shop) => (
          <div
            key={shop.id}
            className="flex items-stretch gap-2 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.06] transition"
          >
            <Link
              href={`/sourcing/${shop.id}`}
              className="flex-1 min-w-0 p-5"
            >
              <p className="text-neutral-100 font-medium">{shop.name}</p>
              {(shop.location || shop.staff || shop.whatsapp) && (
                <p className="text-xs text-neutral-500 mt-1 truncate">
                  {[shop.location, shop.staff, shop.whatsapp]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </Link>
            <button
              onClick={() => handleDelete(shop.id, shop.name)}
              className="px-4 flex items-center text-neutral-500 hover:text-red-400 transition border-l border-white/5"
              aria-label={`Delete ${shop.name}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </main>

      <button
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xl shadow-orange-500/30 hover:bg-orange-600 transition"
        aria-label="New shop"
      >
        <Plus size={24} />
      </button>

      <NewShopDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={refresh}
      />
    </div>
  );
}