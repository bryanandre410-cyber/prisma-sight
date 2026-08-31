import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  Eye,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { PageShell, Panel, SeverityPill } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/alertas")({
  head: () => ({
    meta: [
      { title: "Alertas e Riscos — PRISMA ONE" },
      {
        name: "description",
        content:
          "Monitoramento e fila de resposta a incidentes, vazamentos e riscos de privacidade e IA.",
      },
      { property: "og:title", content: "Alertas e Riscos — PRISMA ONE" },
      {
        property: "og:description",
        content: "Gestão centralizada de riscos priorizados com ações corretivas imediatas.",
      },
    ],
  }),
  component: AlertasPage,
});

export type RiskItem = {
  id: string;
  title: string;
  origin: string;
  context: string;
  date: string;
  time: string;
  assignee: string;
  severity: "alto" | "medio" | "baixo";
  status: "pendente" | "reconhecido" | "resolvido";
  action: string;
  description: string;
};

const initialAlerts: RiskItem[] = [
  {
    id: "RSK-1042",
    title: "Acesso excessivo a dados sensíveis fora do horário comercial",
    origin: "API de Clientes / Base Financeira",
    context: "Departamento Financeiro · IP 189.44.21.90",
    date: "31/08/2026",
    time: "15:24",
    assignee: "Roberto Costa (Segurança)",
    severity: "alto",
    status: "pendente",
    action: "Revogar sessão do usuário, acionar 2FA obrigatório e auditar logs de exportação.",
    description:
      "Conta administrativa realizou download de 4.500 registros contendo dados de faturamento e CPF às 02:40 da manhã.",
  },
  {
    id: "RSK-1041",
    title: "Modelo de IA consumindo dados cadastrais sem anonimização",
    origin: "Pipeline de Treinamento LLM",
    context: "Marketing AI Campaign",
    date: "31/08/2026",
    time: "14:08",
    assignee: "Marina Santos (Auditoria)",
    severity: "medio",
    status: "pendente",
    action:
      "Aplicar pseudonimização com k-anonymity antes de executar a próxima etapa de fine-tuning.",
    description:
      "Dataset de treinamento contém e-mails e nomes completos de clientes que não concederam consentimento para fins de IA.",
  },
  {
    id: "RSK-1040",
    title: "Compartilhamento externo de documento confidencial",
    origin: "Google Workspace / Drive Corporativo",
    context: "Contrato_Confidencial_Operador.pdf",
    date: "31/08/2026",
    time: "13:47",
    assignee: "Ana Rodrigues (DPO)",
    severity: "baixo",
    status: "reconhecido",
    action: "Validar se o destinatário externo possui acordo de confidencialidade (NDA) vigente.",
    description: "Link público de visualização ativado para arquivo com dados de terceiros.",
  },
  {
    id: "RSK-1039",
    title: "Tentativa de injeção e força bruta na rota de autenticação",
    origin: "WAF / Gateway de APIs",
    context: "Rota /api/v1/auth/token · 128 tentativas/min",
    date: "30/08/2026",
    time: "22:15",
    assignee: "Roberto Costa (Segurança)",
    severity: "alto",
    status: "resolvido",
    action: "Bloqueio automático de IP via Cloudflare e fortalecimento de rate limiting.",
    description:
      "IPs suspeitos tentaram adivinhar senhas de contas de operadores. Nenhuma credencial foi comprometida.",
  },
  {
    id: "RSK-1038",
    title: "Retenção de currículos acima do prazo limite da política",
    origin: "RH Cloud Storage",
    context: "Base de Candidatos 2023",
    date: "30/08/2026",
    time: "09:30",
    assignee: "Carlos Silva (Admin)",
    severity: "medio",
    status: "pendente",
    action:
      "Executar script de expurgo automatizado para candidatos reprovados há mais de 24 meses.",
    description:
      "Foram identificados 1.200 currículos em repouso sem finalidade ativa de processo seletivo.",
  },
];

