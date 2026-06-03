import {
  decryptPayload,
  encryptPayload,
  loadVaultRecords,
  saveVaultRecords,
  type VaultRecord,
} from "./encryption";

const VAULT_KEY = "deepshield_vault_enc";

export function getVaultPin(): string | null {
  return sessionStorage.getItem("deepshield_vault_pin");
}

export function addToVault(
  pin: string,
  item: Omit<VaultRecord, "id" | "savedAt"> & { id?: string },
) {
  const list = loadVaultRecords(pin);
  const rec: VaultRecord = {
    id: item.id ?? crypto.randomUUID(),
    name: item.name,
    kind: item.kind,
    sizeBytes: item.sizeBytes,
    payload: item.payload,
    savedAt: new Date().toISOString(),
  };
  saveVaultRecords(pin, [rec, ...list]);
  return rec;
}

export function tryAddToVault(
  item: Omit<VaultRecord, "id" | "savedAt"> & { id?: string },
) {
  const pin = getVaultPin();
  if (!pin) return false;
  try {
    addToVault(pin, item);
    return true;
  } catch {
    return false;
  }
}

export function vaultIsUnlocked(): boolean {
  const pin = getVaultPin();
  if (!pin) return false;
  try {
    loadVaultRecords(pin);
    return true;
  } catch {
    return false;
  }
}

export { loadVaultRecords, saveVaultRecords, encryptPayload, decryptPayload, VAULT_KEY };
export type { VaultRecord };
