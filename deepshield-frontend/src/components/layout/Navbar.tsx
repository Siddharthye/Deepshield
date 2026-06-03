"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageMenu } from "@/components/layout/LanguageMenu";

const LINKS = [
  { href: "/scan", key: "navScan" },
  { href: "/trace", key: "navTrace" },
  { href: "/report", key: "navReport" },
  { href: "/vault", key: "navVault" },
  { href: "/asha", key: "navAsha" },
  { href: "/community", key: "navCommunity" },
  { href: "/learn", key: "navLearn" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(253, 246, 235, 0)", "rgba(253, 214, 193, 0.94)"],
  );
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(18px)"]);
  const border = useTransform(
    scrollY,
    [0, 80],
    ["rgba(197, 204, 173, 0)", "rgba(197, 204, 173, 0.5)"],
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
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/ds-logo.jpeg"
            alt="DeepShield"
            width={36}
            height={36}
            className="rounded-lg object-contain"
            unoptimized
          />
          <span className="font-display hidden text-ink sm:inline">DeepShield</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-0.5 text-xs md:text-sm">
          {LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-2 py-1.5 md:px-3 ${
                pathname === href
                  ? "bg-pink/55 font-medium text-ink"
                  : "text-ink/70 hover:bg-blue/45"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <LanguageMenu />
      </div>
    </motion.header>
  );
}
