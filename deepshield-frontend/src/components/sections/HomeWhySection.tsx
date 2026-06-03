import { GlassCard } from "@/components/ui/GlassCard";

const FACTS = [
  {
    title: "Detection + proof + support",
    body: "Most tools only flag fakes. DeepShield also helps you document evidence, understand Indian cyber laws, and reach Asha for trauma-informed guidance.",
  },
  {
    title: "Built for privacy",
    body: "Your vault and saved scans stay on your device with AES encryption. We do not host your intimate images on a server.",
  },
  {
    title: "Made for India",
    body: "Eight languages, IT Act and IPC references, and cybercrime.gov.in filing prep — designed for how reporting actually works here.",
  },
];

const LAWS = ["IT Act §66E", "§67", "§67A", "IPC §354C", "POCSO (minors)"];

export function HomeWhySection() {
  return (
    <section className="section-pad mx-auto max-w-6xl px-4">
      <p className="page-badge">Why DeepShield</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">
        More than a detector — a complete safety toolkit
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {FACTS.map((f) => (
          <GlassCard key={f.title} className="p-6" tilt>
            <h3 className="font-display text-lg text-ink">{f.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{f.body}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="mt-6 p-6">
        <p className="text-sm font-medium text-ink">Laws we help you understand</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LAWS.map((law) => (
            <span
              key={law}
              className="rounded-full bg-blue/35 px-3 py-1 text-xs font-medium text-ink/85"
            >
              {law}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink/60">
          Summaries are for orientation only — Asha and the rights explainer help you ask the
          right questions before speaking to a lawyer or police.
        </p>
      </GlassCard>
    </section>
  );
}
