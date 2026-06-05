"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { PENDING_USER_COOKIE } from "@/lib/googleOAuth";
import {
  consumePendingUserCookie,
  readSession,
  registerWithEmail,
  signInWithEmail,
  signInWithGoogleProfile,
  signOut as clearSession,
  syncAuthCookieFromSession,
  type AuthUser,
} from "@/lib/authStorage";

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  signInEmail: (email: string, password: string) => ReturnType<typeof signInWithEmail>;
  registerEmail: (
    email: string,
    password: string,
    name: string,
  ) => ReturnType<typeof registerWithEmail>;
  completeOAuth: (user: AuthUser) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    let session = readSession();
    if (!session) {
      const pending = consumePendingUserCookie(PENDING_USER_COOKIE);
      if (pending) session = signInWithGoogleProfile(pending);
    }
    if (session) syncAuthCookieFromSession();
    setUser(session);
    setReady(true);
  }, []);

  const signInEmail = useCallback((email: string, password: string) => {
    const result = signInWithEmail(email, password);
    if (result.ok) setUser(result.user);
    return result;
  }, []);

  const registerEmail = useCallback((email: string, password: string, name: string) => {
    const result = registerWithEmail(email, password, name);
    if (result.ok) setUser(result.user);
    return result;
  }, []);

  const completeOAuth = useCallback((sessionUser: AuthUser) => {
    const next = signInWithGoogleProfile(sessionUser);
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, ready, signInEmail, registerEmail, completeOAuth, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
