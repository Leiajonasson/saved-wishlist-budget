import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus } from "lucide-react";
import { BudgetRing, ListCard, Shell } from "@/components/Shell";
import { budgetSummary, monthKey, MONTHS, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saved – din önskelista och shoppingbudget" },
      { name: "description", content: "Samla önskningar, jämför priser och håll koll på din shoppingbudget." },
      { property: "og:title", content: "Saved – önskelista och budget" },
      { property: "og:description", content: "Planera köp inför Black Friday och jul utan impulsköp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const s = useStore();
  const key = monthKey();
  const sum = budgetSummary(s, key);
  const lists = s.lists.filter((l) => !l.archived);
  return (
    <Shell back={false}>
      <Link to="/budget" className="relative block rounded-xl bg-rose px-4 pt-4 pb-6">
        <h2 className="mb-6 text-center font-serif text-3xl">Din budget för {MONTHS[new Date().getMonth()]}</h2>
        <BudgetRing {...sum} />
        <Pencil className="absolute bottom-5 left-4 h-6 w-6" />
      </Link>
      <div className="mt-8 flex items-center justify-between px-2">
        <h2 className="text-2xl font-semibold">Dina önskelistor</h2>
        <Link to="/listor/ny" className="flex items-center gap-3 rounded-lg bg-primary px-4 py-2 font-serif text-xl text-primary-foreground">
          Skapa <Plus className="h-5 w-5" />
        </Link>
      </div>
      <div className="-mr-2 mt-4 flex gap-4 overflow-x-auto px-2 pb-4">
        {lists.map((l) => (
          <Link key={l.id} to="/listor/$id" params={{ id: l.id }} className="w-40 shrink-0">
            <ListCard name={l.name} image={l.image} />
          </Link>
        ))}
      </div>
    </Shell>
  );
}
