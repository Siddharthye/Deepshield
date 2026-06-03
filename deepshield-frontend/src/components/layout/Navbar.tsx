"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { LANGUAGES } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";

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
  const { language, setLanguage, t } = useLanguage();
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(253, 246, 235, 0)", "rgba(253, 214, 193, 0.92)"],
  );
  const headerBlur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(20px)"]);
  const headerBorder = useTransform(
    scrollY,
    [0, 80],
    ["rgba(197, 204, 173, 0)", "rgba(197, 204, 173, 0.55)"],
  );

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        backdropFilter: headerBlur,
        borderBottomColor: headerBorder,
      }}
      className="sticky top-0 z-50 border-b"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/ds-logo.jpeg"
            alt="DeepShield"
            width={40}
            height={40}
            className="rounded-xl object-contain"
            unoptimized
          />
          <span className="font-display text-lg text-ink">DeepShield</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-0.5 text-sm">
          {LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3 py-1.5 transition ${
                pathname === href
                  ? "bg-pink/55 font-medium text-ink"
                  : "text-ink/70 hover:bg-blue/45"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <select
          aria-label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as typeof language)}
          className="input-field w-auto rounded-full py-1.5 text-sm"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
    </motion.header>
  );
}
