import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Bell, Home, Calculator, List, Wallet, User2 } from "lucide-react";

function TabItem({ to, label, icon: Icon }: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center gap-0.5 px-3 py-2 text-xs",
          isActive ? "text-white" : "text-white/60 hover:text-white",
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );
}

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
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen text-foreground bg-[radial-gradient(100%_60%_at_0%_0%,_rgba(59,130,246,0.25),_transparent_60%),radial-gradient(100%_60%_at_100%_0%,_rgba(16,185,129,0.2),_transparent_60%),linear-gradient(to_bottom,_#0b1020,_#0a0a0a)]">
      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 border-b border-white/10 bg-white/10 backdrop-blur-md text-white">
        <div className="mx-auto max-w-md px-4 flex items-center justify-between h-12">
          <button aria-label="notificaciones" className="p-1 rounded-md text-white/80 hover:text-white">
            <Bell className="h-5 w-5" />
          </button>
          <div className="font-heading text-white text-lg">FUPS</div>
          <div className="h-7 w-7 rounded-full bg-white/15 text-white grid place-items-center text-xs font-medium">
            <User2 className="h-4 w-4" />
          </div>
        </div>
      </header>

      {/* Desktop header remains simple */}
      <header className="hidden md:block sticky top-0 z-30 border-b border-white/10 bg-white/10 backdrop-blur-md text-white">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex flex-col justify-center gap-1.5 p-2 rounded-md border border-white/10"
              aria-label="Abrir menú"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </button>
            <nav className="flex items-center gap-1">
              <NavItem to="/" label="Panel" />
              <NavItem to="/simulate" label="Simulador" />
              <NavItem to="/requests" label="Solicitudes" />
              <NavItem to="/expenses" label="Gastos" />
              <NavItem to="/notifications" label="Notificaciones" />
            </nav>
          </div>
        </div>
        {open && (
          <div className="border-t border-white/10 bg-white/10 backdrop-blur-md">
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

      <main className="mx-auto max-w-md px-4 pb-20 pt-4 sm:pt-6 md:max-w-5xl md:pb-8">{children}</main>

      {/* Bottom tab bar for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/15 bg-black/30 backdrop-blur-xl text-white">
        <div className="mx-auto max-w-md grid grid-cols-4">
          <TabItem to="/" label="Inicio" icon={Home} />
          <TabItem to="/simulate" label="Simular" icon={Calculator} />
          <TabItem to="/requests" label="Movs" icon={List} />
          <TabItem to="/expenses" label="Cuentas" icon={Wallet} />
        </div>
      </nav>
    </div>
  );
}
