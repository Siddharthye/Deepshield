import crypto from "crypto";
import type { AuthUser } from "@/lib/authTypes";

type HandoffPayload = {
  user: AuthUser;
  exp: number;
};

export function createHandoffToken(user: AuthUser, secret: string): string {
  const payload: HandoffPayload = { user, exp: Date.now() + 120_000 };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyHandoffToken(token: string, secret: string): AuthUser | null {
  if (!secret) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as HandoffPayload;
    if (!parsed?.user?.email || parsed.user.provider !== "google") return null;
    if (typeof parsed.exp !== "number" || parsed.exp < Date.now()) return null;
    return parsed.user;
  } catch {
    return null;
  }
}
