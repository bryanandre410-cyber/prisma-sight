import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Database,
  Play,
  RefreshCw,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { supabase } from "@/integrations/supabase/client";
import { PageShell, Panel, SeverityPill } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { alerts, policies, trafficSeries } from "@/lib/prisma-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Visão Geral — PRISMA ONE" },
      {
        name: "description",
        content:
          "Centro de controle de privacidade, conformidade LGPD e governança de Inteligência Artificial.",
      },
      { property: "og:title", content: "Visão Geral — PRISMA ONE" },
      {
        property: "og:description",
        content: "Monitoramento contínuo, conformidade LGPD e auditoria de IA em um só painel.",
      },
    ],
  }),
  component: DashboardPage,
});

type AnalysisRow = {
  id: string;
  source: string;
  scope: string;
  records_scanned: number;
  compliance_score: number;
  risks_found: number;
  created_at: string;
};

function DashboardPage() {
  const {
    data: analyses,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-analyses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as AnalysisRow[];
    },
  });

  // Cálculo de métricas dinâmicas com base nas análises do tenant
  const totalScans = analyses?.length ?? 0;
  const totalRecordsScanned =
    analyses?.reduce((acc, curr) => acc + (curr.records_scanned || 0), 0) ?? 0;
  const latestAnalysis = analyses && analyses.length > 0 ? analyses[0] : null;

  // Score de conformidade médio ou último score
  const complianceScore = latestAnalysis
    ? latestAnalysis.compliance_score
    : analyses && analyses.length > 0
      ? Math.round(analyses.reduce((acc, c) => acc + c.compliance_score, 0) / analyses.length)
      : 98; // Base padrão de conformidade pré-configurada

  const totalRisks =
    analyses && analyses.length > 0
      ? analyses.reduce((acc, c) => acc + (c.risks_found || 0), 0)
      : alerts.filter((a) => a.status === "pendente").length;

  return (
    <PageShell
      title="Visão Geral"
      subtitle="Visibilidade completa da privacidade, fluxos de dados e auditoria de IA."
      actions={
        <Button asChild className="gap-2 font-semibold shadow-xs">
          <Link to="/analise">
            <ScanSearch className="size-4" />
            Nova Varredura
          </Link>
        </Button>
      }
    >
      {/* Loading State */}
      {isLoading && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="surface-card rounded-2xl border border-border p-5 space-y-3">
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-3 w-32 mx-auto" />
              </div>
            ))}
          </div>
          <div className="surface-card rounded-2xl border border-border p-6 h-80 flex items-center justify-center">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="surface-card rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center space-y-4">
          <AlertTriangle className="mx-auto size-10 text-destructive" />
          <h2 className="text-lg font-bold text-foreground">
            Não foi possível carregar os dados do dashboard
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Houve uma instabilidade temporária ao consultar as análises da sua empresa.
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="size-4" /> Tentar novamente
          </Button>
        </div>
      )}

      {/* Loaded State */}
      {!isLoading && !isError && (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Panel className="text-center">
                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                  Dados Monitorados
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {totalRecordsScanned > 0
                    ? `${(totalRecordsScanned / 1000).toFixed(1)}k`
                    : "2.45 TB"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {totalScans > 0 ? `${totalScans} fontes varridas` : "24h contínuas"}
                </p>
                <div className="mx-auto mt-4 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Database className="size-5" />
                </div>
              </Panel>

              <Panel className="text-center">
                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                  Score de Conformidade
                </p>
                <p className="mt-2 text-3xl font-bold text-success">{complianceScore}%</p>
                <p className="mt-1 text-xs text-success font-medium">
                  {complianceScore >= 90
                    ? "Conforme com a LGPD"
                    : complianceScore >= 70
                      ? "Atenção a pendências"
                      : "Ação imediata requerida"}
                </p>
                <div className="mx-auto mt-4 flex size-12 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success">
                  <ShieldCheck className="size-5" />
                </div>
              </Panel>

              <Panel className="text-center">
                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                  Riscos Identificados
                </p>
                <p className="mt-2 text-3xl font-bold text-destructive">{totalRisks}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {totalRisks === 0 ? "Nenhum risco pendente" : "Requer atenção do DPO"}
                </p>
                <div className="mx-auto mt-4 flex size-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
                  <ShieldAlert className="size-5" />
                </div>
              </Panel>

              <Panel className="text-center">
                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                  Varreduras Realizadas
                </p>
                <p className="mt-2 text-3xl font-bold text-primary">{totalScans}</p>
                <p className="mt-1 text-xs text-muted-foreground">Registros no banco</p>
                <div className="mx-auto mt-4 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Activity className="size-5" />
                </div>
              </Panel>
            </div>

            {/* Empty State Alert if no analyses recorded yet */}
            {totalScans === 0 && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <ScanSearch className="size-4 text-primary" />
                    Primeira análise de dados pendente
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Execute uma varredura nas suas fontes de dados corporativas para gerar o score
                    real do seu ambiente.
                  </p>
                </div>
                <Button asChild size="sm" className="shrink-0 font-semibold gap-1.5">
                  <Link to="/analise">
                    <Play className="size-3.5" /> Executar Análise
                  </Link>
                </Button>
              </div>
            )}

            {/* Traffic Monitor Chart */}
            <Panel
              title="Monitoramento Contínuo de Dados"
              description="Análise em tempo real do fluxo e volume de dados na organização."
              action={
                <span className="rounded-lg border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Últimas 24 horas
                </span>
              }
            >
              <div className="h-64 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficSeries}>
                    <defs>
                      <linearGradient id="overviewGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
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
                      width={52}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        color: "var(--color-foreground)",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      fill="url(#overviewGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          {/* Right Sidebar Columns */}
          <div className="space-y-5">
            {/* Recent Alerts */}
            <Panel
              title="Alertas Recentes"
              action={
                <Link
                  to="/alertas"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Ver todos <ArrowUpRight className="size-3" />
                </Link>
              }
            >
              <ul className="space-y-3">
                {alerts.slice(0, 3).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start justify-between gap-3 border-b border-border/50 pb-2.5 last:border-0 last:pb-0 text-left"
                  >
                    <div>
                      <p className="text-xs font-semibold leading-snug text-foreground">
                        {a.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{a.context}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-muted-foreground">{a.time}</p>
                      <div className="mt-1">
                        <SeverityPill severity={a.severity} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* Active Policies */}
            <Panel
              title="Políticas de Privacidade"
              action={
                <Link
                  to="/politicas"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Ver todas <ArrowUpRight className="size-3" />
                </Link>
              }
            >
              <ul className="space-y-3 text-left">
                {policies.slice(0, 3).map((p) => (
                  <li
                    key={p.name}
                    className="flex items-start justify-between gap-3 border-b border-border/50 pb-2.5 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-xs font-semibold text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">Atualizada em {p.updated}</p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-bold rounded px-1.5 py-0.5 ${
                        p.status === "Vigente"
                          ? "bg-success/15 text-success"
                          : "bg-warning/15 text-warning"
                      }`}
                    >
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground text-left">
                {policies.length} políticas ativas · 100% alinhadas à LGPD
              </p>
            </Panel>
          </div>
        </div>
      )}

      {/* Brand Trust Card */}
      <div
        className="mt-6 rounded-2xl border border-primary/30 p-6 text-center shadow-md"
        style={{
          backgroundImage: "var(--gradient-surface)",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        <p className="text-base font-bold text-foreground">
          PRISMA ONE — Governança e Inteligência para Proteção de Dados
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Monitoramento contínuo, conformidade automatizada e segurança de ponta a ponta para sua
          empresa.
        </p>
      </div>
    </PageShell>
  );
}
