import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Plus, FileCheck2, Eye, Calendar, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios e Laudos — PRISMA ONE" },
      {
        name: "description",
        content:
          "Gere relatórios executivos de conformidade LGPD, auditoria de IA e registros de incidentes.",
      },
      { property: "og:title", content: "Relatórios e Laudos — PRISMA ONE" },
      {
        property: "og:description",
        content: "Documentação probatória para diretoria, auditorias e fiscalizações regulatórias.",
      },
    ],
  }),
  component: RelatoriosPage,
});

type ReportItem = {
  id: string;
  name: string;
  period: string;
  type: "Diretoria" | "Regulatório ANPD" | "Auditoria de IA" | "Interno";
  pages: number;
  description: string;
  norm: string;
};

const initialReports: ReportItem[] = [
  {
    id: "REP-01",
    name: "Relatório de Conformidade LGPD & Governança",
    period: "Agosto/2026",
    type: "Diretoria",
    pages: 28,
    description:
      "Consolidado de maturidade dos 26 controles essenciais, gap analysis e plano de ação.",
    norm: "LGPD Art. 50 / ISO 27701",
  },
  {
    id: "REP-02",
    name: "Laudo de Auditoria Ética e Viés em IA",
    period: "Agosto/2026",
    type: "Auditoria de IA",
    pages: 22,
    description:
      "Avaliação técnica de 12 modelos em produção quanto à equidade, vazamento e explicabilidade.",
    norm: "Marco Legal da IA / NIST AI RMF",
  },
  {
    id: "REP-03",
    name: "Relatório de Impacto à Proteção de Dados (RIPD / DPIA)",
    period: "Julho/2026",
    type: "Regulatório ANPD",
    pages: 34,
    description: "Documento oficial para operações de tratamento de alto risco e dados sensíveis.",
    norm: "LGPD Art. 38",
  },
  {
    id: "REP-04",
    name: "Inventário de Dados Pessoais e Fluxos (ROPA)",
    period: "Julho/2026",
    type: "Interno",
    pages: 42,
    description:
      "Mapeamento completo de sistemas, bases legais, operadores e períodos de retenção.",
    norm: "LGPD Art. 37",
  },
];

function RelatoriosPage() {
  const [reportsList, setReportsList] = useState<ReportItem[]>(initialReports);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ReportItem["type"]>("Diretoria");

  const handleDownload = (name: string) => {
    toast.success(`Download iniciado: ${name}.pdf`);
  };

  const handleCreateReport = () => {
    if (!newTitle.trim()) {
      toast.error("Informe o título do relatório.");
      return;
    }

    const report: ReportItem = {
      id: `REP-${String(reportsList.length + 1).padStart(2, "0")}`,
      name: newTitle.trim(),
      period: "Agosto/2026",
      type: newType,
      pages: Math.floor(Math.random() * 15) + 10,
      description: "Relatório customizado gerado a partir dos dados do PRISMA ONE.",
      norm: "ANPD / LGPD",
    };

    setReportsList([report, ...reportsList]);
    setNewTitle("");
    setIsNewModalOpen(false);
    toast.success("Novo relatório gerado com sucesso!");
  };

  return (
    <PageShell
      title="Relatórios e Evidências"
      subtitle="Documentação probatória para a diretoria, DPO e fiscalizações regulatórias."
      actions={
        <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-semibold shadow-xs">
              <Plus className="size-4" /> Novo Relatório
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md text-left">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileCheck2 className="size-5 text-primary" />
                Gerar Novo Relatório no PRISMA ONE
              </DialogTitle>
              <DialogDescription>
                Selecione o escopo e o tipo de relatório desejado.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="report-title">Título do Documento</Label>
                <Input
                  id="report-title"
                  placeholder="Ex: Auditoria Trimestral de Segurança e IA"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="report-type">Tipo de Relatório</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as ReportItem["type"])}>
                  <SelectTrigger id="report-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diretoria">Relatório Executivo para Diretoria</SelectItem>
                    <SelectItem value="Regulatório ANPD">Laudo Regulatório ANPD</SelectItem>
                    <SelectItem value="Auditoria de IA">Auditoria de IA & Viés</SelectItem>
                    <SelectItem value="Interno">Inventário Interno (ROPA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsNewModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateReport}>Gerar Documento</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-5 md:grid-cols-2 text-left">
        {reportsList.map((r) => (
          <Panel key={r.id} className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.period} · {r.pages} páginas · Padrão: {r.norm}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {r.type}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] font-medium text-success flex items-center gap-1">
                <Sparkles className="size-3" /> Assinado Digitalmente
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDownload(r.name)}
                className="gap-1.5 text-xs h-8 font-medium shadow-2xs"
              >
                <Download className="size-3.5" /> Baixar PDF
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
