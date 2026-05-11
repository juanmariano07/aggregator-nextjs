[DEMO AO VIVO](https://aggregator-nextjs.vercel.app/)

# Data Aggregator - Next.js SSR

Painel operacional construído com Next.js, TypeScript e App Router para simular a agregação de múltiplas fontes de dados. O projeto renderiza um dashboard server-side, expõe o mesmo dataset por API route e documenta como essa arquitetura poderia evoluir para AWS.

## Objetivo

Este projeto foi criado para demonstrar competências cobradas em vagas frontend/fullstack com Next.js:

- SSR e revalidação incremental no App Router.
- TypeScript em camada de domínio.
- Separação entre dados mockados, serviço de agregação e UI.
- API route servindo dados consolidados em JSON.
- Modelagem de fontes operacionais, eventos e métricas.
- Visão de arquitetura com API Gateway, Lambda, EventBridge, DynamoDB, S3 e CloudWatch.

## Como rodar

```bash
npm install
npm run dev
```

Acesse:

```text
http://localhost:3000
```

Endpoint de dados agregados:

```text
http://localhost:3000/api/aggregate
```

## Scripts

```bash
npm run dev      # servidor local
npm run build    # build de produção
npm run start    # executa build local
npm run lint     # análise estática
```

## Auditoria

O projeto usa `overrides` no `package.json` para fixar `postcss@8.5.10`, corrigindo uma vulnerabilidade transitiva herdada pelo Next.js sem recorrer a `npm audit fix --force`.

## Estrutura

```text
src/
  app/
    api/aggregate/route.ts   API route do dataset agregado
    page.tsx                 dashboard SSR
    layout.tsx               metadata e fonte global
    globals.css              estilos globais
  data/
    mock-sources.ts          fontes, métricas, eventos e fluxo AWS simulados
  services/
    aggregator.ts            agrega dados e calcula resumo operacional
  types/
    aggregator.ts            tipos de domínio
```

## Fluxo de dados

1. `page.tsx` executa no servidor.
2. A página chama `getAggregatedDataset`.
3. O serviço lê fontes mockadas em `mock-sources.ts`.
4. O serviço calcula totais, latência média, fontes degradadas e eventos críticos.
5. A UI renderiza KPIs, métricas, saúde dos conectores, eventos e fluxo AWS.
6. A rota `GET /api/aggregate` reutiliza o mesmo serviço e entrega JSON.

## SSR e cache

A página principal usa:

```ts
export const revalidate = 60;
```

Isso indica que o conteúdo pode ser reaproveitado por até 60 segundos antes de ser revalidado. Para portfólio, isso demonstra um cenário comum em dashboards operacionais: dados suficientemente recentes, sem recalcular tudo a cada acesso.

A API route também usa cache:

```http
Cache-Control: s-maxage=60, stale-while-revalidate=120
```

## Como isso viraria AWS

O projeto roda localmente com mocks, mas a arquitetura simulada representa um cenário real:

| Camada | Papel |
|---|---|
| API Gateway | Expor endpoints internos ou públicos |
| Lambda | Normalizar payloads de fontes diferentes |
| EventBridge | Agendar coletas e disparar eventos |
| DynamoDB | Guardar snapshots recentes de baixa latência |
| S3 | Armazenar histórico bruto para auditoria |
| CloudWatch | Monitorar latência, falhas e custos |

Em produção, `mock-sources.ts` seria substituído por adaptadores reais de API, filas, banco ou storage.

## Decisões técnicas

- A UI e a API usam o mesmo serviço de agregação para evitar regra duplicada.
- Os tipos ficam em `types/` para explicitar o contrato interno.
- Os mocks seguem formato próximo ao domínio final, facilitando troca por fontes reais.
- O dashboard é server-side para entregar HTML pronto e reduzir trabalho inicial do cliente.
- A revalidação de 60 segundos simula um equilíbrio entre atualização e custo.

## Pontos para explicar em entrevista

- SSR é útil quando a primeira renderização precisa chegar pronta ao usuário ou ao crawler.
- API route permite criar uma fronteira backend dentro do próprio Next.js.
- Revalidação evita recalcular dados em toda requisição.
- Separar serviço de agregação da UI facilita testar e reaproveitar regra.
- AWS entraria como infraestrutura de coleta, processamento, storage e observabilidade.
