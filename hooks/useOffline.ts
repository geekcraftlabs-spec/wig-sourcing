"use client";
import { useEffect, useState } from "react";
import { syncAll, pullFromServer, pushShops } from "@/lib/sync";
import { getPending } from "@/lib/offline";

export function useOffline() {
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const upd = () => setOnline(navigator.onLine);
    const updP = () => setPending(getPending().length);
    upd();
    updP();
    window.addEventListener("online", upd);
    window.addEventListener("offline", upd);
    const iv = setInterval(updP, 2000);
    return () => {
      window.removeEventListener("online", upd);
      window.removeEventListener("offline", upd);
      clearInterval(iv);
    };
  }, []);

  useEffect(() => {
    if (!online) return;
    (async () => {
      setSyncing(true);
      await pushShops();
      await syncAll();
      await pullFromServer();
      setPending(getPending().length);
      setSyncing(false);
    })();
  }, [online]);

  return { online, pending, syncing };
}