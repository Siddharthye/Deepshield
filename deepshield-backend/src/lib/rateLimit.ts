type Bucket = {
  count: number;
  resetAtMs: number;
};

const buckets = new Map<string, Bucket>();

function nowMs() {
  return Date.now();
}

export function assertRateLimit(opts: {
  key: string;
  windowMs: number;
  maxRequests: number;
}) {
  const { key, windowMs, maxRequests } = opts;

  const t = nowMs();
  const existing = buckets.get(key);
  if (!existing || t >= existing.resetAtMs) {
    buckets.set(key, { count: 1, resetAtMs: t + windowMs });
    return;
  }

  if (existing.count >= maxRequests) {
    const err = new Error("Rate limited");
    (err as any).code = "RATE_LIMITED";
    throw err;
  }

  existing.count += 1;
}

