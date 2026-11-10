import { createFileRoute } from "@tanstack/react-router";
import { CircleUserRound } from "lucide-react";
import { Shell } from "@/components/Shell";
import { budgetSummary, monthKey, useStore } from "@/lib/store";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil – Saved" },
      { name: "description", content: "Din översikt över önskningar och utgifter." },
      { property: "og:title", content: "Profil – Saved" },
      { property: "og:description", content: "Din översikt över önskningar och utgifter." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const s = useStore();
  const items = s.lists.flatMap((l) => l.items);
  const b = budgetSummary(s, monthKey());
  const stats = [
    ["Önskelistor", s.lists.filter((l) => !l.archived).length],
    ["Önskningar", items.length],
    ["Köpta", items.filter((i) => i.bought).length],
    ["Kvar i budget", `${b.left} kr`],
  ];
  return (
    <Shell title="Profil">
      <div className="mx-2 rounded-xl bg-rose p-6 text-center">
        <CircleUserRound className="mx-auto h-16 w-16" strokeWidth={1.2} />
        <p className="mt-2 font-serif text-2xl">Min profil</p>
      </div>
      <div className="mx-2 mt-6 grid grid-cols-2 gap-4">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-primary/60 bg-card p-4">
            <p className="text-sm text-muted-foreground">{k}</p>
            <p className="font-serif text-3xl">{v}</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}
