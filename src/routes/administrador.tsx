import { createFileRoute } from "@tanstack/react-router";
import { Users, Shield, Settings as SettingsIcon, Key, Lock, UserCog, Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";

import { PageShell, Panel } from "@/components/prisma/PageShell";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/administrador")({
  head: () => ({
    meta: [
      { title: "Prisma One — Administração" },
      {
        name: "description",
        content: "Gerenciamento de usuários, permissões e configurações do sistema.",
      },
    ],
  }),
  component: Administrador,
});

const initialUsers = [
  { id: 1, name: "Admin Principal", email: "admin@empresa.com", role: "Super Admin", status: "Ativo", lastAccess: "12/08/2026 15:30" },
  { id: 2, name: "Maria Silva", email: "maria.silva@empresa.com", role: "DPO", status: "Ativo", lastAccess: "12/08/2026 14:22" },
  { id: 3, name: "João Santos", email: "joao.santos@empresa.com", role: "Analista de Segurança", status: "Ativo", lastAccess: "12/08/2026 11:45" },
  { id: 4, name: "Ana Costa", email: "ana.costa@empresa.com", role: "Auditor", status: "Inativo", lastAccess: "10/08/2026 09:15" },
  { id: 5, name: "Pedro Lima", email: "pedro.lima@empresa.com", role: "Visualizador", status: "Ativo", lastAccess: "12/08/2026 16:05" },
];

const roles = ["Super Admin", "DPO", "Analista de Segurança", "Auditor", "Visualizador"];

const systemStats = [
  { label: "Usuários Ativos", value: "4", icon: Users },
  { label: "Permissões Configuradas", value: "23", icon: Shield },
  { label: "Chaves de API", value: "7", icon: Key },
  { label: "Sessões Ativas", value: "12", icon: Lock },
];

function Administrador() {
  const [users, setUsers] = useState(initialUsers);
  const [systemStats, setSystemStats] = useState([
    { label: "Usuários Ativos", value: "4", icon: Users },
    { label: "Permissões Configuradas", value: "23", icon: Shield },
    { label: "Chaves de API", value: "7", icon: Key },
    { label: "Sessões Ativas", value: "12", icon: Lock },
  ]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{ id?: number; name: string; email: string; role: string; status: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddUser = () => {
    setEditingUser({ name: "", email: "", role: "Visualizador", status: "Ativo" });
    setIsEditMode(false);
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: typeof initialUsers[0]) => {
    setEditingUser({ ...user });
    setIsEditMode(true);
    setIsUserDialogOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
    setSystemStats([
      { ...systemStats[0], value: String(users.filter(u => u.id !== userId && u.status === "Ativo").length) },
      ...systemStats.slice(1),
    ]);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    
    if (isEditMode && editingUser.id) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser, lastAccess: u.lastAccess } : u));
    } else {
      const newUser = {
        ...editingUser,
        id: Math.max(...users.map(u => u.id)) + 1,
        lastAccess: "-",
      };
      setUsers([...users, newUser]);
      setSystemStats([
        { ...systemStats[0], value: String(users.filter(u => u.status === "Ativo").length + 1) },
        ...systemStats.slice(1),
      ]);
    }
    setIsUserDialogOpen(false);
    setEditingUser(null);
  };

  return (
    <PageShell
      title="Administração"
      subtitle="Gerenciamento de usuários, permissões e configurações do sistema."
    >
      <div className="grid gap-5 lg:grid-cols-4">
        {systemStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Panel key={i} className="text-center">
              <Icon className="mx-auto size-6 text-primary-glow" />
              <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </Panel>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Gerenciamento de Usuários" description="Adicione, edite e gerencie permissões de usuários.">
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground"
                    style={{ backgroundImage: "var(--gradient-primary)" }}
                  >
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-medium">{user.role}</p>
                    <p className={`text-[11px] ${user.status === "Ativo" ? "text-success" : "text-muted-foreground"}`}>
                      {user.status}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/20 hover:text-primary-glow transition-colors"
                      title="Editar"
                    >
                      <Edit className="size-3" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={handleAddUser}
            className="mt-4 flex items-center justify-center gap-2 w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary-glow hover:bg-primary/10 transition-colors"
          >
            <Plus className="size-4" />
            Adicionar Novo Usuário
          </button>
        </Panel>

        <Panel title="Controles de Acesso" description="Configure permissões e políticas de acesso ao sistema.">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <UserCog className="size-5 text-primary-glow" />
                <div>
                  <p className="text-sm font-medium">Autenticação de Dois Fatores</p>
                  <p className="text-xs text-muted-foreground">2FA obrigatório para administradores</p>
                </div>
              </div>
              <div className="flex size-5 items-center justify-center rounded-full bg-success">
                <div className="size-2 rounded-full bg-success-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-primary-glow" />
                <div>
                  <p className="text-sm font-medium">Sessão Única</p>
                  <p className="text-xs text-muted-foreground">Apenas uma sessão por usuário</p>
                </div>
              </div>
              <div className="flex size-5 items-center justify-center rounded-full bg-success">
                <div className="size-2 rounded-full bg-success-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Key className="size-5 text-primary-glow" />
                <div>
                  <p className="text-sm font-medium">Rotação de Chaves API</p>
                  <p className="text-xs text-muted-foreground">Renovação automática a cada 90 dias</p>
                </div>
              </div>
              <div className="flex size-5 items-center justify-center rounded-full bg-warning">
                <div className="size-2 rounded-full bg-warning-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Lock className="size-5 text-primary-glow" />
                <div>
                  <p className="text-sm font-medium">Log de Auditoria</p>
                  <p className="text-xs text-muted-foreground">Registro completo de ações</p>
                </div>
              </div>
              <div className="flex size-5 items-center justify-center rounded-full bg-success">
                <div className="size-2 rounded-full bg-success-foreground" />
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Configurações do Sistema"
        description="Parâmetros globais e configurações de infraestrutura."
        className="mt-5"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <SettingsIcon className="mb-2 size-5 text-primary-glow" />
            <p className="text-sm font-medium">Backup Automático</p>
            <p className="mt-1 text-xs text-muted-foreground">Diário às 02:00 UTC</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Shield className="mb-2 size-5 text-primary-glow" />
            <p className="text-sm font-medium">Criptografia</p>
            <p className="mt-1 text-xs text-muted-foreground">AES-256 em repouso</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <Users className="mb-2 size-5 text-primary-glow" />
            <p className="text-sm font-medium">Limite de Usuários</p>
            <p className="mt-1 text-xs text-muted-foreground">50/100 utilizados</p>
          </div>
        </div>
      </Panel>

      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Editar Usuário" : "Adicionar Novo Usuário"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Atualize as informações do usuário." : "Preencha os dados para criar um novo usuário."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user-name">Nome</Label>
              <Input
                id="user-name"
                value={editingUser?.name || ""}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value } as any)}
                placeholder="Nome completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={editingUser?.email || ""}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value } as any)}
                placeholder="email@empresa.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-role">Função</Label>
              <Select value={editingUser?.role || "Visualizador"} onValueChange={(value) => setEditingUser({ ...editingUser, role: value } as any)}>
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-status">Status</Label>
              <Select value={editingUser?.status || "Ativo"} onValueChange={(value) => setEditingUser({ ...editingUser, status: value } as any)}>
                <SelectTrigger id="user-status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser} disabled={!editingUser?.name || !editingUser?.email}>
              {isEditMode ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
