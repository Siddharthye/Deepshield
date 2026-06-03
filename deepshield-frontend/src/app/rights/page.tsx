import { RightsPanel } from "@/components/rights/RightsPanel";

export default function RightsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold text-espresso">Know your rights</h1>
      <p className="mb-8 text-espresso/70">
        Indian cyber laws explained simply — plus AI answers in your language.
      </p>
      <RightsPanel />
    </div>
  );
}
