"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import {
  readSession,
  registerWithEmail,
  signInWithEmail,
  signInWithGoogleMock,
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
  signInGoogle: () => AuthUser;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const session = readSession();
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

  const signInGoogle = useCallback(() => {
    const next = signInWithGoogleMock();
    setUser(next);
    return next;
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, ready, signInEmail, registerEmail, signInGoogle, signOut }}
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
