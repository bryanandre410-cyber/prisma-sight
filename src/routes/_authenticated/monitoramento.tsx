import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ArrowUpRight, Database, Eye, ShieldCheck } from "lucide-react";

import { PageShell, Panel, SeverityPill } from "@/components/prisma/PageShell";
import { alerts, dataFlows, trafficSeries } from "@/lib/prisma-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/monitoramento")({
  head: () => ({
    meta: [
      { title: "Monitoramento Contínuo — PRISMA ONE" },
      {
        name: "description",
        content:
          "Acompanhe 24h por dia o fluxo de dados, acessos e movimentações em sistemas e modelos de IA.",
      },
      { property: "og:title", content: "Monitoramento Contínuo — PRISMA ONE" },
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
      title="Monitoramento Contínuo 24/7"
      subtitle="O PRISMA ONE observa o tráfego de dados pessoais e transações de IA em tempo real."
      actions={
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link to="/alertas">
            Ver Fila de Alertas <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2 text-left"
          title="Fluxo de Dados nas Últimas 24 Horas"
          description="Volume trafegado e analisado hora a hora em busca de anomalias."
        >
          <div className="h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficSeries}>
                <defs>
                  <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="hora"
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  interval={2}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} unit=" TB" width={52} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    color: "var(--color-foreground)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#flowGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          className="text-left"
          title="Eventos Fora do Padrão"
          description="Detecções geradas pelo motor analítico."
        >
          <ul className="space-y-3">
            {alerts.slice(0, 4).map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-border/80 bg-background/50 p-3 space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground leading-snug">{a.title}</p>
                  <SeverityPill severity={a.severity} />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {a.context} · {a.time}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        className="mt-5 text-left"
        title="Fontes de Dados Monitoradas"
        description="Quem coleta, volume de requisições e classificação de risco por pipeline."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/80 uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="pb-3 pr-4">Fonte de Dados</th>
                <th className="pb-3 px-4">Categoria de Dados</th>
                <th className="pb-3 px-4 text-center">Acessos (24h)</th>
                <th className="pb-3 pl-4 text-right">Classificação de Risco</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {dataFlows.map((f) => (
                <tr key={f.source} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3.5 pr-4 font-semibold text-foreground">{f.source}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{f.category}</td>
                  <td className="py-3.5 px-4 text-center font-mono">{f.access} req/s</td>
                  <td className="py-3.5 pl-4 text-right">
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
