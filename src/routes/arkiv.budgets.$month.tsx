import { createFileRoute } from "@tanstack/react-router";
import { BudgetRing, Shell } from "@/components/Shell";
import { budgetSummary, monthLabel, useStore } from "@/lib/store";

export const Route = createFileRoute("/arkiv/budgets/$month")({
  head: () => ({
    meta: [
      { title: "Arkiverad budget – Saved" },
      { name: "description", content: "Se slutlig kostnad, budget och köp för en tidigare månad." },
      { property: "og:title", content: "Arkiverad budget – Saved" },
      { property: "og:description", content: "Se slutlig kostnad, budget och köp för en tidigare månad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MonthBudget,
});

function MonthBudget() {
  const { month } = Route.useParams();
  const s = useStore();
  const sum = budgetSummary(s, month);
  const bought = s.lists.flatMap((l) => l.items.filter((i) => i.bought && i.boughtMonth === month).map((i) => ({ ...i, list: l.name })));
  return (
    <Shell title={monthLabel(month)}>
      <div className="rounded-xl bg-rose px-4 pt-4 pb-6">
        <h2 className="mb-6 text-center font-serif text-3xl">Din budget för {monthLabel(month)}</h2>
        <BudgetRing {...sum} />
        <div className="mt-6 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-card px-3 py-3"><div className="text-sm">Budget</div><div className="font-serif text-2xl">{sum.budget} kr</div></div>
          <div className="rounded-lg bg-card px-3 py-3"><div className="text-sm">Slutlig kostnad</div><div className="font-serif text-2xl">{sum.spent} kr</div></div>
        </div>
      </div>
      <h3 className="mt-8 mb-3 font-serif text-2xl">Köp under månaden</h3>
      {bought.length === 0 ? <p className="text-muted-foreground">Inga köp gjordes via appen denna månad.</p> : (
        <ul className="space-y-3">
          {bought.map((i) => (
            <li key={i.id} className="flex items-center gap-3 rounded-lg bg-card p-3">
              {i.image ? <img src={i.image} alt="" className="h-14 w-14 rounded object-cover" /> : <div className="h-14 w-14 rounded bg-rose" />}
              <div className="min-w-0 flex-1"><div className="font-semibold">{i.brand} – {i.name}</div><div className="text-sm text-muted-foreground">{i.list}</div></div>
              <div className="font-serif text-lg">{i.price} kr</div>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
