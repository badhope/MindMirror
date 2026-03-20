export interface AIReportSection {
  title: string;
  content: string;
}

export interface AIReport {
  overview: string;
  traitReadings: string[];
  strengths: string[];
  blindSpots: string[];
  practicalSuggestions: string[];
  growthDirections: string[];
  cautions: string[];
}

export interface AIReportMetadata {
  provider: string;
  model?: string;
  generatedAt: string;
  assessmentSlug: string;
  resultType: string;
}

export interface AIReportRecord {
  report: AIReport;
  metadata: AIReportMetadata;
}

export interface AIReportInput {
  assessmentId: string;
  assessmentName: string;
  assessmentSlug: string;
  category: string;
  resultType: string;
  resultProfileId: string;
  resultProfileName: string;
  summary: string;
  highlights: Array<{ id: string; text: string; type: string }>;
  recommendations: Array<{ id: string; text: string; priority: string }>;
  rawScores: Record<string, number>;
  normalizedScores: Record<string, number>;
  dimensionScores?: Record<string, number>;
  mbtiType?: string;
  eiScore?: number;
  snScore?: number;
  tfScore?: number;
  jpScore?: number;
}

export type AIReportStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AIReportError {
  code: 'NO_API_KEY' | 'INVALID_KEY' | 'NETWORK_ERROR' | 'PARSE_ERROR' | 'UNKNOWN_ERROR';
  message: string;
}
