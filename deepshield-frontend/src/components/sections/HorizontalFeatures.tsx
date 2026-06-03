"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

const PANELS = [
  {
    title: "Detect",
    href: "/scan",
    color: "from-pink/50 to-peach/40",
    icon: "🔍",
    desc: "Run the three-signal scan and see exactly where the model flags manipulation.",
    detail:
      "Upload a photo or video frame. Our Hugging Face model, face-api symmetry check, and OpenCV artifact pass combine into one risk score — with a visible heatmap you can save to your vault or legal PDF.",
    cta: "Start scan",
  },
  {
    title: "Trace",
    href: "/trace",
    color: "from-peach/50 to-cream",
    icon: "🌐",
    desc: "Find where your face was reposted. Log URLs for your evidence bundle.",
    detail:
      "Open Google Lens or TinEye in one tap, then record each platform, page title, URL, and first-seen date. Trace entries flow directly into your evidence report.",
    cta: "Trace image",
  },
  {
    title: "Report",
    href: "/report",
    color: "from-blue/50 to-sage/30",
    icon: "📄",
    desc: "Download a legal PDF with scan data, trace log, and filing instructions.",
    detail:
      "Generate a court-ready document with embedded scan image, risk breakdown, AI legal summary, and applicable Indian cyber laws — plus guidance for cybercrime.gov.in.",
    cta: "Build report",
  },
  {
    title: "Vault",
    href: "/vault",
    color: "from-sage/40 to-blue/30",
    icon: "🔐",
    desc: "PIN-protected AES storage for everything you need to keep safe.",
    detail:
      "Your evidence never leaves this device unless you export it. Use a 4-digit PIN, add files anytime, and download a ZIP backup when you meet with police or a lawyer.",
    cta: "Open vault",
  },
  {
    title: "Asha",
    href: "/asha",
    color: "from-pink/35 to-blue/35",
    icon: "💬",
    desc: "Support chat plus know-your-rights cards — private and trauma-informed.",
    detail:
      "Asha listens without judgment, explains IT Act and IPC sections in plain language, and points you to helplines. Available in eight Indian languages.",
    cta: "Talk to Asha",
  },
  {
    title: "Learn",
    href: "/learn",
    color: "from-peach/40 to-pink/25",
    icon: "📚",
    desc: "Quiz yourself on deepfake red flags and safe evidence habits.",
    detail:
      "Short interactive rounds help you spot morphed media, preserve screenshots safely, and understand when to report — refreshed each session by our LLM.",
    cta: "Take quiz",
  },
];

export function HorizontalFeatures() {
  const { t } = useLanguage();

  return (
    <section className="section-pad section-alt-sage mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("journeyBadge")}</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{t("journeyTitle")}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink/70">{t("journeyIntro")}</p>

      <div className="mt-8 -mx-4 flex gap-5 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scroll-smooth md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:snap-none lg:grid-cols-3">
        {PANELS.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className={`flex min-h-[320px] w-[min(88vw,360px)] shrink-0 snap-center flex-col justify-between rounded-3xl bg-gradient-to-br p-8 shadow-lg ring-1 ring-white/40 transition hover:ring-2 hover:ring-pink/40 md:w-auto md:shrink`}
          >
            <div>
              <span className="text-4xl">{p.icon}</span>
              <h3 className="font-display mt-4 text-2xl text-ink">{p.title}</h3>
              <p className="mt-2 text-sm font-medium text-ink/85">{p.desc}</p>
              <p className="mt-3 text-xs leading-relaxed text-ink/70">{p.detail}</p>
            </div>
            <span className="mt-6 inline-flex w-fit rounded-full bg-cream/90 px-4 py-2 text-sm font-medium text-ink shadow-sm">
              {p.cta} →
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-ink/50 md:hidden">
        Swipe sideways to see all steps →
      </p>

      <GlassCard className="mt-10 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-pink">
              Need help now?
            </p>
            <p className="mt-1 font-display text-lg text-ink">
              National helplines — free, confidential
            </p>
            <p className="mt-2 text-sm text-ink/70">
              If you are in immediate danger, contact local police first. These lines specialise
              in cyber abuse and psychosocial support.
            </p>
          </div>
          <ul className="flex flex-wrap gap-3 text-sm text-ink/85">
            <li className="rounded-full bg-peach/40 px-3 py-1.5">Cyber Crime: 1930</li>
            <li className="rounded-full bg-peach/40 px-3 py-1.5">NCW: 181</li>
            <li className="rounded-full bg-peach/40 px-3 py-1.5">iCall: 9152987821</li>
          </ul>
        </div>
      </GlassCard>
    </section>
  );
}
