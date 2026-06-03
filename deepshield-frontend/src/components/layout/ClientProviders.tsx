"use client";

import { LenisProvider } from "@/components/layout/LenisProvider";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { AmbientSoundToggle } from "@/components/ui/AmbientSoundToggle";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <CustomCursor />
      {children}
      <AmbientSoundToggle />
    </LenisProvider>
  );
}
