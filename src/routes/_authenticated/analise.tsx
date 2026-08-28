import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Play, ScanSearch } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { PageShell, Panel, SeverityPill } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { runSimulation, type Finding, type SimulationResult } from "@/lib/analysis-simulator";

export const Route = createFileRoute("/_authenticated/analise")({
  head: () => ({
    meta: [
      { title: "Simulação de análise de dados — Prisma One" },
      {
        name: "description",
        content:
          "Execute uma simulação de análise dos dados da empresa e receba riscos, achados e pontuação de conformidade.",
      },
      { property: "og:title", content: "Simulação de análise de dados — Prisma One" },
      {
        property: "og:description",
        content: "Varredura simulada de fontes de dados com riscos e score de conformidade LGPD.",
      },
    ],
  }),
  component: AnalisePage,
});

const sources = [
  "CRM Comercial",
  "ERP Financeiro",
  "RH Cloud",
  "Data Lake Analytics",
  "Chatbot de Atendimento",
];

const scopes = [
  { value: "completo", label: "Completo" },
  { value: "lgpd", label: "Foco LGPD" },
  { value: "ia", label: "Foco IA" },
];

const steps = [
  "Conectando à fonte de dados...",
  "Mapeando dados pessoais e sensíveis...",
  "Analisando acessos e compartilhamentos...",
  "Avaliando uso por modelos de IA...",
  "Calculando conformidade e gerando achados...",
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

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

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
      if (!userId) throw new Error("Sessão expirada");
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
      toast.success("Análise concluída e registrada");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro ao salvar a análise"),
  });

  function startAnalysis() {
    if (running) return;
    setRunning(true);
    setResult(null);
    setProgress(0);
    setStep(0);

    timer.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + Math.random() * 9 + 4);
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
    }, 320);
  }

  return (
    <PageShell
      title="Simulação de Análise de Dados"
      subtitle="Execute uma varredura simulada nas fontes de dados da empresa e veja riscos, achados e conformidade."
    >
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Panel title="Configurar análise" description="Escolha a fonte e o escopo da varredura.">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fonte">Fonte de dados</Label>
              <select
                id="fonte"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={running}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="escopo">Escopo</Label>
              <select
                id="escopo"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                disabled={running}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {scopes.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={startAnalysis} disabled={running} className="w-full">
              {running ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Play className="mr-2 size-4" />
              )}
              {running ? "Analisando..." : "Iniciar análise"}
            </Button>

            {(running || progress > 0) && (
              <div className="pt-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                      backgroundImage: "var(--gradient-primary)",
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {running ? steps[step] : "Varredura finalizada."} {Math.round(progress)}%
                </p>
              </div>
            )}
          </div>
        </Panel>

        <Panel
          title="Resultado da análise"
          description="Achados simulados a partir do comportamento dos dados na fonte selecionada."
        >
          {!result ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14 text-center text-muted-foreground">
              <ScanSearch className="size-8" />
              <p className="text-sm">Nenhuma análise executada ainda nesta sessão.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Registros analisados" value={result.recordsScanned.toLocaleString("pt-BR")} />
                <Metric label="Conformidade LGPD" value={`${result.complianceScore}%`} />
                <Metric label="Riscos encontrados" value={String(result.findings.length)} />
              </div>
              <ul className="space-y-3">
                {result.findings.map((f) => (
                  <li key={f.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{f.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{f.detail}</p>
                      </div>
                      <SeverityPill severity={f.severity} />
                    </div>
                    <p className="mt-3 text-xs text-primary-glow">Ação recomendada: {f.action}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
      </div>

      <Panel className="mt-4" title="Histórico de análises" description="Últimas varreduras registradas para a sua empresa.">
        {history.isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : !history.data?.length ? (
          <p className="text-sm text-muted-foreground">Nenhuma análise registrada até o momento.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="py-2 text-left font-medium">Fonte</th>
                  <th className="py-2 text-left font-medium">Escopo</th>
                  <th className="py-2 text-right font-medium">Registros</th>
                  <th className="py-2 text-right font-medium">Riscos</th>
                  <th className="py-2 text-right font-medium">Conformidade</th>
                  <th className="py-2 text-right font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {history.data.map((row) => (
                  <tr key={row.id} className="border-t border-border/70">
                    <td className="py-2.5">{row.source}</td>
                    <td className="py-2.5 capitalize text-muted-foreground">{row.scope}</td>
                    <td className="py-2.5 text-right">{row.records_scanned.toLocaleString("pt-BR")}</td>
                    <td className="py-2.5 text-right">{row.risks_found}</td>
                    <td className="py-2.5 text-right">{row.compliance_score}%</td>
                    <td className="py-2.5 text-right text-muted-foreground">
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
