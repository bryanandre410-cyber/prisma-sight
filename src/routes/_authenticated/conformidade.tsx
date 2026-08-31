import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Download,
  ShieldCheck,
  Clock,
  ArrowRight,
  ExternalLink,
  Check,
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
import { toast } from "sonner";

import { PageShell, Panel, SeverityPill } from "@/components/prisma/PageShell";
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

export const Route = createFileRoute("/_authenticated/conformidade")({
  head: () => ({
    meta: [
      { title: "Conformidade LGPD — PRISMA ONE" },
      {
        name: "description",
        content:
          "Nível atual de adequação à LGPD, controles ativos, itens pendentes e plano de ação corretiva.",
      },
      { property: "og:title", content: "Conformidade LGPD — PRISMA ONE" },
      {
        property: "og:description",
        content:
          "Acompanhe o nível de conformidade, riscos encontrados e evolução dos controles de privacidade.",
      },
    ],
  }),
  component: ConformidadePage,
});

type Control = {
  id: string;
  name: string;
  category: "Bases Legais" | "Segurança" | "Direitos do Titular" | "Governança";
  article: string;
  progress: number;
  owner: string;
  status: "concluido" | "em_andamento" | "critico";
  description: string;
  risk: string;
  action: string;
};

const controlsData: Control[] = [
  {
    id: "CTRL-01",
    name: "Mapeamento de Dados Pessoais (Data Mapping)",
    category: "Governança",
    article: "Art. 37 da LGPD",
    progress: 100,
    owner: "DPO",
    status: "concluido",
    description:
      "Inventário completo de fluxos, categorias de dados, finalidades e sistemas de armazenamento.",
    risk: "Baixo — Inventário completo e atualizado no último ciclo trimestral.",
    action: "Manter rotina de revisão a cada novo sistema ou produto lançado.",
  },
  {
    id: "CTRL-02",
    name: "Bases Legais Documentadas",
    category: "Bases Legais",
    article: "Art. 7º e 11 da LGPD",
    progress: 96,
    owner: "Jurídico",
    status: "concluido",
    description:
      "Enquadramento jurídico documentado para cada operação de tratamento de dados pessoais.",
    risk: "Baixo — 96% dos tratamentos devidamente respaldados por consentimento ou legítimo interesse.",
    action: "Completar os 4% restantes referentes a novos formulários de captação de leads.",
  },
  {
    id: "CTRL-03",
    name: "Gestão e Revogação de Consentimento",
    category: "Direitos do Titular",
    article: "Art. 8º da LGPD",
    progress: 92,
    owner: "Produto & Engenharia",
    status: "concluido",
    description:
      "Mecanismo automatizado para registro e revogação de consentimento de usuários no portal.",
    risk: "Baixo — Sistema de opt-out centralizado e funcional.",
    action: "Integrar logs de consentimento com ferramentas legadas de e-mail marketing.",
  },
  {
    id: "CTRL-04",
    name: "Atendimento a Requisições de Titulares (DSAR)",
    category: "Direitos do Titular",
    article: "Art. 18 da LGPD",
    progress: 88,
    owner: "Atendimento & DPO",
    status: "em_andamento",
    description:
      "Fluxo de solicitação de confirmação, acesso, correção e eliminação de dados pessoais em até 15 dias.",
    risk: "Médio — Algumas solicitações manuais de exclusão demoram até 10 dias.",
    action: "Automatizar o pipeline de expurgo em bases de backup e logs secundários.",
  },
  {
    id: "CTRL-05",
    name: "Plano de Resposta a Incidentes de Segurança",
    category: "Segurança",
    article: "Art. 48 da LGPD",
    progress: 74,
    owner: "Segurança da Informação",
    status: "em_andamento",
    description:
      "Procedimento documentado e testado para comunicação de incidentes à ANPD e aos titulares.",
    risk: "Médio — Simulação anual de vazamento de dados ainda não realizada neste semestre.",
    action: "Agendar teste de simulação de incidente com a equipe de resposta até o final do mês.",
  },
  {
    id: "CTRL-06",
    name: "Contratos e Aditivos com Operadores Terceirizados",
    category: "Bases Legais",
    article: "Art. 39 da LGPD",
    progress: 61,
    owner: "Jurídico & Compras",
    status: "critico",
    description:
      "Cláusulas específicas de proteção de dados (DPA) assinadas com fornecedores que tratam dados.",
    risk: "Alto — 3 fornecedores críticos de computação em nuvem operam sem termo aditivo assinado.",
    action:
      "Executar notificação imediata aos 3 fornecedores para formalização das cláusulas de tratamento.",
  },
];

const evolutionSeries = [
  { mes: "Out", score: 68 },
  { mes: "Nov", score: 74 },
  { mes: "Dez", score: 81 },
  { mes: "Jan", score: 87 },
  { mes: "Fev", score: 92 },
  { mes: "Mar", score: 98 },
];

