import { createFileRoute, Link } from "@tanstack/react-router";
import { ListCard, Shell } from "@/components/Shell";
import { useStore } from "@/lib/store";

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
          <Link key={l.id} to="/listor/$id" params={{ id: l.id }}><ListCard name={l.name} image={l.image} faded /></Link>
        ))}
      </div>
    </Shell>
  );
}
