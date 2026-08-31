import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Database,
  Eye,
  FileText,
  Lock,
  Menu,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  ArrowRight,
  Zap,
  Shield,
  BarChart2,
  FileCheck,
  Brain,
  Search,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "PRISMA ONE — Privacidade inteligente para um futuro seguro" },
      {
        name: "description",
        content:
          "Monitore dados, reduza riscos, comprove conformidade com a LGPD e tenha controle sobre o uso de Inteligência Artificial em toda a sua empresa.",
      },
      {
        property: "og:title",
        content: "PRISMA ONE — Privacidade, LGPD e Governança de IA",
      },
      {
        property: "og:description",
        content:
          "Monitore dados, reduza riscos, comprove conformidade com a LGPD e controle o uso de IA em toda a empresa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootComponent,
} as any));

function RootComponent() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/_authenticated/dashboard";
      }
    });
  }, []);

  return <Landing />;
}

const problems = [
  {
    icon: Database,
    title: "Dados pessoais espalhados",
    desc: "Informações de clientes e funcionários dispersas em dezenas de sistemas sem visibilidade centralizada.",
  },
  {
    icon: Eye,
    title: "Falta de visibilidade sobre dados sensíveis",
    desc: "Sem saber onde estão os dados sensíveis, é impossível protegê-los adequadamente.",
  },
  {
    icon: AlertTriangle,
    title: "Riscos de compartilhamento",
    desc: "Transferências de dados entre fornecedores e parceiros sem controle ou base legal documentada.",
  },
  {
    icon: FileText,
    title: "Dificuldade para comprovar conformidade",
    desc: "Sem evidências documentadas, a empresa não consegue demonstrar adequação à LGPD para auditores.",
  },
  {
    icon: Brain,
    title: "Falta de controle sobre ferramentas de IA",
    desc: "Modelos e ferramentas de IA utilizando dados pessoais sem avaliação de riscos ou base legal.",
  },
  {
    icon: Search,
    title: "Ausência de trilhas de auditoria",
    desc: "Sem histórico rastreável de acessos e alterações, é impossível investigar incidentes com precisão.",
  },
];

const modules = [
  {
    category: "Privacidade",
    color: "text-primary",
    bg: "bg-primary/10",
    icon: Shield,
    items: [
      "Inventário de dados",
      "Dados pessoais e sensíveis",
      "Fluxo de dados",
      "Compartilhamentos",
      "Sistemas e integrações",
      "Bases legais",
    ],
  },
  {
    category: "LGPD",
    color: "text-success",
    bg: "bg-success/10",
    icon: ShieldCheck,
    items: [
      "Diagnóstico de conformidade",
      "Score de conformidade",
      "Gap analysis",
      "Plano de ação",
      "Evidências",
      "Histórico de auditorias",
    ],
  },
  {
    category: "Inteligência Artificial",
    color: "text-warning",
    bg: "bg-warning/10",
    icon: Bot,
    items: [
      "Inventário de modelos e ferramentas",
      "Avaliação de riscos",
      "Detecção de possíveis vazamentos",
      "Avaliação de viés",
      "Uso indevido de dados",
      "Histórico de avaliações",
    ],
  },
];

