export type SourceStatus = "healthy" | "degraded" | "down";

export type Severity = "low" | "medium" | "high" | "critical";

export interface SourceSnapshot {
  id: string;
  name: string;
  provider: string;
  status: SourceStatus;
  latencyMs: number;
  records: number;
  freshnessMinutes: number;
  owner: string;
}

export interface BusinessMetric {
  label: string;
  value: string;
  delta: number;
  description: string;
}

export interface AggregatedEvent {
  id: string;
  title: string;
  source: string;
  severity: Severity;
  createdAt: string;
  impact: string;
  recommendation: string;
}

export interface AwsFlowStep {
  service: string;
  role: string;
}

export interface AggregatedDataset {
  generatedAt: string;
  window: string;
  summary: {
    totalSources: number;
    healthySources: number;
    degradedSources: number;
    totalRecords: number;
    avgLatencyMs: number;
    criticalEvents: number;
  };
  metrics: BusinessMetric[];
  sources: SourceSnapshot[];
  events: AggregatedEvent[];
  awsFlow: AwsFlowStep[];
}
