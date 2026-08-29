export type Severity = "alto" | "medio" | "baixo";

export type Finding = {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  action: string;
};

export type SimulationResult = {
  source: string;
  scope: string;
  recordsScanned: number;
  complianceScore: number;
  findings: Finding[];
};

type Template = { title: string; detail: string; severity: Severity; action: string };

const commonFindings: Template[] = [
  {
    title: "Dados sensíveis sem criptografia em repouso",
    detail: "Foram encontrados registros com CPF e dados de saúde armazenados em texto puro.",
    severity: "alto",
    action: "Aplicar criptografia e restringir o acesso ao conjunto de dados.",
  },
  {
    title: "Acessos fora do horário comercial",
    detail: "Contas administrativas acessaram bases pessoais durante a madrugada.",
    severity: "medio",
    action: "Revisar logs de acesso e habilitar autenticação em duas etapas.",
  },
  {
    title: "Retenção de dados acima do prazo definido",
    detail: "Registros inativos há mais de 5 anos continuam disponíveis para consulta.",
    severity: "medio",
    action: "Executar rotina de expurgo e anonimização dos dados antigos.",
  },
  {
    title: "Compartilhamento com terceiros sem contrato atualizado",
    detail: "Integrações enviam dados pessoais para fornecedores sem cláusula de tratamento vigente.",
    severity: "alto",
    action: "Atualizar os contratos de operador e limitar o escopo das integrações.",
  },
  {
    title: "Campos coletados sem finalidade declarada",
    detail: "Formulários coletam informações que não constam no inventário de dados.",
    severity: "baixo",
    action: "Ajustar formulários e atualizar o registro de operações de tratamento.",
  },
];

const lgpdFindings: Template[] = [
  {
    title: "Base legal ausente em tratamentos de marketing",
    detail: "Envios promocionais sem consentimento registrado para parte dos titulares.",
    severity: "alto",
    action: "Coletar consentimento válido e registrar a base legal utilizada.",
  },
  {
    title: "Atendimento a titulares acima do prazo legal",
    detail: "Solicitações de exclusão respondidas em mais de 15 dias.",
    severity: "medio",
    action: "Automatizar o fluxo de requisições de titulares.",
  },
];

const aiFindings: Template[] = [
  {
    title: "Modelo de IA treinado com dados pessoais identificáveis",
    detail: "Pipeline de treinamento consome dados sem anonimização prévia.",
    severity: "alto",
    action: "Anonimizar o conjunto de treino e registrar a avaliação de impacto.",
  },
  {
    title: "Indício de viés em decisões automatizadas",
    detail: "Distribuição de resultados desbalanceada entre grupos demográficos.",
    severity: "medio",
    action: "Reavaliar features sensíveis e aplicar testes de equidade.",
  },
  {
    title: "Prompts com dados confidenciais enviados a serviço externo",
    detail: "Chamadas a modelos de terceiros incluem trechos de documentos internos.",
    severity: "alto",
    action: "Aplicar filtro de mascaramento antes do envio dos prompts.",
  },
];

function pick<T>(items: T[], count: number): T[] {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

export function runSimulation(source: string, scope: string): SimulationResult {
  const pool: Template[] =
    scope === "lgpd"
      ? [...commonFindings, ...lgpdFindings]
      : scope === "ia"
        ? [...aiFindings, ...commonFindings.slice(0, 2)]
        : [...commonFindings, ...lgpdFindings, ...aiFindings];

  const count = Math.min(pool.length, 3 + Math.floor(Math.random() * 3));
  const findings: Finding[] = pick(pool, count).map((f, i) => ({
    id: `${Date.now()}-${i}`,
    ...f,
  }));

  const penalty = findings.reduce(
    (acc, f) => acc + (f.severity === "alto" ? 7 : f.severity === "medio" ? 4 : 2),
    0,
  );

  return {
    source,
    scope,
    recordsScanned: 12_000 + Math.floor(Math.random() * 180_000),
    complianceScore: Math.max(52, 99 - penalty),
    findings,
  };
}
