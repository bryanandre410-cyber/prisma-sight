import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bot,
  ShieldCheck,
  Lock,
  FileText,
  Eye,
  AlertTriangle,
  CheckCircle,
  Menu,
  X,
  Database,
  TrendingUp,
  Users,
  FileCheck,
  ChevronRight,
  Clock,
  Shield,
  Key,
  ClipboardCheck,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prisma One — Privacidade e IA sob controle" },
      {
        name: "description",
        content:
          "Centro de controle de privacidade, conformidade LGPD e auditoria de IA para empresas. Acesse com a conta da sua empresa.",
      },
      { property: "og:title", content: "Prisma One — Privacidade e IA sob controle" },
      {
        property: "og:description",
        content: "Monitoramento contínuo, LGPD e auditoria de IA em um único painel corporativo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Activity,
    title: "Monitoramento contínuo",
    description: "Acompanhe 24h o fluxo de dados, acessos e compartilhamentos suspeitos em tempo real.",
  },
  {
    icon: ShieldCheck,
    title: "Conformidade LGPD",
    description: "Veja o nível de adequação da empresa e o que ainda precisa ser ajustado para estar em conformidade.",
  },
  {
    icon: Bot,
    title: "Auditoria de IA",
    description: "Avalie viés, vazamento e uso indevido de dados pelos modelos de Inteligência Artificial.",
  },
  {
    icon: AlertTriangle,
    title: "Gestão de riscos",
    description: "Identifique e mitigue riscos de segurança antes que se tornem problemas.",
  },
  {
    icon: Lock,
    title: "Controle de acesso",
    description: "Gerencie permissões e garanta que apenas pessoas autorizadas acessem dados sensíveis.",
  },
  {
    icon: FileText,
    title: "Relatórios e evidências",
    description: "Gere relatórios detalhados para auditorias e demonstração de conformidade.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Conecte seus dados e sistemas",
    description: "Integre facilmente suas fontes de dados, sistemas de IA e plataformas corporativas ao Prisma One.",
  },
  {
    step: "2",
    title: "O Prisma One identifica riscos e não conformidades",
    description: "Nossa IA analisa continuamente seus dados, detectando anomalias, riscos de privacidade e problemas de conformidade.",
  },
  {
    step: "3",
    title: "Sua equipe acompanha, corrige e comprova a conformidade",
    description: "Receba alertas, corrija problemas e gere relatórios para demonstrar conformidade com LGPD e normas de segurança.",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Redução de riscos",
    description: "Proteja sua empresa contra vazamentos de dados, multas e danos à reputação.",
  },
  {
    icon: Eye,
    title: "Visibilidade dos dados",
    description: "Saiba exatamente onde seus dados estão, quem acessa e como são utilizados.",
  },
  {
    icon: FileCheck,
    title: "Evidências para auditorias",
    description: "Gere relatórios detalhados e comprovantes de conformidade automaticamente.",
  },
  {
    icon: Clock,
    title: "Monitoramento contínuo",
    description: "Vigilância 24/7 de seus dados e sistemas de IA com alertas em tempo real.",
  },
  {
    icon: Shield,
    title: "Governança de IA",
    description: "Controle e audite o uso de Inteligência Artificial em sua organização.",
  },
  {
    icon: Users,
    title: "Colaboração em equipe",
    description: "Trabalhe em conjunto com sua equipe de privacidade e segurança de dados.",
  },
];

const securityFeatures = [
  { icon: ShieldCheck, title: "LGPD", description: "Totalmente alinhado à Lei Geral de Proteção de Dados" },
  { icon: Lock, title: "Controle de acesso", description: "Gerenciamento granular de permissões" },
  { icon: FileText, title: "Logs de auditoria", description: "Registro completo de todas as atividades" },
  { icon: Activity, title: "Monitoramento contínuo", description: "Vigilância 24/7 de sistemas e dados" },
  { icon: Key, title: "Criptografia", description: "Dados criptografados em repouso e em trânsito" },
  { icon: Users, title: "Gestão de permissões", description: "Controle detalhado de acessos por usuário" },
];

