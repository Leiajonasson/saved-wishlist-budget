import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({ url: z.string().trim().url().max(2000) });

export type ProductInfo =
  | { ok: true; name?: string | undefined; brand?: string | undefined; image?: string | undefined; price?: number | undefined }
  | { ok: false };

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

/** Read a <meta property|name="X" content="Y"> tag, attribute order agnostic. */
function meta(html: string, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const k = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const m =
      html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${k}["'][^>]+content=["']([^"']+)["']`, "i")) ??
      html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${k}["']`, "i"));
    if (m?.[1]) return m[1].trim();
  }
  return undefined;
}

function parsePrice(raw?: string): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw.replace(/[^\d.,]/g, "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 && n < 10_000_000 ? Math.round(n) : undefined;
}

/** Price from JSON-LD Product schema, when present. */
function jsonLdPrice(html: string): number | undefined {
  for (const block of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(block[1] ?? "");
      const nodes = Array.isArray(data) ? data : [data];
      for (const node of nodes) {
        const graph = Array.isArray(node?.["@graph"]) ? node["@graph"] : [node];
        for (const n of graph) {
          if (n?.["@type"] !== "Product") continue;
          const offers = Array.isArray(n.offers) ? n.offers[0] : n.offers;
          const p = parsePrice(String(offers?.price ?? offers?.lowPrice ?? ""));
          if (p) return p;
        }
      }
    } catch { /* ignore malformed JSON-LD */ }
  }
  return undefined;
}

async function directFetch(u: URL) {
  const res = await fetch(u.toString(), {
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "sv-SE,sv;q=0.9,en;q=0.8" },
  });
  if (!res.ok || !(res.headers.get("content-type") ?? "").includes("html")) return {};
  const html = (await res.text()).slice(0, 600_000);
  const name = meta(html, "og:title", "twitter:title") ?? html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
  const image = meta(html, "og:image", "twitter:image", "twitter:image:src");
  const price = parsePrice(meta(html, "product:price:amount", "og:price:amount", "price")) ?? jsonLdPrice(html);
  const brand = meta(html, "product:brand", "og:site_name");
  return {
    name: name || undefined,
    image: image ? new URL(image, u).toString() : undefined,
    price,
    brand,
  };
}

/** Microlink renders JS-heavy pages; free tier, no key. */
async function microlinkFetch(u: URL) {
  const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(u.toString())}`, {
    signal: AbortSignal.timeout(15000),
    headers: { "User-Agent": UA },
  });
  if (!res.ok) return {};
  const json = (await res.json()) as {
    status?: string;
    data?: { title?: string | null; image?: { url?: string } | null; publisher?: string | null };
  };
  if (json.status !== "success" || !json.data) return {};
  return {
    name: json.data.title ?? undefined,
    image: json.data.image?.url ?? undefined,
    brand: json.data.publisher ?? undefined,
  };
}

export const fetchProductInfo = createServerFn({ method: "POST" })
  .inputValidator((data) => Input.parse(data))
  .handler(async ({ data }): Promise<ProductInfo> => {
    try {
      const u = new URL(data.url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return { ok: false };
      const direct = await directFetch(u).catch(() => ({} as Awaited<ReturnType<typeof directFetch>>));
      let extra: Awaited<ReturnType<typeof microlinkFetch>> = {};
      if (!direct.name || !direct.image) {
        extra = await microlinkFetch(u).catch(() => ({} as Awaited<ReturnType<typeof microlinkFetch>>));
      }
      const name = direct.name ?? extra.name;
      const image = direct.image ?? extra.image;
      if (!name && !image) return { ok: false };
      const brand = direct.brand ?? extra.brand ?? u.hostname.replace(/^www\./, "").split(".")[0];
      return {
        ok: true,
        name,
        brand: brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : undefined,
        image,
        price: direct.price,
      };
    } catch {
      return { ok: false };
    }
  });
