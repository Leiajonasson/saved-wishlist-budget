import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, Check, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { BudgetRing, Shell } from "@/components/Shell";
import { actions, budgetSummary, monthKey, MONTHS, useStore } from "@/lib/store";

export const Route = createFileRoute("/budget")({
  head: () => ({
    meta: [
      { title: "Månadsbudget – Saved" },
      { name: "description", content: "Sätt och följ din månadsbudget för shopping." },
      { property: "og:title", content: "Månadsbudget – Saved" },
      { property: "og:description", content: "Sätt och följ din månadsbudget för shopping." },
    ],
  }),
  component: Budget,
});

function Budget() {
  const s = useStore();
  const key = monthKey();
  const sum = budgetSummary(s, key);
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(sum.budget));
  useEffect(() => setVal(String(sum.budget)), [sum.budget]);
  return (
    <Shell>
      <div className="rounded-xl bg-rose px-4 pt-4 pb-6">
        <h2 className="mb-6 text-center font-serif text-3xl">Din budget för {MONTHS[new Date().getMonth()]}</h2>
        <BudgetRing {...sum} />
        <button onClick={() => setEditing((e) => !e)} className="mt-6 flex items-center gap-2 rounded-lg bg-chip px-4 py-2 font-semibold">
          <Pencil className="h-5 w-5" /> Redigera
        </button>
        {editing && (
          <form className="mt-6" onSubmit={(e) => { e.preventDefault(); const n = Number(val); if (n >= 0) { actions.setBudget(key, n); setEditing(false); } }}>
            <label className="font-semibold" htmlFor="belopp">Belopp</label>
            <div className="mt-2 flex gap-3">
              <input id="belopp" inputMode="numeric" value={val} onChange={(e) => setVal(e.target.value.replace(/\D/g, ""))}
                className="w-32 rounded-lg bg-card px-3 py-2 text-xl" />
              <span className="rounded-lg bg-card px-4 py-2 font-semibold">kr (sek)</span>
              <button className="ml-auto flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">
                Spara <Check className="h-5 w-5" />
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="mt-10 flex justify-center">
        <Link to="/arkiv/budgets" className="flex items-center gap-3 rounded-lg bg-card px-5 py-3 font-semibold">
          Se tidigare månader <Archive className="h-5 w-5" />
        </Link>
      </div>
    </Shell>
  );
}
