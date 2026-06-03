import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DeepShield — AI armor against deepfakes",
  description:
    "Detect deepfakes, build legal evidence, and find support for victims of digital violence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${cormorant.variable} h-full`}>
      <body className="relative flex min-h-full flex-col">
        <AmbientBackground />
        <ScrollProgress />
        <LanguageProvider>
          <Navbar />
          <main className="relative z-10 flex-1">{children}</main>
          <footer className="site-footer relative z-10 py-8 text-center">
            <p className="font-display text-sm font-medium text-espresso/80">
              You are not alone. You have rights.
            </p>
            <p className="mt-2 text-xs text-espresso/60">
              Cyber Crime Helpline 1930 · NCW 181 · iCall 9152987821
            </p>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
