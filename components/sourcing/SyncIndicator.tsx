"use client";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useOffline } from "@/hooks/useOffline";
import { syncAll } from "@/lib/sync";

export function SyncIndicator() {
  const { online, pending, syncing } = useOffline();
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`flex items-center gap-1.5 ${
          online ? "text-green-400" : "text-red-400"
        }`}
      >
        {online ? <Wifi size={12} /> : <WifiOff size={12} />}
        {online ? "Online" : "Offline"}
      </span>
      {pending > 0 && (
        <button
          onClick={() => syncAll()}
          className="flex items-center gap-1 text-orange-400 hover:text-orange-300"
        >
          <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
          {pending} pending
        </button>
      )}
    </div>
  );
}