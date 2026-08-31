import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
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

<<<<<<< HEAD
const items = [
  { title: "Visão Geral", url: "/dashboard", icon: Home },
=======
const mainItems = [
  { title: "Visão Geral", url: "/", icon: Home },
>>>>>>> 5f9e2333ff588a7d02e5e4203204c2791513a799
  { title: "Monitoramento Contínuo", url: "/monitoramento", icon: Activity },
  { title: "Varredura & Simulação", url: "/analise", icon: ScanSearch },
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
    <Sidebar collapsible="icon" className="border-sidebar-border bg-sidebar">
      <SidebarHeader className="px-3 py-5">
<<<<<<< HEAD
        <Link to="/dashboard" className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
            style={{
              backgroundImage: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
=======
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
>>>>>>> 5f9e2333ff588a7d02e5e4203204c2791513a799
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
