import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_CATALOG, LEGACY_PRODUCT_KEYS } from "./product-catalog";
const blackfriday = "/omslag/blackfriday.jpg";
const jul = "/omslag/jul.jpg";
const mamma = "/omslag/mamma.jpg";
import mammasFodelsedag from "@/assets/mammas-fodelsedag.jpg.asset.json";
import resaA from "@/assets/resa-omslag.jpg.asset.json";
import kokA from "@/assets/kok-omslag.jpg.asset.json";
import festA from "@/assets/fest-omslag.jpg.asset.json";
const inredning = "/omslag/inredning.jpg";
const beauty = "/omslag/beauty.jpg";
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
  compared?: boolean;
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
export const storeNameFromUrl = (u: string) => { try { const b = new URL(u).hostname.replace(/^www\./, "").split(".").slice(-2)[0] ?? "Butik"; return b.charAt(0).toUpperCase() + b.slice(1); } catch { return "Butik"; } };
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
  if ((saved.productVersion ?? 0) >= 3) return saved;
  return { ...saved, productVersion: 3, lists: saved.lists.map((list) => ({ ...list,
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
    productVersion: 3,
    lists: [
      { id: "black-friday", name: "Black Friday köp", category: "Black Friday", date: "27 November", image: blackfriday, archived: false, shared: [],
        items: [mk("Svarta Jeans", "Weekday", 399, undefined, false, 499), mk("Stickad tröja", "Arket", 199, undefined, false, 349), mk("Ullkappa", "COS", 1050, undefined, true, 1500), mk("Hörlurar", "Sony", 899, undefined, false, 1290), mk("Yogamatta", "Gaiam", 269)] },
      { id: "jul", name: "Jul 2026", category: "Jul", date: "24 December", image: jul, archived: false, shared: ["Mamma"],
        items: [mk("Doftljus", "Lumière", 200, undefined, true), mk("Kashmirhalsduk", "& Other Stories", 699, undefined), mk("Champagneglas", "Orrefors", 595, undefined), mk("Adventsljusstake", "Northlight", 99), mk("Pocketbok", "Liza Marklund", 89)] },
      { id: "mamma", name: "Mammas födelsedag", category: "Födelsedag", date: "14 Mars", image: mammasFodelsedag.url, archived: false, shared: [], items: [mk("Parfym", "Diptyque", 1150, undefined), mk("Keramikvas", "Granit", 299, undefined), mk("Doftljus", "Lumière", 249, undefined), mk("Blomkruka", "Plantagen", 149)] },
      { id: "resa", name: "Köpa till resan", category: "Inspiration", date: "2 Juni", image: resa, archived: true, shared: [],
        items: [
          { ...mk("Resväska", "Samsonite", 1290, undefined, true), boughtMonth: monthKey(new Date(d.getFullYear(), d.getMonth() - 1, 1)) },
          { ...mk("Solglasögon", "Ray-Ban", 890, undefined, true), boughtMonth: monthKey(new Date(d.getFullYear(), d.getMonth() - 2, 1)) },
          mk("Powerbank", "Anker", 399), mk("Solkräm", "ACO", 199),
        ] },
      { id: "kok", name: "Köksinredning", category: "Inspiration", date: "1 Maj", image: kok, archived: true, shared: [], items: [mk("Keramikskålar", "Designtorget", 449, undefined), mk("Kaffebryggare", "Moccamaster", 1490, undefined), mk("Keramikvas", "Granit", 299, undefined), mk("Airfryer", "Philips", 1499)] },
      { id: "fest", name: "50 års fest", category: "Fest", date: "12 April", image: fest, archived: true, shared: [], items: [mk("Champagneglas", "Orrefors", 595, undefined), mk("Doftljus", "Lumière", 200, undefined), mk("Parfym", "Diptyque", 1150, undefined), mk("Glaskaraff", "Designtorget", 349), mk("Festklänning", "Gina Tricot", 499)] },
      { id: "inredning", name: "Inredning", category: "Hem & inredning", date: "15 December", image: inredning, archived: false, shared: [],
        items: [mk("Keramikvas", "Granit", 299, undefined), mk("Doftljus", "Lumière", 249, undefined), mk("Keramikskålar", "Designtorget", 449, undefined), mk("Kuddfodral", "Svanefors", 479)] },
      { id: "beauty", name: "Beauty", category: "Min önskelista", date: "20 December", image: beauty, archived: false, shared: [],
        items: [mk("Läppstift & rouge", "Kicks", 349, undefined), mk("C-vitaminserum", "The Ordinary", 289, undefined), mk("Schampo", "Pureléa", 179, undefined), mk("Ansiktskräm", "The Ordinary", 185)] },
    ],
  };
}

let state: State = seed();
const serverState = state;
let hydrated = false;
const listeners = new Set<() => void>();

// ---- Databaslagring: allt sparas i Lovable Cloud så att länken visar samma innehåll för alla ----

let persisting = false;
let persistAgain = false;

async function persistNow() {
  if (persisting) { persistAgain = true; return; }
  persisting = true;
  const s = state;
  try {
    await supabase.from("offers").delete().gte("id", 0);
    await supabase.from("items").delete().neq("id", "");
    await supabase.from("wishlists").delete().neq("id", "");
    await supabase.from("budgets").delete().neq("month", "");
    const budgetRows = Object.entries(s.budgets).map(([month, amount]) => ({ month, amount }));
    if (budgetRows.length) await supabase.from("budgets").insert(budgetRows);
    if (s.lists.length) {
      await supabase.from("wishlists").insert(s.lists.map((l, i) => ({
        id: l.id, name: l.name, category: l.category, date: l.date,
        image: l.image ?? null, archived: l.archived, shared: l.shared, position: i,
      })));
      const itemRows = s.lists.flatMap((l) => l.items.map((it, i) => ({
        id: it.id, list_id: l.id, name: it.name, brand: it.brand, url: it.url,
        image: it.image ?? null, price: it.price, price_known: it.priceKnown ?? true,
        original_price: it.originalPrice ?? null, compared: it.compared ?? false,
        bought: it.bought, bought_month: it.boughtMonth ?? null, position: i,
      })));
      if (itemRows.length) await supabase.from("items").insert(itemRows);
      const offerRows = s.lists.flatMap((l) => l.items.flatMap((it) => it.offers.map((o) => ({
        item_id: it.id, store: o.store, price: o.price, url: o.url,
      }))));
      if (offerRows.length) await supabase.from("offers").insert(offerRows);
    }
  } catch {}
  persisting = false;
  if (persistAgain) { persistAgain = false; void persistNow(); }
}

let persistTimer: ReturnType<typeof setTimeout> | undefined;
function persist() {
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => void persistNow(), 400);
}

async function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const [{ data: lists }, { data: items }, { data: offers }, { data: budgets }] = await Promise.all([
      supabase.from("wishlists").select("*").order("position"),
      supabase.from("items").select("*").order("position"),
      supabase.from("offers").select("*"),
      supabase.from("budgets").select("*"),
    ]);
    if (!lists || lists.length === 0) {
      // Första besöket: fyll databasen med startinnehållet.
      state = seed();
      await persistNow();
    } else {
      state = migrateProducts({
        seedVersion: SEED_VERSION,
        productVersion: 3,
        budgets: Object.fromEntries((budgets ?? []).map((b) => [b.month, Number(b.amount)])),
        lists: lists.map((l) => ({
          id: l.id, name: l.name, category: l.category, date: l.date,
          image: l.image ?? undefined, archived: l.archived,
          shared: Array.isArray(l.shared) ? (l.shared as string[]) : [],
          items: (items ?? []).filter((i) => i.list_id === l.id).map((i) => ({
            id: i.id, name: i.name, brand: i.brand, url: i.url,
            image: i.image ?? undefined, price: Number(i.price),
            priceKnown: i.price_known,
            originalPrice: i.original_price == null ? undefined : Number(i.original_price),
            compared: i.compared, bought: i.bought, boughtMonth: i.bought_month ?? undefined,
            offers: (offers ?? []).filter((o) => o.item_id === i.id).map((o) => ({ store: o.store, price: Number(o.price), url: o.url })),
          })),
        })),
      });
    }
    listeners.forEach((l) => l());
  } catch {}
}

function set(fn: (s: State) => State) {
  state = fn(state);
  listeners.forEach((l) => l());
  persist();
}

export function useStore() {
  return useSyncExternalStore(
    (l) => { void load(); listeners.add(l); l(); return () => listeners.delete(l); },
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
  addOffers: (listId: string, itemId: string, offers: Offer[]) =>
    set((s) => ({
      ...s,
      lists: s.lists.map((l) => l.id !== listId ? l : {
        ...l, items: l.items.map((i) => {
          if (i.id !== itemId) return i;
          const base = i.offers.length || i.priceKnown === false ? i.offers : [{ store: storeNameFromUrl(i.url), price: i.price, url: i.url }];
          const merged = [...base];
          for (const o of offers) if (!merged.some((m) => m.url === o.url || m.store === o.store)) merged.push(o);
          return { ...i, offers: merged, compared: true };
        }),
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
