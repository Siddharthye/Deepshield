export type Verdict = "authentic" | "likely_manipulated" | "highly_suspicious";

export type DetectionScores = {
  modelScore: number;
  artifactScore: number;
  symmetryScore: number;
  morphScore?: number;
};

export type RiskResult = {
  finalRisk: number;
  verdict: Verdict;
  breakdown: DetectionScores;
};

export type ExplainResult = {
  explanation: string;
  key_signals: string[];
  recommendation: string;
  requestId: string;
};

export type ScanSession = {
  imageDataUrl: string;
  mimeType: string;
  risk: RiskResult;
  explain?: ExplainResult;
  scannedAt: string;
  heatmapDataUrl?: string;
};

export type VideoFrameResult = {
  timeSec: number;
  dataUrl: string;
  finalRisk: number;
  verdict: Verdict;
};

export type VideoScanSession = {
  fileName: string;
  overallRisk: number;
  frames: VideoFrameResult[];
  scannedAt: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
