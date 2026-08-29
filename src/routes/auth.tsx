import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso da empresa — Prisma One" },
      {
        name: "description",
        content:
          "Entre com a conta da sua empresa no Prisma One para acompanhar privacidade, LGPD e auditoria de IA.",
      },
      { property: "og:title", content: "Acesso da empresa — Prisma One" },
      {
        property: "og:description",
        content: "Login corporativo do centro de controle de privacidade e IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: sessionData }: any) => {
      if (sessionData?.session) navigate({ to: "/administracao", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate({ to: "/administracao", replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Acesso liberado");
        navigate({ to: "/administracao", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { company_name: companyName, cnpj },
          },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/administracao", replace: true });
        } else {
          toast.success("Confira seu e-mail para confirmar o cadastro da empresa.");
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível continuar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-3">
          <div
            className="flex size-11 items-center justify-center rounded-xl"
            style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <BarChart3 className="size-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold tracking-tight">Prisma one</p>
            <p className="text-[11px] text-muted-foreground">Acesso corporativo</p>
          </div>
        </Link>

        <div className="surface-card rounded-2xl border border-border p-6">
          <h1 className="text-xl font-semibold tracking-tight">
            {mode === "login" ? "Entrar com a empresa" : "Cadastrar empresa"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Use as credenciais corporativas do responsável pela privacidade."
              : "Crie o acesso da sua empresa ao centro de controle."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Nome da empresa</Label>
                  <Input
                    id="company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Prisma Tecnologia Ltda."
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail corporativo</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="privacidade@empresa.com.br"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {mode === "login" ? "Entrar" : "Criar acesso"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Ainda não tem acesso?" : "Já possui uma conta?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-medium text-primary-glow hover:underline"
            >
              {mode === "login" ? "Cadastrar empresa" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