function ConformidadePage() {
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const completedCount = controlsData.filter((c) => c.status === "concluido").length;
  const inProgressCount = controlsData.filter((c) => c.status === "em_andamento").length;
  const criticalCount = controlsData.filter((c) => c.status === "critico").length;

  const handleDownloadReport = () => {
    toast.success("Relatório de Conformidade LGPD emitido com sucesso em formato PDF!");
    setReportModalOpen(false);
  };

  return (
    <PageShell
      title="Conformidade LGPD"
      subtitle="Auditoria contínua dos controles da Lei Geral de Proteção de Dados (Lei 13.709/2018)."
      actions={
        <Button onClick={() => setReportModalOpen(true)} className="gap-2 font-semibold shadow-xs">
          <Download className="size-4" /> Gerar Laudo de Conformidade
        </Button>
      }
    >
      {/* Top Indicators */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">
            Índice Geral de Adequação
          </p>
          <p className="mt-2 text-3xl font-bold text-success">98%</p>
          <p className="mt-1 text-xs text-muted-foreground">Classificação: Alto Padrão</p>
          <Progress value={98} className="mt-3 h-2" />
        </Panel>

        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">
            Controles Concluídos
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {completedCount}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              / {controlsData.length}
            </span>
          </p>
          <p className="mt-1 text-xs text-success font-medium">Auditados e em conformidade</p>
          <div className="mx-auto mt-3 flex size-8 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="size-4" />
          </div>
        </Panel>

        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">Itens em Andamento</p>
          <p className="mt-2 text-3xl font-bold text-warning">{inProgressCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Acompanhados pelo DPO</p>
          <div className="mx-auto mt-3 flex size-8 items-center justify-center rounded-full bg-warning/15 text-warning">
            <Clock className="size-4" />
          </div>
        </Panel>

        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">Itens Críticos</p>
          <p className="mt-2 text-3xl font-bold text-destructive">{criticalCount}</p>
          <p className="mt-1 text-xs text-destructive font-medium">Ação prioritária</p>
          <div className="mx-auto mt-3 flex size-8 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertTriangle className="size-4" />
          </div>
        </Panel>
      </div>

      {/* Compliance Evolution Chart */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel
          className="lg:col-span-1"
          title="Evolução da Conformidade"
          description="Histórico de maturidade nos últimos 6 meses."
        >
          <div className="h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionSeries}>
                <defs>
                  <linearGradient id="compGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                  unit="%"
                  domain={[50, 100]}
                  width={38}
                />
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
                  dataKey="score"
                  stroke="var(--color-success)"
                  strokeWidth={2.5}
                  fill="url(#compGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Active Controls Table / List */}
        <Panel
          className="lg:col-span-2"
          title="Controles de Proteção de Dados"
          description="Clique em qualquer controle para visualizar os detalhes legais e a ação recomendada."
        >
          <div className="space-y-3">
            {controlsData.map((control) => (
              <div
                key={control.id}
                onClick={() => setSelectedControl(control)}
                className="rounded-xl border border-border/80 bg-background/50 p-4 transition-all hover:border-primary/50 hover:bg-secondary/20 cursor-pointer text-left space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">{control.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {control.article}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Responsável: {control.owner} · Categoria: {control.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold">{control.progress}%</span>
                    <span
                      className={`text-[10px] font-bold rounded px-2 py-0.5 uppercase ${
                        control.status === "concluido"
                          ? "bg-success/15 text-success"
                          : control.status === "em_andamento"
                            ? "bg-warning/15 text-warning"
                            : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {control.status === "concluido"
                        ? "Concluído"
                        : control.status === "em_andamento"
                          ? "Em Andamento"
                          : "Crítico"}
                    </span>
                  </div>
                </div>

                <Progress value={control.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Control Detail Dialog */}
      <Dialog open={!!selectedControl} onOpenChange={(open) => !open && setSelectedControl(null)}>
        <DialogContent className="max-w-xl text-left">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <DialogTitle className="text-base">{selectedControl?.name}</DialogTitle>
            </div>
            <DialogDescription>
              {selectedControl?.id} · {selectedControl?.article} · Responsável:{" "}
              {selectedControl?.owner}
            </DialogDescription>
          </DialogHeader>

          {selectedControl && (
            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-lg bg-secondary/40 p-3.5 space-y-1">
                <p className="font-semibold text-foreground">Descrição do Controle:</p>
                <p className="text-muted-foreground">{selectedControl.description}</p>
              </div>

              <div className="rounded-lg border border-border p-3.5 space-y-1">
                <p className="font-semibold text-foreground">Diagnóstico de Risco:</p>
                <p className="text-muted-foreground">{selectedControl.risk}</p>
              </div>

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3.5 space-y-1">
                <p className="font-semibold text-primary">Ação Recomendada pelo PRISMA ONE:</p>
                <p className="text-foreground">{selectedControl.action}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setSelectedControl(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Generation Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck2 className="size-5 text-primary" />
              Emitir Laudo de Conformidade LGPD
            </DialogTitle>
            <DialogDescription>
              Gere o documento oficial consolidado contendo evidências técnicas, status dos
              controles e assinatura digital do DPO.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs text-muted-foreground">
            <div className="rounded-lg border border-border p-3 space-y-1.5 bg-secondary/30">
              <p className="font-semibold text-foreground">Resumo do Laudo:</p>
              <p>• Score Geral: 98% de Conformidade</p>
              <p>• Total de Controles: 24 aprovados, 2 com ações de melhoria</p>
              <p>• Padrão Normativo: ANPD / ISO 27701</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReportModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDownloadReport} className="gap-1.5 font-semibold">
              <Download className="size-4" /> Baixar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
