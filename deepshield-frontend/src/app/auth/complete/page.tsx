"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PENDING_USER_COOKIE } from "@/lib/googleOAuth";
import {
  consumePendingUserCookie,
  readSession,
  syncAuthCookieFromSession,
} from "@/lib/authStorage";
import { useLanguage } from "@/context/LanguageContext";

function AuthCompleteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeOAuth } = useAuth();
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

    const existing = readSession();
    if (existing) {
      syncAuthCookieFromSession();
      router.replace(returnTo);
      return;
    }

    const user = consumePendingUserCookie(PENDING_USER_COOKIE);
    if (!user) {
      router.replace("/login?error=oauth_missing");
      return;
    }

    completeOAuth(user);
    router.replace(returnTo);
  }, [completeOAuth, router, searchParams]);

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
