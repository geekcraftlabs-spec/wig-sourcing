/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { newId } from "@/lib/utils";
import { readShops, writeShops } from "@/lib/offline";
import { Shop } from "@/types";

export function NewShopDialog({
  open,
  onClose,
  onCreated,
  editingShop,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (s: Shop) => void;
  editingShop?: Shop | null;
}) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [staff, setStaff] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");

  const isEdit = !!editingShop;

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setName(editingShop?.name ?? "");
      setLocation(editingShop?.location ?? "");
      setStaff(editingShop?.staff ?? "");
      setWhatsapp(editingShop?.whatsapp ?? "");
      setNotes(editingShop?.notes ?? "");
    }
  }, [open, editingShop]);

  const handleSave = () => {
    if (!name.trim()) return;

    const shops = readShops();

    if (isEdit && editingShop) {
      const idx = shops.findIndex((s) => s.id === editingShop.id);
      const updated: Shop = {
        ...editingShop,
        name: name.trim(),
        location: location.trim() || null,
        staff: staff.trim() || null,
        whatsapp: whatsapp.trim() || null,
        notes: notes.trim() || null,
      };
      if (idx >= 0) shops[idx] = updated;
      writeShops(shops);

      fetch(`/api/shops/${editingShop.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updated.name,
          location: updated.location,
          staff: updated.staff,
          whatsapp: updated.whatsapp,
          notes: updated.notes,
        }),
      }).catch(() => {});

      onCreated(updated);
    } else {
      const shop: Shop = {
        id: newId(),
        name: name.trim(),
        location: location.trim() || null,
        staff: staff.trim() || null,
        whatsapp: whatsapp.trim() || null,
        notes: notes.trim() || null,
        createdAt: new Date().toISOString(),
      };
      shops.unshift(shop);
      writeShops(shops);
      onCreated(shop);
    }

    setName("");
    setLocation("");
    setStaff("");
    setWhatsapp("");
    setNotes("");
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-white/10 rounded-t-3xl z-50 p-6 space-y-4 max-w-lg mx-auto max-h-[85vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-neutral-100">
              {isEdit ? "Edit Shop" : "New Shop"}
            </h2>

            <Input
              placeholder="Shop name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              placeholder="Staff name (optional)"
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
            />
            <Input
              placeholder="WhatsApp number (optional)"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <Input
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex gap-2 pt-2">
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={!name.trim()}
              >
                {isEdit ? "Save Changes" : "Create"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}