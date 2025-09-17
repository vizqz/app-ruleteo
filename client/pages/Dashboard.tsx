import { useAppStore, formatCurrency } from "@/store/appStore";
import CardTile from "@/components/dashboard/CardTile";
import { Lock, Phone, Gauge, Settings } from "lucide-react";

export default function Dashboard() {
  const { state } = useAppStore();
  const { cards, requests } = state;
  const primary = cards[0];

  return (
    <div className="space-y-6">
      {/* Mobile-focused design */}
      <section className="md:hidden">
        <h1 className="font-heading text-xl mb-2">Bienvenido, Caleb</h1>

        {primary && (
          <div className="rounded-2xl overflow-hidden shadow-card border border-border/60 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
            <div className="p-5">
              <div className="text-xs uppercase tracking-wider text-white/70">HESAP KARTI</div>
              <div className="mt-2 text-lg font-medium">{primary.bank} • {primary.name}</div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="text-sm text-white/60">Número</div>
                  <div className="font-mono tracking-widest text-lg">1234 •••• •••• 5678</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">Límite</div>
                  <div className="font-mono">{formatCurrency(primary.creditLimit)}</div>
                </div>
              </div>
            </div>
            <div className="bg-background text-foreground grid grid-cols-4 gap-2 p-3">
              <Action icon={Phone} label="Contacto" />
              <Action icon={Lock} label="Congelar" />
              <Action icon={Gauge} label="Límite" />
              <Action icon={Settings} label="Ajustes" />
            </div>
          </div>
        )}

        <div className="mt-5 rounded-xl bg-card border border-border/60 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base">Cuentas vinculadas</h2>
          </div>
          <div className="mt-2 divide-y divide-border/60">
            {cards.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium">{c.bank} {c.name}</div>
                </div>
                <div className="text-sm font-mono">{formatCurrency(c.used)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-card border border-border/60 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base">��ltimos movimientos</h2>
          </div>
          <div className="mt-2 space-y-3">
            {requests.length === 0 && (
              <p className="text-sm text-muted-foreground">Aún no hay movimientos.</p>
            )}
            {requests.slice(0, 5).map((r) => {
              const o = cards.find((c) => c.id === r.originId)!;
              const d = cards.find((c) => c.id === r.destinationId)!;
              return (
                <div key={r.id} className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{o.bank} {o.name}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="font-medium">{d.bank} {d.name}</span>
                  </div>
                  <div className="text-sm font-mono">{formatCurrency(r.amount)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Desktop view (keeps previous grid) */}
      <section className="hidden md:block">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-heading text-2xl md:text-3xl">Bienvenido, Caleb</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mt-4">
          {cards.map((c) => (
            <CardTile key={c.id} card={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Action({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border/60 bg-background px-2 py-2 text-xs">
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}
