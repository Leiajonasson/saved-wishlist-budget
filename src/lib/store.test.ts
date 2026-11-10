import { describe, expect, it } from "vitest";
import { budgetSummary, type State } from "./store";

const item = (price: number, bought: boolean, boughtMonth?: string) => ({
  id: String(price), name: "x", brand: "b", url: "", price, offers: [], bought, boughtMonth,
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
