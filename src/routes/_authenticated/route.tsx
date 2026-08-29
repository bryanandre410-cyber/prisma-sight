import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, HelpCircle, LogOut } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/prisma/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const company =
    (user?.user_metadata?.company_name as string | undefined) || user?.email || "Empresa";
  const initials = company.slice(0, 2).toUpperCase();

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
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <button className="relative text-muted-foreground transition-colors hover:text-foreground">
                <Bell className="size-5" />
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary-glow" />
              </button>
              <HelpCircle className="size-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div
                  className="flex size-8 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  {initials}
                </div>
                <div className="hidden leading-tight sm:block">
                  <p className="max-w-[180px] truncate text-sm font-medium">{company}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Responsável pela Privacidade
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
