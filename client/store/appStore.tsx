import { createContext, useContext, useMemo, useState } from "react";
import type { AppState, Card, RuleteoRequest, UUID } from "./types";

const STORAGE_KEY = "ruleteo.app.v1";

const demoCards: Card[] = [
  {
    id: crypto.randomUUID(),
    name: "Blue Rewards",
    bank: "BBVA",
    creditLimit: 5000,
    used: 1850,
    cutoffDay: 17,
    billingDay: 3,
    commissionRate: 0.035,
  },
  {
    id: crypto.randomUUID(),
    name: "Orange Plus",
    bank: "Santander",
    creditLimit: 8000,
    used: 4200,
    cutoffDay: 10,
    billingDay: 28,
    commissionRate: 0.028,
  },
  {
    id: crypto.randomUUID(),
    name: "Green CashBack",
    bank: "HSBC",
    creditLimit: 12000,
    used: 2600,
    cutoffDay: 22,
    billingDay: 8,
    commissionRate: 0.03,
  },
];

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const init: AppState = { cards: demoCards, requests: [], transactions: [] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw) as AppState;
  } catch {
    const fallback: AppState = { cards: demoCards, requests: [], transactions: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export interface AppActions {
  addCard: (card: Omit<Card, "id">) => void;
  updateCard: (id: UUID, patch: Partial<Card>) => void;
  simulate: (
    originId: UUID,
    destinationId: UUID,
    amount: number,
  ) => {
    commission: number;
    bestDate: Date;
    newOriginUsed: number;
    newDestinationUsed: number;
  } | null;
  requestRuleteo: (
    originId: UUID,
    destinationId: UUID,
    amount: number,
    commission: number,
    date: Date,
  ) => RuleteoRequest | null;
}

export const AppStoreContext = createContext<{
  state: AppState;
  actions: AppActions;
} | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  const actions: AppActions = useMemo(
    () => ({
      addCard: (card) => {
        setState((prev) => {
          const next: AppState = {
            ...prev,
            cards: [...prev.cards, { ...card, id: crypto.randomUUID() }],
          };
          saveState(next);
          return next;
        });
      },
      updateCard: (id, patch) => {
        setState((prev) => {
          const cards = prev.cards.map((c) => (c.id === id ? { ...c, ...patch } : c));
          const next = { ...prev, cards };
          saveState(next);
          return next;
        });
      },
      simulate: (originId, destinationId, amount) => {
        const origin = state.cards.find((c) => c.id === originId);
        const dest = state.cards.find((c) => c.id === destinationId);
        if (!origin || !dest || amount <= 0) return null;
        const commission = +(amount * origin.commissionRate).toFixed(2);
        const newOriginUsed = Math.max(0, origin.used + amount + commission);
        const newDestinationUsed = Math.max(0, dest.used - amount);
        const bestDate = getBestTransactionDate(origin.cutoffDay);
        return { commission, bestDate, newOriginUsed, newDestinationUsed };
      },
      requestRuleteo: (originId, destinationId, amount, commission, date) => {
        const origin = state.cards.find((c) => c.id === originId);
        const dest = state.cards.find((c) => c.id === destinationId);
        if (!origin || !dest || amount <= 0) return null;
        const req: RuleteoRequest = {
          id: crypto.randomUUID(),
          originId,
          destinationId,
          amount,
          commission,
          date: date.toISOString(),
          status: "Pending",
        };
        setState((prev) => {
          const cards = prev.cards.map((c) =>
            c.id === originId
              ? { ...c, used: Math.max(0, c.used + amount + commission) }
              : c.id === destinationId
              ? { ...c, used: Math.max(0, c.used - amount) }
              : c,
          );
          const next: AppState = { ...prev, cards, requests: [req, ...prev.requests] };
          saveState(next);
          return next;
        });
        return req;
      },
    }),
    [state.cards],
  );

  return (
    <AppStoreContext.Provider value={{ state, actions }}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}

// Helpers
export function getBestTransactionDate(cutoffDay: number): Date {
  const now = new Date();
  const cutoffThisMonth = new Date(now.getFullYear(), now.getMonth(), cutoffDay);
  const afterCutoff = now > cutoffThisMonth;
  const nextCutoff = afterCutoff
    ? new Date(now.getFullYear(), now.getMonth() + 1, cutoffDay)
    : cutoffThisMonth;
  // Best is 1 day after cutoff to maximize grace period
  const best = new Date(nextCutoff);
  best.setDate(best.getDate() + 1);
  return best;
}

export function formatCurrency(n: number) {
  return n.toLocaleString("es-PE", { style: "currency", currency: "PEN" });
}
