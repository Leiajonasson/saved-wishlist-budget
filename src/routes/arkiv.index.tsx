import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/arkiv/")({
  head: () => ({
    meta: [
      { title: "Arkiv – Saved" },
      { name: "description", content: "Tidigare budgetar och arkiverade önskelistor." },
      { property: "og:title", content: "Arkiv – Saved" },
      { property: "og:description", content: "Tidigare budgetar och arkiverade önskelistor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Shell title="Arkiv">
      <div className="mt-16 space-y-8">
        <Link to="/arkiv/budgets" className="flex h-52 items-center justify-between rounded-xl bg-rose px-4 text-2xl font-semibold">Budgets <ChevronRight className="h-8 w-8" /></Link>
        <Link to="/listor/arkiv" className="flex h-52 items-center justify-between rounded-xl bg-rose px-4 text-2xl font-semibold">Listor <ChevronRight className="h-8 w-8" /></Link>
      </div>
    </Shell>
  ),
});
