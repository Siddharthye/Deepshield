import { ButtonLink } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export function CtaStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <GlassCard className="flex flex-col items-center gap-6 py-12 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="font-display text-2xl text-ink">Ready when you are</h2>
          <p className="mt-2 max-w-md text-sm text-ink/75">
            Private scanning, encrypted vault, and Asha — support and rights in one place.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/scan" variant="primary">
            Start a scan
          </ButtonLink>
          <ButtonLink href="/asha" variant="secondary">
            Talk to Asha
          </ButtonLink>
        </div>
      </GlassCard>
    </section>
  );
}
