import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, BarChart3, Bot, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

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
        property: "og:description", content: "Monitoramento contínuo, LGPD e auditoria de IA em um único painel corporativo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      if (isAuthenticated) {
        // Redirect to dashboard if authenticated
        window.location.href = "/_authenticated/dashboard";
      }
    }
  }, [navigate]);

  return <Landing />;
}

const highlights = [
  {
    icon: Activity,
    title: "Monitoramento contínuo",
    text: "Acompanhe 24h o fluxo de dados, acessos e compartilhamentos suspeitos.",
  },
  {
    icon: ShieldCheck,
    title: "Conformidade LGPD",
    text: "Veja o nível de adequação da empresa e o que ainda precisa ser ajustado.",
  },
  {
    icon: Bot,
    title: "Auditoria de IA",
    text: "Avalie viés, vazamento e uso indevido de dados pelos modelos de IA.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-xl"
            style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <BarChart3 className="size-5 text-primary-foreground" />
          </div>
          <p className="text-lg font-semibold tracking-tight">Prisma one</p>
        </div>
        <Link
          to="/auth"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Entrar
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pb-20">
        <section className="py-16 text-center md:py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-glow">
            Privacidade inteligente para um futuro seguro
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            O centro de controle de privacidade da sua empresa na era da IA
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground">
            Monitore dados, identifique riscos, comprove conformidade com a LGPD e audite seus
            modelos de Inteligência Artificial — tudo em um só lugar.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/auth"
              className="rounded-md px-5 py-2.5 text-sm font-medium text-primary-foreground"
              style={{
                backgroundImage: "var(--gradient-primary)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              Acessar com a empresa
            </Link>
            <Link
              to="/auth"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              Cadastrar empresa
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="surface-card rounded-2xl border border-border p-6">
              <item.icon className="size-6 text-primary-glow" />
              <h2 className="mt-4 text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
