"use client";

import Link from "next/link";

const SIZES = {
  sm: { box: 32, icon: 18, text: "text-sm" },
  md: { box: 56, icon: 28, text: "text-lg" },
  lg: { box: 72, icon: 36, text: "text-xl" },
} as const;

function ShieldIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 40"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M18 3 L32 9.5 V21.5 C32 29.5 25.8 35.2 18 37.5 C10.2 35.2 4 29.5 4 21.5 V9.5 Z"
        fill="white"
        fillOpacity={0.95}
      />
      <path
        d="M13 20.5 L16.5 24 L24.5 15"
        stroke="var(--color-soldier)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type BrandLogoProps = {
  size?: keyof typeof SIZES;
  showWordmark?: boolean;
  href?: string;
  className?: string;
};

export function BrandLogo({
  size = "md",
  showWordmark = true,
  href,
  className = "",
}: BrandLogoProps) {
  const s = SIZES[size];
  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="flex shrink-0 items-center justify-center rounded-[22%] shadow-[var(--shadow-soft)] ring-1 ring-black/[0.06]"
        style={{
          width: s.box,
          height: s.box,
          background:
            "linear-gradient(145deg, var(--color-berry) 0%, color-mix(in srgb, var(--color-koubai) 75%, var(--color-berry)) 100%)",
        }}
      >
        <ShieldIcon size={s.icon} />
      </span>
      {showWordmark && (
        <span
          className={`font-display font-semibold tracking-[-0.03em] text-ink ${s.text}`}
        >
          DeepShield
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="rounded-lg outline-offset-4 hover:opacity-90">
        {inner}
      </Link>
    );
  }

  return inner;
}
