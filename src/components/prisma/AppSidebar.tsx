import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
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
  UserCog,
  Building2,
  Plus,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainItems = [
  { title: "Visão Geral", url: "/", icon: Home },
  { title: "Monitoramento Contínuo", url: "/monitoramento", icon: Activity },
  { title: "Conformidade LGPD", url: "/conformidade", icon: ShieldCheck },
  { title: "Auditoria de IA", url: "/auditoria-ia", icon: Bot },
  { title: "Alertas e Riscos", url: "/alertas", icon: Bell },
  { title: "Políticas de Privacidade", url: "/politicas", icon: ScrollText },
  { title: "Relatórios", url: "/relatorios", icon: FileText },
] as const;

const integrationItems = [
  { title: "Empresas", url: "/empresas", icon: Building2 },
  { title: "Simulação de Integração", url: "/simulacao", icon: Building2 },
  { title: "Nova Empresa", url: "/nova-empresa", icon: Plus },
] as const;

const adminItems = [
  { title: "Administrador", url: "/administrador", icon: UserCog },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [integrationsOpen, setIntegrationsOpen] = useState(true);

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="px-3 py-5">
        <div className="flex items-center gap-3">
          <img 
            src="/prisma-logo.png" 
            alt="Prisma One Logo" 
            className="size-10 shrink-0 rounded-xl object-contain"
            style={{ boxShadow: "var(--shadow-glow)" }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div
            className="hidden flex size-10 shrink-0 items-center justify-center rounded-xl"
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
              {mainItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Integrações</SidebarGroupLabel>
          <SidebarGroupContent>
            <Collapsible open={integrationsOpen} onOpenChange={setIntegrationsOpen}>
              <SidebarMenu>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Integrações">
                      <Building2 className="size-4" />
                      <span className="truncate">Integrações</span>
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {integrationItems.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton asChild isActive={pathname === item.url}>
                            <Link to={item.url} className="flex items-center gap-3">
                              <item.icon className="size-4" />
                              <span className="truncate">{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </SidebarMenu>
            </Collapsible>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
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