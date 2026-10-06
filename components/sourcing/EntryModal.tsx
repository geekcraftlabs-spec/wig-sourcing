/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PriceEntry } from "@/types";
import { newId } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  context: {
    hairType: string;
    laceType: string;
    texture: string;
    size: number;
    colorCode: string;
    colorName: string;
  };
  existing: PriceEntry | null;
  shopId: string;
  onSave: (e: PriceEntry) => void;
  onDelete: () => void;
}

export function EntryModal({
  open,
  onClose,
  context,
  existing,
  shopId,
  onSave,
  onDelete,
}: Props) {
  const [price, setPrice] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkQuantity, setBulkQuantity] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    setPrice(existing?.price?.toString() ?? "");
    setBulkPrice(existing?.bulkPrice?.toString() ?? "");
    setBulkQuantity(existing?.bulkQuantity?.toString() ?? "");
    setNote(existing?.note ?? "");
  }, [existing, open]);

  const handleSave = () => {
    const p = parseInt(price, 10);
    if (isNaN(p) || p <= 0) return;
    onSave({
      id: existing?.id ?? newId(),
      shopId,
      hairType: context.hairType as "human" | "futura",
      laceType: context.laceType as "5x5" | "13x4" | "13x6",
      texture: context.texture,
      size: context.size,
      colorCode: context.colorCode,
      price: p,
      bulkPrice: bulkPrice ? parseInt(bulkPrice, 10) : null,
      bulkQuantity: bulkQuantity ? parseInt(bulkQuantity, 10) : null,
      note: note.trim() || null,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-white/10 rounded-t-3xl z-50 p-6 space-y-5 max-w-lg mx-auto max-h-[85vh] overflow-y-auto"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-orange-400">
                {context.hairType === "human" ? "Human Hair" : "Futura"} ·{" "}
                {context.laceType}
              </p>
              <h2 className="text-2xl font-semibold text-neutral-100 mt-1">
                {context.size}&quot; · {context.colorCode}
              </h2>
              <p className="text-sm text-neutral-400 mt-0.5">
                {context.colorName}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
                  Single Price (required)
                </span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    R
                  </span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-9 text-2xl font-semibold"
                  />
                </div>
              </label>

              <div className="pt-3 border-t border-white/5">
                <span className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
                  Bulk Price (optional)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      R
                    </span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Bulk price"
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Min qty"
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(e.target.value)}
                  />
                </div>
              </div>

              <Input
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              {existing && (
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => {
                    onDelete();
                    onClose();
                  }}
                  className="px-3"
                >
                  <Trash2 size={16} />
                </Button>
              )}
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave} disabled={!price}>
                Save
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}