const features = [
  {
    icon: Activity,
    title: "Monitoramento Contínuo 24/7",
    description:
      "Acompanhe o tráfego de dados pessoais e sensíveis, detectando acessos fora de padrão em tempo real.",
  },
  {
    icon: ShieldCheck,
    title: "Conformidade LGPD Automatizada",
    description:
      "Avaliação contínua dos controles essenciais da LGPD com plano de ação imediato para lacunas encontradas.",
  },
  {
    icon: Bot,
    title: "Auditoria e Governança de IA",
    description:
      "Audite modelos generativos e analíticos quanto a viés algorítmico, vazamento de dados e conformidade ética.",
  },
  {
    icon: AlertTriangle,
    title: "Gestão e Resposta a Incidentes",
    description:
      "Fila centralizada de riscos priorizada por severidade (Crítico, Alto, Médio, Baixo) com fluxos de remediação.",
  },
  {
    icon: Lock,
    title: "Isolamento e Multi-Tenancy",
    description:
      "Criptografia de ponta a ponta e Row Level Security (RLS) garantem que os dados de cada empresa sejam estritamente isolados.",
  },
  {
    icon: FileText,
    title: "Relatórios Regulatórios e Auditoria",
    description:
      "Gere relatórios executivos para diretoria, DPO e fiscalizações da ANPD em formato PDF com um clique.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Conexão das Fontes de Dados e IA",
    description:
      "Integre seus bancos de dados, ERPs, CRMs e APIs de inteligência artificial de forma segura ao PRISMA ONE.",
  },
  {
    step: "02",
    title: "Varredura Inteligente e Diagnóstico",
    description:
      "O motor de análise identifica dados não anonimizados, transferências indevidas e calcula o Score de Conformidade.",
  },
  {
    step: "03",
    title: "Gestão, Correção e Evidências",
    description:
      "Sua equipe de privacidade executa as ações corretivas recomendadas e emite laudos para auditorias.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "R$ 1.490",
    period: "/mês",
    desc: "Ideal para empresas em estágio inicial de adequação à LGPD.",
    features: [
      "Até 3 fontes de dados conectadas",
      "Monitoramento diário de conformidade",
      "Varredura LGPD automatizada",
      "2 usuários de equipe",
      "Relatórios básicos em PDF",
    ],
    cta: "Iniciar com Starter",
    popular: false,
  },
  {
    name: "Professional",
    price: "R$ 3.890",
    period: "/mês",
    desc: "Para empresas que utilizam IA e exigem governança contínua.",
    features: [
      "Até 12 fontes de dados e modelos de IA",
      "Monitoramento em tempo real 24/7",
      "Módulo de Auditoria de IA e Viés",
      "10 usuários com perfis granulares (DPO, Sec, Aud)",
      "Gestão de incidentes e alertas em tempo real",
      "Relatórios regulatórios e executivos completos",
    ],
    cta: "Começar com Professional",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sob Consulta",
    period: "",
    desc: "Solução dedicada para grandes corporações e setores regulados.",
    features: [
      "Fontes de dados e modelos de IA ilimitados",
      "SLA de atendimento 24/7 com DPO dedicado",
      "Deploy em nuvem privada ou on-premises",
      "Auditoria customizada de LLMs proprietários",
      "Integração SIEM / SOC via Webhooks e API",
      "Treinamentos e consultoria de adequação inclusos",
    ],
    cta: "Falar com Consultor",
    popular: false,
  },
];

const faqs = [
  {
    question: "O que é o PRISMA ONE?",
    answer:
      "O PRISMA ONE é uma plataforma SaaS B2B de privacidade, segurança da informação, conformidade com a LGPD e governança/auditoria de Inteligência Artificial para empresas de todos os portes.",
  },
  {
    question: "Como o PRISMA ONE audita modelos de IA?",
    answer:
      "Avaliamos fluxos de dados consumidos no treinamento e inferência, detectando a presença de dados pessoais não autorizados, risco de vazamento via prompts e discrepâncias estatísticas que caracterizam viés algorítmico.",
  },
  {
    question: "Os dados da minha empresa estão seguros no PRISMA ONE?",
    answer:
      "Sim. A arquitetura do PRISMA ONE emprega criptografia em repouso e em trânsito, isolamento rígido de multi-tenancy via Row Level Security (RLS) e não compartilha dados de clientes com terceiros.",
  },
  {
    question: "A plataforma auxilia no atendimento a requisições de titulares da LGPD?",
    answer:
      "Sim. O PRISMA ONE possui controles específicos para catalogar o inventário de dados pessoais, agilizando respostas a titulares e gerando o Relatório de Impacto à Proteção de Dados (RIPD).",
  },
  {
    question: "Posso testar antes de contratar?",
    answer:
      "Sim, você pode criar uma conta corporativa gratuitamente e executar simulações de análise de dados no ambiente de testes da plataforma.",
  },
];

