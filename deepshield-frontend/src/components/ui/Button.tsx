import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  primary:
    "bg-gradient-to-r from-pink to-peach text-ink shadow-[0_4px_20px_rgba(253,200,194,0.5)] hover:brightness-105",
  secondary:
    "border border-sage/60 bg-blue/40 text-ink hover:bg-blue/60",
  dark: "bg-ink text-cream hover:opacity-90",
  ghost: "text-pink hover:bg-peach/50",
} as const;

type Variant = keyof typeof variants;

function classes(variant: Variant, className = "") {
  return `inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition ${variants[variant]} ${className}`;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={classes(variant, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={classes(variant, className)}>
      {children}
    </Link>
  );
}
