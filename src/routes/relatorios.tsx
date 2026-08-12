import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { reports } from "@/lib/prisma-data";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Prisma One" },
      {
        name: "description",
        content:
          "Gere documentos prontos para a diretoria, auditorias internas e órgãos reguladores.",
      },
      { property: "og:title", content: "Relatórios — Prisma One" },
      {
        property: "og:description",
        content: "Relatórios de conformidade, auditoria de IA e incidentes em poucos cliques.",
      },
    ],
  }),
  component: RelatoriosPage,
});

function RelatoriosPage() {
  return (
    <PageShell
      title="Relatórios"
      subtitle="Documentos prontos para diretoria, auditoria e órgãos reguladores."
      actions={
        <Button className="gap-2">
          <FileText className="size-4" /> Novo relatório
        </Button>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        {reports.map((r) => (
          <Panel key={r.name}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.period} · {r.type} · {r.pages} páginas
                </p>
              </div>
              <Button variant="secondary" size="sm" className="gap-2">
                <Download className="size-4" /> PDF
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}