function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-xl shadow-md"
              style={{
                backgroundImage: "var(--gradient-primary)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <BarChart3 className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">PRISMA ONE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Navegação Principal" className="hidden md:flex md:items-center md:gap-7">
            <a
              href="#problema"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              O Problema
            </a>
            <a
              href="#modulos"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Módulos
            </a>
            <a
              href="#como-funciona"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Como Funciona
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Planos
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dúvidas
            </a>
          </nav>

          <div className="hidden md:flex md:items-center md:gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild size="sm" className="font-semibold shadow-xs">
              <Link to="/auth">Começar agora</Link>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden grid size-10 place-items-center rounded-lg border border-border text-foreground"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-4 py-5 md:hidden space-y-3">
            <div className="flex flex-col gap-2.5">
              {["#problema", "#modulos", "#como-funciona", "#pricing", "#faq"].map((href) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {href === "#problema"
                    ? "O Problema"
                    : href === "#modulos"
                      ? "Módulos"
                      : href === "#como-funciona"
                        ? "Como Funciona"
                        : href === "#pricing"
                          ? "Planos"
                          : "Dúvidas"}
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Entrar
                </Link>
              </Button>
              <Button asChild className="w-full font-semibold">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Começar agora
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28 grid-bg">
          <div className="mx-auto max-w-7xl grid gap-14 lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 text-left space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="size-3.5" />
                SaaS Corporativo · LGPD · Governança de IA
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-foreground leading-[1.05]">
                  PRISMA ONE
                </h1>
                <p className="text-2xl font-semibold text-gradient sm:text-3xl">
                  Privacidade inteligente para um futuro seguro.
                </p>
              </div>

              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Monitore dados, reduza riscos, comprove conformidade com a LGPD e tenha controle
                sobre o uso de <strong>Inteligência Artificial</strong> em toda a sua empresa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button asChild size="lg" className="h-13 px-8 font-bold gap-2 shadow-md text-base">
                  <Link to="/auth">
                    Começar agora
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-13 px-8 text-base">
                  <Link to="/auth">Entrar</Link>
                </Button>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-success" /> Multi-tenancy isolado
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-success" /> Alinhado à ANPD
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-success" /> Auditoria de Viés em IA
                </span>
              </div>
            </div>

            {/* Dashboard Preview Card */}
            <div className="lg:col-span-5">
              <div className="surface-card rounded-2xl border border-border/80 p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-destructive" />
                    <div className="size-3 rounded-full bg-warning" />
                    <div className="size-3 rounded-full bg-success" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    PRISMA ONE · Painel Corporativo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Score LGPD", value: "98%", sub: "24 de 26 controles", tone: "text-success" },
                    { label: "Riscos Críticos", value: "0", sub: "Sob monitoramento", tone: "text-foreground" },
                    { label: "Dados Monitorados", value: "2.45 TB", sub: "24h contínuas", tone: "text-foreground" },
                    { label: "Modelos de IA", value: "12", sub: "100% auditados", tone: "text-primary" },
                  ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-border bg-secondary/30 p-3.5">
                      <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
                      <p className={`text-2xl font-bold mt-1 ${kpi.tone}`}>{kpi.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Prioridades de Hoje</span>
                    <span className="text-[10px] text-muted-foreground">31/08/2026</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { label: "3 riscos críticos identificados", tone: "text-destructive" },
                      { label: "4 evidências de conformidade pendentes", tone: "text-warning" },
                      { label: "2 avaliações de IA aguardando revisão", tone: "text-primary" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 rounded-lg bg-secondary/60 p-2">
                        <Bell className="size-3 shrink-0 text-muted-foreground" />
                        <span className={`truncate font-medium ${item.tone}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEMA SECTION */}
        <section id="problema" className="border-t border-border/60 bg-secondary/15 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <h2 className="text-xs font-bold uppercase tracking-widest text-destructive">
                Os Desafios Reais das Empresas
              </h2>
              <p className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Sem visibilidade, não há proteção. Sem evidências, não há conformidade.
              </p>
              <p className="text-base text-muted-foreground">
                Esses são os problemas que levam empresas a multas milionárias e crises de reputação.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((p) => (
                <div
                  key={p.title}
                  className="surface-card rounded-2xl border border-border/80 p-6 space-y-3 text-left hover:border-destructive/40 transition-colors"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <p.icon className="size-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MÓDULOS SECTION */}
        <section id="modulos" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Módulos da Plataforma
            </h2>
            <p className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Tudo o que sua organização precisa em um só lugar
            </p>
            <p className="text-base text-muted-foreground">
              Três grandes pilares que cobrem desde o inventário de dados até a governança de IA.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {modules.map((mod) => (
              <div
                key={mod.category}
                className="surface-card rounded-2xl border border-border/80 p-7 space-y-5 text-left hover:border-primary/40 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex size-12 items-center justify-center rounded-xl ${mod.bg} ${mod.color}`}>
                    <mod.icon className="size-6" />
                  </div>
                  <h3 className={`text-lg font-bold ${mod.color}`}>{mod.category}</h3>
                </div>
                <ul className="space-y-2.5">
                  {mod.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Check className={`size-4 shrink-0 ${mod.color}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="border-t border-border/60 bg-secondary/15 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                Recursos Avançados
              </h2>
              <p className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Arquitetura corporativa robusta
              </p>
              <p className="text-base text-muted-foreground">
                Desenhado para DPOs, engenheiros de segurança e gestores de tecnologia.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="surface-card rounded-2xl border border-border/80 p-6 transition-all hover:border-primary/50 hover:shadow-lg space-y-3 text-left"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Metodologia
            </h2>
            <p className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Como o PRISMA ONE protege sua operação
            </p>
            <p className="text-base text-muted-foreground">
              Fluxo contínuo de 3 etapas para eliminar vulnerabilidades de dados e riscos de IA.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="surface-card rounded-2xl border border-border p-6 relative text-left space-y-3"
              >
                <span className="text-3xl font-extrabold text-primary/40 font-mono">
                  {step.step}
                </span>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* LGPD & IA HIGHLIGHT */}
        <section className="border-t border-border/60 bg-secondary/15 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="surface-card rounded-3xl border border-border/80 p-8 sm:p-12 shadow-xl grid gap-8 lg:grid-cols-2 items-center">
              <div className="space-y-5 text-left">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                  <CheckCircle2 className="size-3.5" /> 100% Adequado à Legislação Brasileira
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Conformidade LGPD & Governança Ética de Inteligência Artificial
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A regulação de privacidade e o Marco Legal da IA exigem comprovação técnica de que
                  os dados de clientes e colaboradores são manipulados de forma legal, segura e não
                  discriminatória.
                </p>
                <ul className="space-y-2.5 text-sm">
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-success" />
                    <span>Mapeamento automático de bases legais (Art. 7º e 11 da LGPD)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-success" />
                    <span>Testes de acurácia e equidade para detecção de viés algorítmico</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-success" />
                    <span>Relatórios de Impacto à Proteção de Dados (RIPD/DPIA) pré-configurados</span>
                  </li>
                </ul>
                <Button asChild className="mt-2 font-semibold">
                  <Link to="/auth">Cadastre sua Empresa</Link>
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/40 p-6 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Indicadores de Governança
                </h3>
                <div className="space-y-3 text-xs">
                  {[
                    { label: "Mapeamento de Dados Pessoais", value: "100% Concluído", tone: "text-success" },
                    { label: "Base Legal Documentada", value: "96% Validada", tone: "text-success" },
                    { label: "Auditoria de Viés em Modelos de IA", value: "Conforme", tone: "text-primary" },
                    { label: "Plano de Resposta a Incidentes", value: "Vigente", tone: "text-warning" },
                  ].map((ind) => (
                    <div key={ind.label} className="rounded-xl border border-border bg-card p-3 flex justify-between items-center">
                      <span>{ind.label}</span>
                      <span className={`font-bold ${ind.tone}`}>{ind.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Planos e Preços
            </h2>
            <p className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Investimento sob medida para o tamanho da sua empresa
            </p>
            <p className="text-base text-muted-foreground">
              Transparência total, sem custos ocultos e com suporte especializado para DPOs.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 items-stretch">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`surface-card rounded-2xl border p-7 flex flex-col justify-between relative ${
                  plan.popular
                    ? "border-primary shadow-xl ring-2 ring-primary/20"
                    : "border-border/80"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold text-primary-foreground uppercase tracking-wider">
                    Mais Escolhido
                  </span>
                )}
                <div className="space-y-4 text-left">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-xs text-muted-foreground">{plan.period}</span>
                  </div>

                  <hr className="border-border/60" />

                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="size-4 text-success shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Button
                    asChild
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full font-semibold"
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="border-t border-border/60 bg-secondary/15 py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                Dúvidas Frequentes
              </h2>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                Perguntas e Respostas sobre o PRISMA ONE
              </p>
            </div>

            <div className="space-y-3 text-left">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className="surface-card rounded-xl border border-border overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-sm hover:bg-secondary/40 transition-colors"
                    aria-expanded={openFaq === index}
                  >
                    <span>{faq.question}</span>
                    <ChevronRight
                      className={`size-4 text-muted-foreground transition-transform ${
                        openFaq === index ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="p-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center text-primary-foreground space-y-6 shadow-2xl relative overflow-hidden"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Pronto para elevar a privacidade e segurança da sua empresa?
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-base opacity-90">
              Cadastre sua organização no <strong>PRISMA ONE</strong> e tenha visibilidade total de
              riscos, conformidade LGPD e governança de IA em minutos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="h-12 px-8 font-bold shadow-md">
                <Link to="/auth">Começar agora — É gratuito</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 font-bold bg-transparent border-white/30 text-white hover:bg-white/10">
                <Link to="/auth">Entrar na plataforma</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex size-9 items-center justify-center rounded-xl"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  <BarChart3 className="size-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">PRISMA ONE</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Plataforma corporativa de privacidade, conformidade LGPD, monitoramento de riscos e
                auditoria de Inteligência Artificial.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Plataforma
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><a href="#problema" className="hover:text-foreground">O Problema</a></li>
                <li><a href="#modulos" className="hover:text-foreground">Módulos</a></li>
                <li><a href="#como-funciona" className="hover:text-foreground">Como Funciona</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Planos</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Segurança & Legal
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link to="/politicas" className="hover:text-foreground">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/politicas" className="hover:text-foreground">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <span className="text-muted-foreground/60">Segurança e Criptografia</span>
                </li>
                <li>
                  <span className="text-muted-foreground/60">Relatório de Transparência</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Acesso Rápido
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link to="/auth" className="hover:text-foreground font-semibold text-primary">
                    Acessar Painel
                  </Link>
                </li>
                <li>
                  <Link to="/auth" className="hover:text-foreground">
                    Cadastrar Empresa
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/60 pt-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} PRISMA ONE. Todos os direitos reservados.</p>
            <p>Desenvolvido para segurança, privacidade e governança de IA.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
