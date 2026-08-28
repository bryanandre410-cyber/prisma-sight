import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { complianceControls } from "@/lib/prisma-data";

export const Route = createFileRoute("/_authenticated/conformidade")({
  head: () => ({
    meta: [
      { title: "Conformidade LGPD — Prisma One" },
      {
        name: "description",
        content: "Nível de adequação à LGPD, controles ativos e pontos que ainda precisam de ajuste.",
      },
      { property: "og:title", content: "Conformidade LGPD — Prisma One" },
      {
        property: "og:description",
        content: "Acompanhe controles, evidências e lacunas de conformidade com a LGPD.",
      },
    ],
  }),
  component: ConformidadePage,
});

function ConformidadePage() {
  const pending = complianceControls.filter((c) => c.progress < 90);

  return (
    <PageShell
      title="Conformidade LGPD"
      subtitle="Veja de forma simples se a empresa está cumprindo a lei e onde ainda existem falhas."
      actions={
        <Button className="gap-2">
          <Download className="size-4" /> Gerar relatório
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Nível de adequação" description="Índice consolidado de conformidade.">
          <p className="text-5xl font-semibold text-gradient">98%</p>
          <p className="mt-2 text-xs text-muted-foreground">
            24 de 26 controles obrigatórios implementados.
          </p>
          <Progress value={98} className="mt-4" />
        </Panel>

        <Panel
          className="lg:col-span-2"
          title="Controles ativos"
          description="Situação atual de cada controle e responsável."
        >
          <ul className="space-y-4">
            {complianceControls.map((c) => (
              <li key={c.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">
                    {c.owner} · {c.progress}%
                  </span>
                </div>
                <Progress value={c.progress} className="mt-2" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="mt-5" title="O que ainda precisa ser ajustado">
        <ul className="grid gap-3 md:grid-cols-2">
          {pending.map((c) => (
            <li key={c.name} className="rounded-xl border border-warning/30 bg-warning/10 p-4">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Responsável: {c.owner} · faltam {100 - c.progress}% para concluir.
              </p>
            </li>
          ))}
        </ul>
      </Panel>
    </PageShell>
  );
}