"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

type VaultItem = {
  id: string;
  name: string;
  savedAt: string;
  kind: string;
};

export default function VaultPage() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [items, setItems] = useState<VaultItem[]>([]);

  useEffect(() => {
    if (!unlocked) return;
    const raw = localStorage.getItem("deepshield_vault_items");
    setItems(raw ? (JSON.parse(raw) as VaultItem[]) : []);
  }, [unlocked]);

  function unlock() {
    if (pin.length >= 4) {
      sessionStorage.setItem("deepshield_vault_pin", pin);
      setUnlocked(true);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold text-espresso">Safe evidence vault</h1>
      <p className="mb-8 text-espresso/70">
        Browser-only storage. PIN is used locally and never sent to a server.
      </p>
      {!unlocked ? (
        <GlassCard className="max-w-sm">
          <p className="mb-3 text-sm">Enter a 4-digit PIN to unlock</p>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="mb-4 w-full rounded-xl border border-sage/40 bg-fantasy px-4 py-2 text-center text-lg tracking-widest"
          />
          <button
            type="button"
            onClick={unlock}
            className="w-full rounded-full bg-espresso py-2 text-sm text-fantasy"
          >
            Unlock vault
          </button>
        </GlassCard>
      ) : (
        <GlassCard>
          <p className="mb-4 text-sm text-espresso/70">
            Encrypted vault (AES via CryptoJS) — coming next. Showing saved metadata
            for now.
          </p>
          {items.length === 0 ? (
            <p className="text-sm">No items yet. Save from Scan or Trace.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.id} className="rounded-lg bg-white/40 px-3 py-2">
                  {i.name} · {i.kind} · {new Date(i.savedAt).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      )}
    </div>
  );
}
