import { ScanCenter } from "@/components/scan/ScanCenter";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHeader
        badge="Detection"
        title="Scan center"
        subtitle="Image and video analysis with three combined signals — model, artifacts, and symmetry — plus a visual heatmap."
      />
      <ScanCenter />
    </div>
  );
}
