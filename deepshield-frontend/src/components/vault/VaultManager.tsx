"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ShieldOverlay } from "@/components/ui/ShieldOverlay";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";
import {
  clearVault,
  loadVaultRecords,
  saveVaultRecords,
  vaultExists,
  type VaultRecord,
} from "@/lib/encryption";

const PIN_COMPLETE_DELAY_MS = 500;

const KIND_KEYS: Record<VaultRecord["kind"], I18nKey> = {
  scan: "vaultKindScan",
  trace: "vaultKindTrace",
  report: "vaultKindReport",
  note: "vaultKindNote",
  video: "vaultKindVideo",
};

function isImagePayload(payload: string) {
  return payload.startsWith("data:image/");
}

function PinPad({
  value,
  onChange,
  inputRef,
  shake,
  burst,
}: {
  value: string;
  onChange: (next: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  shake?: boolean;
  burst?: boolean;
}) {
  const slots = ["", "", "", ""].map((_, i) => value[i] ?? "");

  return (
    <motion.div animate={shake ? { x: [-8, 8, 0] } : {}} className="relative">
      <button
        type="button"
        className="relative mx-auto flex w-full max-w-xs justify-center gap-3 py-2"
        onClick={() => inputRef.current?.focus()}
        aria-label="PIN entry"
      >
        {slots.map((d, i) => (
          <motion.div
            key={i}
            animate={burst ? { scale: [1, 1.15, 1] } : {}}
            className={`pin-dot flex items-center justify-center ${d ? "filled" : ""}`}
          >
            {d ? "•" : ""}
          </motion.div>
        ))}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={4}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
        />
      </button>
    </motion.div>
  );
}

export function VaultManager() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<"unlock" | "setup">("unlock");
  const [setupStep, setSetupStep] = useState<"create" | "confirm">("create");
  const [draftPin, setDraftPin] = useState("");
  const [pinValue, setPinValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [pinMismatch, setPinMismatch] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const [records, setRecords] = useState<VaultRecord[]>([]);
  const [shake, setShake] = useState(false);
  const [shield, setShield] = useState(false);
  const [burst, setBurst] = useState(false);
  const [preview, setPreview] = useState<VaultRecord | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [resetWarningOpen, setResetWarningOpen] = useState(false);
  const [changePinOpen, setChangePinOpen] = useState(false);
  const [changePinStep, setChangePinStep] = useState<"create" | "confirm">("create");
  const [changePinDraft, setChangePinDraft] = useState("");
  const [changePinValue, setChangePinValue] = useState("");
  const [changeConfirmValue, setChangeConfirmValue] = useState("");
  const [changePinNotice, setChangePinNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pinInputRef = useRef<HTMLInputElement>(null);
  const confirmInputRef = useRef<HTMLInputElement>(null);
  const changePinInputRef = useRef<HTMLInputElement>(null);
  const changeConfirmInputRef = useRef<HTMLInputElement>(null);
  const pinAdvanceTimer = useRef<number | null>(null);
  const confirmAdvanceTimer = useRef<number | null>(null);

  function clearPinAdvanceTimer() {
    if (pinAdvanceTimer.current) {
      clearTimeout(pinAdvanceTimer.current);
      pinAdvanceTimer.current = null;
    }
  }

  function clearConfirmAdvanceTimer() {
    if (confirmAdvanceTimer.current) {
      clearTimeout(confirmAdvanceTimer.current);
      confirmAdvanceTimer.current = null;
    }
  }

  useEffect(() => {
    return () => {
      clearPinAdvanceTimer();
      clearConfirmAdvanceTimer();
    };
  }, []);

  useEffect(() => {
    setMode(vaultExists() ? "unlock" : "setup");
    const saved = sessionStorage.getItem("deepshield_vault_pin");
    if (saved) {
      try {
        const list = loadVaultRecords(saved);
        setPin(saved);
        setRecords(list);
      } catch {
        sessionStorage.removeItem("deepshield_vault_pin");
      }
    }
  }, []);

  useEffect(() => {
    if (pin) return;
    const id = window.setTimeout(() => {
      if (mode === "setup" && setupStep === "confirm") {
        confirmInputRef.current?.focus();
      } else {
        pinInputRef.current?.focus();
      }
    }, 200);
    return () => window.clearTimeout(id);
  }, [pin, mode, setupStep]);

  useEffect(() => {
    if (!changePinOpen) return;
    const id = window.setTimeout(() => {
      if (changePinStep === "confirm") {
        changeConfirmInputRef.current?.focus();
      } else {
        changePinInputRef.current?.focus();
      }
    }, 200);
    return () => window.clearTimeout(id);
  }, [changePinOpen, changePinStep]);

  function flashShield() {
    setShield(true);
    setTimeout(() => setShield(false), 900);
  }

  function unlockSuccess(entered: string, list: VaultRecord[]) {
    setPin(entered);
    setRecords(list);
    sessionStorage.setItem("deepshield_vault_pin", entered);
    setBurst(true);
    setTimeout(() => setBurst(false), 600);
    flashShield();
    setPinValue("");
    setConfirmValue("");
  }

  function unlock(entered: string) {
    try {
      const list = loadVaultRecords(entered);
      unlockSuccess(entered, list);
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function goToConfirmStep(entered: string) {
    setDraftPin(entered);
    setSetupStep("confirm");
    setConfirmValue("");
    window.setTimeout(() => confirmInputRef.current?.focus(), 50);
  }

  function setupVault(entered: string, confirm: string) {
    if (entered !== confirm) {
      clearConfirmAdvanceTimer();
      setPinMismatch(true);
      setShake(true);
      setConfirmValue("");
      setTimeout(() => {
        setShake(false);
        setPinMismatch(false);
        confirmInputRef.current?.focus();
      }, 500);
      return;
    }
    saveVaultRecords(entered, []);
    unlockSuccess(entered, []);
  }

  function onPinValueChange(value: string) {
    setPinValue(value);
    clearPinAdvanceTimer();
    if (value.length !== 4) return;

    pinAdvanceTimer.current = window.setTimeout(() => {
      pinAdvanceTimer.current = null;
      if (mode === "unlock") {
        unlock(value);
      } else if (mode === "setup" && setupStep === "create") {
        goToConfirmStep(value);
      }
    }, PIN_COMPLETE_DELAY_MS);
  }

  function onConfirmValueChange(value: string) {
    setConfirmValue(value);
    clearConfirmAdvanceTimer();
    if (value.length !== 4) return;

    const pin = draftPin;
    confirmAdvanceTimer.current = window.setTimeout(() => {
      confirmAdvanceTimer.current = null;
      setupVault(pin, value);
    }, PIN_COMPLETE_DELAY_MS);
  }

  function lockVault() {
    clearPinAdvanceTimer();
    clearConfirmAdvanceTimer();
    setPin(null);
    setRecords([]);
    sessionStorage.removeItem("deepshield_vault_pin");
    setPinValue("");
    setConfirmValue("");
    setDraftPin("");
    setSetupStep("create");
    setResetWarningOpen(false);
    setChangePinOpen(false);
    setMode(vaultExists() ? "unlock" : "setup");
  }

  function resetVaultPin() {
    clearVault();
    sessionStorage.removeItem("deepshield_vault_pin");
    setPin(null);
    setRecords([]);
    setPinValue("");
    setConfirmValue("");
    setDraftPin("");
    setSetupStep("create");
    setResetWarningOpen(false);
    setMode("setup");
    flashShield();
  }

  function closeChangePin() {
    setChangePinOpen(false);
    setChangePinStep("create");
    setChangePinDraft("");
    setChangePinValue("");
    setChangeConfirmValue("");
    setPinMismatch(false);
  }

  function goToChangePinConfirm(entered: string) {
    setChangePinDraft(entered);
    setChangePinStep("confirm");
    setChangeConfirmValue("");
    window.setTimeout(() => changeConfirmInputRef.current?.focus(), 50);
  }

  function applyNewPin(entered: string, confirm: string) {
    if (!pin) return;
    if (entered !== confirm) {
      setPinMismatch(true);
      setShake(true);
      setChangeConfirmValue("");
      setTimeout(() => {
        setShake(false);
        setPinMismatch(false);
        changeConfirmInputRef.current?.focus();
      }, 500);
      return;
    }
    saveVaultRecords(entered, records);
    sessionStorage.setItem("deepshield_vault_pin", entered);
    setPin(entered);
    closeChangePin();
    setChangePinNotice(t("vaultChangePinSuccess"));
    setTimeout(() => setChangePinNotice(null), 4000);
    flashShield();
  }

  function onChangePinValueChange(value: string) {
    setChangePinValue(value);
    if (value.length !== 4) return;
    window.setTimeout(() => goToChangePinConfirm(value), PIN_COMPLETE_DELAY_MS);
  }

  function onChangeConfirmValueChange(value: string) {
    setChangeConfirmValue(value);
    if (value.length !== 4) return;
    window.setTimeout(() => applyNewPin(changePinDraft, value), PIN_COMPLETE_DELAY_MS);
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
      flashShield();
    };
    reader.readAsDataURL(file);
  }

  function saveNote() {
    const text = noteText.trim();
    if (!text || !pin) return;
    const rec: VaultRecord = {
      id: crypto.randomUUID(),
      name: `note_${new Date().toISOString().slice(0, 10)}.txt`,
      kind: "note",
      savedAt: new Date().toISOString(),
      sizeBytes: text.length,
      payload: text,
    };
    persist([rec, ...records]);
    setNoteText("");
    setNoteOpen(false);
    flashShield();
  }

  function deleteRecord(id: string) {
    if (!confirm(t("vaultDeleteItemConfirm"))) return;
    persist(records.filter((r) => r.id !== id));
  }

  function downloadRecord(r: VaultRecord) {
    if (r.payload.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = r.payload;
      a.download = r.name;
      a.click();
    } else {
      const blob = new Blob([r.payload], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = r.name;
      a.click();
      URL.revokeObjectURL(url);
    }
    flashShield();
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
          {resetWarningOpen ? (
            <div className="space-y-4">
              <p className="text-center font-display text-lg text-ink">{t("vaultResetPinLink")}</p>
              <p className="text-center text-sm leading-relaxed text-ink-muted">
                {t("vaultResetWarning")}
              </p>
              <div className="flex flex-col gap-2">
                <Button variant="primary" className="w-full" onClick={resetVaultPin}>
                  {t("vaultResetConfirm")}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setResetWarningOpen(false)}>
                  {t("vaultResetCancel")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-2 text-center font-display text-lg text-ink">
                {mode === "setup" ? t("vaultSetupTitle") : t("vaultUnlock")}
              </p>
              <p className="mb-6 text-center text-sm text-ink-muted">
                {mode === "setup" ? t("vaultSetupHint") : t("vaultPinPrompt")}
              </p>
              <div className="mb-4 space-y-4">
                {mode === "setup" && setupStep === "confirm" ? (
                  <>
                    <p className="text-center text-xs text-ink-subtle">{t("vaultConfirmPin")}</p>
                    <PinPad
                      value={confirmValue}
                      onChange={onConfirmValueChange}
                      inputRef={confirmInputRef}
                      shake={shake}
                      burst={burst}
                    />
                  </>
                ) : (
                  <PinPad
                    value={pinValue}
                    onChange={onPinValueChange}
                    inputRef={pinInputRef}
                    shake={shake}
                    burst={burst}
                  />
                )}
              </div>
              {pinMismatch && (
                <p className="mb-4 text-center text-sm text-danger">{t("vaultPinMismatch")}</p>
              )}
              <p className="mb-4 text-center text-xs text-ink-subtle">{t("vaultPinTapHint")}</p>
              <Button
                variant="dark"
                className="w-full"
                onClick={() => {
                  if (mode === "setup") {
                    if (setupStep === "create" && pinValue.length === 4) {
                      goToConfirmStep(pinValue);
                    } else if (setupStep === "confirm" && confirmValue.length === 4) {
                      setupVault(draftPin, confirmValue);
                    }
                  } else if (pinValue.length === 4) {
                    unlock(pinValue);
                  }
                }}
              >
                {mode === "setup"
                  ? setupStep === "confirm"
                    ? t("vaultCreate")
                    : t("vaultConfirmPin")
                  : t("vaultUnlock")}
              </Button>
              {mode === "unlock" && vaultExists() && (
                <button
                  type="button"
                  onClick={() => setResetWarningOpen(true)}
                  className="mt-4 w-full text-center text-xs font-medium text-link underline-offset-2 hover:underline"
                >
                  {t("vaultResetPinLink")}
                </button>
              )}
            </>
          )}
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
          <Button variant="secondary" onClick={() => setNoteOpen(true)}>
            {t("vaultAddNote")}
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
          <Button variant="ghost" onClick={() => setChangePinOpen(true)}>
            {t("vaultChangePin")}
          </Button>
          <Button variant="ghost" onClick={lockVault}>
            {t("vaultLock")}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*,application/pdf,text/plain"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
          />
        </div>
        <p className="mt-4 text-xs text-ink-subtle">
          {records.length} {t("vaultItemCount")}
        </p>
        {changePinNotice && (
          <p className="mt-2 text-sm text-sage-deep" role="status">
            {changePinNotice}
          </p>
        )}
      </GlassCard>

      <AnimatePresence>
        {changePinOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChangePin}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <GlassCard className="mx-auto w-full max-w-sm space-y-4">
                <p className="text-center font-display text-lg text-ink">{t("vaultChangePinTitle")}</p>
                <p className="text-center text-sm text-ink-muted">{t("vaultChangePinHint")}</p>
                <div className="space-y-4">
                  {changePinStep === "confirm" ? (
                    <>
                      <p className="text-center text-xs text-ink-subtle">{t("vaultConfirmPin")}</p>
                      <PinPad
                        value={changeConfirmValue}
                        onChange={onChangeConfirmValueChange}
                        inputRef={changeConfirmInputRef}
                        shake={shake}
                      />
                    </>
                  ) : (
                    <PinPad
                      value={changePinValue}
                      onChange={onChangePinValueChange}
                      inputRef={changePinInputRef}
                      shake={shake}
                    />
                  )}
                </div>
                {pinMismatch && (
                  <p className="text-center text-sm text-danger">{t("vaultPinMismatch")}</p>
                )}
                <p className="text-center text-xs text-ink-subtle">{t("vaultPinTapHint")}</p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      if (changePinStep === "create" && changePinValue.length === 4) {
                        goToChangePinConfirm(changePinValue);
                      } else if (changePinStep === "confirm" && changeConfirmValue.length === 4) {
                        applyNewPin(changePinDraft, changeConfirmValue);
                      }
                    }}
                  >
                    {changePinStep === "confirm" ? t("vaultChangePin") : t("vaultConfirmPin")}
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={closeChangePin}>
                    {t("vaultClose")}
                  </Button>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {noteOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <GlassCard className="space-y-3">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={t("vaultNotePlaceholder")}
                rows={4}
                className="input-field w-full"
              />
              <div className="flex gap-2">
                <Button variant="primary" onClick={saveNote}>
                  {t("vaultSaveNote")}
                </Button>
                <Button variant="ghost" onClick={() => setNoteOpen(false)}>
                  {t("vaultClose")}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {records.length === 0 ? (
        <GlassCard>
          <p className="text-center text-sm text-ink-muted">{t("vaultEmpty")}</p>
        </GlassCard>
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <GlassCard key={r.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{r.name}</p>
                <p className="text-xs text-ink-subtle">
                  {t(KIND_KEYS[r.kind])} · {(r.sizeBytes / 1024).toFixed(1)} KB ·{" "}
                  {new Date(r.savedAt).toLocaleString()}
                </p>
                {r.kind === "note" && (
                  <p className="mt-2 line-clamp-2 text-xs text-ink-muted">{r.payload}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sage/40 px-2 py-0.5 text-xs">
                  {t("vaultEncryptedBadge")}
                </span>
                {isImagePayload(r.payload) && (
                  <Button variant="ghost" className="!px-3 !py-1 text-xs" onClick={() => setPreview(r)}>
                    {t("vaultPreview")}
                  </Button>
                )}
                <Button variant="ghost" className="!px-3 !py-1 text-xs" onClick={() => downloadRecord(r)}>
                  {t("vaultDownload")}
                </Button>
                <Button variant="ghost" className="!px-3 !py-1 text-xs" onClick={() => deleteRecord(r.id)}>
                  {t("vaultDeleteItem")}
                </Button>
              </div>
            </GlassCard>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {preview && isImagePayload(preview.payload) && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
            <GlassCard className="max-h-[90vh] max-w-lg overflow-auto p-4">
              <p className="mb-3 text-sm font-medium text-ink">{preview.name}</p>
              <div className="relative aspect-square w-full min-w-[280px]">
                <Image
                  src={preview.payload}
                  alt={preview.name}
                  fill
                  className="rounded-xl object-contain"
                  unoptimized
                />
              </div>
              <Button variant="primary" className="mt-4 w-full" onClick={() => setPreview(null)}>
                {t("vaultClose")}
              </Button>
            </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
