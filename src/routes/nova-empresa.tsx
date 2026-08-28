import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, Users, Database, Shield, ArrowRight, CheckCircle2, Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/nova-empresa")({
  head: () => ({
    meta: [
      { title: "Prisma One — Integrar Nova Empresa" },
      {
        name: "description",
        content: "Configure e integre uma nova empresa ao Prisma One.",
      },
    ],
  }),
  component: NovaEmpresa,
});

const industries = [
  "Tecnologia",
  "Financeiro",
  "Saúde",
  "Educação",
  "Varejo",
  "Manufatura",
  "Serviços",
  "Outro",
];

const systemTemplates = [
  { name: "SAP ERP", type: "Sistema de Gestão", recommended: true },
  { name: "Salesforce CRM", type: "Gestão de Clientes", recommended: true },
  { name: "Microsoft 365", type: "Produtividade", recommended: false },
  { name: "AWS Data Lake", type: "Armazenamento", recommended: false },
  { name: "Oracle Database", type: "Banco de Dados", recommended: false },
  { name: "Google Workspace", type: "Produtividade", recommended: false },
];

function NovaEmpresa() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [companyData, setCompanyData] = useState({
    name: "",
    cnpj: "",
    industry: "",
    employees: "",
    dataVolume: "",
  });
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [isSystemDialogOpen, setIsSystemDialogOpen] = useState(false);
  const [customSystem, setCustomSystem] = useState("");

  const steps = [
    { id: 1, title: "Informações da Empresa", description: "Dados básicos da organização" },
    { id: 2, title: "Sistemas a Integrar", description: "Selecione os sistemas para conectar" },
    { id: 3, title: "Configuração Inicial", description: "Defina parâmetros de monitoramento" },
    { id: 4, title: "Confirmação", description: "Revise e inicie a integração" },
  ];

  const handleNextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddSystem = (systemName: string) => {
    if (!selectedSystems.includes(systemName)) {
      setSelectedSystems([...selectedSystems, systemName]);
    }
    setIsSystemDialogOpen(false);
  };

  const handleRemoveSystem = (systemName: string) => {
    setSelectedSystems(selectedSystems.filter(s => s !== systemName));
  };

  const handleAddCustomSystem = () => {
    if (customSystem && !selectedSystems.includes(customSystem)) {
      setSelectedSystems([...selectedSystems, customSystem]);
      setCustomSystem("");
    }
    setIsSystemDialogOpen(false);
  };

  const handleCompleteIntegration = () => {
    alert("Integração iniciada com sucesso! Redirecionando para a lista de empresas...");
    navigate({ to: "/empresas" });
  };

  return (
    <PageShell
      title="Integrar Nova Empresa"
      subtitle="Configure uma nova empresa para monitoramento de privacidade e dados."
    >
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Panel title="Progresso da Integração">
            <div className="space-y-4">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-start gap-3">
                  <div className="flex shrink-0 items-center justify-center">
                    {s.id < step ? (
                      <div className="flex size-8 items-center justify-center rounded-full bg-success">
                        <CheckCircle2 className="size-4 text-success-foreground" />
                      </div>
                    ) : s.id === step ? (
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary-glow">
                        <span className="text-sm font-semibold text-primary-foreground">{s.id}</span>
                      </div>
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-full border-2 border-border">
                        <span className="text-xs font-medium text-muted-foreground">{s.id}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${s.id === step ? "text-primary-glow" : s.id < step ? "text-success" : "text-muted-foreground"}`}>
                      {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="mt-3 size-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-3">
          {step === 1 && (
            <Panel title="Informações da Empresa">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="company-name">Nome da Empresa *</Label>
                  <Input
                    id="company-name"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                    placeholder="Nome completo da empresa"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-cnpj">CNPJ</Label>
                  <Input
                    id="company-cnpj"
                    value={companyData.cnpj}
                    onChange={(e) => setCompanyData({ ...companyData, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-industry">Setor *</Label>
                  <Select value={companyData.industry} onValueChange={(value) => setCompanyData({ ...companyData, industry: value })}>
                    <SelectTrigger id="company-industry">
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-employees">Número de Funcionários</Label>
                  <Input
                    id="company-employees"
                    value={companyData.employees}
                    onChange={(e) => setCompanyData({ ...companyData, employees: e.target.value })}
                    placeholder="Ex: 500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-volume">Volume Estimado de Dados</Label>
                  <Input
                    id="company-volume"
                    value={companyData.dataVolume}
                    onChange={(e) => setCompanyData({ ...companyData, dataVolume: e.target.value })}
                    placeholder="Ex: 2.5 TB"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button onClick={handleNextStep} disabled={!companyData.name || !companyData.industry}>
                  Próximo
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </Panel>
          )}

          {step === 2 && (
            <Panel title="Sistemas a Integrar" description="Selecione os sistemas que deseja conectar ao Prisma One.">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <p className="text-sm font-medium mb-3">Sistemas Recomendados</p>
                  <div className="grid gap-2">
                    {systemTemplates.filter(s => s.recommended).map((system) => (
                      <div
                        key={system.name}
                        className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                          selectedSystems.includes(system.name)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => selectedSystems.includes(system.name) ? handleRemoveSystem(system.name) : handleAddSystem(system.name)}
                      >
                        <div className="flex items-center gap-3">
                          <Database className="size-5 text-primary-glow" />
                          <div>
                            <p className="text-sm font-medium">{system.name}</p>
                            <p className="text-xs text-muted-foreground">{system.type}</p>
                          </div>
                        </div>
                        {selectedSystems.includes(system.name) && (
                          <CheckCircle2 className="size-5 text-success" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium mb-3">Outros Sistemas Disponíveis</p>
                  <div className="grid gap-2">
                    {systemTemplates.filter(s => !s.recommended).map((system) => (
                      <div
                        key={system.name}
                        className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                          selectedSystems.includes(system.name)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => selectedSystems.includes(system.name) ? handleRemoveSystem(system.name) : handleAddSystem(system.name)}
                      >
                        <div className="flex items-center gap-3">
                          <Database className="size-5 text-primary-glow" />
                          <div>
                            <p className="text-sm font-medium">{system.name}</p>
                            <p className="text-xs text-muted-foreground">{system.type}</p>
                          </div>
                        </div>
                        {selectedSystems.includes(system.name) && (
                          <CheckCircle2 className="size-5 text-success" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedSystems.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Sistemas Selecionados ({selectedSystems.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSystems.map((system) => (
                      <div
                        key={system}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary-glow"
                      >
                        {system}
                        <button
                          onClick={() => handleRemoveSystem(system)}
                          className="ml-1 hover:text-destructive"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Anterior
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsSystemDialogOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="size-4" />
                    Sistema Personalizado
                  </Button>
                  <Button onClick={handleNextStep}>
                    Próximo
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            </Panel>
          )}

          {step === 3 && (
            <Panel title="Configuração Inicial" description="Defina os parâmetros básicos de monitoramento.">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="size-5 text-primary-glow" />
                    <p className="text-sm font-medium">Nível de Monitoramento</p>
                  </div>
                  <Select defaultValue="completo">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basico">Básico - Apenas alertas críticos</SelectItem>
                      <SelectItem value="padrao">Padrão - Alertas médios e críticos</SelectItem>
                      <SelectItem value="completo">Completo - Todos os alertas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="size-5 text-primary-glow" />
                    <p className="text-sm font-medium">Frequência de Relatórios</p>
                  </div>
                  <Select defaultValue="semanal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="size-5 text-primary-glow" />
                    <p className="text-sm font-medium">Retenção de Logs</p>
                  </div>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="180">180 dias</SelectItem>
                      <SelectItem value="365">1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="size-5 text-primary-glow" />
                    <p className="text-sm font-medium">Conformidade LGPD</p>
                  </div>
                  <Select defaultValue="automatico">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatico">Verificação automática</SelectItem>
                      <SelectItem value="manual">Verificação manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Anterior
                </Button>
                <Button onClick={handleNextStep}>
                  Próximo
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </Panel>
          )}

          {step === 4 && (
            <Panel title="Confirmação" description="Revise as informações antes de iniciar a integração.">
              <div className="space-y-6">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium mb-3">Informações da Empresa</p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome:</span>
                      <span className="font-medium">{companyData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CNPJ:</span>
                      <span className="font-medium">{companyData.cnpj || "Não informado"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Setor:</span>
                      <span className="font-medium">{companyData.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Funcionários:</span>
                      <span className="font-medium">{companyData.employees || "Não informado"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume de Dados:</span>
                      <span className="font-medium">{companyData.dataVolume || "Não informado"}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium mb-3">Sistemas a Integrar ({selectedSystems.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSystems.map((system) => (
                      <div
                        key={system}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary-glow"
                      >
                        {system}
                      </div>
                    ))}
                    {selectedSystems.length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhum sistema selecionado</p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4 bg-accent/30">
                  <p className="text-sm font-medium mb-2">Resumo</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• A integração será iniciada após a confirmação</li>
                    <li>• Você poderá adicionar mais sistemas posteriormente</li>
                    <li>• O monitoramento começará automaticamente</li>
                    <li>• Relatórios iniciais estarão disponíveis em 24h</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Anterior
                </Button>
                <Button onClick={handleCompleteIntegration} className="gap-2">
                  <CheckCircle2 className="size-4" />
                  Iniciar Integração
                </Button>
              </div>
            </Panel>
          )}
        </div>
      </div>

      <Dialog open={isSystemDialogOpen} onOpenChange={setIsSystemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Sistema Personalizado</DialogTitle>
            <DialogDescription>
              Insira o nome de um sistema que não está na lista.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="custom-system">Nome do Sistema</Label>
              <Input
                id="custom-system"
                value={customSystem}
                onChange={(e) => setCustomSystem(e.target.value)}
                placeholder="Ex: Sistema ERP Legado"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSystemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCustomSystem} disabled={!customSystem}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
