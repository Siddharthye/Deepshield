"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";

type VaultItem = {
  id: string;
  name: string;
  savedAt: string;
  kind: string;
};

export default function VaultPage() {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [items, setItems] = useState<VaultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!unlocked) return;
    const raw = localStorage.getItem("deepshield_vault_items");
    setItems(raw ? (JSON.parse(raw) as VaultItem[]) : []);
  }, [unlocked]);

  function handlePinChange(value: string) {
    const nums = value.replace(/\D/g, "").slice(0, 4).split("");
    const next = ["", "", "", ""].map((_, i) => nums[i] ?? "");
    setDigits(next);
    if (nums.length === 4) {
      sessionStorage.setItem("deepshield_vault_pin", nums.join(""));
      setUnlocked(true);
    }
  }

  function tryUnlock() {
    const pin = digits.join("");
    if (pin.length >= 4) {
      sessionStorage.setItem("deepshield_vault_pin", pin);
      setUnlocked(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <PageHeader
        badge="Private"
        title="Safe evidence vault"
        subtitle="Browser-only storage. Your PIN never leaves this device."
      />

      {!unlocked ? (
        <GlassCard className="mx-auto max-w-sm">
          <p className="mb-6 text-center text-sm text-espresso/75">
            Enter a 4-digit PIN to unlock
          </p>
          <motion.div
            animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}}
            className="mb-6 flex justify-center gap-3"
            onClick={() => inputRef.current?.focus()}
          >
            {digits.map((d, i) => (
              <div
                key={i}
                className={`pin-dot flex items-center justify-center ${d ? "filled" : ""}`}
              >
                {d ? "•" : ""}
              </div>
            ))}
          </motion.div>
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={digits.join("")}
            onChange={(e) => handlePinChange(e.target.value)}
            className="sr-only"
            aria-label="Vault PIN"
          />
          <Button variant="dark" className="w-full" onClick={tryUnlock}>
            Unlock vault
          </Button>
        </GlassCard>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <p className="mb-4 text-sm text-espresso/70">
              Encrypted vault (AES via CryptoJS) — coming next. Saved metadata
              appears below.
            </p>
            {items.length === 0 ? (
              <p className="rounded-xl bg-blush/25 px-4 py-6 text-center text-sm text-espresso/75">
                No items yet. Save from Scan or Trace.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {items.map((i) => (
                  <li
                    key={i.id}
                    className="rounded-xl bg-fantasy/80 px-4 py-3 ring-1 ring-blush/40"
                  >
                    {i.name} · {i.kind} ·{" "}
                    {new Date(i.savedAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
