import { useMemo } from "react";
import { useAppStore } from "@/store/appStore";

function nextDate(day: number) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), day);
  if (d < now) d.setMonth(d.getMonth() + 1);
  return d;
}

export default function UpcomingDates() {
  const {
    state: { cards },
  } = useAppStore();

  const items = useMemo(() => {
    const all = cards.flatMap((c) => [
      { type: "Corte", card: c.name, date: nextDate(c.cutoffDay), color: "text-secondary" },
      { type: "Vencimiento", card: c.name, date: nextDate(c.billingDay), color: "text-primary" },
    ]);
    return all.sort((a, b) => +a.date - +b.date).slice(0, 6);
  }, [cards]);

  return (
    <div className="rounded-xl bg-card shadow-card border border-border/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg">Próximas fechas</h3>
      </div>
      <ul className="space-y-3">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <div>
              <div className="text-sm">
                <span className={`font-medium ${it.color}`}>{it.type}</span>
                <span className="text-muted-foreground"> • {it.card}</span>
              </div>
            </div>
            <div className="text-sm font-mono">
              {it.date.toLocaleDateString("es-ES", { month: "short", day: "2-digit" })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
