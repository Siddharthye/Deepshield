"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/scan", label: "Scan" },
  { href: "/asha", label: "Asha" },
  { href: "/report", label: "Report" },
  { href: "/vault", label: "Vault" },
  { href: "/", label: "Home" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-sage/40 bg-cream/95 backdrop-blur-lg md:hidden">
      <div className="flex justify-around py-2">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-2 py-1 text-xs font-medium ${
              pathname === href ? "text-pink" : "text-ink/60"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
