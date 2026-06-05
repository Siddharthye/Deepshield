export type AuthProvider = "email" | "google";

export type AuthUser = {
  email: string;
  name: string;
  provider: AuthProvider;
  picture?: string;
};

export const AUTH_COOKIE = "deepshield_auth";
export const AUTH_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const SESSION_KEY = "deepshield_auth_session";
const ACCOUNTS_KEY = "deepshield_auth_accounts";

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
    const maxAge = AUTH_COOKIE_MAX_AGE_SECONDS;
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

export function signInWithGoogleProfile(profile: {
  email: string;
  name: string;
  picture?: string;
}): AuthUser {
  const user: AuthUser = {
    email: normalizeEmail(profile.email),
    name: profile.name.trim() || profile.email.split("@")[0] || "User",
    provider: "google",
    picture: profile.picture,
  };
  writeSession(user);
  return user;
}

/** Read one-time user payload set by OAuth callback, then clear the cookie. */
export function consumePendingUserCookie(cookieName: string): AuthUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));
  if (!match) return null;

  const raw = decodeURIComponent(match.slice(cookieName.length + 1));
  document.cookie = `${cookieName}=; path=/; max-age=0; SameSite=Lax`;

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.email || parsed.provider !== "google") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function signOut() {
  writeSession(null);
}

export { isValidEmail };
