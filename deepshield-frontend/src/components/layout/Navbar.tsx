"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <header className="sticky top-0 z-50 border-b border-sage/30 bg-blush/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/ds-logo.jpeg"
            alt="DeepShield"
            width={40}
            height={40}
            className="rounded-lg object-contain"
            unoptimized
          />
          <span className="text-lg font-semibold text-espresso">DeepShield</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3 py-1.5 transition ${
                pathname === href
                  ? "bg-rose/40 text-espresso"
                  : "text-espresso/80 hover:bg-blush"
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
          className="rounded-full border border-sage/50 bg-fantasy px-3 py-1.5 text-sm text-espresso"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
