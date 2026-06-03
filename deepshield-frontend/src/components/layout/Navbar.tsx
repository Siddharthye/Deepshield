"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGUAGES } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";

const LINKS = [
  { href: "/scan", key: "navScan" },
  { href: "/trace", key: "navTrace" },
  { href: "/report", key: "navReport" },
  { href: "/vault", key: "navVault" },
  { href: "/rights", key: "navRights" },
  { href: "/community", key: "navCommunity" },
  { href: "/asha", key: "navAsha" },
  { href: "/learn", key: "navLearn" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-blush/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-espresso">
          DeepShield
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3 py-1.5 transition ${
                pathname === href
                  ? "bg-rose/30 text-espresso"
                  : "text-espresso/80 hover:bg-white/40"
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
          className="rounded-full border border-white/40 bg-fantasy px-3 py-1.5 text-sm text-espresso"
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