const faqs = [
  {
    question: "O que é o Prisma One?",
    answer: "Prisma One é uma plataforma SaaS de privacidade e segurança de dados que ajuda empresas a monitorar dados, garantir conformidade com a LGPD e auditar o uso de Inteligência Artificial em uma única interface centralizada.",
  },
  {
    question: "Como funciona o monitoramento?",
    answer: "O Prisma One conecta-se aos seus sistemas de dados e IA, monitorando continuamente o fluxo de informações, acessos e compartilhamentos. Quando detecta algo fora do padrão, gera alertas automáticos para sua equipe.",
  },
  {
    question: "O sistema ajuda na adequação à LGPD?",
    answer: "Sim. O Prisma One avalia continuamente sua conformidade com a LGPD, identifica gaps e fornece recomendações. Também gera relatórios e evidências necessárias para demonstrar conformidade em auditorias.",
  },
  {
    question: "Como funciona a auditoria de IA?",
    answer: "Nossa plataforma analisa seus modelos de IA, detectando uso indevido de dados, vieses, vazamentos de informações e riscos de privacidade. Você recebe relatórios detalhados e recomendações de correção.",
  },
  {
    question: "Meus dados ficam seguros?",
    answer: "Absolutamente. Utilizamos criptografia de ponta a ponta, controle de acesso rigoroso, monitoramento contínuo e seguimos as melhores práticas de segurança. Seus dados são seus e permanecem sob seu controle.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim, você pode cancelar sua assinatura a qualquer momento sem penalidades. Seus dados serão exportados ou deletados conforme sua escolha, garantindo total controle sobre suas informações.",
  },
];

