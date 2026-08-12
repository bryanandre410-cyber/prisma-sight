import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

import { PageShell, Panel, SeverityPill } from "@/components/prisma/PageShell";
import { alerts } from "@/lib/prisma-data";

export const Route = createFileRoute("/alertas")({
  head: () => ({
    meta: [
      { title: "Alertas e Riscos — Prisma One" },
      {
        name: "description",
        content:
          "Todos os riscos identificados com nível de gravidade e a ação recomendada para a equipe.",
      },
      { property: "og:title", content: "Alertas e Riscos — Prisma One" },
      {
        property: "og:description",
        content: "Acessos indevidos, vazamentos e uso inadequado de dados por IA em um só lugar.",
      },
    ],
  }),
  component: AlertasPage,
});

function AlertasPage() {
  const counts = {
    alto: alerts.filter((a) => a.severity === "alto").length,
    medio: alerts.filter((a) => a.severity === "medio").length,
    baixo: alerts.filter((a) => a.severity === "baixo").length,
  };

  return (
    <PageShell
      title="Alertas e Riscos"
      subtitle="Cada alerta mostra a gravidade e o que a equipe deve fazer."
    >
      <div className="grid gap-5 md:grid-cols-3">
        <Panel>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Gravidade alta</p>
          <p className="mt-2 text-3xl font-semibold text-destructive">{counts.alto}</p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Gravidade média</p>
          <p className="mt-2 text-3xl font-semibold text-warning">{counts.medio}</p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Gravidade baixa</p>
          <p className="mt-2 text-3xl font-semibold text-info">{counts.baixo}</p>
        </Panel>
      </div>

      <Panel className="mt-5" title="Fila de alertas" description="Ordenados do mais recente ao mais antigo.">
        <ul className="space-y-3">
          {alerts.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-border/70 bg-background/40 p-4 transition-colors hover:border-primary/50"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-accent">
                    <AlertTriangle className="size-4 text-primary-glow" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.id} · {a.context} · {a.time}
                    </p>
                  </div>
                </div>
                <SeverityPill severity={a.severity} />
              </div>
              <p className="mt-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                Ação recomendada: {a.action}
              </p>
            </li>
          ))}
        </ul>
      </Panel>
    </PageShell>
  );
}