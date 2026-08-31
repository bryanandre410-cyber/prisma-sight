import { createFileRoute } from "@tanstack/react-router";
import { Building2, Users, Database, Shield, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialCompanies = [
  {
    id: 1,
    name: "TechCorp Solutions",
    cnpj: "12.345.678/0001-90",
    industry: "Tecnologia",
    employees: "250",
    dataVolume: "1.2 TB",
    complianceScore: "95%",
    status: "Ativo",
    systems: ["SAP ERP", "Salesforce CRM", "Microsoft 365"],
    createdAt: "01/08/2026",
    lastSync: "12/08/2026 15:30",
  },
  {
    id: 2,
    name: "Financeira Brasil",
    cnpj: "98.765.432/0001-10",
    industry: "Financeiro",
    employees: "500",
    dataVolume: "3.5 TB",
    complianceScore: "88%",
    status: "Ativo",
    systems: ["Oracle Database", "AWS Data Lake"],
    createdAt: "15/07/2026",
    lastSync: "12/08/2026 14:45",
  },
  {
    id: 3,
    name: "Saúde Plus",
    cnpj: "45.678.901/0001-23",
    industry: "Saúde",
    employees: "150",
    dataVolume: "800 GB",
    complianceScore: "92%",
    status: "Ativo",
    systems: ["Google Workspace", "ServiceNow"],
    createdAt: "20/07/2026",
    lastSync: "12/08/2026 16:00",
  },
];

export const Route = createFileRoute("/empresas")({
  head: () => ({
    meta: [
      { title: "Prisma One — Empresas" },
      {
        name: "description",
        content: "Gerencie e visualize todas as empresas integradas ao Prisma One.",
      },
    ],
  }),
  component: EmpresasPage,
});

function EmpresasPage() {
  const [companies, setCompanies] = useState(initialCompanies);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCompanies = localStorage.getItem("companies");
      if (savedCompanies) {
        setCompanies(JSON.parse(savedCompanies));
      }
    }
  }, []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditCompany = (company: typeof initialCompanies[0]) => {
    setEditingCompany({ ...company });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeleteCompany = (companyId: number) => {
    setCompanies(companies.filter(c => c.id !== companyId));
  };

  const handleSaveCompany = () => {
    if (!editingCompany) return;
    
    if (isEditMode && editingCompany.id) {
      setCompanies(companies.map(c => c.id === editingCompany.id ? editingCompany : c));
    }
    setIsDialogOpen(false);
    setEditingCompany(null);
  };

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 90) return "text-success";
    if (numScore >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreBg = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 90) return "bg-success/20";
    if (numScore >= 70) return "bg-warning/20";
    return "bg-destructive/20";
  };

  return (
    <PageShell
      title="Empresas Integradas"
      subtitle="Gerencie e visualize todas as empresas integradas ao Prisma One."
    >
      <div className="grid gap-5">
        {companies.map((company) => (
          <Panel key={company.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  <Building2 className="size-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${company.status === "Ativo" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                      {company.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    CNPJ: {company.cnpj} · Setor: {company.industry}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="rounded-lg bg-accent/50 p-3">
                      <p className="text-[11px] text-muted-foreground">Funcionários</p>
                      <p className="text-sm font-medium">{company.employees}</p>
                    </div>
                    <div className="rounded-lg bg-accent/50 p-3">
                      <p className="text-[11px] text-muted-foreground">Volume de Dados</p>
                      <p className="text-sm font-medium">{company.dataVolume}</p>
                    </div>
                    <div className={`rounded-lg p-3 ${getScoreBg(company.complianceScore)}`}>
                      <p className="text-[11px] text-muted-foreground">Score Conformidade</p>
                      <p className={`text-sm font-medium ${getScoreColor(company.complianceScore)}`}>{company.complianceScore}</p>
                    </div>
                    <div className="rounded-lg bg-accent/50 p-3">
                      <p className="text-[11px] text-muted-foreground">Sistemas</p>
                      <p className="text-sm font-medium">{company.systems.length} conectados</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {company.systems.map((system) => (
                      <span key={system} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary-glow">
                        {system}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Criado em: {company.createdAt}</span>
                    <span>Última sincronização: {company.lastSync}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => handleEditCompany(company)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-primary/20 hover:text-primary-glow transition-colors"
                  title="Editar"
                >
                  <Edit className="size-4" />
                </button>
                <button
                  onClick={() => handleDeleteCompany(company.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </Panel>
        ))}

        {companies.length === 0 && (
          <Panel>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma empresa integrada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comece integrando uma nova empresa ao Prisma One.
              </p>
              <Button onClick={() => window.location.href = "/nova-empresa"}>
                Integrar Nova Empresa
              </Button>
            </div>
          </Panel>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Atualize as informações da empresa.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                value={editingCompany?.name || ""}
                onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-cnpj">CNPJ</Label>
              <Input
                id="company-cnpj"
                value={editingCompany?.cnpj || ""}
                onChange={(e) => setEditingCompany({ ...editingCompany, cnpj: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-industry">Setor</Label>
              <Select value={editingCompany?.industry} onValueChange={(value) => setEditingCompany({ ...editingCompany, industry: value })}>
                <SelectTrigger id="company-industry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Varejo">Varejo</SelectItem>
                  <SelectItem value="Manufatura">Manufatura</SelectItem>
                  <SelectItem value="Serviços">Serviços</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company-employees">Funcionários</Label>
                <Input
                  id="company-employees"
                  value={editingCompany?.employees || ""}
                  onChange={(e) => setEditingCompany({ ...editingCompany, employees: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-volume">Volume de Dados</Label>
                <Input
                  id="company-volume"
                  value={editingCompany?.dataVolume || ""}
                  onChange={(e) => setEditingCompany({ ...editingCompany, dataVolume: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-status">Status</Label>
              <Select value={editingCompany?.status} onValueChange={(value) => setEditingCompany({ ...editingCompany, status: value })}>
                <SelectTrigger id="company-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Em integração">Em integração</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCompany}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
