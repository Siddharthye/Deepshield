import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
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
      <body className="relative flex min-h-full flex-col">
        <AmbientBackground />
        <ScrollProgress />
        <LanguageProvider>
          <Navbar />
          <main className="relative z-10 flex-1">{children}</main>
          <footer className="site-footer relative z-10 py-8 text-center">
            <p className="text-sm font-medium text-ink/80">
              You are not alone. You have rights.
            </p>
            <p className="mt-2 text-xs text-ink/55">
              Cyber Crime Helpline 1930 · NCW 181 · iCall 9152987821
            </p>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
