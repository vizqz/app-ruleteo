import { useState } from "react";
import { useAppStore, formatCurrency } from "@/store/appStore";
import CardTile from "@/components/dashboard/CardTile";
import { Lock, Phone, Gauge, Settings, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function Dashboard() {
  const { state, actions } = useAppStore();
  const { cards, requests } = state;
  const [index, setIndex] = useState(0);
  const primary = cards[index];

  function prev() {
    if (cards.length === 0) return;
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  }
  function next() {
    if (cards.length === 0) return;
    setIndex((i) => (i + 1) % cards.length);
  }

  function maskedNumber(id: string) {
    // Generate a deterministic 16-digit masked number from the UUID
    let digits = "";
    for (let i = 0; i < id.length; i++) {
      const ch = id.charCodeAt(i);
      digits += ((ch + i) % 10).toString();
      if (digits.length >= 16) break;
    }
    while (digits.length < 16) digits += "0";
    return `${digits.slice(0, 4)} •••• •••• ${digits.slice(-4)}`;
  }

  return (
    <div className="space-y-6">
      {/* Mobile-focused design */}
      <section className="md:hidden">
        <h1 className="font-heading text-xl mb-2">Bienvenido, Caleb</h1>

        {/* Controls row: arrows + add card */}
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <button onClick={prev} className="h-9 w-9 grid place-items-center rounded-full border border-border/60 bg-background">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="h-9 w-9 grid place-items-center rounded-full border border-border/60 bg-background">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <AddCard onAdd={(card) => {
            actions.addCard(card);
            setIndex(cards.length); // focus new card (now at the end)
          }} />
        </div>

        {primary && (
          <div className="relative rounded-2xl overflow-hidden shadow-card border border-border/60 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
            <button onClick={prev} aria-label="Anterior" className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full bg-white/15 text-white">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={next} aria-label="Siguiente" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full bg-white/15 text-white">
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="p-5">
              <div className="text-xs uppercase tracking-wider text-white/70">HESAP KARTI</div>
              <div className="mt-2 text-lg font-medium">{primary.bank} • {primary.name}</div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="text-sm text-white/60">Número</div>
                  <div className="font-mono tracking-widest text-lg">{maskedNumber(primary.id)}</div>
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
            <h2 className="font-heading text-base">Últimos movimientos</h2>
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

function AddCard({ onAdd }: { onAdd: (card: Parameters<typeof useAppStore>[0] extends never ? never : any) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    bank: "",
    name: "",
    creditLimit: 0,
    used: 0,
    cutoffDay: 1,
    billingDay: 1,
    commissionRate: 0.03,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.bank || !form.name) return;
    onAdd({
      bank: form.bank,
      name: form.name,
      creditLimit: Number(form.creditLimit),
      used: Number(form.used),
      cutoffDay: Number(form.cutoffDay),
      billingDay: Number(form.billingDay),
      commissionRate: Number(form.commissionRate),
    });
    setOpen(false);
  }

  return (
    <div className="w-full max-w-[210px]">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-secondary text-secondary-foreground px-3 py-2 shadow-brand"
        >
          <Plus className="h-4 w-4" /> Agregar tarjeta
        </button>
      ) : (
        <form onSubmit={submit} className="rounded-lg border border-border/60 bg-background p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input required placeholder="Banco" className="col-span-2 rounded-md border border-border px-2 py-1" value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} />
            <input required placeholder="Nombre" className="col-span-2 rounded-md border border-border px-2 py-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="number" min={0} required placeholder="Límite" className="rounded-md border border-border px-2 py-1" value={form.creditLimit} onChange={(e) => setForm({ ...form, creditLimit: +e.target.value })} />
            <input type="number" min={0} required placeholder="Usado" className="rounded-md border border-border px-2 py-1" value={form.used} onChange={(e) => setForm({ ...form, used: +e.target.value })} />
            <input type="number" min={1} max={28} required placeholder="Corte" className="rounded-md border border-border px-2 py-1" value={form.cutoffDay} onChange={(e) => setForm({ ...form, cutoffDay: +e.target.value })} />
            <input type="number" min={1} max={28} required placeholder="Facturación" className="rounded-md border border-border px-2 py-1" value={form.billingDay} onChange={(e) => setForm({ ...form, billingDay: +e.target.value })} />
            <input type="number" step="0.001" min={0} max={1} required placeholder="Comisión (0-1)" className="col-span-2 rounded-md border border-border px-2 py-1" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: +e.target.value })} />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="px-2 py-1 text-sm text-muted-foreground">Cancelar</button>
            <button type="submit" className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground">Guardar</button>
          </div>
        </form>
      )}
    </div>
  );
}
