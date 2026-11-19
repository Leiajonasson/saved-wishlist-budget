import { createServerFn } from "@tanstack/react-start";

export type FoundOffer = { store: string; price: number; url: string };
const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";

const host = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
const storeName = (h: string) => { const b = h.split(".").slice(-2)[0] ?? h; return b.charAt(0).toUpperCase() + b.slice(1); };
const BLOCKED = /(plick|tradera|blocket|sellpy|vinted|ebay|amazon\.com|prisbot|varusok|google|youtube|facebook|instagram|pinterest|reddit|wikipedia|tiktok|pricerunner|prisjakt)\./;

export const findOtherStores = createServerFn({ method: "POST" })
  .inputValidator((d: { name: string; brand?: string; url?: string; price?: number }) => {
    const name = String(d?.name ?? "").trim().slice(0, 150);
    if (name.length < 2) throw new Error("Produktnamn saknas");
    return { name, brand: String(d.brand ?? "").slice(0, 60), url: String(d.url ?? ""), price: Number(d.price) || 0 };
  })
  .handler(async ({ data }): Promise<{ ok: true; offers: FoundOffer[] } | { ok: false; error: string }> => {
    const lk = process.env["LOVABLE_API_KEY"], fk = process.env["FIRECRAWL_API_KEY"];
    if (!lk || !fk) return { ok: false, error: "Söktjänsten är inte kopplad" };
    const own = host(data.url);
    const query = `${data.brand && !data.name.toLowerCase().includes(data.brand.toLowerCase()) ? data.brand + " " : ""}${data.name} köp pris`;
    const res = await fetch(`${GATEWAY}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${lk}`, "X-Connection-Api-Key": fk },
      body: JSON.stringify({
        query, limit: 8, country: "SE", lang: "sv",
        scrapeOptions: { formats: [{ type: "json", prompt: `Is this a product page selling "${data.name}"? Return sameProduct (boolean, true only if it's this exact product), price (number, current price in SEK, null if missing), currency.`,
          schema: { type: "object", properties: { sameProduct: { type: "boolean" }, price: { type: ["number", "null"] }, currency: { type: ["string", "null"] } } } }] },
      }),
    });
    if (!res.ok) { const t = await res.text(); console.error(`Firecrawl ${res.status}: ${t}`); return { ok: false, error: `Sökningen misslyckades (${res.status})` }; }
    const body = (await res.json()) as { data?: { web?: { url: string; json?: { sameProduct?: boolean; price?: number | null; currency?: string | null } }[] } };
    const seen = new Set<string>(own ? [own] : []);
    const offers: FoundOffer[] = [];
    for (const r of body.data?.web ?? []) {
      const h = host(r.url); const j = r.json;
      if (!h || seen.has(h) || BLOCKED.test(h + ".")) continue;
      if (!j?.sameProduct || typeof j.price !== "number" || j.price <= 0) continue;
      if (data.price > 0 && (j.price < data.price * 0.4 || j.price > data.price * 2.5)) continue;
      if (j.currency && !/sek|kr/i.test(j.currency)) continue;
      seen.add(h);
      offers.push({ store: storeName(h), price: Math.round(j.price), url: r.url });
    }
    return { ok: true, offers: offers.sort((a, b) => a.price - b.price).slice(0, 5) };
  });
