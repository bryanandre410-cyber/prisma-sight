import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ScrollText, Eye, Trash2 } from "lucide-react";

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
      { title: "Políticas de Privacidade — Prisma One" },
      {
        name: "description",
        content: "Crie, versione e acompanhe as políticas de privacidade ativas da sua empresa.",
      },
      { property: "og:title", content: "Políticas de Privacidade — Prisma One" },
      {
        property: "og:description",
        content: "Documentação organizada, controle de versões e status de cada política.",
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
    { version: "v4.2", date: "12/05/2024", changes: "Adicionada seção sobre IA generativa" },
    { version: "v4.1", date: "01/03/2024", changes: "Atualização base legal LGPD" },
    { version: "v4.0", date: "15/01/2024", changes: "Revisão completa da política" },
  ],
  "Política de IA Responsável": [
    { version: "v2.0", date: "08/05/2024", changes: "Novos critérios de avaliação de viés" },
    { version: "v1.5", date: "20/02/2024", changes: "Adicionada seção de transparência" },
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
    if (!newPolicy.name || !newPolicy.content) return;

    const policy: Policy = {
      name: newPolicy.name,
      updated: new Date().toLocaleDateString("pt-BR"),
      version: "v1.0",
      status: newPolicy.status,
      content: newPolicy.content,
    };

    setPolicyList([...policyList, policy]);
    setNewPolicy({ name: "", content: "", status: "Vigente" });
    setIsAddDialogOpen(false);
  };

  const handleEditPolicy = () => {
    if (!editingPolicy) return;

    setPolicyList(
      policyList.map((p) =>
        p.name === editingPolicy.name
          ? { ...editingPolicy, updated: new Date().toLocaleDateString("pt-BR") }
          : p
      )
    );
    setIsEditDialogOpen(false);
    setEditingPolicy(null);
  };

  const handleDeletePolicy = (name: string) => {
    setPolicyList(policyList.filter((p) => p.name !== name));
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
      subtitle="Tudo documentado, versionado e pronto para auditoria."
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" /> Nova política
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Política</DialogTitle>
              <DialogDescription>
                Adicione uma nova política de privacidade ao sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="policy-name">Nome da política</Label>
                <Input
                  id="policy-name"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  placeholder="Ex: Política de Cookies"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy-content">Conteúdo da política</Label>
                <Textarea
                  id="policy-content"
                  value={newPolicy.content}
                  onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                  placeholder="Descreva os objetivos e diretrizes da política..."
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy-status">Status inicial</Label>
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddPolicy}>Criar política</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        {policyList.map((p) => (
          <Panel key={p.name}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent">
                  <ScrollText className="size-5 text-primary-glow" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Atualizada em {p.updated} · {p.version}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                  p.status === "Vigente"
                    ? "border-success/40 bg-success/15 text-success"
                    : "border-warning/40 bg-warning/15 text-warning"
                }`}
              >
                {p.status}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => openVersionsDialog(p.name)}>
                <Eye className="size-3 mr-1" /> Ver versões
              </Button>
              <Button variant="ghost" size="sm" onClick={() => openEditDialog(p)}>
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePolicy(p.name)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3 mr-1" /> Excluir
              </Button>
            </div>
          </Panel>
        ))}
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        {policyList.length} políticas ativas · 100% alinhadas à LGPD
      </p>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Política</DialogTitle>
            <DialogDescription>
              Altere o conteúdo e status da política.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-policy-name">Nome da política</Label>
              <Input
                id="edit-policy-name"
                value={editingPolicy?.name || ""}
                onChange={(e) =>
                  setEditingPolicy(editingPolicy ? { ...editingPolicy, name: e.target.value } : null)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-policy-content">Conteúdo da política</Label>
              <Textarea
                id="edit-policy-content"
                value={editingPolicy?.content || ""}
                onChange={(e) =>
                  setEditingPolicy(editingPolicy ? { ...editingPolicy, content: e.target.value } : null)
                }
                rows={6}
              />
            </div>
            <div className="space-y-2">
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditPolicy}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isVersionsDialogOpen} onOpenChange={setIsVersionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de Versões</DialogTitle>
            <DialogDescription>
              {selectedPolicyForVersions}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {selectedPolicyForVersions && versionsData[selectedPolicyForVersions] ? (
              versionsData[selectedPolicyForVersions].map((v) => (
                <div key={v.version} className="rounded-lg border border-border/70 bg-background/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{v.version}</span>
                    <span className="text-xs text-muted-foreground">{v.date}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{v.changes}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma versão anterior disponível.</p>
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