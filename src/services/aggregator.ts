import {
  aggregatedEvents,
  awsFlow,
  businessMetrics,
  sourceSnapshots,
} from "@/data/mock-sources";
import type { AggregatedDataset, SourceSnapshot } from "@/types/aggregator";

const SOURCE_DRIFT = new Map([
  ["b3-market", 18],
  ["orders-core", -12],
  ["risk-engine", 72],
  ["crm-signals", 9],
  ["billing-ledger", -6],
]);

function withRuntimeVariance(source: SourceSnapshot): SourceSnapshot {
  const drift = SOURCE_DRIFT.get(source.id) ?? 0;
  const minute = new Date().getMinutes();
  const oscillation = (minute % 6) * 7;

  return {
    ...source,
    latencyMs: Math.max(80, source.latencyMs + drift + oscillation),
    freshnessMinutes: source.freshnessMinutes + (minute % 3),
  };
}

export async function getAggregatedDataset(): Promise<AggregatedDataset> {
  const sources = sourceSnapshots.map(withRuntimeVariance);
  const totalRecords = sources.reduce((sum, source) => sum + source.records, 0);
  const avgLatencyMs = Math.round(
    sources.reduce((sum, source) => sum + source.latencyMs, 0) / sources.length,
  );
  const degradedSources = sources.filter(
    (source) => source.status !== "healthy",
  ).length;
  const criticalEvents = aggregatedEvents.filter(
    (event) => event.severity === "critical",
  ).length;

  return {
    generatedAt: new Date().toISOString(),
    window: "Últimas 24 horas",
    summary: {
      totalSources: sources.length,
      healthySources: sources.length - degradedSources,
      degradedSources,
      totalRecords,
      avgLatencyMs,
      criticalEvents,
    },
    metrics: businessMetrics,
    sources,
    events: aggregatedEvents,
    awsFlow,
  };
}
