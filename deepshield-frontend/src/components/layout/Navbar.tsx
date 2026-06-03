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
    ["rgba(247, 243, 237, 0)", "rgba(239, 216, 214, 0.92)"],
  );
  const headerBlur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(20px)"]);
  const headerBorder = useTransform(
    scrollY,
    [0, 80],
    ["rgba(194, 198, 185, 0)", "rgba(194, 198, 185, 0.5)"],
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
            width={44}
            height={44}
            className="rounded-xl object-contain shadow-sm"
            unoptimized
          />
          <span className="font-display text-xl font-semibold text-espresso">
            DeepShield
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-0.5 text-sm">
          {LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3 py-1.5 transition ${
                pathname === href
                  ? "bg-rose/50 font-medium text-espresso shadow-sm"
                  : "text-espresso/75 hover:bg-blush/70"
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
