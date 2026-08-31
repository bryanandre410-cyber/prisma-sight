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
  ChevronRight,
  Database,
  ClipboardList,
  Monitor,
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

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

const mainItems: NavItem[] = [
  { title: "Visão Geral", url: "/_authenticated/dashboard", icon: Home },
  { title: "Monitoramento", url: "/_authenticated/monitoramento", icon: Monitor },
  { title: "Alertas e Riscos", url: "/_authenticated/alertas", icon: Bell },
];

const complianceItems: NavItem[] = [
  { title: "Conformidade LGPD", url: "/_authenticated/conformidade", icon: ShieldCheck },
  { title: "Inventário de Dados", url: "/_authenticated/inventario", icon: Database },
  { title: "Políticas de Privacidade", url: "/_authenticated/politicas", icon: ScrollText },
  { title: "Plano de Ação", url: "/_authenticated/plano-acao", icon: ClipboardList },
];

const aiItems: NavItem[] = [
  { title: "Auditoria de IA", url: "/_authenticated/auditoria-ia", icon: Bot },
  { title: "Varredura & Análise", url: "/_authenticated/analise", icon: ScanSearch },
];

const adminItems: NavItem[] = [
  { title: "Relatórios", url: "/_authenticated/relatorios", icon: FileText },
  { title: "Administração", url: "/_authenticated/administracao", icon: UserCog },
  { title: "Configurações", url: "/_authenticated/configuracoes", icon: Settings },
];

function isActive(pathname: string, url: string): boolean {
  return pathname === url || pathname.startsWith(url + "/");
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [complianceOpen, setComplianceOpen] = useState(true);
  const [aiOpen, setAiOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border bg-sidebar">
      <SidebarHeader className="px-3 py-5">
        <Link to="/_authenticated/dashboard" className="flex items-center gap-3">
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
        {/* Main items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(pathname, item.url)}
                    tooltip={item.title}
                    className="h-10 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold transition-colors"
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

        {/* Compliance group */}
        <SidebarGroup>
          <SidebarGroupLabel>Privacidade & LGPD</SidebarGroupLabel>
          <SidebarGroupContent>
            <Collapsible open={complianceOpen} onOpenChange={setComplianceOpen}>
              <SidebarMenu>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Privacidade & LGPD">
                      <ShieldCheck className="size-4" />
                      <span className="truncate">Conformidade</span>
                      <ChevronRight
                        className={`ml-auto size-4 transition-transform duration-200 ${complianceOpen ? "rotate-90" : ""}`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {complianceItems.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(pathname, item.url)}
                          >
                            <Link to={item.url} className="flex items-center gap-3">
                              <item.icon className="size-4 shrink-0" />
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

        {/* AI group */}
        <SidebarGroup>
          <SidebarGroupLabel>Inteligência Artificial</SidebarGroupLabel>
          <SidebarGroupContent>
            <Collapsible open={aiOpen} onOpenChange={setAiOpen}>
              <SidebarMenu>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Inteligência Artificial">
                      <Bot className="size-4" />
                      <span className="truncate">Governança de IA</span>
                      <ChevronRight
                        className={`ml-auto size-4 transition-transform duration-200 ${aiOpen ? "rotate-90" : ""}`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {aiItems.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(pathname, item.url)}
                          >
                            <Link to={item.url} className="flex items-center gap-3">
                              <item.icon className="size-4 shrink-0" />
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

        {/* Admin group */}
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
              <SidebarMenu>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Administração">
                      <UserCog className="size-4" />
                      <span className="truncate">Administração</span>
                      <ChevronRight
                        className={`ml-auto size-4 transition-transform duration-200 ${adminOpen ? "rotate-90" : ""}`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {adminItems.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(pathname, item.url)}
                          >
                            <Link to={item.url} className="flex items-center gap-3">
                              <item.icon className="size-4 shrink-0" />
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
      </SidebarContent>

      <SidebarFooter className="px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-background/50 p-3 shadow-xs">
          <ShieldCheck className="size-5 text-success shrink-0" aria-hidden="true" />
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
