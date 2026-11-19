import { createFileRoute } from "@tanstack/react-router";
import { BudgetRing, Shell } from "@/components/Shell";
import { examplePurchases, MONTHS, monthLabel, useStore } from "@/lib/store";

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
  const m = Number(month.split("-")[1] ?? 1);
  const real = s.lists.flatMap((l) => l.items.filter((i) => i.bought && i.boughtMonth === month)
    .map((i) => ({ id: i.id, brand: i.brand, name: i.name, price: i.price, image: i.image, url: i.url, sub: l.name })));
  const ex = examplePurchases(month).map((p) => ({ ...p, sub: `${p.day} ${MONTHS[m - 1]?.toLowerCase()}` }));
  const bought = [...real, ...ex];
  const budget = s.budgets[month] ?? 0;
  const spent = bought.reduce((a, i) => a + i.price, 0);
  const left = budget - spent;
  const ratio = budget > 0 ? Math.min(1, spent / budget) : 1;
  const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  return (
    <Shell title={monthLabel(month)}>
      <div className="rounded-xl bg-rose px-4 pt-4 pb-6">
        <h2 className="mb-6 text-center font-serif text-3xl">Din budget för {monthLabel(month)}</h2>
        <BudgetRing left={left} spent={spent} budget={budget} ratio={ratio} />
        <p className="mt-6 text-center font-serif text-xl">{pct} % av budgeten spenderades</p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-card">
          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-card px-3 py-3"><div className="text-sm">Budget</div><div className="font-serif text-2xl">{budget} kr</div></div>
          <div className="rounded-lg bg-card px-3 py-3"><div className="text-sm">Slutlig kostnad</div><div className="font-serif text-2xl">{spent} kr</div></div>
        </div>
      </div>
      <h3 className="mt-8 mb-3 font-serif text-2xl">Köp under månaden ({bought.length})</h3>
      <ul className="space-y-3">
        {bought.map((i) => (
          <li key={i.id} className="flex items-center gap-3 rounded-lg bg-card p-3">
            {i.image ? <img src={i.image} alt="" className="h-14 w-14 rounded object-cover" /> : <div className="grid h-14 w-14 place-items-center rounded bg-rose font-serif text-xl">{i.brand[0]}</div>}
            <div className="min-w-0 flex-1"><a href={i.url} target="_blank" rel="noreferrer" className="font-semibold underline focus-visible:outline-2 focus-visible:outline-primary">{i.brand} – {i.name}</a><div className="text-sm text-muted-foreground">{i.sub}</div></div>
            <div className="font-serif text-lg">{i.price} kr</div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
