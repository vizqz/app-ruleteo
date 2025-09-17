import { useMemo, useState } from "react";
import { useAppStore, formatCurrency } from "@/store/appStore";
import type { Card } from "@/store/types";

export default function Simulator() {
  const { state, actions } = useAppStore();
  const [originId, setOriginId] = useState(state.cards[0]?.id ?? "");
  const [destinationId, setDestinationId] = useState(state.cards[1]?.id ?? "");
  const [amount, setAmount] = useState(100);

  const result = useMemo(
    () =>
      originId && destinationId && amount > 0
        ? actions.simulate(originId, destinationId, amount)
        : null,
    [originId, destinationId, amount],
  );

  const origin = state.cards.find((c) => c.id === originId);
  const dest = state.cards.find((c) => c.id === destinationId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 rounded-xl bg-card shadow-card border border-border/60 p-5">
        <h1 className="font-heading text-2xl mb-4">Simulador de Ruleteo</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Tarjeta origen</label>
            <select
              className="w-full rounded-md bg-background border border-border px-3 py-2"
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
            >
              {state.cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.bank} — {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Tarjeta destino</label>
            <select
              className="w-full rounded-md bg-background border border-border px-3 py-2"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
            >
              {state.cards
                .filter((c) => c.id !== originId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.bank} — {c.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Monto</label>
            <input
              type="number"
              min={1}
              className="w-full rounded-md bg-background border border-border px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
            />
          </div>
          <div className="flex items-end">
            {origin && (
              <p className="text-sm text-muted-foreground">
                Comisión: <span className="font-medium">{(origin.commissionRate * 100).toFixed(2)}%</span>
              </p>
            )}
          </div>
        </div>

        {result && origin && dest && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4 bg-background/60">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Estimaciones</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>Comisión</span>
                  <span className="font-mono">{formatCurrency(result.commission)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mejor fecha</span>
                  <span className="font-mono">
                    {result.bestDate.toLocaleDateString(undefined, { month: "short", day: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4 bg-background/60">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Nuevos saldos</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>Origen ({origin.bank} {origin.name})</span>
                  <span className="font-mono">{formatCurrency(result.newOriginUsed)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Destino ({dest.bank} {dest.name})</span>
                  <span className="font-mono">{formatCurrency(result.newDestinationUsed)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            disabled={!result || !origin || !dest}
            onClick={() => {
              if (!result || !origin || !dest) return;
              actions.requestRuleteo(origin.id, dest.id, amount, result.commission, new Date());
            }}
            className="inline-flex items-center gap-2 rounded-md bg-secondary text-secondary-foreground px-4 py-2 shadow-brand disabled:opacity-50"
          >
            Solicitar Ruleteo
          </button>
        </div>
      </div>

      <div className="lg:col-span-2 rounded-xl bg-card shadow-card border border-border/60 p-5">
        <h2 className="font-heading text-lg mb-3">Solicitudes recientes</h2>
        <div className="space-y-3">
          {state.requests.length === 0 && (
            <p className="text-sm text-muted-foreground">Aún no hay solicitudes.</p>
          )}
          {state.requests.map((r) => {
            const o = state.cards.find((c) => c.id === r.originId)!;
            const d = state.cards.find((c) => c.id === r.destinationId)!;
            return (
              <div key={r.id} className="rounded-md border border-border p-3 bg-background/40">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{o.bank} {o.name}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="font-medium">{d.bank} {d.name}</span>
                    <span className="text-muted-foreground"> • {new Date(r.date).toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="text-sm font-mono">{formatCurrency(r.amount)} (+{formatCurrency(r.commission)})</div>
                </div>
                <div className="mt-1 text-xs">
                  <span
                    className={
                      r.status === "Completed"
                        ? "text-accent"
                        : r.status === "In Process"
                        ? "text-secondary"
                        : "text-muted-foreground"
                    }
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
