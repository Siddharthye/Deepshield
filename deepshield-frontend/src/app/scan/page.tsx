import { ImageScanner } from "@/components/scan/ImageScanner";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHeader
        badge="Detection"
        title="Scan center"
        subtitle="Upload an image to run three-signal analysis and receive a trauma-informed, plain-language explanation."
      />
      <ImageScanner />
    </div>
  );
}
