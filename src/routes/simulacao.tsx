import { createFileRoute } from "@tanstack/react-router";
import { Building2, Database, Cloud, Server, CheckCircle2, Clock, ArrowRight, Plug, Edit, Pencil } from "lucide-react";
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

export const Route = createFileRoute("/simulacao")({
  head: () => ({
    meta: [
      { title: "Prisma One — Simulação de Integração" },
      {
        name: "description",
        content: "Simulação de integração do Prisma One com sistemas empresariais.",
      },
    ],
  }),
  component: Simulacao,
});

const integrationSteps = [
  { id: 1, title: "Configuração da Empresa", description: "Cadastro de informações básicas e estrutura organizacional", status: "completed" },
  { id: 2, title: "Mapeamento de Sistemas", description: "Identificação e conexão com fontes de dados existentes", status: "completed" },
  { id: 3, title: "Integração de APIs", description: "Configuração de conexões seguras com sistemas externos", status: "in_progress" },
  { id: 4, title: "Configuração de Monitoramento", description: "Definição de regras e alertas personalizados", status: "pending" },
  { id: 5, title: "Teste de Conformidade", description: "Validação inicial de conformidade com LGPD", status: "pending" },
  { id: 6, title: "Ativação Completa", description: "Sistema pronto para monitoramento contínuo", status: "pending" },
];

const connectedSystems = [
  { name: "SAP ERP", type: "Sistema de Gestão", status: "Conectado", lastSync: "12/08/2026 15:45", icon: Server },
  { name: "Salesforce CRM", type: "Gestão de Clientes", status: "Conectado", lastSync: "12/08/2026 15:42", icon: Cloud },
  { name: "Microsoft 365", type: "Produtividade", status: "Conectado", lastSync: "12/08/2026 15:40", icon: Database },
  { name: "AWS Data Lake", type: "Armazenamento", status: "Em conexão", lastSync: "Processando...", icon: Database },
  { name: "Slack", type: "Comunicação", status: "Pendente", lastSync: "-", icon: Cloud },
];

const companyInfo = {
  name: "TechCorp Brasil Ltda",
  cnpj: "12.345.678/0001-90",
  industry: "Tecnologia",
  employees: "1.250",
  dataVolume: "4.8 TB",
  complianceScore: "87%",
};

const availableSystems = [
  { name: "SAP ERP", type: "Sistema de Gestão", icon: Server },
  { name: "Salesforce CRM", type: "Gestão de Clientes", icon: Cloud },
  { name: "Microsoft 365", type: "Produtividade", icon: Database },
  { name: "AWS Data Lake", type: "Armazenamento", icon: Database },
  { name: "Slack", type: "Comunicação", icon: Cloud },
  { name: "Oracle Database", type: "Banco de Dados", icon: Database },
  { name: "Google Workspace", type: "Produtividade", icon: Cloud },
  { name: "ServiceNow", type: "IT Service Management", icon: Server },
];

