import { useSyncExternalStore } from "react";
import blackfriday from "@/assets/blackfriday.jpg";
import jul from "@/assets/jul.jpg";
import mamma from "@/assets/mamma.jpg";
import jeans from "@/assets/jeans.jpg";

export type Offer = { store: string; price: number };
export type Item = {
  id: string;
  name: string;
  brand: string;
  url: string;
  image?: string | undefined;
  price: number;
  originalPrice?: number | undefined;
  offers: Offer[];
  bought: boolean;
  boughtMonth?: string | undefined; // YYYY-MM
};
export type WishList = {
  id: string;
  name: string;
  category: string;
  date: string;
  image?: string | undefined;
  archived: boolean;
  shared: string[];
  items: Item[];
};
export type State = {
  budgets: Record<string, number>; // YYYY-MM -> amount
  lists: WishList[];
};

export const CATEGORIES = ["Min önskelista", "Födelsedag", "Jul", "Black Friday", "Inspiration", "Fest"];
export const MONTHS = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];

export const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
export const monthLabel = (key: string) => {
  const [y = 0, m = 1] = key.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};

/** Spent in a month = sum of prices of items marked bought that month. */
export function spentInMonth(state: State, key: string) {
  return state.lists.flatMap((l) => l.items).filter((i) => i.bought && i.boughtMonth === key).reduce((s, i) => s + i.price, 0);
}
export function budgetSummary(state: State, key: string) {
  const budget = state.budgets[key] ?? 0;
  const spent = spentInMonth(state, key);
  return { budget, spent, left: budget - spent, ratio: budget > 0 ? Math.min(spent / budget, 1) : 0 };
}

const uid = () => Math.random().toString(36).slice(2, 10);

const offersFor = (p: number): Offer[] => [
  { store: "Zalando", price: Math.round(p * 0.87) },
  { store: "Boozt", price: Math.round(p * 1.005) },
  { store: "Ellos", price: Math.round(p * 0.998) },
];

function seed(): State {
  const now = monthKey();
  const budgets: Record<string, number> = { [now]: 2000 };
  const d = new Date();
  for (let i = 1; i <= 6; i++) budgets[monthKey(new Date(d.getFullYear(), d.getMonth() - i, 1))] = 1500 + i * 100;
  const mk = (name: string, brand: string, price: number, image?: string, bought = false, original?: number): Item => ({
    id: uid(), name, brand, url: "https://www.example.com/produkt", image, price, originalPrice: original,
    offers: offersFor(price), bought, boughtMonth: bought ? now : undefined,
  });
  return {
    budgets,
    lists: [
      { id: "black-friday", name: "Black Friday köp", category: "Black Friday", date: "27 November", image: blackfriday, archived: false, shared: [],
        items: [mk("Svarta Jeans", "Weekday", 399, jeans, false, 499), mk("Tröja", "Arket", 199), mk("Ullkappa", "COS", 1050, undefined, true)] },
      { id: "jul", name: "Jul 2026", category: "Jul", date: "24 December", image: jul, archived: false, shared: ["Mamma"],
        items: [mk("Doftljus", "Byredo", 200, undefined, true), mk("Kashmirhalsduk", "& Other Stories", 699)] },
      { id: "mamma", name: "Mammas födelsedag", category: "Födelsedag", date: "14 Mars", image: mamma, archived: false, shared: [], items: [] },
      { id: "resa", name: "Köpa till resan", category: "Inspiration", date: "2 Juni", image: blackfriday, archived: true, shared: [], items: [] },
      { id: "kok", name: "Köksinredning", category: "Inspiration", date: "1 Maj", image: jul, archived: true, shared: [], items: [] },
      { id: "fest", name: "50 års fest", category: "Fest", date: "12 April", image: mamma, archived: true, shared: [], items: [] },
    ],
  };
}

const KEY = "saved-app-v1";
let state: State = seed();
const serverState = state;
let hydrated = false;
const listeners = new Set<() => void>();

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw);
  } catch {}
}
function set(fn: (s: State) => State) {
  state = fn(state);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
}

export function useStore() {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => state,
    () => serverState,
  );
}

function titleFromUrl(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").split(".")[0] ?? "";
    const slug = u.pathname.split("/").filter(Boolean).pop() ?? "produkt";
    const name = slug.replace(/\.[a-z]+$/, "").replace(/[-_]+/g, " ").replace(/\d{4,}/g, "").trim() || "Produkt";
    return { brand: host.charAt(0).toUpperCase() + host.slice(1), name: name.charAt(0).toUpperCase() + name.slice(1) };
  } catch {
    return null;
  }
}

export const actions = {
  setBudget: (key: string, amount: number) => set((s) => ({ ...s, budgets: { ...s.budgets, [key]: amount } })),
  createList: (l: Omit<WishList, "id" | "archived" | "items">) => {
    const id = uid();
    set((s) => ({ ...s, lists: [...s.lists, { ...l, id, archived: false, items: [] }] }));
    return id;
  },
  updateList: (id: string, patch: Partial<Pick<WishList, "name" | "category" | "date">>) =>
    set((s) => ({ ...s, lists: s.lists.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
  toggleArchive: (id: string) => set((s) => ({ ...s, lists: s.lists.map((l) => (l.id === id ? { ...l, archived: !l.archived } : l)) })),
  share: (id: string, who: string) => set((s) => ({ ...s, lists: s.lists.map((l) => (l.id === id ? { ...l, shared: [...l.shared, who] } : l)) })),
  addItemFromUrl: (listId: string, url: string): boolean => {
    const t = titleFromUrl(url);
    if (!t) return false;
    let h = 0;
    for (const c of url) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const price = 149 + (h % 18) * 50;
    const item: Item = { id: uid(), ...t, url, price, originalPrice: h % 3 === 0 ? Math.round(price * 1.25) : undefined, offers: offersFor(price), bought: false };
    set((s) => ({ ...s, lists: s.lists.map((l) => (l.id === listId ? { ...l, items: [...l.items, item] } : l)) }));
    return true;
  },
  toggleBought: (listId: string, itemId: string) =>
    set((s) => ({
      ...s,
      lists: s.lists.map((l) => l.id !== listId ? l : {
        ...l, items: l.items.map((i) => i.id !== itemId ? i : { ...i, bought: !i.bought, boughtMonth: !i.bought ? monthKey() : undefined }),
      }),
    })),
  removeItem: (listId: string, itemId: string) =>
    set((s) => ({ ...s, lists: s.lists.map((l) => (l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l)) })),
};
