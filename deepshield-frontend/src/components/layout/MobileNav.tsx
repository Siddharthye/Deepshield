"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const LINKS: { href: string; key: I18nKey }[] = [
  { href: "/", key: "navHome" },
  { href: "/scan", key: "navScan" },
  { href: "/asha", key: "navAsha" },
  { href: "/report", key: "navReport" },
  { href: "/vault", key: "navVault" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-secondary/35 bg-cream-tan/95 backdrop-blur-lg md:hidden">
      <div className="flex justify-around py-2">
        {LINKS.map(({ href, key }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`ui-nowrap px-2 py-1 text-xs font-medium ${
                active ? "text-ink underline decoration-blue/80" : "text-ink-subtle"
              }`}
            >
              {t(key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
