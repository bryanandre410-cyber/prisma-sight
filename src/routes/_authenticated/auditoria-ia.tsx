import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  FileCheck2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  Search,
  Eye,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/auditoria-ia")({
  head: () => ({
    meta: [
      { title: "Auditoria de IA — PRISMA ONE" },
      {
        name: "description",
        content:
          "Governança e auditoria de modelos de Inteligência Artificial: análise de viés, risco de vazamento e uso ético de dados.",
      },
      { property: "og:title", content: "Auditoria de IA — PRISMA ONE" },
      {
        property: "og:description",
        content:
          "Audite modelos generativos e preditivos quanto ao uso autorizado de dados, vazamentos e vieses.",
      },
    ],
  }),
  component: AuditoriaPage,
});

type AIModel = {
  id: string;
  name: string;
  type: "LLM / Generativo" | "Classificador / Preditivo" | "Visão Computacional" | "NLP";
  purpose: string;
  dataUse: string;
  bias: number;
  leak: number;
  status: "Conforme" | "Atenção" | "Crítico";
  lastAudit: string;
  auditor: string;
  findings: string;
  remediation: string;
};

const initialModels: AIModel[] = [
  {
    id: "MOD-01",
    name: "Modelo de Score de Crédito e Risco",
    type: "Classificador / Preditivo",
    purpose: "Avaliação automática de limite de crédito para novos clientes",
    dataUse: "Base legal: Execução de contrato (Art. 7º, V da LGPD)",
    bias: 12,
    leak: 4,
    status: "Conforme",
    lastAudit: "18/08/2026",
    auditor: "Equipe de Governança de IA",
    findings: "Paridade estatística balanceada entre faixas etárias e regiões demográficas.",
    remediation: "Manter monitoramento contínuo de drift nos dados de entrada.",
  },
  {
    id: "MOD-02",
    name: "Assistente de Atendimento ao Cliente (LLM)",
    type: "LLM / Generativo",
    purpose: "Atendimento de suporte e triagem de chamados",
    dataUse: "Base legal: Consentimento do titular (Art. 7º, I da LGPD)",
    bias: 18,
    leak: 15,
    status: "Conforme",
    lastAudit: "22/08/2026",
    auditor: "Marina Santos (Auditoria)",
    findings: "Filtros de mascaramento de CPF e cartão de crédito operando com 99.2% de eficácia.",
    remediation: "Adicionar regra de descarte imediato de logs contendo dados de saúde.",
  },
  {
    id: "MOD-03",
    name: "Marketing AI Campaign Engine",
    type: "NLP",
    purpose: "Segmentação comportamental de leads e campanhas de marketing",
    dataUse: "Dados de navegação e compras não anonimizados",
    bias: 38,
    leak: 27,
    status: "Atenção",
    lastAudit: "14/08/2026",
    auditor: "Roberto Costa (Segurança)",
    findings:
      "Identificado risco moderado de inferência de dados sensíveis a partir de clusters de navegação.",
    remediation:
      "Aplicar pseudonimização k-anonymity nos datasets de treino antes da próxima iteração.",
  },
  {
    id: "MOD-04",
    name: "Triagem de Currículos e Recrutamento",
    type: "Classificador / Preditivo",
    purpose: "Filtragem inicial de candidatos para vagas corporativas",
    dataUse: "Currículos contendo dados de gênero, idade e endereço sem consentimento explícito",
    bias: 57,
    leak: 22,
    status: "Crítico",
    lastAudit: "27/08/2026",
    auditor: "Ana Rodrigues (DPO)",
    findings: "Viés detectado na pontuação de candidatos por localização geográfica e gênero.",
    remediation:
      "Suspender decisões automáticas até retraining com remoção de variáveis protegidas.",
  },
];

const statusTone: Record<string, string> = {
  Conforme: "border-success/40 bg-success/15 text-success",
  Atenção: "border-warning/40 bg-warning/15 text-warning",
  Crítico: "border-destructive/40 bg-destructive/15 text-destructive",
};

