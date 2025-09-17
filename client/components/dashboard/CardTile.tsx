import { Card as CardType } from "@/store/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/store/appStore";

const bankColors: Record<string, string> = {
  BBVA: "from-blue-500 to-blue-600",
  Santander: "from-red-500 to-red-600",
  HSBC: "from-emerald-500 to-emerald-600",
  Citi: "from-sky-500 to-sky-600",
  Amex: "from-indigo-500 to-indigo-600",
  Visa: "from-cyan-500 to-cyan-600",
  Mastercard: "from-amber-500 to-orange-600",
  Other: "from-zinc-500 to-zinc-600",
};

export default function CardTile({ card }: { card: CardType }) {
  const available = Math.max(0, card.creditLimit - card.used);
  const pct = Math.min(100, Math.round((card.used / card.creditLimit) * 100));
  return (
    <div className="rounded-xl bg-card shadow-sm overflow-hidden border border-border/60">
      <div className={cn("px-4 sm:px-5 py-4 bg-card")}
      >
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="opacity-90">{card.bank}</div>
          <div className="opacity-90">Corte {card.cutoffDay} • Venc. {card.billingDay}</div>
        </div>
        <div className="mt-1 text-lg sm:text-xl font-heading tracking-wide">{card.name}</div>
      </div>
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <div className="rounded-lg bg-background border border-border/60 p-3 sm:p-4">
          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">Usado</div>
              <div className="font-mono text-base sm:text-lg">{formatCurrency(card.used)}</div>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">Disponible</div>
              <div className="font-mono text-base sm:text-lg text-accent">{formatCurrency(available)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">Límite</div>
              <div className="font-mono text-base sm:text-lg">{formatCurrency(card.creditLimit)}</div>
            </div>
          </div>
          <div className="mt-3 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
