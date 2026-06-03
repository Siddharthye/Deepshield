"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Tooltip({
  label,
  children,
  learnMoreHref,
}: {
  label: string;
  children: ReactNode;
  learnMoreHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className="relative inline"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span
        tabIndex={0}
        aria-describedby={open ? id : undefined}
        className="cursor-help border-b border-dotted border-pink/60 text-ink underline-offset-2"
      >
        {children}
      </span>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="glass-card pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 px-3 py-2 text-left text-xs leading-snug text-ink shadow-lg"
          >
            {label}
            {learnMoreHref && (
              <span className="mt-1 block text-pink">Learn more →</span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
