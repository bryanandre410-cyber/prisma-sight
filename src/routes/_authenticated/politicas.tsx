import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, ScrollText, Eye, Trash2, Edit, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { policies } from "@/lib/prisma-data";
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

export const Route = createFileRoute("/_authenticated/politicas")({
  head: () => ({
    meta: [
      { title: "Políticas de Privacidade — PRISMA ONE" },
      {
        name: "description",
        content: "Crie, versione e acompanhe as políticas de privacidade ativas da sua empresa.",
      },
      { property: "og:title", content: "Políticas de Privacidade — PRISMA ONE" },
      {
        property: "og:description",
        content:
          "Documentação organizada, controle de versões e status de cada política corporativa.",
      },
    ],
  }),
  component: PoliticasPage,
});

interface Policy {
  name: string;
  updated: string;
  version: string;
  status: "Vigente" | "Revisão em breve";
  content?: string;
}

const versionsData: Record<string, { version: string; date: string; changes: string }[]> = {
  "Política de Dados Pessoais": [
    {
      version: "v4.2",
      date: "12/05/2026",
      changes: "Adicionada seção sobre IA generativa e transferências internacionais",
    },
    {
      version: "v4.1",
      date: "01/03/2026",
      changes: "Atualização das bases legais de marketing e consentimento",
    },
    {
      version: "v4.0",
      date: "15/01/2026",
      changes: "Revisão completa da política alinhada à ANPD",
    },
  ],
  "Política de IA Responsável": [
    {
      version: "v2.0",
      date: "08/05/2026",
      changes: "Novos critérios de mitigação de viés algorítmico e auditoria contínua",
    },
    {
      version: "v1.5",
      date: "20/02/2026",
      changes: "Adicionada seção de transparência de prompts",
    },
  ],
};

