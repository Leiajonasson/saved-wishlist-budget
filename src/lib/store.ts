import { useSyncExternalStore } from "react";
import { PRODUCT_CATALOG, LEGACY_PRODUCT_KEYS } from "./product-catalog";
import blackfriday from "@/assets/blackfriday.jpg";
import jul from "@/assets/jul.jpg";
import mamma from "@/assets/mamma.jpg";
import mammasFodelsedag from "@/assets/mammas-fodelsedag.jpg.asset.json";
import jeans from "@/assets/jeans.jpg";
import resaA from "@/assets/resa-omslag.jpg.asset.json";
import kokA from "@/assets/kok-omslag.jpg.asset.json";
import festA from "@/assets/fest-omslag.jpg.asset.json";
import pTroja from "@/assets/p-troja.jpg";
import pKappa from "@/assets/p-kappa.jpg";
import pLjus from "@/assets/p-ljus.jpg";
import pHalsduk from "@/assets/p-halsduk.jpg";
import pParfym from "@/assets/p-parfym.jpg";
import pVas from "@/assets/p-vas.jpg";
import pResvaska from "@/assets/p-resvaska.jpg";
import pSolglas from "@/assets/p-solglas.jpg";
import pSkalar from "@/assets/p-skalar.jpg";
import pKaffe from "@/assets/p-kaffe.jpg";
import pGlas from "@/assets/p-glas.jpg";
import inredning from "@/assets/inredning.jpg";
import beauty from "@/assets/beauty.jpg";
import pSmink from "@/assets/p-smink.jpg";
import pHudvard from "@/assets/p-hudvard.jpg";
import pHarvard from "@/assets/p-harvard.jpg";
const resa = resaA.url, kok = kokA.url, fest = festA.url;
const ARCHIVE_IMAGES: Record<string, string> = { resa, kok, fest };
const SEED_VERSION = 4;

