import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Play, ScanSearch, Bell, HelpCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

import { PageShell, Panel, SeverityPill } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AppSidebar } from "@/components/prisma/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/analise")({
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

type Finding = {
  id: string;
  title: string;
  detail: string;
  severity: "baixo" | "medio" | "alto";
  action: string;
};

type SimulationResult = {
  source: string;
  scope: string;
  recordsScanned: number;
  complianceScore: number;
  findings: Finding[];
};

function runSimulation(source: string, scope: string): SimulationResult {
  const findings: Finding[] = [
    {
      id: "1",
      title: "Dados pessoais não criptografados em repouso",
      detail: `Detectados 2.450 registros de CPF em texto plano no ${source}`,
      severity: "alto",
      action: "Implementar criptografia AES-256 para dados em repouso",
    },
    {
      id: "2",
      title: "Acesso excessivo por usuários não autorizados",
      detail: "3 usuários com permissões de administrador sem justificativa",
      severity: "medio",
      action: "Revisar e reduzir privilégios de acesso",
    },
    {
      id: "3",
      title: "Retenção de dados além do prazo legal",
      detail: "Dados de clientes encerrados há mais de 5 anos ainda armazenados",
      severity: "baixo",
      action: "Implementar política de exclusão automática",
    },
  ];

  return {
    source,
    scope,
    recordsScanned: Math.floor(Math.random() * 50000) + 10000,
    complianceScore: Math.floor(Math.random() * 30) + 70,
    findings,
  };
}

function AnalisePage() {
  const navigate = useNavigate();
  const [source, setSource] = useState(sources[0]);
  const [scope, setScope] = useState("completo");
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const userCompany = typeof window !== "undefined" ? (localStorage.getItem("userCompany") || "Empresa") : "Empresa";
  const initials = userCompany.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      if (!isAuthenticated) navigate({ to: "/auth" as any, replace: true });
    }
  }, [navigate]);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  function handleSignOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userCompany");
      localStorage.removeItem("userEmail");
    }
    navigate({ to: "/auth" as any, replace: true });
  }

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
          const simulated = runSimulation(source as string, scope as string);
          setResult(simulated);
          setRunning(false);
          toast.success("Análise concluída");
        }
        return next;
      });
    }, 320);
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <button className="relative text-muted-foreground transition-colors hover:text-foreground">
                <Bell className="size-5" />
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary-glow" />
              </button>
              <HelpCircle className="size-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div
                  className="flex size-8 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  {initials}
                </div>
                <div className="hidden leading-tight sm:block">
                  <p className="max-w-[180px] truncate text-sm font-medium">{userCompany}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Responsável pela Privacidade
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </header>
          <main className="flex-1 p-6">
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
            </PageShell>
          </main>
        </div>
      </div>
    </SidebarProvider>
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
