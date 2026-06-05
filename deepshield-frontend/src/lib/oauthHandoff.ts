import crypto from "crypto";
import type { AuthUser } from "@/lib/authStorage";

type HandoffPayload = {
  user: AuthUser;
  exp: number;
};

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
