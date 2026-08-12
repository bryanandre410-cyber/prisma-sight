import { createFileRoute } from "@tanstack/react-router";
import { Plus, ScrollText } from "lucide-react";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { policies } from "@/lib/prisma-data";

export const Route = createFileRoute("/politicas")({
  head: () => ({
    meta: [
      { title: "Políticas de Privacidade — Prisma One" },
      {
        name: "description",
        content: "Crie, versione e acompanhe as políticas de privacidade ativas da sua empresa.",
      },
      { property: "og:title", content: "Políticas de Privacidade — Prisma One" },
      {
        property: "og:description",
        content: "Documentação organizada, controle de versões e status de cada política.",
      },
    ],
  }),
  component: PoliticasPage,
});

function PoliticasPage() {
  return (
    <PageShell
      title="Políticas de Privacidade"
      subtitle="Tudo documentado, versionado e pronto para auditoria."
      actions={
        <Button className="gap-2">
          <Plus className="size-4" /> Nova política
        </Button>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        {policies.map((p) => (
          <Panel key={p.name}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent">
                  <ScrollText className="size-5 text-primary-glow" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Atualizada em {p.updated} · {p.version}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                  p.status === "Vigente"
                    ? "border-success/40 bg-success/15 text-success"
                    : "border-warning/40 bg-warning/15 text-warning"
                }`}
              >
                {p.status}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm">
                Ver versões
              </Button>
              <Button variant="ghost" size="sm">
                Editar
              </Button>
            </div>
          </Panel>
        ))}
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        4 políticas ativas · 100% alinhadas à LGPD
      </p>
    </PageShell>
  );
}