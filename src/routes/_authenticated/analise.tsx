import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Play,
  ScanSearch,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  History,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { PageShell, Panel, SeverityPill } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { runSimulation, type Finding, type SimulationResult } from "@/lib/analysis-simulator";

export const Route = createFileRoute("/_authenticated/analise")({
  head: () => ({
    meta: [
      { title: "Varredura & Simulação de Dados — PRISMA ONE" },
      {
        name: "description",
        content:
          "Execute uma varredura de conformidade e auditoria de IA nas fontes de dados corporativas da empresa.",
      },
      { property: "og:title", content: "Varredura & Simulação de Dados — PRISMA ONE" },
      {
        property: "og:description",
        content: "Mapeamento em tempo real de dados pessoais, riscos de vazamento e score LGPD.",
      },
    ],
  }),
  component: AnalisePage,
});

const sources = [
  "CRM Comercial (HubSpot / Salesforce)",
  "ERP Financeiro (SAP / TOTVS)",
  "RH Cloud Storage & Currículos",
  "Data Lake & Snowflake Analytics",
  "Chatbot de Atendimento & LLM Gateway",
];

const scopes = [
  { value: "completo", label: "Varredura Completa (LGPD + IA + Segurança)" },
  { value: "lgpd", label: "Foco Estrito em Conformidade LGPD" },
  { value: "ia", label: "Foco em Modelos de IA e Viés Algorítmico" },
];

const steps = [
  "Estabelecendo túnel seguro com a fonte de dados...",
  "Mapeando campos com dados pessoais e sensíveis...",
  "Analisando permissões de acesso e logs de compartilhamento...",
  "Avaliando uso de dados por modelos de Inteligência Artificial...",
  "Consolidando métricas e gerando laudo de conformidade...",
];

type AnalysisRow = {
  id: string;
  source: string;
  scope: string;
  records_scanned: number;
  compliance_score: number;
  risks_found: number;
  findings: Finding[];
  created_at: string;
};

function AnalisePage() {
  const queryClient = useQueryClient();
  const [source, setSource] = useState(sources[0]);
  const [scope, setScope] = useState("completo");
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  const history = useQuery({
    queryKey: ["analyses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data ?? []) as unknown as AnalysisRow[];
    },
  });

  const save = useMutation({
    mutationFn: async (payload: SimulationResult) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Sessão expirada. Por favor, faça login novamente.");

      const { error } = await supabase.from("analyses").insert({
        user_id: userId,
        source: payload.source,
        scope: payload.scope,
        status: "concluida",
        records_scanned: payload.recordsScanned,
        compliance_score: payload.complianceScore,
        risks_found: payload.findings.length,
        findings: payload.findings as unknown as never,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-analyses"] });
      toast.success("Varredura concluída e persistida com sucesso!");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao registrar varredura."),
  });

  function startAnalysis() {
    if (running) return;
    setRunning(true);
    setResult(null);
    setProgress(0);
    setStep(0);

    timer.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + Math.random() * 11 + 6);
        setStep(Math.min(steps.length - 1, Math.floor((next / 100) * steps.length)));
        if (next >= 100) {
          if (timer.current) clearInterval(timer.current);
          const simulated = runSimulation(source, scope);
          setResult(simulated);
          setRunning(false);
          save.mutate(simulated);
        }
        return next;
      });
    }, 280);
  }

  return (
    <PageShell
      title="Varredura & Simulação de Dados"
      subtitle="Execute diagnósticos de conformidade e auditoria de IA nas fontes corporativas da sua empresa."
    >
      <div className="grid gap-5 lg:grid-cols-[380px_1fr] text-left">
        {/* Configuration Panel */}
        <Panel
          title="Configurar Varredura"
          description="Selecione a fonte e o escopo do diagnóstico."
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="fonte">Fonte de Dados Corporativa</Label>
              <select
                id="fonte"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={running}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs focus-visible:ring-2 focus-visible:ring-ring"
              >
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="escopo">Escopo da Análise</Label>
              <select
                id="escopo"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                disabled={running}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs focus-visible:ring-2 focus-visible:ring-ring"
              >
                {scopes.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={startAnalysis}
              disabled={running}
              className="w-full h-10 font-semibold gap-2 shadow-xs"
            >
              {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
              {running ? "Executando Varredura..." : "Iniciar Varredura"}
            </Button>

            {(running || progress > 0) && (
              <div className="pt-2 space-y-1.5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundImage: "var(--gradient-primary)",
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {running ? steps[step] : "Varredura concluída com sucesso."} (
                  {Math.round(progress)}%)
                </p>
              </div>
            )}
          </div>
        </Panel>

        {/* Results Panel */}
        <Panel
          title="Resultado da Varredura"
          description="Achados técnicos e classificação de riscos identificados no ambiente analisado."
        >
          {!result ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground text-xs">
              <ScanSearch className="size-10 text-muted-foreground/60" />
              <p className="font-medium text-foreground">Nenhuma análise executada nesta sessão.</p>
              <p>Configure a fonte de dados e clique em "Iniciar Varredura" para gerar o laudo.</p>
            </div>
          ) : (
            <div className="space-y-5 text-left">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
                  <p className="text-[11px] text-muted-foreground">Registros Analisados</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {result.recordsScanned.toLocaleString("pt-BR")}
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
                  <p className="text-[11px] text-muted-foreground">Score de Conformidade</p>
                  <p className="text-2xl font-bold text-success mt-1">{result.complianceScore}%</p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
                  <p className="text-[11px] text-muted-foreground">Riscos Identificados</p>
                  <p className="text-2xl font-bold text-destructive mt-1">
                    {result.findings.length}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Achados e Recomendações:
                </p>
                <ul className="space-y-3">
                  {result.findings.map((f) => (
                    <li
                      key={f.id}
                      className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-foreground">{f.title}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{f.detail}</p>
                        </div>
                        <SeverityPill severity={f.severity} />
                      </div>
                      <p className="rounded-md bg-primary/5 border border-primary/20 p-2 text-[11px] text-primary">
                        <strong>Ação recomendada pelo PRISMA ONE:</strong> {f.action}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* History Table from Supabase */}
      <Panel
        className="mt-6 text-left"
        title="Histórico de Varreduras da Empresa"
        description="Registros persistidos no banco de dados isolado do seu tenant."
      >
        {history.isLoading ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            Carregando histórico do banco...
          </p>
        ) : !history.data?.length ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            Nenhuma varredura registrada ainda para a sua organização.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/80 uppercase tracking-wider text-muted-foreground font-semibold">
                  <th className="pb-3 pr-4">Fonte de Dados</th>
                  <th className="pb-3 px-4">Escopo</th>
                  <th className="pb-3 px-4 text-right">Registros</th>
                  <th className="pb-3 px-4 text-right">Riscos</th>
                  <th className="pb-3 px-4 text-right">Conformidade</th>
                  <th className="pb-3 pl-4 text-right">Data / Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {history.data.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-foreground">{row.source}</td>
                    <td className="py-3 px-4 capitalize text-muted-foreground">{row.scope}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      {row.records_scanned.toLocaleString("pt-BR")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-destructive">{row.risks_found}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-success">
                      {row.compliance_score}%
                    </td>
                    <td className="py-3 pl-4 text-right text-muted-foreground">
                      {new Date(row.created_at).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </PageShell>
  );
}
