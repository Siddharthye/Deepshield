"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(250, 249, 247, 0)", "rgba(250, 249, 247, 0.82)"],
  );
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(20px)"]);
  const border = useTransform(
    scrollY,
    [0, 80],
    ["rgba(87, 85, 39, 0)", "rgba(87, 85, 39, 0.08)"],
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
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 md:gap-3 md:py-3">
        <BrandLogo
          href="/"
          size="sm"
          className="[&>span:nth-child(2)]:hidden sm:[&>span:nth-child(2)]:inline"
        />
        <nav className="flex flex-wrap items-center justify-center gap-0.5 text-xs md:text-sm">
          {LINKS.map(({ href, key }) => {
            const active =
              href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-2 py-1.5 md:px-3 ${
                  active
                    ? "bg-white/90 font-medium text-ink shadow-sm ring-1 ring-black/6"
                    : "text-ink-muted hover:bg-white/50"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>
        <LanguageMenu />
      </div>
    </motion.header>
  );
}
