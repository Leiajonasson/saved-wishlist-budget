import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, Plus } from "lucide-react";
import { ListCard, Shell } from "@/components/Shell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/listor/")({
  head: () => ({
    meta: [
      { title: "Önskelistor – Saved" },
      { name: "description", content: "Alla dina önskelistor för olika tillfällen." },
      { property: "og:title", content: "Önskelistor – Saved" },
      { property: "og:description", content: "Alla dina önskelistor för olika tillfällen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Lists,
});

function Lists() {
  const s = useStore();
  return (
    <Shell title="Önskelistor">
      <div className="grid grid-cols-2 gap-4 px-2">
        <Link to="/listor/ny" className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-primary/80 bg-rose text-xl font-semibold">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-chip"><Plus /></span>
          Skapa ny lista
        </Link>
        {s.lists.filter((l) => !l.archived).map((l) => (
          <Link key={l.id} to="/listor/$id" params={{ id: l.id }}><ListCard name={l.name} image={l.image} /></Link>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link to="/listor/arkiv" className="flex items-center gap-3 rounded-lg bg-card px-5 py-3 font-semibold">
          Arkiverade listor <Archive className="h-5 w-5" />
        </Link>
      </div>
    </Shell>
  );
}
