import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, Trash2, Edit, ShieldCheck, ShieldAlert, Shield } from "lucide-react";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";

type UserRole = "Administrador" | "DPO" | "Segurança" | "Auditoria" | "Visualizador";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ativo" | "inativo";
  lastAccess: string;
}

const rolePermissions: Record<UserRole, string[]> = {
  Administrador: ["Acesso total", "Gerenciar usuários", "Configurações", "Todos os relatórios"],
  DPO: ["Alertas", "Políticas", "Relatórios de conformidade", "Responder titulares"],
  Segurança: ["Monitoramento", "Incidentes", "Logs de acesso", "Relatórios de segurança"],
  Auditoria: ["Relatórios (somente leitura)", "Logs de auditoria", "Políticas (visualização)"],
  Visualizador: ["Dashboard (somente leitura)", "Relatórios básicos"],
};

const defaultUsers: User[] = [
  {
    id: "1",
    name: "Carlos Silva",
    email: "carlos.silva@empresa.com",
    role: "Administrador",
    status: "ativo",
    lastAccess: "Há 5 minutos",
  },
  {
    id: "2",
    name: "Ana Rodrigues",
    email: "ana.rodrigues@empresa.com",
    role: "DPO",
    status: "ativo",
    lastAccess: "Há 1 hora",
  },
  {
    id: "3",
    name: "Roberto Costa",
    email: "roberto.costa@empresa.com",
    role: "Segurança",
    status: "ativo",
    lastAccess: "Há 30 minutos",
  },
  {
    id: "4",
    name: "Marina Santos",
    email: "marina.santos@empresa.com",
    role: "Auditoria",
    status: "ativo",
    lastAccess: "Há 2 horas",
  },
  {
    id: "5",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.com",
    role: "Visualizador",
    status: "inativo",
    lastAccess: "Há 3 dias",
  },
];

export const Route = createFileRoute("/administracao")({
  head: () => ({
    meta: [
      { title: "Administração — Prisma One" },
      {
        name: "description",
        content: "Gerencie usuários, permissões e configurações de acesso à plataforma.",
      },
      { property: "og:title", content: "Administração — Prisma One" },
      {
        property: "og:description",
        content: "Controle completo de acesso e permissões do sistema.",
      },
    ],
  }),
  component: AdministracaoPage,
});

function AdministracaoPage() {
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Visualizador" as UserRole,
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;

    const user: User = {
      id: String(users.length + 1),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "ativo",
      lastAccess: "Nunca",
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "Visualizador" });
    setIsAddDialogOpen(false);
  };

  const handleEditUser = () => {
    if (!editingUser) return;

    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === "ativo" ? "inativo" : "ativo" } : u
      )
    );
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "Administrador":
        return ShieldCheck;
      case "DPO":
        return Shield;
      case "Segurança":
        return ShieldAlert;
      default:
        return Shield;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "Administrador":
        return "bg-destructive/15 text-destructive border-destructive/40";
      case "DPO":
        return "bg-primary/15 text-primary border-primary/40";
      case "Segurança":
        return "bg-warning/15 text-warning border-warning/40";
      case "Auditoria":
        return "bg-info/15 text-info border-info/40";
      default:
        return "bg-muted/15 text-muted-foreground border-muted/40";
    }
  };

  const userCounts = {
    total: users.length,
    ativos: users.filter((u) => u.status === "ativo").length,
    inativos: users.filter((u) => u.status === "inativo").length,
  };

  return (
    <PageShell
      title="Administração"
      subtitle="Gerencie usuários e permissões de acesso à plataforma."
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="size-4" /> Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo usuário no sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Ex: joao.silva@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="DPO">DPO</SelectItem>
                    <SelectItem value="Segurança">Segurança</SelectItem>
                    <SelectItem value="Auditoria">Auditoria</SelectItem>
                    <SelectItem value="Visualizador">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddUser}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-5 md:grid-cols-3">
        <Panel>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total de Usuários</p>
          <p className="mt-2 text-3xl font-semibold">{userCounts.total}</p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Usuários Ativos</p>
          <p className="mt-2 text-3xl font-semibold text-success">{userCounts.ativos}</p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Usuários Inativos</p>
          <p className="mt-2 text-3xl font-semibold text-muted-foreground">{userCounts.inativos}</p>
        </Panel>
      </div>

      <Panel className="mt-5" title="Usuários do Sistema" description="Gerencie permissões e status de acesso.">
        <div className="space-y-3">
          {users.map((user) => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <div
                key={user.id}
                className="rounded-xl border border-border/70 bg-background/40 p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-accent">
                      <RoleIcon className="size-5 text-primary-glow" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                          {user.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            user.status === "ativo"
                              ? "bg-success/15 text-success border-success/40"
                              : "bg-muted/15 text-muted-foreground border-muted/40"
                          }
                        >
                          {user.status === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(user.id)}
                      className="text-xs"
                    >
                      {user.status === "ativo" ? "Desativar" : "Ativar"}
                    </Button>
                    <Dialog
                      open={isEditDialogOpen && editingUser?.id === user.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) setEditingUser(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                          className="text-xs"
                        >
                          <Edit className="size-3 mr-1" /> Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Usuário</DialogTitle>
                          <DialogDescription>
                            Altere as permissões e status do usuário.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome completo</Label>
                            <Input
                              id="edit-name"
                              value={editingUser?.name || ""}
                              onChange={(e) =>
                                setEditingUser(editingUser ? { ...editingUser, name: e.target.value } : null)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-email">E-mail</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editingUser?.email || ""}
                              onChange={(e) =>
                                setEditingUser(editingUser ? { ...editingUser, email: e.target.value } : null)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-role">Função</Label>
                            <Select
                              value={editingUser?.role || "Visualizador"}
                              onValueChange={(value: UserRole) =>
                                setEditingUser(editingUser ? { ...editingUser, role: value } : null)
                              }
                            >
                              <SelectTrigger id="edit-role">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Administrador">Administrador</SelectItem>
                                <SelectItem value="DPO">DPO</SelectItem>
                                <SelectItem value="Segurança">Segurança</SelectItem>
                                <SelectItem value="Auditoria">Auditoria</SelectItem>
                                <SelectItem value="Visualizador">Visualizador</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleEditUser}>Salvar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-xs text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-3 mr-1" /> Excluir
                    </Button>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Permissões:</p>
                  <div className="flex flex-wrap gap-1">
                    {rolePermissions[user.role].map((perm) => (
                      <span
                        key={perm}
                        className="text-[10px] rounded bg-background px-2 py-0.5 text-muted-foreground"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Último acesso: {user.lastAccess}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </PageShell>
  );
}
