import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { ListCard, Shell } from "@/components/Shell";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/listor/arkiv")({
  head: () => ({
    meta: [
      { title: "Arkiverade listor – Saved" },
      { name: "description", content: "Önskelistor du har arkiverat." },
      { property: "og:title", content: "Arkiverade listor – Saved" },
      { property: "og:description", content: "Önskelistor du har arkiverat." },
    ],
  }),
  component: Archived,
});

function Archived() {
  const s = useStore();
  const lists = s.lists.filter((l) => l.archived);
  return (
    <Shell title="Arkiverade listor">
      {lists.length === 0 && <p className="text-center text-muted-foreground">Inga arkiverade listor.</p>}
      <div className="grid grid-cols-2 gap-4 px-2">
        {lists.map((l) => (
          <div key={l.id} className="relative">
            <Link to="/listor/$id" params={{ id: l.id }}><ListCard name={l.name} image={l.image} faded /></Link>
            <button
              type="button"
              aria-label={`Radera ${l.name}`}
              onClick={() => { if (window.confirm(`Vill du radera "${l.name}"? Det går inte att ångra.`)) actions.removeList(l.id); }}
              className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-card text-primary shadow-md ring-1 ring-primary/40 hover:bg-rose"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </Shell>
  );
}
