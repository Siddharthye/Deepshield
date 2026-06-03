import { ButtonLink } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export function CtaStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <GlassCard className="flex flex-col items-center gap-6 bg-gradient-to-br from-peach/35 to-pink/25 py-12 text-center md:flex-row md:justify-between md:text-left">
        <div className="max-w-lg">
          <h2 className="font-display text-2xl text-ink">Ready when you are</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            Private scanning, encrypted vault, legal PDFs, and Asha — support and rights in one
            place. You choose what to use; nothing is shared without your action.
          </p>
          <p className="mt-3 text-xs text-ink/55">
            File online at{" "}
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink underline"
            >
              cybercrime.gov.in
            </a>{" "}
            · Helpline 1930
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/scan" variant="primary">
            Start a scan
          </ButtonLink>
          <ButtonLink href="/asha" variant="secondary">
            Talk to Asha
          </ButtonLink>
          <ButtonLink href="/report" variant="ghost">
            Build report
          </ButtonLink>
        </div>
      </GlassCard>
    </section>
  );
}
