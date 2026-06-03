import { GlassCard } from "@/components/ui/GlassCard";

/** Pre-written reference — not AI-generated (PRD §6.8). */
export const BASIC_RIGHTS = [
  {
    title: "IT Act Section 66E",
    subtitle: "Privacy violation",
    body: "Capturing, publishing, or transmitting images of private areas without consent is a criminal offence. You can report this to cybercrime.gov.in and preserve screenshots as evidence.",
  },
  {
    title: "IT Act Section 67",
    subtitle: "Obscene material",
    body: "Publishing or transmitting obscene material electronically is punishable. This can apply when morphed or sexualised images are shared without consent.",
  },
  {
    title: "IT Act Section 67A",
    subtitle: "Sexually explicit material",
    body: "Sharing sexually explicit content electronically — including deepfakes — can lead to imprisonment and fines under Indian cyber law.",
  },
  {
    title: "IPC Section 354C",
    subtitle: "Voyeurism",
    body: "Watching, capturing, or disseminating images of a woman without her consent is voyeurism. You may file an FIR and seek legal aid.",
  },
  {
    title: "POCSO Act",
    subtitle: "If the victim is a minor",
    body: "Enhanced protections and dedicated procedures apply when the person depicted or harmed is under 18. Report immediately to police and the NCPCR helpline.",
  },
] as const;

export const RIGHTS_QUICK_PROMPTS = [
  "Can I get them arrested?",
  "How do I file a complaint online?",
  "What if the perpetrator is abroad?",
  "What are my rights if someone morphed my photo?",
] as const;

export function BasicRights() {
  return (
    <section aria-labelledby="basic-rights-heading">
      <h2
        id="basic-rights-heading"
        className="font-display mb-4 text-2xl font-semibold text-espresso"
      >
        Know your basic rights
      </h2>
      <p className="mb-6 text-sm text-espresso/75">
        These summaries are for quick reference. Ask Asha below for personalised
        guidance in plain language.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {BASIC_RIGHTS.map((law) => (
          <GlassCard key={law.title}>
            <p className="text-xs font-medium uppercase tracking-wide text-rose">
              {law.subtitle}
            </p>
            <h3 className="mt-1 font-semibold text-espresso">{law.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-espresso/85">
              {law.body}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
