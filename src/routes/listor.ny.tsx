import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Plus, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { actions, CATEGORIES, MONTHS } from "@/lib/store";

export const Route = createFileRoute("/listor/ny")({
  head: () => ({
    meta: [
      { title: "Skapa önskelista – Saved" },
      { name: "description", content: "Skapa en ny önskelista för ett tillfälle." },
      { property: "og:title", content: "Skapa önskelista – Saved" },
      { property: "og:description", content: "Skapa en ny önskelista för ett tillfälle." },
    ],
  }),
  component: NewList,
});

function NewList() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [date, setDate] = useState("");
  const [image, setImage] = useState<string>();
  const [invite, setInvite] = useState("");
  const [shared, setShared] = useState<string[]>([]);
  const [showInvite, setShowInvite] = useState(false);

  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(f);
  };
  const dateLabel = date ? (() => { const d = new Date(date); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; })() : "";

  return (
    <Shell back={false}>
      <form className="mx-2 rounded-xl border border-primary/70 bg-card p-5"
        onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return;
          const id = actions.createList({ name: name.trim(), category: cat, date: dateLabel || "Inget datum", image, shared });
          nav({ to: "/listor/$id", params: { id } }); }}>
        <div className="mb-5 flex items-center justify-between">
          <h1 className="font-serif text-2xl">Skapa önskelista</h1>
          <button type="button" aria-label="Stäng" onClick={() => nav({ to: "/listor" })} className="grid h-7 w-7 place-items-center rounded-full bg-chip"><X className="h-4 w-4" /></button>
        </div>
        <label className="relative flex h-44 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl bg-rose font-semibold">
          {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-chip"><Plus className="h-4 w-4" /></span>Lägg till bild</>}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        <label htmlFor="namn" className="mt-6 block font-semibold">Namn</label>
        <input id="namn" value={name} onChange={(e) => setName(e.target.value)} placeholder="Önskelista…" className="mt-2 w-full rounded-lg bg-field px-3 py-3" />
        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button type="button" key={c} onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${cat === c ? "bg-primary text-primary-foreground" : "bg-chip"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <label className="relative flex items-center gap-3 rounded-lg bg-chip px-3 py-2 text-sm font-semibold">
            Datum <CalendarDays className="h-5 w-5" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="absolute inset-0 opacity-0" />
          </label>
          {dateLabel && <span className="rounded-lg bg-chip px-3 py-2 text-sm font-semibold">{dateLabel}</span>}
        </div>
        <button type="button" onClick={() => setShowInvite((v) => !v)} className="mt-6 flex items-center gap-3 rounded-lg bg-rose px-3 py-2 text-sm font-semibold">
          Dela / Bjud in <UserPlus className="h-4 w-4" />
        </button>
        {showInvite && (
          <div className="mt-3 flex gap-2">
            <input value={invite} onChange={(e) => setInvite(e.target.value)} placeholder="E-post eller namn" className="flex-1 rounded-lg bg-field px-3 py-2 text-sm" />
            <button type="button" onClick={() => { if (invite.trim()) { setShared([...shared, invite.trim()]); setInvite(""); } }}
              className="rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground">Bjud in</button>
          </div>
        )}
        {shared.length > 0 && <p className="mt-2 text-sm text-muted-foreground">Inbjudna: {shared.join(", ")}</p>}
        <button className="mt-8 w-full rounded-lg bg-primary py-2.5 font-serif text-xl text-primary-foreground disabled:opacity-50" disabled={!name.trim()}>Skapa önskelista</button>
      </form>
    </Shell>
  );
}