function AuditoriaPage() {
  const [models, setModels] = useState<AIModel[]>(initialModels);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  const conformeCount = models.filter((m) => m.status === "Conforme").length;
  const atencaoCount = models.filter((m) => m.status === "Atenção").length;
  const criticoCount = models.filter((m) => m.status === "Crítico").length;

  const handleRunFullAudit = () => {
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      toast.success("Varredura de modelos de IA executada com sucesso! Relatório atualizado.");
    }, 1500);
  };

  return (
    <PageShell
      title="Auditoria de Inteligência Artificial"
      subtitle="Verifique se os modelos de IA da sua empresa operam de forma ética, sem viés e sem vazamento de dados."
      actions={
        <Button
          onClick={handleRunFullAudit}
          disabled={evaluating}
          className="gap-2 font-semibold shadow-xs"
        >
          <FileCheck2 className="size-4" />
          {evaluating ? "Auditando Modelos..." : "Executar Auditoria Geral"}
        </Button>
      }
    >
      {/* Notice Banner */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3 text-left">
        <Info className="size-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-foreground">
            Governança Ativa de IA — Marco Legal & LGPD
          </p>
          <p className="text-muted-foreground">
            O PRISMA ONE audita datasets de treinamento e prompts de inferência para assegurar a
            não-discriminação, rastreabilidade dos outputs e proteção dos segredos industriais da
            sua empresa.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">Modelos em Produção</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{models.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">100% catalogados</p>
          <div className="mx-auto mt-3 flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Bot className="size-4" />
          </div>
        </Panel>

        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">Modelos Conformes</p>
          <p className="mt-2 text-3xl font-bold text-success">{conformeCount}</p>
          <p className="mt-1 text-xs text-success font-medium">Aprovados para uso</p>
          <div className="mx-auto mt-3 flex size-8 items-center justify-center rounded-full bg-success/15 text-success">
            <ShieldCheck className="size-4" />
          </div>
        </Panel>

        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">Modelos em Atenção</p>
          <p className="mt-2 text-3xl font-bold text-warning">{atencaoCount}</p>
          <p className="mt-1 text-xs text-warning font-medium">Ajustes recomendados</p>
          <div className="mx-auto mt-3 flex size-8 items-center justify-center rounded-full bg-warning/15 text-warning">
            <Sliders className="size-4" />
          </div>
        </Panel>

        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">Modelos Críticos</p>
          <p className="mt-2 text-3xl font-bold text-destructive">{criticoCount}</p>
          <p className="mt-1 text-xs text-destructive font-medium">Decisão suspensa</p>
          <div className="mx-auto mt-3 flex size-8 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertTriangle className="size-4" />
          </div>
        </Panel>
      </div>

      {/* Model Cards Grid */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 text-left">
        {models.map((model) => (
          <Panel key={model.id} className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{model.purpose}</p>
                  </div>
                </div>
                <span
                  className={`rounded-md border px-2.5 py-0.5 text-[11px] font-bold uppercase ${statusTone[model.status]}`}
                >
                  {model.status}
                </span>
              </div>

              <div className="rounded-lg bg-secondary/40 p-2.5 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">Tipo:</strong> {model.type}
                </p>
                <p className="mt-0.5">
                  <strong className="text-foreground">Uso de Dados:</strong> {model.dataUse}
                </p>
              </div>

              {/* Progress bars for Bias and Leakage */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">Risco de Viés Algorítmico</span>
                    <span
                      className={`font-bold ${
                        model.bias > 40
                          ? "text-destructive"
                          : model.bias > 25
                            ? "text-warning"
                            : "text-success"
                      }`}
                    >
                      {model.bias}%
                    </span>
                  </div>
                  <Progress value={model.bias} className="h-1.5" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">
                      Risco de Vazamento via Prompts
                    </span>
                    <span
                      className={`font-bold ${
                        model.leak > 40
                          ? "text-destructive"
                          : model.leak > 20
                            ? "text-warning"
                            : "text-success"
                      }`}
                    >
                      {model.leak}%
                    </span>
                  </div>
                  <Progress value={model.leak} className="h-1.5" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                Auditoria: {model.lastAudit} · {model.auditor}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedModel(model)}
                className="gap-1.5 text-xs h-8"
              >
                <Eye className="size-3.5" /> Ver Detalhes
              </Button>
            </div>
          </Panel>
        ))}
      </div>

      {/* Model Audit Details Dialog */}
      <Dialog open={!!selectedModel} onOpenChange={(open) => !open && setSelectedModel(null)}>
        <DialogContent className="max-w-lg text-left">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-primary" />
              <DialogTitle className="text-base">{selectedModel?.name}</DialogTitle>
            </div>
            <DialogDescription>
              {selectedModel?.id} · Tipo: {selectedModel?.type} · Auditor: {selectedModel?.auditor}
            </DialogDescription>
          </DialogHeader>

          {selectedModel && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-muted-foreground">Risco de Viés</p>
                  <p className="text-xl font-bold mt-1 text-foreground">{selectedModel.bias}%</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-muted-foreground">Risco de Vazamento</p>
                  <p className="text-xl font-bold mt-1 text-foreground">{selectedModel.leak}%</p>
                </div>
              </div>

              <div className="rounded-lg bg-secondary/40 p-3.5 space-y-1">
                <p className="font-semibold text-foreground">Achados da Auditoria:</p>
                <p className="text-muted-foreground">{selectedModel.findings}</p>
              </div>

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3.5 space-y-1">
                <p className="font-semibold text-primary">Ação de Remediação Recomendada:</p>
                <p className="text-foreground">{selectedModel.remediation}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setSelectedModel(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
