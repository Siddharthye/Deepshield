"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  loadVaultRecords,
  saveVaultRecords,
  type VaultRecord,
} from "@/lib/encryption";

export function VaultManager() {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [pin, setPin] = useState<string | null>(null);
  const [records, setRecords] = useState<VaultRecord[]>([]);
  const [shake, setShake] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function unlock(entered: string) {
    try {
      const list = loadVaultRecords(entered);
      setPin(entered);
      setRecords(list);
      sessionStorage.setItem("deepshield_vault_pin", entered);
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function handlePinChange(value: string) {
    const nums = value.replace(/\D/g, "").slice(0, 4).split("");
    const next = ["", "", "", ""].map((_, i) => nums[i] ?? "");
    setDigits(next);
    if (nums.length === 4) unlock(nums.join(""));
  }

  function persist(next: VaultRecord[]) {
    if (!pin) return;
    saveVaultRecords(pin, next);
    setRecords(next);
  }

  function onUpload(file: File) {
    if (!pin) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rec: VaultRecord = {
        id: crypto.randomUUID(),
        name: file.name,
        kind: file.type.startsWith("video") ? "video" : "scan",
        savedAt: new Date().toISOString(),
        sizeBytes: file.size,
        payload: reader.result as string,
      };
      persist([rec, ...records]);
    };
    reader.readAsDataURL(file);
  }

  function exportAll() {
    records.forEach((r) => {
      const a = document.createElement("a");
      a.href = r.payload.startsWith("data:") ? r.payload : `data:text/plain;base64,${r.payload}`;
      a.download = r.name;
      a.click();
    });
  }

  function deleteAll() {
    if (!pin || !confirm("Delete all vault items?")) return;
    persist([]);
  }

  if (!pin) {
    return (
      <GlassCard className="mx-auto max-w-sm">
        <p className="mb-6 text-center text-sm text-ink/75">Enter a 4-digit PIN (AES-256 encrypted)</p>
        <motion.div
          animate={shake ? { x: [-8, 8, 0] } : {}}
          className="mb-6 flex justify-center gap-3"
        >
          {digits.map((d, i) => (
            <div key={i} className={`pin-dot flex items-center justify-center ${d ? "filled" : ""}`}>
              {d ? "•" : ""}
            </div>
          ))}
        </motion.div>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          className="sr-only"
          aria-label="Vault PIN"
          onChange={(e) => handlePinChange(e.target.value)}
        />
        <Button variant="dark" className="w-full" onClick={() => unlock(digits.join(""))}>
          Unlock vault
        </Button>
      </GlassCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <GlassCard>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => fileRef.current?.click()}>
            Add file
          </Button>
          <Button variant="secondary" onClick={exportAll} disabled={!records.length}>
            Export all
          </Button>
          <Button variant="ghost" onClick={deleteAll} disabled={!records.length}>
            Delete all
          </Button>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
          />
        </div>
        <p className="mt-4 text-xs text-ink/55">
          {records.length} item(s) · encrypted in localStorage
        </p>
      </GlassCard>

      {records.length === 0 ? (
        <GlassCard>
          <p className="text-center text-sm text-ink/70">
            Vault is empty. Save scans, traces, or notes here.
          </p>
        </GlassCard>
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <GlassCard key={r.id} className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-ink">{r.name}</p>
                <p className="text-xs text-ink/55">
                  {r.kind} · {(r.sizeBytes / 1024).toFixed(1)} KB ·{" "}
                  {new Date(r.savedAt).toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-sage/40 px-2 py-0.5 text-xs">encrypted</span>
            </GlassCard>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
