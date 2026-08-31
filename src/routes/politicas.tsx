import { createFileRoute } from "@tanstack/react-router";
import { Plus, ScrollText, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialPolicies = [
  { id: 1, name: "Política de Dados Pessoais", updated: "12/05/2024", version: "v4.2", status: "Vigente", description: "Define as diretrizes para tratamento de dados pessoais." },
  { id: 2, name: "Política de IA Responsável", updated: "08/05/2024", version: "v2.0", status: "Vigente", description: "Estabelece princípios éticos para uso de IA." },
  { id: 3, name: "Política de Retenção de Dados", updated: "01/05/2024", version: "v3.1", status: "Vigente", description: "Define prazos e critérios para retenção de dados." },
  {
    id: 4,
    name: "Política de Compartilhamento",
    updated: "28/04/2024",
    version: "v1.8",
    status: "Revisão em breve",
    description: "Regras para compartilhamento de dados com terceiros."
  },
];

export const Route = createFileRoute("/politicas")({
  head: () => ({
    meta: [
      { title: "Políticas de Privacidade — Prisma One" },
      {
        name: "description",
        content: "Documentação organizada, controle de versões e status de cada política.",
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

function PoliticasPage() {
  const [policies, setPolicies] = useState(initialPolicies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<{ id?: number; name: string; description: string; status: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddPolicy = () => {
    setEditingPolicy({ name: "", description: "", status: "Revisão em breve" });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditPolicy = (policy: typeof initialPolicies[0]) => {
    setEditingPolicy({ ...policy });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeletePolicy = (policyId: number) => {
    setPolicies(policies.filter(p => p.id !== policyId));
  };

  const handleSavePolicy = () => {
    if (!editingPolicy) return;
    
    if (isEditMode && editingPolicy.id) {
      setPolicies(policies.map(p => p.id === editingPolicy.id ? { ...editingPolicy, version: p.version, updated: p.updated } : p));
    } else {
      const newPolicy = {
        ...editingPolicy,
        id: Math.max(...policies.map(p => p.id)) + 1,
        version: "v1.0",
        updated: new Date().toLocaleDateString('pt-BR'),
      };
      setPolicies([...policies, newPolicy]);
    }
    setIsDialogOpen(false);
    setEditingPolicy(null);
  };

  return (
    <PageShell
      title="Políticas de Privacidade"
      subtitle="Tudo documentado, versionado e pronto para auditoria."
      actions={
        <Button onClick={handleAddPolicy} className="gap-2">
          <Plus className="size-4" /> Nova política
        </Button>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        {policies.map((p) => (
          <Panel key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent">
                  <ScrollText className="size-5 text-primary-glow" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Atualizada em {p.updated} · {p.version}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                    p.status === "Vigente"
                      ? "border-success/40 bg-success/15 text-success"
                      : "border-warning/40 bg-warning/15 text-warning"
                  }`}
                >
                  {p.status}
                </span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleEditPolicy(p)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/20 hover:text-primary-glow transition-colors"
                    title="Editar"
                  >
                    <Edit className="size-3" />
                  </button>
                  <button 
                    onClick={() => handleDeletePolicy(p.id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm">
                Ver versões
              </Button>
            </div>
          </Panel>
        ))}
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        {policies.length} políticas ativas · 100% alinhadas à LGPD
      </p>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Editar Política" : "Nova Política"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Atualize as informações da política." : "Crie uma nova política de privacidade."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="policy-name">Nome da Política</Label>
              <Input
                id="policy-name"
                value={editingPolicy?.name || ""}
                onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value } as any)}
                placeholder="Ex: Política de Dados Pessoais"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="policy-description">Descrição</Label>
              <Textarea
                id="policy-description"
                value={editingPolicy?.description || ""}
                onChange={(e) => setEditingPolicy({ ...editingPolicy, description: e.target.value } as any)}
                placeholder="Descreva o objetivo e escopo da política..."
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="policy-status">Status</Label>
              <Select value={editingPolicy?.status || "Revisão em breve"} onValueChange={(value) => setEditingPolicy({ ...editingPolicy, status: value } as any)}>
                <SelectTrigger id="policy-status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vigente">Vigente</SelectItem>
                  <SelectItem value="Revisão em breve">Revisão em breve</SelectItem>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePolicy} disabled={!editingPolicy?.name}>
              {isEditMode ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}