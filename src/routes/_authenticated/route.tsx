import { useState } from "react";
import { createFileRoute, Outlet, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, HelpCircle, LogOut, ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/prisma/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { alerts } from "@/lib/prisma-data";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth", replace: true });
    }
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [helpOpen, setHelpOpen] = useState(false);

  // Buscar perfil da empresa no Supabase
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const company =
    profile?.company_name ||
    (user?.user_metadata?.["company_name"] as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Empresa";

  const initials = company.slice(0, 2).toUpperCase();
  const pendingAlerts = alerts.filter((a) => a.status === "pendente");

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="hidden md:inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Painel Corporativo
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Notifications Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Alertas e Notificações"
                    className="relative grid size-9 place-items-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Bell className="size-4" />
                    {pendingAlerts.length > 0 && (
                      <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                        {pendingAlerts.length}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0 shadow-lg">
                  <div className="flex items-center justify-between border-b border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide">
                      Alertas Recentes ({pendingAlerts.length})
                    </p>
                    <Link
                      to="/alertas"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Ver todos
                    </Link>
                  </div>
                  <ul className="divide-y divide-border/60 max-h-64 overflow-y-auto">
                    {pendingAlerts.slice(0, 3).map((alert) => (
                      <li key={alert.id} className="p-3 text-xs hover:bg-secondary/40">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-foreground truncate">
                            {alert.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.5 ${
                              alert.severity === "alto"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-warning/20 text-warning"
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <p className="mt-1 text-muted-foreground">{alert.context}</p>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>

              {/* Help Dialog Button */}
              <button
                type="button"
                onClick={() => setHelpOpen(true)}
                aria-label="Central de Ajuda e Suporte LGPD"
                className="grid size-9 place-items-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <HelpCircle className="size-4" />
              </button>

              {/* Company Info */}
              <div className="flex items-center gap-2.5 pl-1">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground shadow-xs"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  {initials}
                </div>
                <div className="hidden leading-tight sm:block text-left">
                  <p className="max-w-[160px] truncate text-xs font-semibold text-foreground">
                    {company}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Responsável LGPD / DPO</p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
              >
                <LogOut className="size-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 pb-10">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Help Dialog Modal */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Suporte & Governança — PRISMA ONE
            </DialogTitle>
            <DialogDescription>
              Centro de assistência técnica e suporte para DPOs e equipes de compliance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border p-3.5 bg-secondary/40 space-y-1">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wide">
                Conformidade com a LGPD (Lei 13.709/2018)
              </p>
              <p className="text-xs">
                O PRISMA ONE audita fluxos de dados, bases legais, consentimentos e direitos de
                titulares em tempo real.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-semibold text-foreground">Canais de Atendimento:</p>
              <ul className="space-y-1">
                <li>• E-mail: suporte@prismaone.com.br</li>
                <li>• Suporte DPO: atendimento em até 4h úteis</li>
                <li>• Base de Conhecimento e Modelos de Políticas inclusos</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
