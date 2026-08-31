import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const links = [
  { label: "Produto", href: "#produto" },
  { label: "Recursos", href: "#recursos" },
  { label: "LGPD", href: "#lgpd" },
  { label: "Segurança", href: "#seguranca" },
  { label: "Preços", href: "#precos" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Prisma One, início">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-lg text-primary-foreground"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <span className="truncate text-base font-semibold tracking-tight">Prisma One</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Entrar</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/auth">Começar agora</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="grid size-11 place-items-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div id="menu-mobile" className="border-t border-border bg-background lg:hidden">
          <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-2 grid gap-2">
              <Button asChild variant="outline" className="min-h-11 w-full">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  Entrar
                </Link>
              </Button>
              <Button asChild className="min-h-11 w-full">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  Começar agora
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
