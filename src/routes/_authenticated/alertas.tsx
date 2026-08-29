import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Check, X, Eye } from "lucide-react";

import { PageShell, Panel, SeverityPill } from "@/components/prisma/PageShell";
import { Button } from "@/components/ui/button";
import { alerts } from "@/lib/prisma-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/alertas")({
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
  const [alertList, setAlertList] = useState(alerts);
  const [selectedAlert, setSelectedAlert] = useState<typeof alerts[0] | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const counts = {
    alto: alertList.filter((a) => a.severity === "alto" && a.status === "pendente").length,
    medio: alertList.filter((a) => a.severity === "medio" && a.status === "pendente").length,
    baixo: alertList.filter((a) => a.severity === "baixo" && a.status === "pendente").length,
    resolvidos: alertList.filter((a) => a.status === "resolvido").length,
  };

  const handleResolveAlert = (id: string) => {
    setAlertList(alertList.map((a) => (a.id === id ? { ...a, status: "resolvido" as const } : a)));
    setIsDetailDialogOpen(false);
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlertList(alertList.map((a) => (a.id === id ? { ...a, status: "reconhecido" as const } : a)));
    setIsDetailDialogOpen(false);
  };

  const handleReopenAlert = (id: string) => {
    setAlertList(alertList.map((a) => (a.id === id ? { ...a, status: "pendente" as const } : a)));
    setIsDetailDialogOpen(false);
  };

  const openAlertDetail = (alert: typeof alerts[0]) => {
    setSelectedAlert(alert);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolvido":
        return "bg-success/15 text-success border-success/40";
      case "reconhecido":
        return "bg-info/15 text-info border-info/40";
      default:
        return "bg-warning/15 text-warning border-warning/40";
    }
  };

  return (
    <PageShell
      title="Alertas e Riscos"
      subtitle="Cada alerta mostra a gravidade e o que a equipe deve fazer."
    >
      <div className="grid gap-5 md:grid-cols-4">
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
        <Panel>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Resolvidos</p>
          <p className="mt-2 text-3xl font-semibold text-success">{counts.resolvidos}</p>
        </Panel>
      </div>

      <Panel className="mt-5" title="Fila de alertas" description="Ordenados do mais recente ao mais antigo.">
        <ul className="space-y-3">
          {alertList.map((a) => (
            <li
              key={a.id}
              className={`rounded-xl border border-border/70 bg-background/40 p-4 transition-colors hover:border-primary/50 ${
                a.status === "resolvido" ? "opacity-60" : ""
              }`}
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
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`text-[10px] rounded border px-2 py-0.5 font-medium ${getStatusBadge(a.status)}`}
                      >
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SeverityPill severity={a.severity} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openAlertDetail(a)}
                    className="text-xs"
                  >
                    <Eye className="size-3 mr-1" /> Detalhes
                  </Button>
                </div>
              </div>
              <p className="mt-3 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                Ação recomendada: {a.action}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-primary-glow" />
              {selectedAlert?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedAlert?.id} · {selectedAlert?.context} · {selectedAlert?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <SeverityPill severity={selectedAlert?.severity || "baixo"} />
              <span
                className={`text-[10px] rounded border px-2 py-0.5 font-medium ${getStatusBadge(selectedAlert?.status || "pendente")}`}
              >
                {(selectedAlert?.status ?? "pendente").charAt(0).toUpperCase() + (selectedAlert?.status ?? "pendente").slice(1)}
              </span>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Ação recomendada:</p>
              <p className="text-sm text-muted-foreground">{selectedAlert?.action}</p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            {selectedAlert?.status === "pendente" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => selectedAlert && handleAcknowledgeAlert(selectedAlert.id)}
                  className="gap-2"
                >
                  <Check className="size-4" /> Reconhecer
                </Button>
                <Button
                  onClick={() => selectedAlert && handleResolveAlert(selectedAlert.id)}
                  className="gap-2"
                >
                  <Check className="size-4" /> Resolver
                </Button>
              </>
            )}
            {selectedAlert?.status !== "pendente" && (
              <Button
                variant="outline"
                onClick={() => selectedAlert && handleReopenAlert(selectedAlert.id)}
                className="gap-2"
              >
                Reabrir
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}