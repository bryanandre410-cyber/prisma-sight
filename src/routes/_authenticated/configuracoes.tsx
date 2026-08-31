import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Shield, Bell, Save, Lock, Sliders, Building2 } from "lucide-react";
import { toast } from "sonner";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — PRISMA ONE" },
      {
        name: "description",
        content:
          "Ajuste permissões de acesso, segurança da organização e preferências de monitoramento.",
      },
      { property: "og:title", content: "Configurações — PRISMA ONE" },
      {
        property: "og:description",
        content: "Controle de preferências de monitoramento, notificações e segurança do tenant.",
      },
    ],
  }),
  component: ConfiguracoesPage,
});

const permissions = [
  { role: "Administrador", scope: "Acesso total e gestão de faturamento", people: 2 },
  { role: "DPO (Encarregado de Dados)", scope: "Alertas, políticas, RIPD e laudos", people: 3 },
  {
    role: "Segurança da Informação",
    scope: "Monitoramento contínuo e resposta a incidentes",
    people: 6,
  },
  { role: "Auditoria", scope: "Somente leitura e logs de conformidade", people: 4 },
];

const preferences = [
  {
    id: "tempo-real",
    label: "Monitoramento Contínuo em Tempo Real",
    desc: "Análise ininterrupta de requisições e tráfego de dados sensíveis.",
  },
  {
    id: "ia",
    label: "Auditoria Automática de Modelos de IA",
    desc: "Verificações automáticas diárias de viés algorítmico e vazamento.",
  },
  {
    id: "email",
    label: "Alertas Críticos Imediatos por E-mail",
    desc: "Notificação instantânea para o DPO e equipe de segurança.",
  },
  {
    id: "retencao",
    label: "Aplicação Automática de Prazos de Retenção",
    desc: "Notificar quando dados pessoais ultrapassarem o tempo legal de expurgo.",
  },
  {
    id: "mfa",
    label: "Exigência de Autenticação em Duas Etapas (2FA)",
    desc: "Obrigar 2FA para todos os membros da organização.",
  },
];

function ConfiguracoesPage() {
  const [preferencesState, setPreferencesState] = useState<Record<string, boolean>>({
    "tempo-real": true,
    ia: true,
    email: true,
    retencao: true,
    mfa: true,
  });

  const handlePreferenceChange = (id: string, checked: boolean) => {
    setPreferencesState((prev) => ({ ...prev, [id]: checked }));
    const pref = preferences.find((p) => p.id === id);
    if (pref) {
      toast.success(`${pref.label} ${checked ? "ativado" : "desativado"}.`);
    }
  };

  const handleSaveAll = () => {
    toast.success("Todas as preferências da organização foram salvas com sucesso!");
  };

  return (
    <PageShell
      title="Configurações do Sistema"
      subtitle="Parâmetros de monitoramento, segurança do tenant e perfis de permissão."
      actions={
        <Button onClick={handleSaveAll} className="gap-2 font-semibold shadow-xs">
          <Save className="size-4" /> Salvar Preferências
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-2 text-left">
        {/* Monitoring & Security Preferences */}
        <Panel
          title="Preferências de Monitoramento & Segurança"
          description="Ajuste como o motor do PRISMA ONE opera no seu ambiente."
        >
          <ul className="space-y-4">
            {preferences.map((p) => (
              <li
                key={p.id}
                className="flex items-start justify-between gap-4 border-b border-border/50 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <Label
                    htmlFor={p.id}
                    className="text-xs font-semibold text-foreground cursor-pointer"
                  >
                    {p.label}
                  </Label>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{p.desc}</p>
                </div>
                <Switch
                  id={p.id}
                  checked={preferencesState[p.id] ?? false}
                  onCheckedChange={(checked) => handlePreferenceChange(p.id, checked)}
                />
              </li>
            ))}
          </ul>
        </Panel>

        {/* Roles and Scopes */}
        <Panel
          title="Matriz de Permissões (RBAC)"
          description="Escopos de acesso corporativo por função no PRISMA ONE."
        >
          <ul className="space-y-3">
            {permissions.map((p) => (
              <li
                key={p.role}
                className="flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-3"
              >
                <div>
                  <p className="text-xs font-bold text-foreground">{p.role}</p>
                  <p className="text-[11px] text-muted-foreground">{p.scope}</p>
                </div>
                <span className="text-[11px] font-medium text-primary bg-primary/10 rounded px-2 py-0.5">
                  {p.people} ativos
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-secondary/30 p-5 text-left text-xs space-y-1">
        <p className="font-semibold text-foreground">Isolamento de Dados e Conformidade:</p>
        <p className="text-muted-foreground">
          Todas as alterações nas configurações de segurança geram registros imutáveis nos logs de
          auditoria do <strong>PRISMA ONE</strong>.
        </p>
      </div>
    </PageShell>
  );
}
