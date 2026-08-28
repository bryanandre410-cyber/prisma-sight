import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Prisma One" },
      {
        name: "description",
        content: "Ajuste permissões de acesso, visibilidade das informações e preferências de monitoramento.",
      },
      { property: "og:title", content: "Configurações — Prisma One" },
      {
        property: "og:description",
        content: "Controle quem vê cada informação e como o monitoramento funciona.",
      },
    ],
  }),
  component: ConfiguracoesPage,
});

const permissions = [
  { role: "Administrador", scope: "Acesso total à plataforma", people: 2 },
  { role: "Responsável pela Privacidade (DPO)", scope: "Alertas, políticas e relatórios", people: 3 },
  { role: "Segurança da Informação", scope: "Monitoramento e incidentes", people: 6 },
  { role: "Auditoria", scope: "Somente leitura de relatórios", people: 4 },
];

const preferences = [
  { id: "tempo-real", label: "Monitoramento em tempo real", desc: "Analisar fluxos continuamente, 24/7." },
  { id: "ia", label: "Auditoria automática de modelos de IA", desc: "Verificações diárias de viés e vazamento." },
  { id: "email", label: "Notificar alertas de gravidade alta por e-mail", desc: "Envio imediato ao DPO." },
  { id: "retencao", label: "Descarte automático por prazo de retenção", desc: "Aplicar políticas de retenção." },
];

function ConfiguracoesPage() {
  const [preferencesState, setPreferencesState] = useState<Record<string, boolean>>({
    "tempo-real": true,
    "ia": true,
    "email": true,
    "retencao": false,
  });

  const handlePreferenceChange = (id: string, checked: boolean) => {
    setPreferencesState((prev) => ({ ...prev, [id]: checked }));
    
    const pref = preferences.find((p) => p.id === id);
    if (pref) {
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="size-4" />
          <span>
            {pref.label} {checked ? "ativado" : "desativado"}
          </span>
        </div>
      );
    }
  };

  return (
    <PageShell
      title="Configurações"
      subtitle="Permissões de acesso e preferências de monitoramento."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Permissões de acesso" description="Quem pode ver cada informação.">
          <ul className="space-y-3">
            {permissions.map((p) => (
              <li
                key={p.role}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background/40 p-3"
              >
                <div>
                  <p className="text-sm font-medium">{p.role}</p>
                  <p className="text-xs text-muted-foreground">{p.scope}</p>
                </div>
                <span className="text-xs text-muted-foreground">{p.people} usuários</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Preferências de monitoramento">
          <ul className="space-y-4">
            {preferences.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-4">
                <div>
                  <Label htmlFor={p.id} className="text-sm font-medium">
                    {p.label}
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                </div>
                <Switch
                  id={p.id}
                  checked={preferencesState[p.id]}
                  onCheckedChange={(checked) => handlePreferenceChange(p.id, checked)}
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </PageShell>
  );
}