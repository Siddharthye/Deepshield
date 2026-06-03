import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  primary:
    "bg-gradient-to-r from-rose to-blush text-espresso shadow-[0_4px_20px_rgba(219,161,162,0.45)] hover:shadow-[0_6px_28px_rgba(219,161,162,0.55)] hover:brightness-105",
  secondary:
    "border border-sage/50 bg-blush/50 text-espresso hover:bg-blush hover:border-rose/40",
  dark: "bg-espresso text-fantasy hover:bg-espresso/90",
  ghost: "text-rose hover:bg-blush/40",
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
