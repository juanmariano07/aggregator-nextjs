import type {
  AggregatedEvent,
  AwsFlowStep,
  BusinessMetric,
  SourceSnapshot,
} from "@/types/aggregator";

export const sourceSnapshots: SourceSnapshot[] = [
  {
    id: "b3-market",
    name: "Market feed B3",
    provider: "REST API",
    status: "healthy",
    latencyMs: 142,
    records: 12840,
    freshnessMinutes: 2,
    owner: "Investments",
  },
  {
    id: "orders-core",
    name: "Orders core",
    provider: "GraphQL",
    status: "healthy",
    latencyMs: 214,
    records: 9320,
    freshnessMinutes: 4,
    owner: "Brokerage",
  },
  {
    id: "risk-engine",
    name: "Risk engine",
    provider: "Lambda",
    status: "degraded",
    latencyMs: 610,
    records: 1880,
    freshnessMinutes: 16,
    owner: "Risk",
  },
  {
    id: "crm-signals",
    name: "CRM signals",
    provider: "S3 batch",
    status: "healthy",
    latencyMs: 320,
    records: 5240,
    freshnessMinutes: 28,
    owner: "Growth",
  },
  {
    id: "billing-ledger",
    name: "Billing ledger",
    provider: "DynamoDB stream",
    status: "healthy",
    latencyMs: 184,
    records: 4180,
    freshnessMinutes: 7,
    owner: "Finance",
  },
];

export const businessMetrics: BusinessMetric[] = [
  {
    label: "Volume agregado",
    value: "33,4 mil",
    delta: 8.4,
    description: "Registros consolidados nas últimas 24 horas.",
  },
  {
    label: "Latência média",
    value: "294 ms",
    delta: -12.1,
    description: "Media ponderada das fontes ativas.",
  },
  {
    label: "SLA operacional",
    value: "99,91%",
    delta: 0.18,
    description: "Disponibilidade simulada dos conectores.",
  },
  {
    label: "Eventos críticos",
    value: "1",
    delta: -50,
    description: "Alertas que exigem ação imediata.",
  },
];

export const aggregatedEvents: AggregatedEvent[] = [
  {
    id: "evt-001",
    title: "Risk engine acima do limite de latência",
    source: "risk-engine",
    severity: "critical",
    createdAt: "2026-05-11T07:42:00-03:00",
    impact: "Ordens de alta exposição podem demorar para liberar.",
    recommendation: "Escalar concorrência da Lambda e revisar cold starts.",
  },
  {
    id: "evt-002",
    title: "Pico de consultas no feed de mercado",
    source: "b3-market",
    severity: "medium",
    createdAt: "2026-05-11T07:28:00-03:00",
    impact: "Aumento de custo e risco de throttling no provedor.",
    recommendation: "Ativar cache curto em CloudFront ou Redis gerenciado.",
  },
  {
    id: "evt-003",
    title: "CRM batch atualizado com atraso aceitável",
    source: "crm-signals",
    severity: "low",
    createdAt: "2026-05-11T06:55:00-03:00",
    impact: "Campanhas usam dados com janela de até 30 minutos.",
    recommendation: "Manter monitoramento; sem ação imediata.",
  },
  {
    id: "evt-004",
    title: "Divergência pequena no ledger de cobrança",
    source: "billing-ledger",
    severity: "high",
    createdAt: "2026-05-11T06:20:00-03:00",
    impact: "Pode afetar conciliação diária se persistir.",
    recommendation: "Reprocessar particao e comparar checksums.",
  },
];

export const awsFlow: AwsFlowStep[] = [
  {
    service: "API Gateway",
    role: "Expõe endpoints REST para sistemas internos e parceiros.",
  },
  {
    service: "Lambda",
    role: "Normaliza payloads de fontes diferentes sem servidor dedicado.",
  },
  {
    service: "EventBridge",
    role: "Agenda coletas, dispara alertas e desacopla eventos.",
  },
  {
    service: "DynamoDB",
    role: "Guarda snapshots recentes com baixa latência.",
  },
  {
    service: "S3",
    role: "Armazena histórico bruto para auditoria e reprocessamento.",
  },
  {
    service: "CloudWatch",
    role: "Monitora latência, falhas, custos e alarmes operacionais.",
  },
];
