import { getAggregatedDataset } from "@/services/aggregator";
import type { Severity, SourceStatus } from "@/types/aggregator";

export const revalidate = 60;

const statusLabel: Record<SourceStatus, string> = {
  healthy: "Saudável",
  degraded: "Degradado",
  down: "Indisponível",
};

const severityLabel: Record<Severity, string> = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico",
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDelta(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

export default async function Home() {
  const dataset = await getAggregatedDataset();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Next.js SSR + AWS ready</span>
          <h1>Data Aggregator</h1>
          <p>
            Painel server-side que consolida fontes operacionais, prioriza
            eventos e expõe o mesmo dataset por API.
          </p>
        </div>
        <div className="refresh-card" aria-label="Dados da renderização">
          <span>Snapshot SSR</span>
          <strong>{formatDateTime(dataset.generatedAt)}</strong>
          <small>Revalida a cada 60s</small>
        </div>
      </header>

      <section className="summary-grid" aria-label="Resumo operacional">
        <article className="summary-card">
          <span>Fontes ativas</span>
          <strong>{dataset.summary.totalSources}</strong>
          <small>
            {dataset.summary.healthySources} saudáveis /{" "}
            {dataset.summary.degradedSources} com atenção
          </small>
        </article>
        <article className="summary-card">
          <span>Registros agregados</span>
          <strong>{formatNumber(dataset.summary.totalRecords)}</strong>
          <small>{dataset.window}</small>
        </article>
        <article className="summary-card">
          <span>Latência média</span>
          <strong>{dataset.summary.avgLatencyMs} ms</strong>
          <small>Calculada no servidor</small>
        </article>
        <article className="summary-card summary-card--alert">
          <span>Eventos críticos</span>
          <strong>{dataset.summary.criticalEvents}</strong>
          <small>Prioridade de operação</small>
        </article>
      </section>

      <section className="metric-grid" aria-label="Métricas de negócio">
        {dataset.metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <div className={metric.delta >= 0 ? "delta up" : "delta down"}>
              {formatDelta(metric.delta)}
            </div>
            <p>{metric.description}</p>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel panel--wide">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Conectores</span>
              <h2>Saúde das fontes agregadas</h2>
            </div>
            <code>SSR fetch: getAggregatedDataset()</code>
          </div>

          <div className="source-list">
            {dataset.sources.map((source) => (
              <article className="source-row" key={source.id}>
                <div>
                  <strong>{source.name}</strong>
                  <span>
                    {source.provider} / {source.owner}
                  </span>
                </div>
                <span className={`status status--${source.status}`}>
                  {statusLabel[source.status]}
                </span>
                <span>{source.latencyMs} ms</span>
                <span>{formatNumber(source.records)} registros</span>
                <span>{source.freshnessMinutes} min</span>
              </article>
            ))}
          </div>
        </div>

        <aside className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">AWS</span>
              <h2>Fluxo sugerido</h2>
            </div>
          </div>
          <div className="aws-flow">
            {dataset.awsFlow.map((item) => (
              <article key={item.service}>
                <strong>{item.service}</strong>
                <p>{item.role}</p>
              </article>
            ))}
          </div>
        </aside>

        <section className="panel panel--wide">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Eventos</span>
              <h2>Fila priorizada</h2>
            </div>
            <span>{dataset.events.length} eventos</span>
          </div>

          <div className="event-list">
            {dataset.events.map((event) => (
              <article className="event-card" key={event.id}>
                <div className="event-card__title">
                  <span className={`severity severity--${event.severity}`}>
                    {severityLabel[event.severity]}
                  </span>
                  <strong>{event.title}</strong>
                </div>
                <p>{event.impact}</p>
                <small>{event.recommendation}</small>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