function Simulacao() {
  const [companyData, setCompanyData] = useState(companyInfo);
  const [connectedSystems, setConnectedSystems] = useState([
    { name: "SAP ERP", type: "Sistema de Gestão", status: "Conectado", lastSync: "12/08/2026 15:45", icon: Server },
    { name: "Salesforce CRM", type: "Gestão de Clientes", status: "Conectado", lastSync: "12/08/2026 15:42", icon: Cloud },
    { name: "Microsoft 365", type: "Produtividade", status: "Conectado", lastSync: "12/08/2026 15:40", icon: Database },
    { name: "AWS Data Lake", type: "Armazenamento", status: "Em conexão", lastSync: "Processando...", icon: Database },
  ]);
  const [integrationSteps, setIntegrationSteps] = useState([
    { id: 1, title: "Configuração da Empresa", description: "Cadastro de informações básicas e estrutura organizacional", status: "completed" },
    { id: 2, title: "Mapeamento de Sistemas", description: "Identificação e conexão com fontes de dados existentes", status: "completed" },
    { id: 3, title: "Integração de APIs", description: "Configuração de conexões seguras com sistemas externos", status: "in_progress" },
    { id: 4, title: "Configuração de Monitoramento", description: "Definição de regras e alertas personalizados", status: "pending" },
    { id: 5, title: "Teste de Conformidade", description: "Validação inicial de conformidade com LGPD", status: "pending" },
    { id: 6, title: "Ativação Completa", description: "Sistema pronto para monitoramento contínuo", status: "pending" },
  ]);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isSystemDialogOpen, setIsSystemDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState({ ...companyData });
  const [selectedSystem, setSelectedSystem] = useState("");

  const handleCompanyEdit = () => {
    setEditingCompany({ ...companyData });
    setIsCompanyDialogOpen(true);
  };

  const handleCompanySave = () => {
    setCompanyData({ ...editingCompany });
    setIsCompanyDialogOpen(false);
  };

  const handleConnectSystem = () => {
    if (!selectedSystem) return;
    const system = availableSystems.find(s => s.name === selectedSystem);
    if (system) {
      const newSystem = {
        ...system,
        status: "Em conexão",
        lastSync: "Processando...",
      };
      setConnectedSystems([...connectedSystems, newSystem]);
      setIsSystemDialogOpen(false);
      setSelectedSystem("");
    }
  };

  const handleDisconnectSystem = (systemName: string) => {
    setConnectedSystems(connectedSystems.filter(s => s.name !== systemName));
  };

  return (
    <PageShell
      title="Simulação de Integração"
      subtitle="Demonstração de como integrar o Prisma One aos sistemas da sua empresa."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel 
          title="Informações da Empresa" 
          className="lg:col-span-1"
          action={
            <button 
              onClick={handleCompanyEdit}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-primary-glow hover:bg-primary/10 transition-colors"
            >
              <Edit className="size-3" />
              Editar
            </button>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justifyContent-between gap-3">
              <div className="flex items-center gap-3">
                <Building2 className="size-5 text-primary-glow" />
                <div>
                  <p className="text-sm font-medium">{companyData.name}</p>
                  <p className="text-xs text-muted-foreground">CNPJ: {companyData.cnpj}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-[11px] text-muted-foreground">Setor</p>
                <p className="text-sm font-medium">{companyData.industry}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-[11px] text-muted-foreground">Funcionários</p>
                <p className="text-sm font-medium">{companyData.employees}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-[11px] text-muted-foreground">Volume de Dados</p>
                <p className="text-sm font-medium">{companyData.dataVolume}</p>
              </div>
              <div className="rounded-lg bg-accent/50 p-3">
                <p className="text-[11px] text-muted-foreground">Score Conformidade</p>
                <p className="text-sm font-medium text-success">{companyData.complianceScore}</p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Progresso da Integração" className="lg:col-span-2">
          <div className="space-y-4">
            {integrationSteps.map((step, index) => {
              const isCompleted = step.status === "completed";
              const isInProgress = step.status === "in_progress";
              const isPending = step.status === "pending";
              
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex shrink-0 items-center justify-center">
                    {isCompleted ? (
                      <div className="flex size-8 items-center justify-center rounded-full bg-success">
                        <CheckCircle2 className="size-4 text-success-foreground" />
                      </div>
                    ) : isInProgress ? (
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary-glow">
                        <Clock className="size-4 text-primary-foreground animate-pulse" />
                      </div>
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-full border-2 border-border">
                        <span className="text-xs font-medium text-muted-foreground">{step.id}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${isCompleted ? "text-success" : isInProgress ? "text-primary-glow" : "text-muted-foreground"}`}>
                        {step.title}
                      </p>
                      {isInProgress && (
                        <span className="rounded-full bg-primary-glow/20 px-2 py-0.5 text-[10px] font-medium text-primary-glow">
                          Em andamento
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {index < integrationSteps.length - 1 && (
                    <ArrowRight className="mt-3 size-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-lg border border-border p-4 bg-accent/30">
            <div>
              <p className="text-sm font-medium">Progresso Geral</p>
              <p className="text-xs text-muted-foreground">{integrationSteps.filter(s => s.status === "completed").length} de {integrationSteps.length} etapas concluídas</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-primary-glow">{Math.round((integrationSteps.filter(s => s.status === "completed").length / integrationSteps.length) * 100)}%</p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Sistemas Conectados" description="Gerencie as integrações com os sistemas da sua empresa." className="mt-5">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {connectedSystems.map((system) => {
            const Icon = system.icon;
            const statusColor = system.status === "Conectado" ? "text-success" : system.status === "Em conexão" ? "text-primary-glow" : "text-muted-foreground";
            const statusBg = system.status === "Conectado" ? "bg-success/20" : system.status === "Em conexão" ? "bg-primary-glow/20" : "bg-muted";
            
            return (
              <div key={system.name} className="flex items-center justify-between rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className="size-5 text-primary-glow" />
                  <div>
                    <p className="text-sm font-medium">{system.name}</p>
                    <p className="text-xs text-muted-foreground">{system.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className={`text-xs font-medium ${statusColor}`}>{system.status}</p>
                    <p className="text-[11px] text-muted-foreground">{system.lastSync}</p>
                  </div>
                  {system.status === "Conectado" && (
                    <button 
                      onClick={() => handleDisconnectSystem(system.name)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                      title="Desconectar"
                    >
                      <Edit className="size-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button 
          onClick={() => setIsSystemDialogOpen(true)}
          className="mt-4 flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:border-primary-glow hover:text-primary-glow transition-colors"
        >
          <Plug className="size-4" />
          Conectar Novo Sistema
        </button>
      </Panel>

      <Panel title="Próximos Passos" description="O que você precisa fazer para completar a integração." className="mt-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-glow/20">
              <span className="text-sm font-bold text-primary-glow">1</span>
            </div>
            <div>
              <p className="text-sm font-medium">Finalizar Conexão AWS</p>
              <p className="mt-1 text-xs text-muted-foreground">Complete a autenticação com o Data Lake da AWS</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-glow/20">
              <span className="text-sm font-bold text-primary-glow">2</span>
            </div>
            <div>
              <p className="text-sm font-medium">Configurar Regras de Monitoramento</p>
              <p className="mt-1 text-xs text-muted-foreground">Defina alertas personalizados para cada tipo de dado</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-glow/20">
              <span className="text-sm font-bold text-primary-glow">3</span>
            </div>
            <div>
              <p className="text-sm font-medium">Integrar Slack</p>
              <p className="mt-1 text-xs text-muted-foreground">Conecte o Slack para receber notificações em tempo real</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-glow/20">
              <span className="text-sm font-bold text-primary-glow">4</span>
            </div>
            <div>
              <p className="text-sm font-medium">Executar Teste de Conformidade</p>
              <p className="mt-1 text-xs text-muted-foreground">Valide a conformidade inicial com a LGPD</p>
            </div>
          </div>
        </div>
      </Panel>

      <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Informações da Empresa</DialogTitle>
            <DialogDescription>
              Atualize as informações básicas da empresa para a integração.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                value={editingCompany.name}
                onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-cnpj">CNPJ</Label>
              <Input
                id="company-cnpj"
                value={editingCompany.cnpj}
                onChange={(e) => setEditingCompany({ ...editingCompany, cnpj: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-industry">Setor</Label>
              <Input
                id="company-industry"
                value={editingCompany.industry}
                onChange={(e) => setEditingCompany({ ...editingCompany, industry: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company-employees">Funcionários</Label>
                <Input
                  id="company-employees"
                  value={editingCompany.employees}
                  onChange={(e) => setEditingCompany({ ...editingCompany, employees: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-volume">Volume de Dados</Label>
                <Input
                  id="company-volume"
                  value={editingCompany.dataVolume}
                  onChange={(e) => setEditingCompany({ ...editingCompany, dataVolume: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompanyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCompanySave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSystemDialogOpen} onOpenChange={setIsSystemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conectar Novo Sistema</DialogTitle>
            <DialogDescription>
              Selecione um sistema disponível para conectar ao Prisma One.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="system-select">Sistema</Label>
              <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                <SelectTrigger id="system-select">
                  <SelectValue placeholder="Selecione um sistema..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSystems
                    .filter(s => !connectedSystems.some(cs => cs.name === s.name))
                    .map((system) => (
                      <SelectItem key={system.name} value={system.name}>
                        {system.name} - {system.type}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSystemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConnectSystem} disabled={!selectedSystem}>
              Conectar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
