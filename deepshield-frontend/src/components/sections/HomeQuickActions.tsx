import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

const ACTIONS = [
  {
    href: "/scan",
    icon: "🔍",
    title: "Scan suspicious media",
    desc: "Photo or video — get a risk score in under a minute.",
  },
  {
    href: "/trace",
    icon: "🌐",
    title: "Trace where it was shared",
    desc: "Log URLs and open reverse image search.",
  },
  {
    href: "/report",
    icon: "📄",
    title: "Build legal evidence",
    desc: "PDF report ready for authorities.",
  },
  {
    href: "/asha",
    icon: "💬",
    title: "Talk to Asha",
    desc: "Support + rights in plain language.",
  },
  {
    href: "/vault",
    icon: "🔐",
    title: "Open encrypted vault",
    desc: "PIN-protected storage on this device.",
  },
  {
    href: "/learn",
    icon: "📚",
    title: "Learn to spot fakes",
    desc: "Quick quiz on red flags and safety.",
  },
];

export function HomeQuickActions() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8">
      <p className="page-badge">Quick start</p>
      <h2 className="font-display text-xl text-ink md:text-2xl">Jump to what you need</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((a) => (
          <Link key={a.href} href={a.href}>
            <GlassCard className="flex h-full gap-4 p-5 transition hover:ring-2 hover:ring-pink/30">
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="font-semibold text-ink">{a.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/70">{a.desc}</p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
