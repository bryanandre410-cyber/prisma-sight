import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, RefreshCw, TrendingUp, AlertTriangle, ShieldCheck, Database } from "lucide-react";

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
    name: "Teste de Conformidade LGPD",
    description: "Simula uma auditoria completa de conformidade com a LGPD",
    type: "compliance",
    duration: 30,
    complexity: "alta",
  },
  {
    id: "sim-002",
    name: "Simulação de Ataque de Dados",
    description: "Testa a resposta do sistema a tentativas de acesso não autorizado",
    type: "security",
    duration: 15,
    complexity: "media",
  },
  {
    id: "sim-003",
    name: "Análise de Viés em IA",
    description: "Detecta possíveis vieses em modelos de IA treinados",
    type: "compliance",
    duration: 45,
    complexity: "alta",
  },
  {
    id: "sim-004",
    name: "Teste de Performance de Monitoramento",
    description: "Avalia a capacidade do sistema em tempo real",
    type: "performance",
    duration: 20,
    complexity: "baixa",
  },
  {
    id: "sim-005",
    name: "Simulação de Vazamento de Dados",
    description: "Testa detecção de vazamentos de dados sensíveis",
    type: "security",
    duration: 25,
    complexity: "media",
  },
];

export const Route = createFileRoute("/simulacao")({
  head: () => ({
    meta: [
      { title: "Simulação — Prisma One" },
      {
        name: "description",
        content: "Execute simulações e testes para análise de dados e conformidade.",
      },
      { property: "og:title", content: "Simulação — Prisma One" },
      {
        property: "og:description",
        content: "Ambiente de teste para validar políticas e segurança de dados.",
      },
    ],
  }),
  component: SimulacaoPage,
});

function SimulacaoPage() {
  const [selectedScenario, setSelectedScenario] = useState<string>("");
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
        riskLevel: "Calculando...",
        dataVolume: "0 TB",
        processingTime: "0s",
      },
      findings: [],
    };

    setCurrentSimulation(newSimulation);

    // Simular progresso
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        const completedSimulation: SimulationResult = {
          ...newSimulation,
          status: "concluido",
          progress: 100,
          metrics: {
            complianceScore: Math.floor(Math.random() * 20) + 80,
            riskLevel: Math.random() > 0.5 ? "Baixo" : "Médio",
            dataVolume: (Math.random() * 5 + 1).toFixed(2) + " TB",
            processingTime: (Math.random() * 30 + 10).toFixed(1) + "s",
          },
          findings: [
            "Conformidade LGPD: 98% alinhada",
            "Detectados 2 pontos de atenção menores",
            "Sistema de monitoramento operacional",
            "Políticas de retenção ativas",
          ],
        };

        setCurrentSimulation(completedSimulation);
        setResults([completedSimulation, ...results]);
        setIsRunning(false);
      } else {
        setCurrentSimulation({ ...newSimulation, progress });
      }
    }, 500);
  };

  const resetSimulation = () => {
    setCurrentSimulation(null);
    setIsRunning(false);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "alta":
        return "bg-destructive/15 text-destructive border-destructive/40";
      case "media":
        return "bg-warning/15 text-warning border-warning/40";
      default:
        return "bg-success/15 text-success border-success/40";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "compliance":
        return ShieldCheck;
      case "security":
        return AlertTriangle;
      default:
        return TrendingUp;
    }
  };

  return (
    <PageShell
      title="Simulação e Análise"
      subtitle="Execute testes e simulações para validar conformidade e segurança."
    >
      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scenarios">Cenários de Teste</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-5">
          <Panel title="Configurar Simulação" description="Selecione um cenário para executar.">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cenário de Teste</label>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cenário" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((scenario) => {
                      const TypeIcon = getTypeIcon(scenario.type);
                      return (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          <div className="flex items-center gap-2">
                            <TypeIcon className="size-4" />
                            <span>{scenario.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedScenario && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {scenarios.find((s) => s.id === selectedScenario)?.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {scenarios.find((s) => s.id === selectedScenario)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duração estimada:</span>
                      <span className="font-medium">
                        {scenarios.find((s) => s.id === selectedScenario)?.duration} segundos
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Complexidade:</span>
                      <Badge
                        variant="outline"
                        className={
                          getComplexityColor(
                            scenarios.find((s) => s.id === selectedScenario)?.complexity || "baixa"
                          )
                        }
                      >
                        {scenarios.find((s) => s.id === selectedScenario)?.complexity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium capitalize">
                        {scenarios.find((s) => s.id === selectedScenario)?.type}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={runSimulation}
                  disabled={!selectedScenario || isRunning}
                  className="flex-1 gap-2"
                >
                  <Play className="size-4" />
                  {isRunning ? "Executando..." : "Executar Simulação"}
                </Button>
                {currentSimulation && (
                  <Button onClick={resetSimulation} variant="outline" className="gap-2">
                    <RefreshCw className="size-4" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </Panel>

          {currentSimulation && (
            <Panel title="Progresso da Simulação" description="Acompanhe a execução em tempo real.">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{currentSimulation.scenario}</span>
                  <Badge
                    variant="outline"
                    className={
                      currentSimulation.status === "concluido"
                        ? "bg-success/15 text-success border-success/40"
                        : currentSimulation.status === "executando"
                          ? "bg-primary/15 text-primary border-primary/40"
                          : "bg-destructive/15 text-destructive border-destructive/40"
                    }
                  >
                    {currentSimulation.status === "executando"
                      ? "Executando"
                      : currentSimulation.status === "concluido"
                        ? "Concluído"
                        : "Falhou"}
                  </Badge>
                </div>

                <Progress value={currentSimulation.progress} className="h-2" />

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ShieldCheck className="size-4" />
                        Pontuação de Conformidade
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {currentSimulation.metrics.complianceScore}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="size-4" />
                        Nível de Risco
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{currentSimulation.metrics.riskLevel}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Database className="size-4" />
                        Volume de Dados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{currentSimulation.metrics.dataVolume}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="size-4" />
                        Tempo de Processamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{currentSimulation.metrics.processingTime}</p>
                    </CardContent>
                  </Card>
                </div>

                {currentSimulation.status === "concluido" && currentSimulation.findings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Descobertas:</h4>
                    <ul className="space-y-1">
                      {currentSimulation.findings.map((finding, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="mt-1.5 size-1.5 rounded-full bg-primary" />
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Panel>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-5">
          <Panel title="Histórico de Simulações" description="Resultados das simulações executadas.">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <Play className="mx-auto size-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma simulação executada ainda. Selecione um cenário para começar.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{result.scenario}</CardTitle>
                        <Badge
                          variant="outline"
                          className="bg-success/15 text-success border-success/40"
                        >
                          Concluído
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Conformidade</p>
                          <p className="font-semibold">{result.metrics.complianceScore}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Risco</p>
                          <p className="font-semibold">{result.metrics.riskLevel}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Dados</p>
                          <p className="font-semibold">{result.metrics.dataVolume}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Tempo</p>
                          <p className="font-semibold">{result.metrics.processingTime}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {result.findings.slice(0, 2).map((finding, fIndex) => (
                          <p key={fIndex} className="text-xs text-muted-foreground">
                            • {finding}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </Panel>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
