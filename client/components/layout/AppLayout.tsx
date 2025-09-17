import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { useAppStore } from "@/store/appStore";
import { formatCurrency } from "@/store/appStore";
import { useState } from "react";

function NavItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted",
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const {
    state: { cards },
  } = useAppStore();
  const [open, setOpen] = useState(false);

  const totalDebt = cards.reduce((sum, c) => sum + c.used, 0);
  const totalLimit = cards.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalAvailable = Math.max(0, totalLimit - totalDebt);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex flex-col justify-center gap-1.5 p-2 rounded-md border border-border/60"
              aria-label="Abrir menú"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
            </button>
            <Logo />
            <nav className="hidden md:flex items-center gap-1">
              <NavItem to="/" label="Panel" />
              <NavItem to="/simulate" label="Simulador" />
              <NavItem to="/requests" label="Solicitudes" />
              <NavItem to="/expenses" label="Gastos" />
              <NavItem to="/notifications" label="Notificaciones" />
            </nav>
          </div>
        </div>
        {/* Menú móvil */}
        {open && (
          <div className="md:hidden border-t border-border/60 bg-background">
            <div className="container py-2 flex flex-wrap gap-2">
              <NavItem to="/" label="Panel" onClick={() => setOpen(false)} />
              <NavItem to="/simulate" label="Simulador" onClick={() => setOpen(false)} />
              <NavItem to="/requests" label="Solicitudes" onClick={() => setOpen(false)} />
              <NavItem to="/expenses" label="Gastos" onClick={() => setOpen(false)} />
              <NavItem to="/notifications" label="Notificaciones" onClick={() => setOpen(false)} />
            </div>
          </div>
        )}
      </header>
      <main className="container py-4 sm:py-6">{children}</main>
    </div>
  );
}