function AlertasPage() {
  const [alertList, setAlertList] = useState<RiskItem[]>(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<RiskItem | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = alertList.filter((alert) => {
    if (severityFilter !== "todos" && alert.severity !== severityFilter) return false;
    if (statusFilter !== "todos" && alert.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.context.toLowerCase().includes(q) ||
        alert.origin.toLowerCase().includes(q) ||
        alert.assignee.toLowerCase().includes(q) ||
        alert.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    alto: alertList.filter((a) => a.severity === "alto" && a.status === "pendente").length,
    medio: alertList.filter((a) => a.severity === "medio" && a.status === "pendente").length,
    baixo: alertList.filter((a) => a.severity === "baixo" && a.status === "pendente").length,
    resolvidos: alertList.filter((a) => a.status === "resolvido").length,
  };

  const handleResolveAlert = (id: string) => {
    setAlertList(alertList.map((a) => (a.id === id ? { ...a, status: "resolvido" } : a)));
    setSelectedAlert(null);
    toast.success("Risco marcado como resolvido.");
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlertList(alertList.map((a) => (a.id === id ? { ...a, status: "reconhecido" } : a)));
    setSelectedAlert(null);
    toast.info("Risco reconhecido e atribuído à equipe.");
  };

  const handleReopenAlert = (id: string) => {
    setAlertList(alertList.map((a) => (a.id === id ? { ...a, status: "pendente" } : a)));
    setSelectedAlert(null);
    toast.warning("Risco reaberto para acompanhamento.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolvido":
        return "bg-success/15 text-success border-success/40";
      case "reconhecido":
        return "bg-info/15 text-info border-info/40";
      default:
        return "bg-warning/15 text-warning border-warning/40";
    }
  };

  return (
    <PageShell
      title="Alertas e Monitoramento de Riscos"
      subtitle="Fila de resposta a incidentes com classificação por gravidade e ações corretivas."
    >
      {/* Risk Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">Gravidade Alta</p>
          <p className="mt-2 text-3xl font-bold text-destructive">{counts.alto}</p>
          <p className="mt-1 text-xs text-destructive font-medium">Requer ação imediata</p>
        </Panel>

        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">Gravidade Média</p>
          <p className="mt-2 text-3xl font-bold text-warning">{counts.medio}</p>
          <p className="mt-1 text-xs text-muted-foreground">Em análise</p>
        </Panel>

        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">Gravidade Baixa</p>
          <p className="mt-2 text-3xl font-bold text-info">{counts.baixo}</p>
          <p className="mt-1 text-xs text-muted-foreground">Boas práticas</p>
        </Panel>

        <Panel className="text-center">
          <p className="text-xs text-muted-foreground uppercase font-medium">Resolvidos</p>
          <p className="mt-2 text-3xl font-bold text-success">{counts.resolvidos}</p>
          <p className="mt-1 text-xs text-success font-medium">Mitigados com sucesso</p>
        </Panel>
      </div>

      {/* Filters and Search Bar */}
      <Panel className="mt-5 text-left" title="Filtros e Busca de Incidentes">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, origem ou responsável..."
              className="pl-9 h-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0 font-medium">Gravidade:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
            >
              <option value="todos">Todas as Gravidades</option>
              <option value="alto">Alta</option>
              <option value="medio">Média</option>
              <option value="baixo">Baixa</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs"
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="reconhecido">Reconhecido</option>
              <option value="resolvido">Resolvido</option>
            </select>
          </div>
        </div>
      </Panel>

      {/* Alerts List */}
      <Panel
        className="mt-5 text-left"
        title={`Fila de Riscos (${filteredAlerts.length})`}
        description="Ordenados por data e nível de criticidade."
      >
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-xs">
            Nenhum risco encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl border border-border/80 bg-background/50 p-4 transition-all hover:border-primary/50 text-left space-y-3 ${
                  alert.status === "resolvido" ? "opacity-70 bg-muted/20" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                      <AlertTriangle className="size-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{alert.title}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {alert.id}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Origem: <strong className="text-foreground">{alert.origin}</strong> ·
                        Contexto: {alert.context}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span>
                          Data: {alert.date} às {alert.time}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="size-3" /> {alert.assignee}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <SeverityPill severity={alert.severity} />
                    <span
                      className={`text-[10px] rounded border px-2 py-0.5 font-bold uppercase ${getStatusBadge(
                        alert.status,
                      )}`}
                    >
                      {alert.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAlert(alert)}
                      className="text-xs h-8"
                    >
                      <Eye className="size-3.5 mr-1" /> Detalhes
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/40 p-2.5 text-xs text-foreground flex items-center justify-between gap-2">
                  <p>
                    <strong className="text-primary">Ação Corretiva:</strong> {alert.action}
                  </p>
                  <div className="flex gap-1.5 shrink-0">
                    {alert.status === "pendente" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        Reconhecer
                      </Button>
                    )}
                    {alert.status !== "resolvido" && (
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        Resolver
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Alert Detail Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        <DialogContent className="max-w-lg text-left">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              <DialogTitle className="text-base">{selectedAlert?.title}</DialogTitle>
            </div>
            <DialogDescription>
              ID: {selectedAlert?.id} · Data: {selectedAlert?.date} às {selectedAlert?.time}
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3 bg-secondary/30">
                  <p className="text-muted-foreground">Origem do Risco</p>
                  <p className="font-semibold text-foreground mt-0.5">{selectedAlert.origin}</p>
                </div>
                <div className="rounded-lg border border-border p-3 bg-secondary/30">
                  <p className="text-muted-foreground">Responsável Designado</p>
                  <p className="font-semibold text-foreground mt-0.5">{selectedAlert.assignee}</p>
                </div>
              </div>

              <div className="rounded-lg bg-secondary/40 p-3.5 space-y-1">
                <p className="font-semibold text-foreground">Descrição Técnica do Incidente:</p>
                <p className="text-muted-foreground">{selectedAlert.description}</p>
              </div>

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3.5 space-y-1">
                <p className="font-semibold text-primary">Plano de Ação Corretiva Recomendado:</p>
                <p className="text-foreground">{selectedAlert.action}</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {selectedAlert?.status === "pendente" && (
              <Button
                variant="outline"
                onClick={() => selectedAlert && handleAcknowledgeAlert(selectedAlert.id)}
              >
                Reconhecer Risco
              </Button>
            )}
            {selectedAlert?.status !== "resolvido" ? (
              <Button onClick={() => selectedAlert && handleResolveAlert(selectedAlert.id)}>
                Marcar como Resolvido
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => selectedAlert && handleReopenAlert(selectedAlert.id)}
              >
                Reabrir Risco
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