function PoliticasPage() {
  const [policyList, setPolicyList] = useState<Policy[]>(policies as Policy[]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isVersionsDialogOpen, setIsVersionsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [selectedPolicyForVersions, setSelectedPolicyForVersions] = useState<string | null>(null);
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    content: "",
    status: "Vigente" as "Vigente" | "Revisão em breve",
  });

  const handleAddPolicy = () => {
    if (!newPolicy.name.trim()) {
      toast.error("Informe o nome da política.");
      return;
    }

    const policy: Policy = {
      name: newPolicy.name.trim(),
      updated: new Date().toLocaleDateString("pt-BR"),
      version: "v1.0",
      status: newPolicy.status,
      content:
        newPolicy.content.trim() ||
        "Diretrizes e normas de privacidade estabelecidas para a organização.",
    };

    setPolicyList([policy, ...policyList]);
    setNewPolicy({ name: "", content: "", status: "Vigente" });
    setIsAddDialogOpen(false);
    toast.success("Nova política de privacidade criada com sucesso!");
  };

  const handleEditPolicy = () => {
    if (!editingPolicy) return;

    setPolicyList(
      policyList.map((p) =>
        p.name === editingPolicy.name
          ? { ...editingPolicy, updated: new Date().toLocaleDateString("pt-BR") }
          : p,
      ),
    );
    setIsEditDialogOpen(false);
    setEditingPolicy(null);
    toast.success("Política atualizada e versionada com sucesso!");
  };

  const handleDeletePolicy = (name: string) => {
    setPolicyList(policyList.filter((p) => p.name !== name));
    toast.info("Política removida da base ativa.");
  };

  const openVersionsDialog = (policyName: string) => {
    setSelectedPolicyForVersions(policyName);
    setIsVersionsDialogOpen(true);
  };

  const openEditDialog = (policy: Policy) => {
    setEditingPolicy(policy);
    setIsEditDialogOpen(true);
  };

  return (
    <PageShell
      title="Políticas de Privacidade"
      subtitle="Documentação estruturada, controle de versionamento e evidências para auditoria."
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-semibold shadow-xs">
              <Plus className="size-4" /> Nova Política
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl text-left">
            <DialogHeader>
              <DialogTitle>Criar Nova Política de Privacidade</DialogTitle>
              <DialogDescription>
                Adicione um novo documento normativo ao acervo corporativo do PRISMA ONE.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-3 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="policy-name">Título da Política</Label>
                <Input
                  id="policy-name"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  placeholder="Ex: Política de Cookies e Rastreamento"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="policy-content">Diretrizes e Conteúdo</Label>
                <Textarea
                  id="policy-content"
                  value={newPolicy.content}
                  onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                  placeholder="Descreva os objetivos, base legal e escopo da política..."
                  rows={5}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="policy-status">Status de Vigência</Label>
                <Select
                  value={newPolicy.status}
                  onValueChange={(value: "Vigente" | "Revisão em breve") =>
                    setNewPolicy({ ...newPolicy, status: value })
                  }
                >
                  <SelectTrigger id="policy-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vigente">Vigente</SelectItem>
                    <SelectItem value="Revisão em breve">Revisão em breve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddPolicy}>Publicar Política</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-5 md:grid-cols-2 text-left">
        {policyList.map((p) => (
          <Panel key={p.name} className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <ScrollText className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Atualizada em {p.updated} · Versão {p.version}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-md border px-2.5 py-0.5 text-[11px] font-bold ${
                    p.status === "Vigente"
                      ? "border-success/40 bg-success/15 text-success"
                      : "border-warning/40 bg-warning/15 text-warning"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">
                {p.content ||
                  "Normas de privacidade e tratamento de dados pessoais conforme a LGPD."}
              </p>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openVersionsDialog(p.name)}
                className="h-8 text-xs gap-1.5"
              >
                <Eye className="size-3.5" /> Histórico de Versões
              </Button>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(p)}
                  className="h-8 text-xs"
                >
                  <Edit className="size-3.5 mr-1" /> Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePolicy(p.name)}
                  className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-left">
        {policyList.length} políticas ativas · 100% alinhadas às diretrizes da ANPD e LGPD
      </p>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl text-left">
          <DialogHeader>
            <DialogTitle>Editar e Versionar Política</DialogTitle>
            <DialogDescription>
              Atualize o conteúdo. O sistema registrará uma nova versão para histórico de auditoria.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="edit-policy-name">Nome da Política</Label>
              <Input
                id="edit-policy-name"
                value={editingPolicy?.name || ""}
                onChange={(e) =>
                  setEditingPolicy(
                    editingPolicy ? { ...editingPolicy, name: e.target.value } : null,
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-policy-content">Conteúdo da Política</Label>
              <Textarea
                id="edit-policy-content"
                value={editingPolicy?.content || ""}
                onChange={(e) =>
                  setEditingPolicy(
                    editingPolicy ? { ...editingPolicy, content: e.target.value } : null,
                  )
                }
                rows={6}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-policy-status">Status</Label>
              <Select
                value={editingPolicy?.status || "Vigente"}
                onValueChange={(value: "Vigente" | "Revisão em breve") =>
                  setEditingPolicy(editingPolicy ? { ...editingPolicy, status: value } : null)
                }
              >
                <SelectTrigger id="edit-policy-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vigente">Vigente</SelectItem>
                  <SelectItem value="Revisão em breve">Revisão em breve</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditPolicy}>Salvar Nova Versão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Versions History Dialog */}
      <Dialog open={isVersionsDialogOpen} onOpenChange={setIsVersionsDialogOpen}>
        <DialogContent className="max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScrollText className="size-5 text-primary" />
              Histórico de Versões
            </DialogTitle>
            <DialogDescription>{selectedPolicyForVersions}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            {selectedPolicyForVersions && versionsData[selectedPolicyForVersions] ? (
              versionsData[selectedPolicyForVersions].map((v) => (
                <div
                  key={v.version}
                  className="rounded-xl border border-border/80 bg-background/50 p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{v.version}</span>
                    <span className="text-muted-foreground">{v.date}</span>
                  </div>
                  <p className="text-muted-foreground">{v.changes}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Versão inicial v1.0 publicada. Nenhuma alteração anterior registrada.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsVersionsDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
