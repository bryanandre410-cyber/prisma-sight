import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";

const links = [
  { label: "Recursos", href: "#features" },
  { label: "Como Funciona", href: "#how-it-works" },
  { label: "LGPD & IA", href: "#lgpd" },
  { label: "Planos", href: "#pricing" },
  { label: "Dúvidas", href: "#faq" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8"
      >
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="PRISMA ONE, início">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-sm"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <BarChart3 className="size-5" aria-hidden="true" />
          </span>
          <span className="truncate text-lg font-bold tracking-tight text-foreground">
            PRISMA ONE
          </span>
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="font-semibold shadow-xs">
            <Link to="/auth">Cadastrar Empresa</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="grid size-10 place-items-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div id="menu-mobile" className="border-t border-border bg-background md:hidden">
          <ul className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-3 grid gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  Entrar
                </Link>
              </Button>
              <Button asChild className="w-full font-semibold">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  Cadastrar Empresa
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
