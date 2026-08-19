import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  FileText,
  Home,
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
  { title: "Visão Geral", url: "/", icon: Home },
  { title: "Monitoramento Contínuo", url: "/monitoramento", icon: Activity },
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
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="px-3 py-5">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <BarChart3 className="size-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-lg font-semibold tracking-tight">Prisma one</p>
              <p className="text-[11px] text-muted-foreground">
                Privacidade inteligente para um futuro seguro
              </p>
            </div>
          )}
        </div>
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
                    className="h-11 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4" />
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
        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 p-3">
          <ShieldCheck className="size-5 text-success" />
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-sm font-medium text-success">Proteção Ativa</p>
              <p className="text-[11px] text-muted-foreground">Todos os sistemas operacionais</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}