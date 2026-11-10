import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { budgetSummary, monthKey, monthLabel, useStore } from "@/lib/store";

export const Route = createFileRoute("/arkiv/budgets")({
  head: () => ({
    meta: [
      { title: "Arkiverade budgetar – Saved" },
      { name: "description", content: "Se hur dina tidigare månadsbudgetar gick." },
      { property: "og:title", content: "Arkiverade budgetar – Saved" },
      { property: "og:description", content: "Se hur dina tidigare månadsbudgetar gick." },
    ],
  }),
  component: Budgets,
});

function Budgets() {
  const s = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const keys = Object.keys(s.budgets).filter((k) => k < monthKey()).sort().reverse();
  return (
    <Shell title="Arkiverade budgets">
      <div className="space-y-6">
        {keys.length === 0 && <p className="text-center text-muted-foreground">Inga tidigare månader ännu.</p>}
        {keys.map((k) => {
          const b = budgetSummary(s, k);
          return (
            <button key={k} onClick={() => setOpen(open === k ? null : k)} className="block w-full rounded-xl bg-rose px-4 py-8 text-left">
              <span className="flex items-center justify-between text-2xl font-semibold">
                {monthLabel(k)} <ChevronRight className={`h-7 w-7 transition ${open === k ? "rotate-90" : ""}`} />
              </span>
              {open === k && <span className="mt-3 block font-serif text-lg">{b.spent} av {b.budget} kr spenderat · {b.left} kr kvar</span>}
            </button>
          );
        })}
      </div>
    </Shell>
  );
}
