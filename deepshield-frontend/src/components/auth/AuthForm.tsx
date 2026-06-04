"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { SAFETY } from "@/lib/safetyContacts";
import type { I18nKey } from "@/lib/i18n";

type Mode = "signin" | "register";

const OAUTH_ERROR_KEYS: Record<string, I18nKey> = {
  google_not_configured: "authGoogleNotConfigured",
  google_denied: "authGoogleDenied",
  google_failed: "authGoogleFailed",
  google_redirect: "authGoogleRedirectMismatch",
  google_credentials: "authGoogleCredentials",
  google_token: "authGoogleTokenFailed",
  google_userinfo: "authGoogleUserinfoFailed",
  oauth_state: "authGoogleStateFailed",
  oauth_missing: "authGoogleSessionFailed",
  access_denied: "authGoogleDenied",
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AuthForm() {
  const { t } = useLanguage();
  const { user, signInEmail, registerEmail, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const returnTo =
    from && from.startsWith("/") && !from.startsWith("//") && !from.startsWith("/login")
      ? from
      : "/";
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (!oauthError) return;
    const key = OAUTH_ERROR_KEYS[oauthError];
    setError(key ? t(key) : t("authGoogleFailed"));
  }, [searchParams, t]);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setConfirmPassword("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          setError(t("authPasswordMismatch"));
          return;
        }
        const result = registerEmail(email, password, name);
        if (!result.ok) {
          if (result.reason === "invalid_email") setError(t("authEmailInvalid"));
          else if (result.reason === "weak_password") setError(t("authPasswordShort"));
          else if (result.reason === "exists") setError(t("authEmailExists"));
          return;
        }
        router.push(returnTo);
        router.refresh();
        return;
      }

      const result = signInEmail(email, password);
      if (!result.ok) {
        if (result.reason === "invalid_email") setError(t("authEmailInvalid"));
        else setError(t("authSignInFailed"));
        return;
      }
      router.push(returnTo);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  function handleGoogle() {
    setError(null);
    setLoading(true);
    const url = new URL("/api/auth/google", window.location.origin);
    url.searchParams.set("from", returnTo);
    window.location.assign(url.toString());
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-md"
    >
      <GlassCard className="glass-card-tint-blue p-6 md:p-8">
        {user && (
          <div className="mb-6 rounded-2xl bg-sage/25 px-4 py-3 text-sm text-ink">
            <p>
              {t("authAlreadySignedIn")} <strong>{user.name}</strong>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => router.push(returnTo)}
                className="rounded-full bg-secondary px-4 py-2 text-xs font-medium text-cream-deep"
              >
                {t("authContinueApp")}
              </button>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setError(null);
                }}
                className="rounded-full border border-secondary/30 px-4 py-2 text-xs font-medium text-ink"
              >
                {t("authSignOutSwitch")}
              </button>
            </div>
          </div>
        )}
        <p className="page-badge">{t("loginBadge")}</p>
        <h1 className="font-display text-2xl text-ink md:text-3xl">{t("loginTitle")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t("loginSubtitle")}</p>

        <div
          className="mt-6 flex rounded-full bg-cream-tan/80 p-1 ring-1 ring-secondary/20"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            onClick={() => switchMode("signin")}
            className={`ui-nowrap flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "signin"
                ? "bg-secondary text-cream-deep shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {t("authSignIn")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            onClick={() => switchMode("register")}
            className={`ui-nowrap flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "register"
                ? "bg-secondary text-cream-deep shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {t("authRegister")}
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-secondary/25 bg-cream-deep px-4 py-2.5 text-sm font-medium text-ink shadow-sm transition hover:bg-parchment disabled:opacity-60"
        >
          <GoogleIcon />
          {loading ? t("authGoogleRedirecting") : t("authContinueGoogle")}
        </button>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-secondary/20" />
          <span className="text-xs text-ink-subtle">{t("authOrDivider")}</span>
          <span className="h-px flex-1 bg-secondary/20" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === "register" && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">
                {t("authName")}
              </span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder={t("authNamePlaceholder")}
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">
              {t("authEmail")}
            </span>
            <input
              type="email"
              autoComplete={mode === "register" ? "email" : "username"}
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="name@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">
              {t("authPassword")}
            </span>
            <input
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              required
              minLength={mode === "register" ? 8 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </label>

          {mode === "register" && (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">
                {t("authConfirmPassword")}
              </span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </label>
          )}

          {error && (
            <p className="text-center text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {mode === "register" ? t("authSubmitRegister") : t("authSubmitSignIn")}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-ink-muted">
          {mode === "signin" ? t("authNoAccount") : t("authHasAccount")}{" "}
          <button
            type="button"
            onClick={() => switchMode(mode === "signin" ? "register" : "signin")}
            className="font-medium text-link underline-offset-2 hover:underline"
          >
            {mode === "signin" ? t("authSwitchToRegister") : t("authSwitchToSignIn")}
          </button>
        </p>
      </GlassCard>

      <p className="mt-4 text-center text-xs text-ink-subtle">
        {t("safetyRibbonLabel")}{" "}
        <a href={SAFETY.cyberHelplineTel} className="font-medium text-link">
          {SAFETY.cyberHelpline}
        </a>
        {" · "}
        <a
          href={SAFETY.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-link"
        >
          {SAFETY.portalLabel}
        </a>
      </p>
    </motion.div>
  );
}
