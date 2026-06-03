import type { TraceHit } from "./traceStorage";

/** Public demo image (Wikipedia Commons) — used for guaranteed trace demo. */
export const DEMO_TRACE_IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Danny_DeVito_by_Gage_Skidmore.jpg/440px-Danny_DeVito_by_Gage_Skidmore.jpg";

export function getDemoTraceHits(): TraceHit[] {
  return [
    {
      id: "demo-trace-hit-1",
      platform: "Wikipedia",
      title: "Same photo on encyclopedia page",
      url: "https://en.wikipedia.org/wiki/Danny_DeVito",
      firstSeen: new Date().toISOString().slice(0, 10),
    },
  ];
}
