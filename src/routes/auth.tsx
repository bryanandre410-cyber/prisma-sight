import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { formatCnpj, isValidCnpj, translateAuthError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso Corporativo — PRISMA ONE" },
      {
        name: "description",
        content:
          "Entre ou cadastre a sua empresa no PRISMA ONE para gerenciar privacidade, conformidade LGPD e auditoria de IA.",
      },
      { property: "og:title", content: "Acesso Corporativo — PRISMA ONE" },
      {
        property: "og:description",
        content: "Centro de controle de privacidade, dados e governança de IA para empresas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const SECTORES = [
  "Tecnologia & SaaS",
  "Financeiro & Fintech",
  "Saúde & Healthtech",
  "Varejo & E-commerce",
  "Educação & Edtech",
  "Serviços Jurídicos / Consultoria",
  "Indústria & Manufatura",
  "Outro",
];

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup" | "recovery">("login");
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [sector, setSector] = useState(SECTORES[0]);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cnpjError, setCnpjError] = useState("");

  // Password Recovery
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/_authenticated/dashboard", replace: true });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate({ to: "/_authenticated/dashboard", replace: true });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCnpj(e.target.value);
    setCnpj(formatted);
    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 14) {
      if (!isValidCnpj(formatted)) {
        setCnpjError("CNPJ inválido. Verifique os dígitos digitados.");
      } else {
        setCnpjError("");
      }
    } else {
      setCnpjError("");
    }
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!loginEmail.trim() || !loginPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) throw error;

      toast.success("Acesso autorizado ao PRISMA ONE.");
      navigate({ to: "/_authenticated/dashboard", replace: true });
    } catch (error) {
      toast.error(translateAuthError(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!companyName.trim()) {
      toast.error("O nome da empresa é obrigatório.");
      return;
    }

    const cleanCnpj = cnpj.replace(/\D/g, "");
    if (cleanCnpj.length > 0 && cleanCnpj.length !== 14) {
      toast.error("O CNPJ deve conter 14 dígitos.");
      return;
    }

    if (cleanCnpj.length === 14 && !isValidCnpj(cnpj)) {
      toast.error("CNPJ inválido. Por favor, corrija antes de prosseguir.");
      return;
    }

    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      toast.error("Informe um e-mail corporativo válido.");
      return;
    }

    if (signupPassword.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail.trim(),
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/_authenticated/dashboard`,
          data: {
            company_name: companyName.trim(),
            cnpj: cnpj.trim() || null,
            sector,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Garantir que a tabela profiles tenha as informações atualizadas
        try {
          await supabase
            .from("profiles")
            .upsert({
              id: data.user.id,
              company_name: companyName.trim(),
              cnpj: cnpj.trim() || null,
              sector,
              updated_at: new Date().toISOString(),
            });
        } catch (err) {
          // Silently fail on profile update
          console.error("Erro ao atualizar perfil:", err);
        }
      }

      if (data.session) {
        toast.success("Empresa cadastrada com sucesso! Bem-vindo ao PRISMA ONE.");
        navigate({ to: "/_authenticated/dashboard", replace: true });
      } else {
        toast.success(
          "Cadastro realizado! Enviamos um e-mail de confirmação para ativar sua conta.",
          { duration: 6000 },
        );
        setTab("login");
      }
    } catch (error) {
      toast.error(translateAuthError(error));
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordRecovery(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!recoveryEmail.trim() || !recoveryEmail.includes("@")) {
      toast.error("Informe o e-mail corporativo cadastrado.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail.trim(), {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      setRecoverySent(true);
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (error) {
      toast.error(translateAuthError(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (loading) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/_authenticated/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(translateAuthError(error));
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-3 transition-opacity hover:opacity-90"
        >
          <div
            className="flex size-12 items-center justify-center rounded-2xl shadow-lg"
            style={{
              backgroundImage: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <BarChart3 className="size-6 text-primary-foreground" />
          </div>
          <div className="leading-tight text-left">
            <p className="text-xl font-bold tracking-tight text-foreground">PRISMA ONE</p>
            <p className="text-xs font-medium text-muted-foreground">
              Privacidade, LGPD & Auditoria de IA
            </p>
          </div>
        </Link>

        {/* Main Card */}
        <div className="surface-card rounded-2xl border border-border/80 p-6 sm:p-8 shadow-xl">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar Empresa</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login" className="space-y-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Acesso Corporativo
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Entre com as credenciais da sua organização.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">E-mail corporativo</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="dpo@suaempresa.com.br"
                      className="pl-9"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      autoComplete="email"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Senha</Label>
                    <button
                      type="button"
                      onClick={() => setTab("recovery")}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Validando acesso...
                    </>
                  ) : (
                    "Entrar no PRISMA ONE"
                  )}
                </Button>
              </form>

              <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                ou continue com
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full h-11 border-border/80 hover:bg-secondary"
                onClick={handleGoogle}
                disabled={loading}
                aria-label="Entrar com Google Workspace"
              >
                <svg className="mr-2 size-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google Workspace
              </Button>
            </TabsContent>

            {/* SIGNUP TAB */}
            <TabsContent value="signup" className="space-y-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Cadastrar Empresa
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Crie o espaço corporativo da sua organização no PRISMA ONE.
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company-name">Nome da Empresa / Razão Social</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="company-name"
                      type="text"
                      placeholder="Ex: Prisma Tecnologia Ltda."
                      className="pl-9"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-cnpj">CNPJ (opcional)</Label>
                    <Input
                      id="signup-cnpj"
                      type="text"
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={handleCnpjChange}
                      maxLength={18}
                      disabled={loading}
                    />
                    {cnpjError && (
                      <p className="text-[11px] text-destructive" role="alert">
                        {cnpjError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-sector">Setor de Atuação</Label>
                    <select
                      id="signup-sector"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      disabled={loading}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {SECTORES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">E-mail corporativo do DPO / Responsável</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="privacidade@empresa.com.br"
                      className="pl-9"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      autoComplete="email"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password">Senha (mínimo 8 dígitos)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        minLength={8}
                        autoComplete="new-password"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={8}
                        autoComplete="new-password"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {signupPassword && confirmPassword && signupPassword !== confirmPassword && (
                  <p className="text-xs text-destructive" role="alert">
                    As senhas digitadas não coincidem.
                  </p>
                )}

                <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5 font-medium text-foreground">
                    <ShieldCheck className="size-4 text-success" />
                    Segurança e Multi-Tenancy
                  </p>
                  <p className="mt-1">
                    Os dados da sua organização são isolados por criptografia e políticas de Row
                    Level Security (RLS).
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Criando ambiente corporativo...
                    </>
                  ) : (
                    "Criar Conta da Empresa"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* PASSWORD RECOVERY TAB */}
            <TabsContent value="recovery" className="space-y-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Recuperação de Senha
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Informe o e-mail cadastrado para receber as instruções de redefinição.
                </p>
              </div>

              {recoverySent ? (
                <div className="rounded-xl border border-success/30 bg-success/10 p-5 text-center space-y-3">
                  <CheckCircle2 className="mx-auto size-8 text-success" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Instruções enviadas com sucesso!
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Enviamos um link para <strong>{recoveryEmail}</strong>. Verifique sua caixa de
                    entrada e a pasta de spam.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRecoverySent(false);
                      setTab("login");
                    }}
                  >
                    Voltar ao Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordRecovery} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="recovery-email">E-mail corporativo cadastrado</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="dpo@empresa.com.br"
                        className="pl-9"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Enviando instruções...
                      </>
                    ) : (
                      "Enviar Link de Recuperação"
                    )}
                  </Button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Lembrou da senha? Voltar ao login
                    </button>
                  </div>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PRISMA ONE. Todos os direitos reservados. Conformidade e
          Segurança de Dados.
        </p>
      </div>
    </div>
  );
}
