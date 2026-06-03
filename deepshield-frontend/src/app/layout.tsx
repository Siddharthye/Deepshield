import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { ClientProviders } from "@/components/layout/ClientProviders";
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
    <html lang="en">
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
      <body className="relative min-h-screen pb-16 md:pb-0">
        <AmbientBackground />
        <ScrollProgress />
        <LanguageProvider>
          <AuthProvider>
            <ClientProviders>
              <AppShell>{children}</AppShell>
            </ClientProviders>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