function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Prisma One</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <Link to="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Recursos
            </Link>
            <Link to="#lgpd" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              LGPD
            </Link>
            <Link to="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Segurança
            </Link>
            <Link to="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Preços
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Entrar
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Começar agora
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-4 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                to="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Recursos
              </Link>
              <Link
                to="#lgpd"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                LGPD
              </Link>
              <Link
                to="#security"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Segurança
              </Link>
              <Link
                to="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preços
              </Link>
              <hr className="border-border" />
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link
                to="/login"
                className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                Começar agora
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-24 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Controle total sobre os dados da sua empresa na era da IA
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                Monitore dados, detecte riscos, gerencie a conformidade com a LGPD e audite o uso de
                inteligência artificial em uma única plataforma.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 sm:text-sm"
                >
                  Começar gratuitamente
                  <ArrowRight className="ml-2 size-4" />
                </Link>
                <Link
                  to="#how-it-works"
                  className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-medium hover:bg-accent sm:text-sm"
                >
                  Ver como funciona
                </Link>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative">
              <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-destructive" />
                    <div className="size-3 rounded-full bg-warning" />
                    <div className="size-3 rounded-full bg-success" />
                  </div>
                  <span className="text-xs text-muted-foreground">Dashboard Prisma One</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Score de Conformidade</span>
                      <CheckCircle className="size-4 text-success" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold">87%</p>
                    <p className="text-xs text-success">+5% este mês</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Riscos Críticos</span>
                      <AlertTriangle className="size-4 text-destructive" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold">3</p>
                    <p className="text-xs text-destructive">Requer atenção</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Dados Monitorados</span>
                      <Database className="size-4 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold">2.4M</p>
                    <p className="text-xs text-muted-foreground">Registros</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Modelos de IA</span>
                      <Bot className="size-4 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold">12</p>
                    <p className="text-xs text-muted-foreground">Auditados</p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-muted p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Alertas Recentes</span>
                    <span className="text-xs text-muted-foreground">Últimas 24h</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="size-2 rounded-full bg-warning" />
                      <span className="text-muted-foreground">Acesso não autorizado detectado</span>
                      <span className="ml-auto text-muted-foreground">2h atrás</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="size-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">Conformidade LGPD atualizada</span>
                      <span className="ml-auto text-muted-foreground">5h atrás</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="size-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Novo modelo de IA integrado</span>
                      <span className="ml-auto text-muted-foreground">8h atrás</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Tudo o que sua empresa precisa para proteger seus dados
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Uma plataforma completa de privacidade, segurança e conformidade
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Como funciona</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Três passos simples para proteger seus dados e garantir conformidade
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {howItWorks.map((step) => (
              <div key={step.step} className="relative">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {step.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                {step.step !== "3" && (
                  <ChevronRight className="absolute right-0 top-8 hidden size-6 text-muted-foreground md:block" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Visualization Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-card p-8 shadow-lg">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Dashboard de conformidade em tempo real
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Visualize o status de privacidade da sua empresa em um único painel. Monitoramento
                  contínuo, alertas automáticos e métricas claras para tomada de decisões.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-success" />
                    <span>Score de conformidade LGPD atualizado</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-success" />
                    <span>Alertas de riscos em tempo real</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-success" />
                    <span>Histórico de atividades e acessos</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-success" />
                    <span>Relatórios prontos para auditorias</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg bg-muted p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Evolução da Conformidade</span>
                  <span className="text-xs text-muted-foreground">Últimos 6 meses</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="w-16 text-xs text-muted-foreground">Jan</span>
                    <div className="flex-1 rounded-full bg-secondary h-2">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "65%" }} />
                    </div>
                    <span className="text-xs font-medium">65%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-16 text-xs text-muted-foreground">Fev</span>
                    <div className="flex-1 rounded-full bg-secondary h-2">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "72%" }} />
                    </div>
                    <span className="text-xs font-medium">72%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-16 text-xs text-muted-foreground">Mar</span>
                    <div className="flex-1 rounded-full bg-secondary h-2">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "78%" }} />
                    </div>
                    <span className="text-xs font-medium">78%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-16 text-xs text-muted-foreground">Abr</span>
                    <div className="flex-1 rounded-full bg-secondary h-2">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "82%" }} />
                    </div>
                    <span className="text-xs font-medium">82%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-16 text-xs text-muted-foreground">Mai</span>
                    <div className="flex-1 rounded-full bg-secondary h-2">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "85%" }} />
                    </div>
                    <span className="text-xs font-medium">85%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-16 text-xs text-muted-foreground">Jun</span>
                    <div className="flex-1 rounded-full bg-secondary h-2">
                      <div className="h-2 rounded-full bg-success" style={{ width: "87%" }} />
                    </div>
                    <span className="text-xs font-medium">87%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Benefícios para sua empresa
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Por que escolher o Prisma One para proteger seus dados
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="size-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security and Trust Section */}
        <section id="security" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Segurança e confiança
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Construído com as mais rigorosas práticas de segurança
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {securityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-success/10">
                  <feature.icon className="size-6 text-success" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Perguntas frequentes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tire suas dúvidas sobre o Prisma One
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-accent"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronRight
                    className={`size-5 transition-transform ${
                      openFaq === index ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-primary px-8 py-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Pronto para proteger seus dados?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Comece gratuitamente e transforme a privacidade da sua empresa
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-primary-foreground px-6 py-3 text-base font-medium text-primary hover:bg-primary-foreground/90 sm:text-sm"
              >
                Começar gratuitamente
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                to="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-primary-foreground/30 px-6 py-3 text-base font-medium hover:bg-primary-foreground/10 sm:text-sm"
              >
                Falar com especialista
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
                  <BarChart3 className="size-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold tracking-tight">Prisma One</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Plataforma SaaS de privacidade, LGPD e auditoria de IA para empresas.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Produto</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link to="#features" className="text-muted-foreground hover:text-foreground">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link to="#pricing" className="text-muted-foreground hover:text-foreground">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link to="#security" className="text-muted-foreground hover:text-foreground">
                    Segurança
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-muted-foreground hover:text-foreground">
                    Entrar
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Empresa</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted-foreground hover:text-foreground">
                    LGPD
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Prisma One. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
