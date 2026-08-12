import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageShell, Panel, SeverityPill } from "@/components/prisma/PageShell";
import { alerts, dataFlows, trafficSeries } from "@/lib/prisma-data";

export const Route = createFileRoute("/monitoramento")({
  head: () => ({
    meta: [
      { title: "Monitoramento Contínuo — Prisma One" },
      {
        name: "description",
        content:
          "Acompanhe 24h por dia o fluxo de dados, acessos e movimentos suspeitos em sistemas de IA.",
      },
      { property: "og:title", content: "Monitoramento Contínuo — Prisma One" },
      {
        property: "og:description",
        content: "Fluxo de dados, acessos e comportamentos suspeitos monitorados em tempo real.",
      },
    ],
  }),
  component: MonitoramentoPage,
});

function MonitoramentoPage() {
  return (
    <PageShell
      title="Monitoramento Contínuo"
      subtitle="O Prisma One observa o fluxo de dados da sua empresa 24 horas por dia."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Fluxo de dados nas últimas 24 horas"
          description="Volume trafegado e analisado por hora."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficSeries}>
                <defs>
                  <linearGradient id="flow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="hora" stroke="var(--color-muted-foreground)" fontSize={11} interval={2} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} unit=" TB" width={56} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="var(--color-primary-glow)"
                  strokeWidth={2}
                  fill="url(#flow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Eventos fora do padrão" description="Gerados automaticamente pelo motor de análise.">
          <ul className="space-y-3">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.id} className="rounded-xl border border-border/70 bg-background/40 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium">{a.title}</p>
                  <SeverityPill severity={a.severity} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.context} · {a.time}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        className="mt-5"
        title="Fontes de dados observadas"
        description="Quem coleta, quem acessa e o nível de risco de cada fluxo."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Fonte</th>
                <th className="pb-3 font-medium">Categoria</th>
                <th className="pb-3 font-medium">Acessos (24h)</th>
                <th className="pb-3 font-medium">Risco</th>
              </tr>
            </thead>
            <tbody>
              {dataFlows.map((f) => (
                <tr key={f.source} className="border-t border-border/70">
                  <td className="py-3 font-medium">{f.source}</td>
                  <td className="py-3 text-muted-foreground">{f.category}</td>
                  <td className="py-3 text-muted-foreground">{f.access}</td>
                  <td className="py-3">
                    <SeverityPill
                      severity={f.risk === "Alto" ? "alto" : f.risk === "Médio" ? "medio" : "baixo"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageShell>
  );
}