export type Offer = { store: string; price: number; url: string };
export type Item = {
  id: string;
  name: string;
  brand: string;
  url: string;
  image?: string | undefined;
  price: number;
  priceKnown?: boolean;
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
  seedVersion?: number | undefined;
  productVersion?: number;
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

const STORE_URLS: Record<string, string> = {
  Zalando: "https://www.zalando.se",
  Boozt: "https://www.boozt.com",
  Ellos: "https://www.ellos.se",
};
export const storeUrl = (store: string) => STORE_URLS[store] ?? `https://www.google.com/search?q=${encodeURIComponent(store)}`;
export const storeLogo = (store: string, url?: string) => {
  const domain = url ? new URL(url).hostname : (STORE_URLS[store] ? new URL(STORE_URLS[store]).hostname : `${store.toLowerCase().replace(/\s+/g, "")}.se`);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
};

export function realProductItem(item: Item): Item {
  const key = LEGACY_PRODUCT_KEYS[item.name];
  const product = key ? PRODUCT_CATALOG[key] : undefined;
  if (!product) return { ...item, offers: item.offers.filter((o) => Boolean(o.url)) };
  const price = item.bought ? item.price : product.price;
  return { ...item, name: product.name, brand: product.brand, url: product.url,
    image: product.image, price, priceKnown: item.bought || product.priceKnown,
    originalPrice: undefined,
    offers: product.priceKnown ? [{ store: product.store, price: product.price, url: product.url }] : [],
  };
}

export function migrateProducts(saved: State): State {
  if ((saved.productVersion ?? 0) >= 2) return saved;
  return { ...saved, productVersion: 2, lists: saved.lists.map((list) => ({ ...list,
    items: list.items.map((item) => {
      const key = LEGACY_PRODUCT_KEYS[item.name];
      const product = key ? PRODUCT_CATALOG[key] : undefined;
      let placeholder = false;
      try { const h = new URL(item.url).hostname; placeholder = h === "www.example.com" || h === "example.com"; } catch {}
      // Refresh catalog-managed items (placeholder or already pointing at the catalog URL);
      // user-added items with their own URLs are left untouched.
      if (product && (placeholder || item.url === product.url)) return realProductItem(item);
      return { ...item, offers: item.offers.filter((o) => Boolean(o.url)) };
    }),
  })) };
}

function seed(): State {
  const now = monthKey();
  const budgets: Record<string, number> = { [now]: 2000 };
  const d = new Date();
  for (let i = 1; i <= 6; i++) budgets[monthKey(new Date(d.getFullYear(), d.getMonth() - i, 1))] = 1500 + i * 100;
  const mk = (name: string, brand: string, price: number, image?: string, bought = false, original?: number): Item => realProductItem({
    id: uid(), name, brand, url: "https://www.example.com/produkt", image, price, originalPrice: original,
    offers: [], bought, boughtMonth: bought ? now : undefined,
  });
  return {
    budgets,
    seedVersion: SEED_VERSION,
    productVersion: 2,
    lists: [
      { id: "black-friday", name: "Black Friday köp", category: "Black Friday", date: "27 November", image: blackfriday, archived: false, shared: [],
        items: [mk("Svarta Jeans", "Weekday", 399, jeans, false, 499), mk("Stickad tröja", "Arket", 199, pTroja, false, 349), mk("Ullkappa", "COS", 1050, pKappa, true, 1500), mk("Hörlurar", "Sony", 899, undefined, false, 1290), mk("Yogamatta", "Gaiam", 269)] },
      { id: "jul", name: "Jul 2026", category: "Jul", date: "24 December", image: jul, archived: false, shared: ["Mamma"],
        items: [mk("Doftljus", "Lumière", 200, pLjus, true), mk("Kashmirhalsduk", "& Other Stories", 699, pHalsduk), mk("Champagneglas", "Orrefors", 595, pGlas), mk("Adventsljusstake", "Northlight", 99), mk("Pocketbok", "Liza Marklund", 89)] },
      { id: "mamma", name: "Mammas födelsedag", category: "Födelsedag", date: "14 Mars", image: mammasFodelsedag.url, archived: false, shared: [], items: [mk("Parfym", "Diptyque", 1150, pParfym), mk("Keramikvas", "Granit", 299, pVas), mk("Doftljus", "Lumière", 249, pLjus), mk("Blomkruka", "Plantagen", 149)] },
      { id: "resa", name: "Köpa till resan", category: "Inspiration", date: "2 Juni", image: resa, archived: true, shared: [],
        items: [
          { ...mk("Resväska", "Samsonite", 1290, pResvaska, true), boughtMonth: monthKey(new Date(d.getFullYear(), d.getMonth() - 1, 1)) },
          { ...mk("Solglasögon", "Ray-Ban", 890, pSolglas, true), boughtMonth: monthKey(new Date(d.getFullYear(), d.getMonth() - 2, 1)) },
          mk("Powerbank", "Anker", 399), mk("Solkräm", "ACO", 199),
        ] },
      { id: "kok", name: "Köksinredning", category: "Inspiration", date: "1 Maj", image: kok, archived: true, shared: [], items: [mk("Keramikskålar", "Designtorget", 449, pSkalar), mk("Kaffebryggare", "Moccamaster", 1490, pKaffe), mk("Keramikvas", "Granit", 299, pVas), mk("Airfryer", "Philips", 1499)] },
      { id: "fest", name: "50 års fest", category: "Fest", date: "12 April", image: fest, archived: true, shared: [], items: [mk("Champagneglas", "Orrefors", 595, pGlas), mk("Doftljus", "Lumière", 200, pLjus), mk("Parfym", "Diptyque", 1150, pParfym), mk("Glaskaraff", "Designtorget", 349), mk("Festklänning", "Gina Tricot", 499)] },
      { id: "inredning", name: "Inredning", category: "Hem & inredning", date: "15 December", image: inredning, archived: false, shared: [],
        items: [mk("Keramikvas", "Granit", 299, pVas), mk("Doftljus", "Lumière", 249, pLjus), mk("Keramikskålar", "Designtorget", 449, pSkalar), mk("Kuddfodral", "Svanefors", 479)] },
      { id: "beauty", name: "Beauty", category: "Min önskelista", date: "20 December", image: beauty, archived: false, shared: [],
        items: [mk("Läppstift & rouge", "Kicks", 349, pSmink), mk("C-vitaminserum", "The Ordinary", 289, pHudvard), mk("Schampo", "Pureléa", 179, pHarvard), mk("Ansiktskräm", "The Ordinary", 185)] },
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
    if (raw) {
      let saved = JSON.parse(raw) as State;
      if ((saved.seedVersion ?? 1) < SEED_VERSION) {
        const fresh = seed();
        saved = { ...saved, seedVersion: SEED_VERSION, lists: [
          ...saved.lists.map((l) => {
            const f = fresh.lists.find((x) => x.id === l.id);
            if (!f) return l;
            const own = l.items.filter((i) => !i.url.includes("example.com"));
            const img = ARCHIVE_IMAGES[l.id] && !(l.image ?? "").startsWith("data:") ? ARCHIVE_IMAGES[l.id] : l.image;
            return { ...l, image: img, items: [...f.items, ...own] };
          }),
          ...fresh.lists.filter((f) => !saved.lists.some((l) => l.id === f.id)),
        ] };
      }
      state = migrateProducts({
        ...saved,
        lists: saved.lists.map((list) =>
          list.id === "mamma" && (list.image === mamma || /\/mamma(?:-[\w-]+)?\.jpg(?:[?#].*)?$/.test(list.image ?? ""))
            ? { ...list, image: mammasFodelsedag.url }
            : ARCHIVE_IMAGES[list.id] && false
              ? { ...list, image: ARCHIVE_IMAGES[list.id] }
              : list,
        ),
      });
      localStorage.setItem(KEY, JSON.stringify(state));
    }
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
  updateList: (id: string, patch: Partial<Pick<WishList, "name" | "category" | "date" | "image">>) =>
    set((s) => ({ ...s, lists: s.lists.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
  toggleArchive: (id: string) => set((s) => ({ ...s, lists: s.lists.map((l) => (l.id === id ? { ...l, archived: !l.archived } : l)) })),
  removeList: (id: string) => set((s) => ({ ...s, lists: s.lists.filter((l) => l.id !== id) })),
  share: (id: string, who: string) => set((s) => ({ ...s, lists: s.lists.map((l) => (l.id === id ? { ...l, shared: [...l.shared, who] } : l)) })),
  addItem: (listId: string, data: { name: string; brand: string; url: string; image?: string | undefined; price: number; priceKnown?: boolean; originalPrice?: number | undefined }) => {
    const item: Item = { id: uid(), ...data, offers: [], bought: false };
    set((s) => ({ ...s, lists: s.lists.map((l) => (l.id === listId ? { ...l, items: [...l.items, item] } : l)) }));
  },
  addItemFromUrl: (listId: string, url: string): boolean => {
    const t = titleFromUrl(url);
    if (!t) return false;
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const item: Item = { id: uid(), ...t, url, price: 0, priceKnown: false, offers: [], bought: false };
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

// Example purchases for past months (illustrative, deterministic per month)
const EXAMPLES = Object.values(PRODUCT_CATALOG).filter((p) => p.priceKnown);
export function examplePurchases(key: string) {
  let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const n = 2 + (h % 3), out: { id: string; brand: string; name: string; price: number; day: number; url: string; image?: string }[] = [];
  for (let i = 0; i < n; i++) {
    const product = EXAMPLES[(h + i * 5) % EXAMPLES.length];
    if (!product) continue;
    out.push({ id: `${key}-${i}`, ...product, day: 1 + ((h >>> (i + 2)) % 28) });
  }
  return out.sort((a, b) => a.day - b.day);
}
