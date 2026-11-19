import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Shell } from "@/components/Shell";
import { monthKey, monthLabel, useStore } from "@/lib/store";

export const Route = createFileRoute("/arkiv/budgets/")({
  head: () => ({
    meta: [
      { title: "Arkiverade budgetar – Saved" },
      { name: "description", content: "Se hur dina tidigare månadsbudgetar gick." },
      { property: "og:title", content: "Arkiverade budgetar – Saved" },
      { property: "og:description", content: "Se hur dina tidigare månadsbudgetar gick." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Budgets,
});

function Budgets() {
  const s = useStore();
  const keys = Object.keys(s.budgets).filter((k) => k < monthKey()).sort().reverse();
  return (
    <Shell title="Arkiverade budgets">
      <div className="space-y-6">
        {keys.length === 0 && <p className="text-center text-muted-foreground">Inga tidigare månader ännu.</p>}
        {keys.map((k) => {
          
          return (
            <Link key={k} to="/arkiv/budgets/$month" params={{ month: k }} className="block w-full rounded-xl bg-rose px-4 py-8 text-left">
              <span className="flex items-center justify-between text-2xl font-semibold">
                {monthLabel(k)} <ChevronRight className="h-7 w-7" />
              </span>
            </Link>
          );
        })}
      </div>
    </Shell>
  );
}
