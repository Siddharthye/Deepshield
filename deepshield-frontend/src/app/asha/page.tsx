import Image from "next/image";
import { AshaChat } from "@/components/asha/AshaChat";
import { BasicRights } from "@/components/asha/BasicRights";

export default function AshaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <Image
          src="/images/asha-logo.jpeg"
          alt="Asha companion"
          width={88}
          height={88}
          className="rounded-2xl object-cover shadow-md"
          priority
          unoptimized
        />
        <div>
          <h1 className="text-3xl font-semibold text-espresso">Asha</h1>
          <p className="mt-1 max-w-xl text-espresso/75">
            Hope, support, and plain-language guidance on your rights — private
            and trauma-informed.
          </p>
        </div>
      </div>

      <div className="mb-12">
        <BasicRights />
      </div>

      <AshaChat />
    </div>
  );
}
