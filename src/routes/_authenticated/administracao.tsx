import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Trash2, Edit, ShieldCheck, ShieldAlert, Shield, Search } from "lucide-react";
import { toast } from "sonner";

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
    email: "carlos.silva@empresa.com.br",
    role: "Administrador",
    status: "ativo",
    lastAccess: "Há 5 minutos",
  },
  {
    id: "2",
    name: "Ana Rodrigues",
    email: "ana.rodrigues@empresa.com.br",
    role: "DPO",
    status: "ativo",
    lastAccess: "Há 1 hora",
  },
  {
    id: "3",
    name: "Roberto Costa",
    email: "roberto.costa@empresa.com.br",
    role: "Segurança",
    status: "ativo",
    lastAccess: "Há 30 minutos",
  },
  {
    id: "4",
    name: "Marina Santos",
    email: "marina.santos@empresa.com.br",
    role: "Auditoria",
    status: "ativo",
    lastAccess: "Há 2 horas",
  },
  {
    id: "5",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.com.br",
    role: "Visualizador",
    status: "inativo",
    lastAccess: "Há 3 dias",
  },
];

export const Route = createFileRoute("/_authenticated/administracao")({
  head: () => ({
    meta: [
      { title: "Administração e Acessos — PRISMA ONE" },
      {
        name: "description",
        content:
          "Gerencie membros de equipe, perfis de permissão e credenciais de acesso à plataforma.",
      },
      { property: "og:title", content: "Administração e Acessos — PRISMA ONE" },
      {
        property: "og:description",
        content: "Controle de acesso granular e gestão de equipe corporativa.",
      },
    ],
  }),
  component: AdministracaoPage,
});

function AdministracaoPage() {
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Visualizador" as UserRole,
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error("Preencha o nome e o e-mail do usuário.");
      return;
    }
    if (!newUser.email.includes("@")) {
      toast.error("Informe um e-mail válido.");
      return;
    }

    const user: User = {
      id: String(Date.now()),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: "ativo",
      lastAccess: "Nunca",
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "Visualizador" });
    setIsAddDialogOpen(false);
    toast.success(`Usuário ${user.name} adicionado com sucesso com perfil ${user.role}!`);
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setIsEditDialogOpen(false);
    setEditingUser(null);
    toast.success("Dados do usuário atualizados.");
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    toast.info("Acesso do usuário revogado.");
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === "ativo" ? "inativo" : "ativo";
          toast.info(`Status do usuário alterado para ${newStatus}.`);
          return { ...u, status: newStatus };
        }
        return u;
      }),
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
      title="Administração e Acessos"
      subtitle="Gerencie usuários corporativos, permissões e papéis de conformidade."
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-semibold shadow-xs">
              <UserPlus className="size-4" /> Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="text-left max-w-md">
            <DialogHeader>
              <DialogTitle>Convidar Novo Membro para o PRISMA ONE</DialogTitle>
              <DialogDescription>
                Cadastre o profissional e atribua o nível de acesso à plataforma.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail Corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Ex: joao.silva@empresa.com.br"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Função / Perfil</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="DPO">DPO (Encarregado de Dados)</SelectItem>
                    <SelectItem value="Segurança">Segurança da Informação</SelectItem>
                    <SelectItem value="Auditoria">Auditoria</SelectItem>
                    <SelectItem value="Visualizador">Visualizador (Somente Leitura)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddUser}>Adicionar Membro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Panel className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Total de Membros
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">{userCounts.total}</p>
        </Panel>
        <Panel className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Membros Ativos
          </p>
          <p className="mt-2 text-3xl font-bold text-success">{userCounts.ativos}</p>
        </Panel>
        <Panel className="text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Membros Inativos
          </p>
          <p className="mt-2 text-3xl font-bold text-muted-foreground">{userCounts.inativos}</p>
        </Panel>
      </div>

      <Panel
        className="mt-5 text-left"
        title="Usuários da Organização"
        description="Controle de acesso baseado em funções (RBAC)."
      >
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filtrar por nome, e-mail ou cargo..."
              className="pl-9 h-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <div
                key={user.id}
                className="rounded-xl border border-border/80 bg-background/50 p-4 transition-all hover:border-primary/50 text-left space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                      <RoleIcon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                          {user.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            user.status === "ativo"
                              ? "bg-success/15 text-success border-success/40 text-[10px]"
                              : "bg-muted/15 text-muted-foreground border-muted/40 text-[10px]"
                          }
                        >
                          {user.status === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(user.id)}
                      className="text-xs h-8"
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
                          className="text-xs h-8"
                        >
                          <Edit className="size-3.5 mr-1" /> Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="text-left max-w-md">
                        <DialogHeader>
                          <DialogTitle>Editar Membro</DialogTitle>
                          <DialogDescription>
                            Altere os dados cadastrais e as permissões de acesso.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2 text-xs">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-name">Nome Completo</Label>
                            <Input
                              id="edit-name"
                              value={editingUser?.name || ""}
                              onChange={(e) =>
                                setEditingUser(
                                  editingUser ? { ...editingUser, name: e.target.value } : null,
                                )
                              }
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-email">E-mail</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editingUser?.email || ""}
                              onChange={(e) =>
                                setEditingUser(
                                  editingUser ? { ...editingUser, email: e.target.value } : null,
                                )
                              }
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-role">Função / Perfil</Label>
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
                        <DialogFooter className="gap-2">
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleEditUser}>Salvar Alterações</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/40 p-2.5 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground mr-1.5">Permissões ativas:</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {rolePermissions[user.role].map((perm) => (
                      <span
                        key={perm}
                        className="rounded bg-background border border-border/60 px-2 py-0.5 text-[10px] text-foreground"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </PageShell>
  );
}
