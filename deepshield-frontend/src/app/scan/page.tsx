import { ImageScanner } from "@/components/scan/ImageScanner";

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold text-espresso">Scan center</h1>
      <p className="mb-8 text-espresso/70">
        Upload an image to run three-signal analysis and get a plain-language
        explanation.
      </p>
      <ImageScanner />
    </div>
  );
}
