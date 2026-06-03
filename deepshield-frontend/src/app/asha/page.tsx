import Image from "next/image";
import { AshaChat } from "@/components/asha/AshaChat";
import { BasicRights } from "@/components/asha/BasicRights";
import { RightsExplainer } from "@/components/asha/RightsExplainer";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AshaPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col px-4 py-10 md:py-14">
      <PageHeader
        badge="Companion"
        title="Asha"
        subtitle="Hope, support, and plain-language guidance on your rights — private and trauma-informed."
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl bg-pink/30 blur-lg" aria-hidden />
            <Image
              src="/images/asha-logo.jpeg"
              alt="Asha companion"
              width={80}
              height={80}
              className="relative rounded-2xl object-cover shadow-md ring-2 ring-peach/60"
              priority
              unoptimized
            />
          </div>
        </div>
      </PageHeader>

      <div className="mb-10 space-y-10">
        <BasicRights />
        <RightsExplainer />
      </div>

      <section
        aria-label="Chat with Asha"
        className="flex min-h-[calc(100vh-12rem)] flex-col rounded-3xl border border-white/40 bg-gradient-to-b from-peach/20 to-blue/15 p-1 shadow-lg md:min-h-[calc(100vh-10rem)]"
      >
        <AshaChat />
      </section>
    </div>
  );
}
