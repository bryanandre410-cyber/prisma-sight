import { createFileRoute } from "@tanstack/react-router";
import { Bot, FileCheck2 } from "lucide-react";

import { PageShell, Panel } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { aiModels } from "@/lib/prisma-data";

export const Route = createFileRoute("/auditoria-ia")({
  head: () => ({
    meta: [
      { title: "Auditoria de IA — Prisma One" },
      {
        name: "description",
        content:
          "Audite modelos de IA: uso ético de dados, dados sensíveis sem autorização, viés e risco de vazamento.",
      },
      { property: "og:title", content: "Auditoria de IA — Prisma One" },
      {
        property: "og:description",
        content: "Transparência e controle sobre como seus modelos de IA usam dados pessoais.",
      },
    ],
  }),
  component: AuditoriaPage,
});

const statusTone: Record<string, string> = {
  Conforme: "border-success/40 bg-success/15 text-success",
  Atenção: "border-warning/40 bg-warning/15 text-warning",
  Crítico: "border-destructive/40 bg-destructive/15 text-destructive",
};

function AuditoriaPage() {
  return (
    <PageShell
      title="Auditoria de Inteligência Artificial"
      subtitle="Verifique se os modelos usam dados de forma ética, autorizada e sem viés."
      actions={
        <Button variant="secondary" className="gap-2">
          <FileCheck2 className="size-4" /> Gerar relatório de auditoria
        </Button>
      }
    >
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Modelos auditados", value: "12" },
          { label: "Modelos com pendência", value: "2" },
          { label: "Dados sensíveis sem base legal", value: "1" },
        ].map((s) => (
          <Panel key={s.label}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold">{s.value}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {aiModels.map((m) => (
          <Panel key={m.name}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent">
                  <Bot className="size-5 text-primary-glow" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.purpose}</p>
                </div>
              </div>
              <span
                className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${statusTone[m.status]}`}
              >
                {m.status}
              </span>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">Uso de dados: {m.dataUse}</p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs">
                  <span>Risco de viés</span>
                  <span className="text-muted-foreground">{m.bias}%</span>
                </div>
                <Progress value={m.bias} className="mt-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span>Risco de vazamento</span>
                  <span className="text-muted-foreground">{m.leak}%</span>
                </div>
                <Progress value={m.leak} className="mt-1.5" />
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}