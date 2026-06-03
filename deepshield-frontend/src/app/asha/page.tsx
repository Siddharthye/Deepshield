import { AshaChat } from "@/components/asha/AshaChat";

export default function AshaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold text-espresso">Asha</h1>
      <p className="mb-6 text-espresso/70">
        Your compassionate companion — private, anonymous, and here for you.
      </p>
      <AshaChat />
    </div>
  );
}
