"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  readSession,
  signInWithGoogleProfile,
  syncAuthCookieFromSession,
  type AuthUser,
} from "@/lib/authStorage";
import { useLanguage } from "@/context/LanguageContext";

function AuthCompleteInner() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const from = searchParams.get("from");
    const returnTo =
      from && from.startsWith("/") && !from.startsWith("//") && !from.startsWith("/login")
        ? from
        : "/";

    async function finish() {
      const existing = readSession();
      if (existing) {
        syncAuthCookieFromSession();
        window.location.replace(returnTo);
        return;
      }

      try {
        const res = await fetch("/api/auth/session", { credentials: "same-origin" });
        if (res.ok) {
          const data = (await res.json()) as { user: AuthUser | null };
          if (data.user) {
            signInWithGoogleProfile(data.user);
            window.location.replace(returnTo);
            return;
          }
        }
      } catch {
        /* fall through to login */
      }

      window.location.replace("/login?error=oauth_missing");
    }

    void finish();
  }, [searchParams]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="h-10 w-10 animate-pulse rounded-full bg-cream-tan/80" aria-hidden />
      <p className="mt-4 text-sm text-ink-muted">{t("authCompletingGoogle")}</p>
    </div>
  );
}

export default function AuthCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center justify-center px-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-cream-tan/80" aria-hidden />
        </div>
      }
    >
      <AuthCompleteInner />
    </Suspense>
  );
}
