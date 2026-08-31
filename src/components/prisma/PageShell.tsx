import type { ReactNode } from "react";

export function PageShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-6 md:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {actions}
      </header>
      {children}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`surface-card rounded-2xl border border-border p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function SeverityPill({ severity }: { severity: "alto" | "medio" | "baixo" }) {
  const map = {
    alto: "bg-destructive/20 text-destructive border-destructive/40",
    medio: "bg-warning/20 text-warning border-warning/40",
    baixo: "bg-info/20 text-info border-info/40",
  } as const;
  const label = { alto: "Alto", medio: "Médio", baixo: "Baixo" }[severity];
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${map[severity]}`}
    >
      {label}
    </span>
  );
}
