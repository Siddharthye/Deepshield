"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/layout/PageTransition";
import { LanguageMenu } from "@/components/layout/LanguageMenu";
import { IntroLoader } from "@/components/ui/IntroLoader";
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthFlow = pathname === "/login" || pathname.startsWith("/auth/");

  if (isAuthFlow) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2.5">
          <Link href="/login" className="flex items-center gap-2">
            <Image
              src="/images/ds-logo.jpeg"
              alt="DeepShield"
              width={32}
              height={32}
              className="rounded-lg object-contain ring-1 ring-secondary/40"
              unoptimized
            />
            <span className="font-display hidden text-sm text-ink sm:inline">DeepShield</span>
          </Link>
          <LanguageMenu />
        </header>
        <main className="relative z-10 pt-14">{children}</main>
      </>
    );
  }

  return (
    <>
      <IntroLoader />
      <Navbar />
      <PageTransition>
        <main className="relative z-10 flex-1">{children}</main>
      </PageTransition>
      <MobileNav />
      <SiteFooter />
    </>
  );
}
