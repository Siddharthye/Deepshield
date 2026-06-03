import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { SafetyRibbon } from "@/components/layout/SafetyRibbon";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/layout/PageTransition";
import { ClientProviders } from "@/components/layout/ClientProviders";
import { IntroLoader } from "@/components/ui/IntroLoader";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeepShield — AI armor against deepfakes",
  description:
    "Detect deepfakes, build legal evidence, and find support for victims of digital violence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative flex min-h-full flex-col pb-28 md:pb-12">
        <AmbientBackground />
        <ScrollProgress />
        <LanguageProvider>
          <AuthProvider>
            <IntroLoader />
            <ClientProviders>
              <Navbar />
              <PageTransition>
                <main className="relative z-10 flex-1">{children}</main>
              </PageTransition>
              <MobileNav />
              <SiteFooter />
              <SafetyRibbon />
            </ClientProviders>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
