"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-[var(--color-koubai)] text-white shadow-[var(--shadow-glow)] hover:brightness-[1.06] active:scale-[0.98]",
  secondary:
    "border border-[color-mix(in_srgb,var(--color-soldier)_14%,transparent)] bg-white/80 text-ink shadow-sm hover:bg-white",
  dark: "bg-[var(--color-soldier)] text-[var(--color-fog)] hover:opacity-90",
  ghost: "text-accent hover:bg-white/60",
} as const;

type Variant = keyof typeof variants;

function baseClasses(variant: Variant, className = "") {
  return `relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight ${variants[variant]} ${className}`;
}

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  shimmer?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

function RippleButton({
  children,
  variant = "primary",
  className = "",
  shimmer = false,
  disabled,
  onClick,
  type = "button",
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  function addRipple(e: React.MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setRipples((r) => [
      ...r.slice(-2),
      { x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() },
    ]);
  }

  return (
    <motion.button
      ref={ref}
      className={baseClasses(variant, className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      onMouseEnter={addRipple}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {shimmer && (
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          aria-hidden
        />
      )}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-pink/30"
          style={{ left: r.x, top: r.y, width: 8, height: 8, marginLeft: -4, marginTop: -4 }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 18, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          onAnimationComplete={() =>
            setRipples((all) => all.filter((x) => x.id !== r.id))
          }
        />
      ))}
      <span className="relative z-[1]">{children}</span>
    </motion.button>
  );
}

export function Button(props: ButtonProps) {
  return (
    <RippleButton
      {...props}
      shimmer={props.variant === "primary" || props.variant === undefined}
    />
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
    <motion.span
      className="inline-block"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <Link href={href} className={`group ${baseClasses(variant, className)}`}>
        {variant === "primary" && (
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          >
            <span className="absolute inset-0 -skew-x-12 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.2s_ease-in-out]" />
          </span>
        )}
        <span className="relative z-[1]">{children}</span>
      </Link>
    </motion.span>
  );
}
