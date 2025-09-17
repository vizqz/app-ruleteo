import { useEffect, useState } from "react";
import { useAppStore, formatCurrency, getBestTransactionDate } from "@/store/appStore";
import type { Card, Bank } from "@/store/types";
import CardTile from "@/components/dashboard/CardTile";
import { Lock, Phone, Gauge, Settings, Plus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function Dashboard() {
  const { state, actions } = useAppStore();
  const { cards, requests } = state;
  const [index, setIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const primary = cards[index];

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

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

  const currentCardId = cards[index]?.id;
  const filteredRequests = currentCardId
    ? requests.filter((r) => r.originId === currentCardId || r.destinationId === currentCardId)
    : [];

  return (
    <div className="space-y-6">
      {/* Mobile-focused design */}
      <section className="md:hidden">
        <div className="mb-3 text-white">
          <div className="text-xs/4 text-white/70">Saldo</div>
          <div className="text-4xl font-semibold tracking-tight">
            {primary ? formatCurrency(Math.max(0, primary.creditLimit - primary.used)) : ""}
          </div>
          {primary && (
            <div className="mt-1 text-[11px] text-white/60">
              {(() => {
                const best = getBestTransactionDate(primary.cutoffDay);
                const cutoff = new Date(best);
                cutoff.setDate(cutoff.getDate() - 1);
                const days = Math.max(0, Math.ceil((cutoff.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                return `${days} días para corte`;
              })()}
            </div>
          )}
        </div>

        {/* Controls: add card */}
        <div className="mb-3 flex items-center justify-end">
          <AddCard
            onAdd={(card) => {
              actions.addCard(card);
              setTimeout(() => api?.scrollTo(cards.length), 0);
            }}
          />
        </div>

        <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="relative">
          <CarouselContent>
            {cards.map((c) => (
              <CarouselItem key={c.id}>
                <div className="relative rounded-2xl overflow-hidden shadow-none bg-gradient-to-br from-[#0b1b3a] via-[#0d3fa8] to-[#0b77e3] text-white">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(120%_80%_at_80%_0%,rgba(255,255,255,0.6),transparent)]" />
                  <div className="relative p-5">
                    <div className="text-xs uppercase tracking-wider text-white/70">Tarjeta</div>
                    <div className="mt-2 text-lg font-medium">{c.bank} • {c.name}</div>
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <div className="text-sm text-white/60">Número</div>
                        <div className="font-mono tracking-widest text-lg">{maskedNumber(c.id)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white/60">Límite</div>
                        <div className="font-mono">{formatCurrency(c.creditLimit)}</div>
                      </div>
                    </div>
                  </div>
                                  </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-white/20 text-white border-white/20 hover:bg-white/30" />
          <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-white/20 text-white border-white/20 hover:bg-white/30" />
        </Carousel>


        <div className="mt-6">
          <h2 className="text-white/80 text-sm mb-2">Movimientos</h2>
          <div className="divide-y divide-white/10">
            {filteredRequests.length === 0 && (
              <p className="text-xs text-white/60 py-3">Sin movimientos para esta tarjeta.</p>
            )}
            {filteredRequests.slice(0, 8).map((r) => {
              const o = cards.find((c) => c.id === r.originId)!;
              const d = cards.find((c) => c.id === r.destinationId)!;
              const isOutgoing = r.originId === currentCardId;
              return (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div className="text-sm text-white/90">
                    <span className="font-medium">{o.bank} {o.name}</span>
                    <span className="text-white/50"> → </span>
                    <span className="font-medium">{d.bank} {d.name}</span>
                  </div>
                  <div className={cn("text-sm font-mono", isOutgoing ? "text-rose-300" : "text-emerald-300")}>{isOutgoing ? "-" : "+"}{formatCurrency(r.amount)}</div>
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

function ActionIcon({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button aria-label={label} className="h-10 w-10 grid place-items-center rounded-full border border-white/15 bg-white/10 text-white">
      <Icon className="h-5 w-5" />
    </button>
  );
}

function AddCard({ onAdd }: { onAdd: (card: Omit<Card, "id">) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Card, "id">>({
    bank: "Other" as Bank,
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
          className="h-9 w-9 grid place-items-center rounded-full border border-white/15 bg-white/10 text-white"
          aria-label="Agregar tarjeta"
        >
          <Plus className="h-4 w-4" />
        </button>
      ) : (
        <form onSubmit={submit} className="rounded-lg border border-white/10 bg-black/40 backdrop-blur p-3 space-y-2 text-white">
          <div className="grid grid-cols-2 gap-2">
            <input required aria-label="Banco" placeholder="Banco" className="col-span-2 rounded-md border border-border px-2 py-1" value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value as Bank })} />
            <input required aria-label="Nombre" placeholder="Nombre" className="col-span-2 rounded-md border border-border px-2 py-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="number" min={0} required aria-label="Límite" placeholder="Límite" className="rounded-md border border-border px-2 py-1" value={form.creditLimit} onChange={(e) => setForm({ ...form, creditLimit: +e.target.value })} />
            <input type="number" min={0} required aria-label="Usado" placeholder="Usado" className="rounded-md border border-border px-2 py-1" value={form.used} onChange={(e) => setForm({ ...form, used: +e.target.value })} />
            <input type="number" min={1} max={28} required aria-label="Corte" placeholder="Corte" className="rounded-md border border-border px-2 py-1" value={form.cutoffDay} onChange={(e) => setForm({ ...form, cutoffDay: +e.target.value })} />
            <input type="number" min={1} max={28} required aria-label="Facturación" placeholder="Facturación" className="rounded-md border border-border px-2 py-1" value={form.billingDay} onChange={(e) => setForm({ ...form, billingDay: +e.target.value })} />
            <input type="number" step="0.001" min={0} max={1} required aria-label="Comisión" placeholder="Comisión (0-1)" className="col-span-2 rounded-md border border-border px-2 py-1" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: +e.target.value })} />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="px-2 py-1 text-sm text-white/70">Cancelar</button>
            <button type="submit" className="px-3 py-1.5 text-sm rounded-md bg-white text-black">Guardar</button>
          </div>
        </form>
      )}
    </div>
  );
}
