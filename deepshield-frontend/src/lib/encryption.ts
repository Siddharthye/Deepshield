import CryptoJS from "crypto-js";

export const VAULT_KEY = "deepshield_vault_enc";

export function vaultExists(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(VAULT_KEY));
}

export function encryptPayload(plain: string, pin: string): string {
  return CryptoJS.AES.encrypt(plain, pin).toString();
}

export function decryptPayload(cipher: string, pin: string): string {
  const bytes = CryptoJS.AES.decrypt(cipher, pin);
  const text = bytes.toString(CryptoJS.enc.Utf8);
  if (!text) throw new Error("Invalid PIN or corrupted data");
  return text;
}

export type VaultRecord = {
  id: string;
  name: string;
  kind: "scan" | "trace" | "report" | "note" | "video";
  savedAt: string;
  sizeBytes: number;
  payload: string;
};

export function loadVaultRecords(pin: string): VaultRecord[] {
  const raw = localStorage.getItem(VAULT_KEY);
  if (!raw) return [];
  const decrypted = decryptPayload(raw, pin);
  return JSON.parse(decrypted) as VaultRecord[];
}

export function saveVaultRecords(pin: string, records: VaultRecord[]) {
  const encrypted = encryptPayload(JSON.stringify(records), pin);
  localStorage.setItem(VAULT_KEY, encrypted);
}
