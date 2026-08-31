import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  FileText,
  Home,
  ScanSearch,
  ScrollText,
  ShieldCheck,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Visão Geral", url: "/dashboard", icon: Home },
  { title: "Monitoramento Contínuo", url: "/monitoramento", icon: Activity },
  { title: "Varredura & Simulação", url: "/analise", icon: ScanSearch },
  { title: "Conformidade LGPD", url: "/conformidade", icon: ShieldCheck },
  { title: "Auditoria de IA", url: "/auditoria-ia", icon: Bot },
  { title: "Alertas e Riscos", url: "/alertas", icon: Bell },
  { title: "Políticas de Privacidade", url: "/politicas", icon: ScrollText },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
  { title: "Administração", url: "/administracao", icon: Users },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border bg-sidebar">
      <SidebarHeader className="px-3 py-5">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
            style={{
              backgroundImage: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <BarChart3 className="size-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="leading-tight text-left">
              <p className="text-base font-bold tracking-tight text-foreground">PRISMA ONE</p>
              <p className="text-[11px] text-muted-foreground truncate">
                Privacidade & Auditoria de IA
              </p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="h-10 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium transition-colors"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-background/50 p-3 shadow-xs">
          <ShieldCheck className="size-5 text-success shrink-0" />
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-xs font-semibold text-success">Proteção Ativa</p>
              <p className="text-[10px] text-muted-foreground">Monitoramento 24/7 operacional</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
