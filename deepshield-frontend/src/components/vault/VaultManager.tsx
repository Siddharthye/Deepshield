"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ShieldOverlay } from "@/components/ui/ShieldOverlay";
import { useLanguage } from "@/context/LanguageContext";
import {
  loadVaultRecords,
  saveVaultRecords,
  type VaultRecord,
} from "@/lib/encryption";

export function VaultManager() {
  const { t } = useLanguage();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [pin, setPin] = useState<string | null>(null);
  const [records, setRecords] = useState<VaultRecord[]>([]);
  const [shake, setShake] = useState(false);
  const [shield, setShield] = useState(false);
  const [burst, setBurst] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function flashShield() {
    setShield(true);
    setTimeout(() => setShield(false), 900);
  }

  function unlock(entered: string) {
    try {
      const list = loadVaultRecords(entered);
      setPin(entered);
      setRecords(list);
      sessionStorage.setItem("deepshield_vault_pin", entered);
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
      flashShield();
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

  async function exportAll() {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    records.forEach((r) => {
      if (r.payload.startsWith("data:")) {
        const [meta, b64] = r.payload.split(",");
        const ext = meta.includes("png") ? "png" : meta.includes("pdf") ? "pdf" : "jpg";
        zip.file(`${r.name.replace(/\.[^.]+$/, "")}.${ext}`, b64, { base64: true });
      } else {
        zip.file(r.name, r.payload);
      }
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deepshield_vault_${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    flashShield();
  }

  function deleteAll() {
    if (!pin || !confirm(t("vaultDeleteConfirm"))) return;
    persist([]);
  }

  if (!pin) {
    return (
      <>
        <ShieldOverlay show={shield} />
        <GlassCard className="mx-auto max-w-sm">
          <p className="mb-6 text-center text-sm text-ink/75">{t("vaultPinPrompt")}</p>
          <motion.div
            animate={shake ? { x: [-8, 8, 0] } : {}}
            className="mb-6 flex justify-center gap-3"
          >
            {digits.map((d, i) => (
              <motion.div
                key={i}
                animate={burst ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
                className={`pin-dot flex items-center justify-center ${d ? "filled" : ""}`}
              >
                {d ? "•" : ""}
              </motion.div>
            ))}
          </motion.div>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            className="sr-only"
            aria-label={t("vaultPinAria")}
            onChange={(e) => handlePinChange(e.target.value)}
          />
          <Button variant="dark" className="w-full" onClick={() => unlock(digits.join(""))}>
            {t("vaultUnlock")}
          </Button>
        </GlassCard>
      </>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <ShieldOverlay show={shield} />
      <GlassCard>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => fileRef.current?.click()}>
            {t("vaultAddFile")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => void exportAll()}
            disabled={!records.length}
          >
            {t("vaultExportZip")}
          </Button>
          <Button variant="ghost" onClick={deleteAll} disabled={!records.length}>
            {t("vaultDeleteAll")}
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
          {records.length} {t("vaultItemCount")}
        </p>
      </GlassCard>

      {records.length === 0 ? (
        <GlassCard>
          <p className="text-center text-sm text-ink/70">{t("vaultEmpty")}</p>
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
              <span className="rounded-full bg-sage/40 px-2 py-0.5 text-xs">
                {t("vaultEncryptedBadge")}
              </span>
            </GlassCard>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
