"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageMenu } from "@/components/layout/LanguageMenu";

const LINKS = [
  { href: "/", key: "navHome" as const },
  { href: "/scan", key: "navScan" as const },
  { href: "/trace", key: "navTrace" as const },
  { href: "/report", key: "navReport" as const },
  { href: "/vault", key: "navVault" as const },
  { href: "/asha", key: "navAsha" as const },
  { href: "/community", key: "navCommunity" as const },
  { href: "/learn", key: "navLearn" as const },
];

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 48));
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(166, 144, 118, 0)", "rgba(75, 10, 10, 0.96)"],
  );
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(18px)"]);
  const border = useTransform(
    scrollY,
    [0, 80],
    ["rgba(75, 10, 10, 0)", "rgba(242, 232, 213, 0.22)"],
  );
  const maxW = useTransform(scrollY, [0, 80], ["100%", "56rem"]);
  const radius = useTransform(scrollY, [0, 80], [0, 9999]);
  const top = useTransform(scrollY, [0, 80], [0, 10]);
  const left = useTransform(scrollY, [0, 80], ["0%", "50%"]);
  const x = useTransform(scrollY, [0, 80], ["0%", "-50%"]);

  return (
    <motion.header
      style={{
        backgroundColor: bg,
        backdropFilter: blur,
        borderColor: border,
        maxWidth: maxW,
        borderRadius: radius,
        top,
        left,
        x,
      }}
      className="fixed z-50 w-full border-b border-transparent shadow-sm"
    >
      <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-2 px-4 py-2.5 md:gap-3 md:py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/ds-logo.jpeg"
            alt="DeepShield"
            width={36}
            height={36}
            className="rounded-lg object-contain ring-1 ring-secondary/40"
            unoptimized
          />
          <span
            className={`font-display hidden sm:inline ${scrolled ? "text-cream-deep" : "text-ink"}`}
          >
            DeepShield
          </span>
        </Link>
        <nav className="flex min-w-0 flex-1 flex-nowrap items-center justify-center gap-0.5 overflow-x-auto text-xs md:text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LINKS.map(({ href, key }) => {
            const active =
              href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`ui-nowrap shrink-0 rounded-full px-2 py-1.5 md:px-3 ${
                  active
                    ? scrolled
                      ? "bg-cream-deep/20 font-medium text-cream-deep ring-1 ring-cream-deep/35"
                      : "bg-secondary/12 font-medium text-ink ring-1 ring-secondary/30"
                    : scrolled
                      ? "text-cream-deep/85 hover:bg-cream-deep/12"
                      : "text-ink-muted hover:bg-secondary/8"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>
        <LanguageMenu scrolled={scrolled} />
      </div>
    </motion.header>
  );
}
