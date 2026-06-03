export type AuthProvider = "email" | "google";

export type AuthUser = {
  email: string;
  name: string;
  provider: AuthProvider;
};

export const AUTH_COOKIE = "deepshield_auth";
const SESSION_KEY = "deepshield_auth_session";
const ACCOUNTS_KEY = "deepshield_auth_accounts";
const COOKIE_MAX_AGE_DAYS = 30;

type StoredAccount = {
  email: string;
  password: string;
  name: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setAuthCookie(active: boolean) {
  if (typeof document === "undefined") return;
  if (active) {
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}

function readAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function writeSession(user: AuthUser | null) {
  if (!user) {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthCookie(false);
    return;
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  setAuthCookie(true);
}

/** Restore auth cookie when session exists (e.g. after tab refresh). */
export function syncAuthCookieFromSession() {
  setAuthCookie(readSession() !== null);
}

export function registerWithEmail(
  email: string,
  password: string,
  name: string,
): { ok: true; user: AuthUser } | { ok: false; reason: "invalid_email" | "weak_password" | "exists" } {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) return { ok: false, reason: "invalid_email" };
  if (password.length < 8) return { ok: false, reason: "weak_password" };

  const accounts = readAccounts();
  if (accounts.some((a) => a.email === normalized)) return { ok: false, reason: "exists" };

  const displayName = name.trim() || (normalized.split("@")[0] ?? "User");
  accounts.push({ email: normalized, password, name: displayName });
  writeAccounts(accounts);

  const user: AuthUser = { email: normalized, name: displayName, provider: "email" };
  writeSession(user);
  return { ok: true, user };
}

export function signInWithEmail(
  email: string,
  password: string,
): { ok: true; user: AuthUser } | { ok: false; reason: "invalid_email" | "invalid_credentials" } {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) return { ok: false, reason: "invalid_email" };

  const account = readAccounts().find((a) => a.email === normalized);
  if (!account || account.password !== password) {
    return { ok: false, reason: "invalid_credentials" };
  }

  const user: AuthUser = {
    email: normalized,
    name: account.name,
    provider: "email",
  };
  writeSession(user);
  return { ok: true, user };
}

/** Placeholder until Google OAuth is wired — creates a signed-in session for UX testing. */
export function signInWithGoogleMock(): AuthUser {
  const user: AuthUser = {
    email: "google.user@example.com",
    name: "Google user",
    provider: "google",
  };
  writeSession(user);
  return user;
}

export function signOut() {
  writeSession(null);
}

export { isValidEmail };
