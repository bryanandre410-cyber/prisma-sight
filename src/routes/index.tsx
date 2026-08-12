import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Database, ShieldCheck, ShieldAlert } from "lucide-react";
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
import { alerts, overviewMetrics, policies, trafficSeries } from "@/lib/prisma-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prisma One — Centro de controle de privacidade e IA" },
      {
        name: "description",
        content:
          "Visibilidade completa da privacidade e segurança dos seus dados e IA: monitoramento contínuo, LGPD e alertas.",
      },
      { property: "og:title", content: "Prisma One — Privacidade e IA sob controle" },
      {
        property: "og:description",
        content: "Monitoramento contínuo, conformidade LGPD e auditoria de IA em um só painel.",
      },
    ],
  }),
  component: Index,
});

const icons = [Database, Activity, ShieldAlert, ShieldCheck];
const tones: Record<string, string> = {
  primary: "text-primary-glow border-primary/40 bg-primary/15",
  glow: "text-primary-glow border-primary-glow/40 bg-primary-glow/15",
  danger: "text-destructive border-destructive/40 bg-destructive/15",
  success: "text-success border-success/40 bg-success/15",
};

function Index() {
  return (
    <PageShell
      title="Visão Geral"
      subtitle="Visibilidade completa da privacidade e segurança dos seus dados e IA."
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewMetrics.map((m, i) => {
              const Icon = icons[i] ?? Database;
              return (
                <Panel key={m.key} className="text-center">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="mt-2 text-3xl font-semibold">
                    {m.value}
                    {m.unit && <span className="ml-1 text-lg">{m.unit}</span>}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      m.tone === "danger"
                        ? "text-destructive"
                        : m.tone === "success"
                          ? "text-success"
                          : "text-muted-foreground"
                    }`}
                  >
                    {m.delta}
                  </p>
                  <div
                    className={`mx-auto mt-4 flex size-12 items-center justify-center rounded-full border ${tones[m.tone]}`}
                  >
                    <Icon className="size-5" />
                  </div>
                </Panel>
              );
            })}
          </div>

          <Panel
            title="Monitoramento Contínuo de Dados"
            description="Análise contínua do fluxo e uso de dados na sua organização."
            action={
              <span className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground">
                Últimas 24 horas
              </span>
            }
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficSeries}>
                  <defs>
                    <linearGradient id="overview" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
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
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    unit=" TB"
                    width={56}
                  />
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
                    fill="url(#overview)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel
            title="Alertas Recentes"
            action={
              <Link to="/alertas" className="text-xs text-primary-glow hover:underline">
                Ver todos
              </Link>
            }
          >
            <ul className="space-y-3">
              {alerts.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium leading-snug">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.context}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                    <div className="mt-1">
                      <SeverityPill severity={a.severity} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Políticas de Privacidade"
            action={
              <Link to="/politicas" className="text-xs text-primary-glow hover:underline">
                Ver todas
              </Link>
            }
          >
            <ul className="space-y-3">
              {policies.map((p) => (
                <li key={p.name} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium leading-snug">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Atualizada em {p.updated}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs ${
                      p.status === "Vigente" ? "text-success" : "text-warning"
                    }`}
                  >
                    • {p.status}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
              4 políticas ativas · 100% alinhadas à LGPD
            </p>
          </Panel>
        </div>
      </div>

      <div
        className="mt-5 rounded-2xl border border-primary/30 p-6 text-center"
        style={{ backgroundImage: "var(--gradient-surface)", boxShadow: "var(--shadow-glow)" }}
      >
        <p className="text-lg font-semibold">IA e Privacidade. Juntos por um futuro seguro.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Prisma One protege seus dados, garante conformidade e fortalece a confiança.
        </p>
      </div>
    </PageShell>
  );
}
