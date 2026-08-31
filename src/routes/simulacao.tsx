import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Play,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Database,
  ArrowRight,
} from "lucide-react";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SimulationScenario = {
  id: string;
  name: string;
  description: string;
  type: "compliance" | "security" | "performance";
  duration: number;
  complexity: "baixa" | "media" | "alta";
};

type SimulationResult = {
  scenario: string;
  status: "executando" | "concluido" | "falhou";
  progress: number;
  metrics: {
    complianceScore: number;
    riskLevel: string;
    dataVolume: string;
    processingTime: string;
  };
  findings: string[];
};

const scenarios: SimulationScenario[] = [
  {
    id: "sim-001",
    name: "Teste de Conformidade LGPD & Bases Legais",
    description: "Simula uma auditoria completa de conformidade com os 26 controles da LGPD.",
    type: "compliance",
    duration: 15,
    complexity: "alta",
  },
  {
    id: "sim-002",
    name: "Simulação de Tentativa de Exfiltração de Dados",
    description: "Testa a resposta dos algoritmos de contenção a vazamento de dados sensíveis.",
    type: "security",
    duration: 10,
    complexity: "media",
  },
  {
    id: "sim-003",
    name: "Auditoria de Viés Algorítmico em Modelo de IA",
    description: "Avalia a distribuição de decisões automatizadas entre grupos protegidos.",
    type: "compliance",
    duration: 20,
    complexity: "alta",
  },
  {
    id: "sim-004",
    name: "Teste de Performance de Monitoramento 24/7",
    description: "Avalia a capacidade de processamento de fluxos de dados em tempo real.",
    type: "performance",
    duration: 8,
    complexity: "baixa",
  },
];

export const Route = createFileRoute("/simulacao")({
  head: () => ({
    meta: [
      { title: "Simulação de Diagnóstico — PRISMA ONE" },
      {
        name: "description",
        content:
          "Ambiente de teste e demonstração do motor analítico de conformidade e auditoria de IA do PRISMA ONE.",
      },
      { property: "og:title", content: "Simulação de Diagnóstico — PRISMA ONE" },
      {
        property: "og:description",
        content: "Valide políticas de segurança e conformidade LGPD em ambiente de teste.",
      },
    ],
  }),
  component: SimulacaoPage,
});

function SimulacaoPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>("sim-001");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [currentSimulation, setCurrentSimulation] = useState<SimulationResult | null>(null);

  const runSimulation = () => {
    if (!selectedScenario) return;
    const scenario = scenarios.find((s) => s.id === selectedScenario);
    if (!scenario) return;

    setIsRunning(true);

    const newSimulation: SimulationResult = {
      scenario: scenario.name,
      status: "executando",
      progress: 0,
      metrics: {
        complianceScore: 0,
        riskLevel: "Analisando...",
        dataVolume: "0 TB",
        processingTime: "0s",
      },
      findings: [],
    };

    setCurrentSimulation(newSimulation);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        const completed: SimulationResult = {
          ...newSimulation,
          status: "concluido",
          progress: 100,
          metrics: {
            complianceScore: Math.floor(Math.random() * 10) + 90,
            riskLevel: Math.random() > 0.5 ? "Baixo" : "Médio",
            dataVolume: (Math.random() * 4 + 1).toFixed(2) + " TB",
            processingTime: (Math.random() * 15 + 5).toFixed(1) + "s",
          },
          findings: [
            "Conformidade com os artigos 7º e 11 da LGPD validada.",
            "Detecção de dados não mascarados em pipeline secundário.",
            "Políticas de retenção e expurgo ativas.",
            "Modelo de IA com paridade estatística de 98.4%.",
          ],
        };

        setCurrentSimulation(completed);
        setResults([completed, ...results]);
        setIsRunning(false);
      } else {
        setCurrentSimulation({ ...newSimulation, progress });
      }
    }, 350);
  };

  return (
    <PageShell
      title="Ambiente de Simulação e Testes"
      subtitle="Valide cenários de privacidade, auditoria de IA e monitoramento contínuo no motor do PRISMA ONE."
      actions={
        <Button asChild className="gap-1.5 font-semibold">
          <Link to="/auth">
            Acessar Painel Corporativo <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    >
      <Tabs defaultValue="scenarios" className="w-full text-left">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="scenarios">Cenários de Teste</TabsTrigger>
          <TabsTrigger value="results">Resultados Anteriores ({results.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-5">
          <Panel
            title="Configurar Simulação"
            description="Selecione um cenário para disparar o diagnóstico."
          >
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Cenário de Diagnóstico</label>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Selecione um cenário" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {s.name} ({s.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedScenario && (
                <Card className="bg-secondary/40 border-border/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-foreground font-bold">
                      {scenarios.find((s) => s.id === selectedScenario)?.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {scenarios.find((s) => s.id === selectedScenario)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duração estimada:</span>
                      <span className="font-semibold">
                        {scenarios.find((s) => s.id === selectedScenario)?.duration} segundos
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Complexidade:</span>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {scenarios.find((s) => s.id === selectedScenario)?.complexity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={runSimulation}
                  disabled={isRunning}
                  className="flex-1 font-semibold gap-2"
                >
                  <Play className="size-4" />
                  {isRunning ? "Simulando..." : "Executar Simulação"}
                </Button>
              </div>
            </div>
          </Panel>

          {currentSimulation && (
            <Panel
              title="Progresso da Simulação"
              description="Acompanhe a varredura em tempo real."
            >
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    {currentSimulation.scenario}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      currentSimulation.status === "concluido"
                        ? "bg-success/15 text-success border-success/40"
                        : "bg-primary/15 text-primary border-primary/40"
                    }
                  >
                    {currentSimulation.status === "concluido" ? "Concluído" : "Executando"}
                  </Badge>
                </div>

                <Progress value={currentSimulation.progress} className="h-2" />

                {currentSimulation.status === "concluido" && (
                  <div className="grid gap-3 sm:grid-cols-4 pt-2">
                    <div className="rounded-xl border border-border p-3 bg-secondary/30 text-center">
                      <p className="text-muted-foreground text-[10px]">Conformidade</p>
                      <p className="text-xl font-bold text-success mt-1">
                        {currentSimulation.metrics.complianceScore}%
                      </p>
                    </div>
                    <div className="rounded-xl border border-border p-3 bg-secondary/30 text-center">
                      <p className="text-muted-foreground text-[10px]">Nível de Risco</p>
                      <p className="text-xl font-bold text-foreground mt-1">
                        {currentSimulation.metrics.riskLevel}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border p-3 bg-secondary/30 text-center">
                      <p className="text-muted-foreground text-[10px]">Volume de Dados</p>
                      <p className="text-xl font-bold text-foreground mt-1">
                        {currentSimulation.metrics.dataVolume}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border p-3 bg-secondary/30 text-center">
                      <p className="text-muted-foreground text-[10px]">Tempo</p>
                      <p className="text-xl font-bold text-foreground mt-1">
                        {currentSimulation.metrics.processingTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Panel title="Histórico de Simulações">
            {results.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                Nenhuma simulação executada ainda. Selecione um cenário para começar.
              </p>
            ) : (
              <div className="space-y-3">
                {results.map((res, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">{res.scenario}</span>
                      <span className="text-success font-bold">
                        {res.metrics.complianceScore}% Score
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      Volume: {res.metrics.dataVolume} · Processamento: {res.metrics.processingTime}{" "}
                      · Risco: {res.metrics.riskLevel}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
