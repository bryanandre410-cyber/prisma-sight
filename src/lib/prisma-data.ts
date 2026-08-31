export type Severity = "alto" | "medio" | "baixo";

export const overviewMetrics = [
  {
    key: "dados",
    label: "Dados Monitorados",
    value: "2.45",
    unit: "TB",
    delta: "+12% vs mês anterior",
    tone: "primary" as const,
  },
  {
    key: "atividades",
    label: "Atividades em Tempo Real",
    value: "1.328",
    unit: "",
    delta: "+8.7% vs hora anterior",
    tone: "glow" as const,
  },
  {
    key: "riscos",
    label: "Riscos Identificados",
    value: "7",
    unit: "",
    delta: "-2 vs semana anterior",
    tone: "danger" as const,
  },
  {
    key: "lgpd",
    label: "Conformidade LGPD",
    value: "98",
    unit: "%",
    delta: "Conforme",
    tone: "success" as const,
  },
];

export const trafficSeries = Array.from({ length: 24 }, (_, hour) => {
  const base = 1.4 + Math.sin((hour / 24) * Math.PI * 2.2) * 0.55;
  const noise = Math.sin(hour * 3.1) * 0.12;
  return {
    hora: `${String(hour).padStart(2, "0")}:00`,
    volume: Number((base + noise + hour / 40).toFixed(2)),
  };
});

export const alerts: {
  id: string;
  title: string;
  context: string;
  time: string;
  severity: Severity;
  action: string;
  status: "pendente" | "resolvido" | "reconhecido";
}[] = [
  {
    id: "AL-1042",
    title: "Acesso excessivo a dados sensíveis",
    context: "Departamento Financeiro",
    time: "15:24",
    severity: "alto",
    action: "Revogar sessão e revisar permissões do usuário.",
    status: "pendente",
  },
  {
    id: "AL-1041",
    title: "Modelo de IA com dados não anonimizados",
    context: "Marketing AI Campaign",
    time: "14:08",
    severity: "medio",
    action: "Aplicar pseudonimização antes do próximo treino.",
    status: "pendente",
  },
  {
    id: "AL-1040",
    title: "Compartilhamento externo detectado",
    context: "Contrato_Confidencial.pdf",
    time: "13:47",
    severity: "baixo",
    action: "Confirmar base legal do compartilhamento.",
    status: "pendente",
  },
  {
    id: "AL-1039",
    title: "Tentativa de acesso indevido",
    context: "API de Clientes · IP 189.44.x.x",
    time: "11:12",
    severity: "alto",
    action: "Bloquear IP e abrir incidente de segurança.",
    status: "pendente",
  },
  {
    id: "AL-1038",
    title: "Retenção de dados acima do prazo",
    context: "Base de currículos RH",
    time: "09:30",
    severity: "medio",
    action: "Executar rotina de descarte automático.",
    status: "pendente",
  },
];

export const policies = [
  { name: "Política de Dados Pessoais", updated: "12/05/2024", version: "v4.2", status: "Vigente" },
  { name: "Política de IA Responsável", updated: "08/05/2024", version: "v2.0", status: "Vigente" },
  {
    name: "Política de Retenção de Dados",
    updated: "01/05/2024",
    version: "v3.1",
    status: "Vigente",
  },
  {
    name: "Política de Compartilhamento",
    updated: "28/04/2024",
    version: "v1.8",
    status: "Revisão em breve",
  },
];

export const complianceControls = [
  { name: "Mapeamento de dados pessoais", progress: 100, owner: "DPO" },
  { name: "Base legal documentada", progress: 96, owner: "Jurídico" },
  { name: "Gestão de consentimento", progress: 92, owner: "Produto" },
  { name: "Direitos do titular (atendimento)", progress: 88, owner: "Atendimento" },
  { name: "Plano de resposta a incidentes", progress: 74, owner: "Segurança" },
  { name: "Contratos com operadores", progress: 61, owner: "Jurídico" },
];

export const dataFlows = [
  { source: "CRM Comercial", category: "Dados cadastrais", access: 128, risk: "Baixo" },
  { source: "ERP Financeiro", category: "Dados financeiros", access: 64, risk: "Alto" },
  { source: "RH Cloud", category: "Dados sensíveis", access: 41, risk: "Médio" },
  { source: "Data Lake Analytics", category: "Comportamental", access: 302, risk: "Médio" },
  {
    source: "Chatbot de Atendimento",
    category: "Conversas de clientes",
    access: 517,
    risk: "Alto",
  },
];

export const aiModels = [
  {
    name: "Modelo de Score de Crédito",
    purpose: "Análise de risco",
    dataUse: "Autorizado",
    bias: 12,
    leak: 4,
    status: "Conforme",
  },
  {
    name: "Marketing AI Campaign",
    purpose: "Segmentação",
    dataUse: "Dados não anonimizados",
    bias: 38,
    leak: 27,
    status: "Atenção",
  },
  {
    name: "Assistente de Atendimento",
    purpose: "Suporte ao cliente",
    dataUse: "Autorizado",
    bias: 18,
    leak: 15,
    status: "Conforme",
  },
  {
    name: "Triagem de Currículos",
    purpose: "Recrutamento",
    dataUse: "Dados sensíveis sem base legal",
    bias: 57,
    leak: 22,
    status: "Crítico",
  },
];

export const reports = [
  { name: "Relatório de Conformidade LGPD", period: "Maio/2024", type: "Diretoria", pages: 24 },
  { name: "Auditoria de Modelos de IA", period: "Maio/2024", type: "Auditoria", pages: 18 },
  { name: "Incidentes e Alertas", period: "Abril/2024", type: "Regulatório", pages: 12 },
  { name: "Inventário de Dados Pessoais", period: "Abril/2024", type: "Interno", pages: 36 },
];

export const severityLabel: Record<Severity, string> = {
  alto: "Alto",
  medio: "Médio",
  baixo: "Baixo",
};
