import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-sage/30 py-6 text-center text-sm text-espresso/70">
            Cyber Crime Helpline 1930 · NCW 181 · iCall 9152987821
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
