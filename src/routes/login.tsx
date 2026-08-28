import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Lock, Mail, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Prisma One" },
      {
        name: "description",
        content: "Acesse o sistema de privacidade e conformidade da sua empresa.",
      },
      { property: "og:title", content: "Login — Prisma One" },
      {
        property: "og:description",
        content: "Acesse o painel de controle de privacidade e IA.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    company: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de autenticação
    setTimeout(() => {
      if (formData.email && formData.password && formData.company) {
        // Salvar dados de autenticação
        if (typeof window !== "undefined") {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userCompany", formData.company);
          localStorage.setItem("userEmail", formData.email);
        }
        
        toast.success("Login realizado com sucesso!");
        router.navigate({ to: "/" });
      } else {
        toast.error("Por favor, preencha todos os campos.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl"
            style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Building2 className="size-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Prisma One</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Privacidade inteligente para um futuro seguro
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acessar Sistema</CardTitle>
            <CardDescription>
              Entre com suas credenciais corporativas para acessar o painel de controle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Nome da Empresa</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="company"
                    type="text"
                    placeholder="Sua empresa"
                    className="pl-9"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail Corporativo</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@empresa.com"
                    className="pl-9"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? "Autenticando..." : "Entrar"}
                {!isLoading && <ArrowRight className="size-4" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Ao entrar, você concorda com os termos de uso e política de privacidade.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Precisa de ajuda? Entre em contato com o suporte da sua empresa.
          </p>
        </div>
      </div>
    </div>
  );
}
