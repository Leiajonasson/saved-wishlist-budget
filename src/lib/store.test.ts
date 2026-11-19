import { describe, expect, it } from "vitest";
import { budgetSummary, migrateProducts, realProductItem, examplePurchases, type State } from "./store";
import { PRODUCT_CATALOG } from "./product-catalog";

const item = (price: number, bought: boolean, boughtMonth?: string) => ({
  id: String(price), name: "x", brand: "b", url: "", price, offers: [], bought, boughtMonth,
});

describe("real product links", () => {
  it("replaces every catalog placeholder with a direct product link", () => {
    for (const product of Object.values(PRODUCT_CATALOG)) {
      expect(new URL(product.url).protocol).toBe("https:");
      expect(new URL(product.url).pathname).not.toBe("/");
      expect(product.url).not.toMatch(/\/search[/?]|google\.com/);
      expect(product.url).not.toContain("example.com");
    }
    const jeans = realProductItem({ ...item(399, false), name: "Svarta Jeans" });
    expect(jeans.url).toBe("https://www.zalando.se/weekday-klean-regular-straight-jeans-straight-leg-black-web22g068-q11.html");
    expect(jeans.offers).toEqual([{ store: "Zalando", price: 679, url: jeans.url }]);
  });

  it("preserves bought prices, IDs, months and user-added products during migration", () => {
    const own = { ...item(450, false), id: "own", url: "https://my-shop.test/product/123" };
    const s: State = { budgets: { "2026-11": 2000 }, lists: [{ id: "custom", name: "Min lista", category: "", date: "", archived: true, shared: [], items: [
      { ...item(1050, true, "2026-11"), id: "bought", name: "Ullkappa", url: "https://www.example.com/produkt" }, own,
    ] }] };
    const migrated = migrateProducts(s);
    expect(migrated.lists[0]?.items[0]).toMatchObject({ id: "bought", price: 1050, bought: true, boughtMonth: "2026-11", url: PRODUCT_CATALOG["kappa"]?.url });
    expect(migrated.lists[0]?.items[1]).toEqual(own);
    expect(migrated.lists).toHaveLength(1);
    expect(migrated.lists[0]?.archived).toBe(true);
    expect(migrateProducts(migrated)).toBe(migrated);
  });

  it("also gives archived example purchases real product URLs", () => {
    const purchases = examplePurchases("2026-10");
    expect(purchases.length).toBeGreaterThan(0);
    for (const purchase of purchases) expect(Object.values(PRODUCT_CATALOG).some((p) => p.url === purchase.url)).toBe(true);
  });
});

describe("budgetSummary", () => {
  it("counts only items bought in the given month", () => {
    const s: State = {
      budgets: { "2026-11": 2000 },
      lists: [{ id: "a", name: "a", category: "", date: "", archived: false, shared: [],
        items: [item(1050, true, "2026-11"), item(200, true, "2026-11"), item(399, false), item(500, true, "2026-10")] }],
    };
    expect(budgetSummary(s, "2026-11")).toMatchObject({ budget: 2000, spent: 1250, left: 750 });
  });
});
