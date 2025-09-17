export type UUID = string;

export type Bank =
  | "Visa"
  | "Mastercard"
  | "Amex"
  | "BBVA"
  | "Santander"
  | "HSBC"
  | "Citi"
  | "Other";

export interface Card {
  id: UUID;
  name: string; // e.g., Gold, Platinum
  bank: Bank;
  creditLimit: number; // total limit
  used: number; // current used balance
  cutoffDay: number; // 1-28 typical
  billingDay: number; // due date
  commissionRate: number; // 0.0 - 1.0 (e.g., 0.035 = 3.5%)
}

export type RequestStatus = "Pending" | "In Process" | "Completed";

export interface RuleteoRequest {
  id: UUID;
  originId: UUID;
  destinationId: UUID;
  amount: number;
  commission: number;
  date: string; // ISO date
  status: RequestStatus;
}

export interface Transaction {
  id: UUID;
  cardId: UUID;
  description: string;
  amount: number; // positive = expense, negative = payment
  date: string; // ISO
  category?: string;
}

export interface AppState {
  cards: Card[];
  requests: RuleteoRequest[];
  transactions: Transaction[];
}
