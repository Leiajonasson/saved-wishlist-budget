import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, ArrowUpRight, CalendarDays, Check, Pencil, Plus, Search, Share, Trash2, X } from "lucide-react";
import { useState } from "react";
import * as D from "@radix-ui/react-dialog";
import { Shell } from "@/components/Shell";
import { ThemePicker } from "@/components/ThemePicker";
import { actions, useStore, type Item, budgetSummary, monthKey, storeUrl } from "@/lib/store";

export const Route = createFileRoute("/listor/$id")({
  head: () => ({
    meta: [
      { title: "Önskelista – Saved" },
      { name: "description", content: "Dina önskningar, priser och prisjämförelser." },
      { property: "og:title", content: "Önskelista – Saved" },
      { property: "og:description", content: "Dina önskningar, priser och prisjämförelser." },
    ],
  }),
  component: ListPage,
});

function ListPage() {
  const { id } = Route.useParams();
  const s = useStore();
  const list = s.lists.find((l) => l.id === id);
  const [adding, setAdding] = useState(false);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [who, setWho] = useState("");
  const [editing, setEditing] = useState(false);
  const [eName, setEName] = useState("");
  const [eCat, setECat] = useState("");
  const [eDate, setEDate] = useState("");
  const [eImage, setEImage] = useState<string>();

  const onFileEdit = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setEImage(String(r.result));
    r.readAsDataURL(f);
  };

  if (!list) return <Shell><p className="text-center">Listan hittades inte. <Link to="/listor" className="underline">Till listor</Link></p></Shell>;
  const item = list.items.find((i) => i.id === openItem);

  return (
    <Shell>
      <div className="mx-2 rounded-xl border border-primary/70 bg-card p-5">
        <div className="relative">
          <h1 className="px-10 text-center font-serif text-3xl">{list.name}</h1>
          <button aria-label="Redigera önskelista" onClick={() => { setEName(list.name); setECat(list.category); setEDate(list.date); setEImage(list.image); setEditing(true); }}
            className="absolute top-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-chip"><Pencil className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold"><CalendarDays className="h-5 w-5" />{list.date}</span>
          <span className="rounded-lg bg-foreground px-2 py-1 text-sm font-semibold text-background">{list.category}</span>
        </div>
        <div className="mt-4 aspect-[16/15] overflow-hidden rounded-lg border border-foreground/60 bg-muted">
          {list.image && <img src={list.image} alt={list.name} className="h-full w-full object-cover object-center" />}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <Link to="/budget" className="rounded-lg bg-primary px-2 py-1 font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Kvar av budget: {budgetSummary(s, monthKey()).left} kr
          </Link>
          <button onClick={() => setSharing((v) => !v)} className="ml-auto flex items-center gap-1 rounded-lg bg-chip px-2 py-1 font-semibold"><Share className="h-4 w-4" />Dela</button>
          <button onClick={() => actions.toggleArchive(list.id)} className="flex items-center gap-1 rounded-lg bg-chip px-2 py-1 font-semibold">
            <Archive className="h-4 w-4" />{list.archived ? "Återställ" : "Arkivera"}</button>
        </div>
        {sharing && (
          <div className="mt-3 rounded-lg bg-muted p-3 text-sm">
            <div className="flex gap-2">
              <input value={who} onChange={(e) => setWho(e.target.value)} aria-label="Bjud in via e-post eller namn" placeholder="Bjud in via e-post eller namn" className="flex-1 rounded-lg bg-card px-3 py-2" />
              <button onClick={() => { if (who.trim()) { actions.share(list.id, who.trim()); setWho(""); } }} className="rounded-lg bg-primary px-3 font-semibold text-primary-foreground">Bjud in</button>
            </div>
            <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="mt-2 underline">Kopiera länk</button>
            {list.shared.length > 0 && <p className="mt-2 text-muted-foreground">Delad med: {list.shared.join(", ")}</p>}
          </div>
        )}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <button onClick={() => setAdding(true)} className={`flex aspect-[3/3.6] flex-col items-center justify-center gap-3 rounded-lg border border-primary font-semibold shadow-md transition ${adding ? "bg-primary text-primary-foreground" : "bg-rose"}`}>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-chip text-foreground"><Plus className="h-4 w-4" /></span>Skapa önskan
          </button>
          {list.items.map((i) => <ItemCard key={i.id} item={i} onOpen={() => setOpenItem(i.id)} />)}
        </div>
      </div>

      {adding && (
        <Sheet onClose={() => { setAdding(false); setErr(""); }} title="Skapa önskan">
          <form onSubmit={(e) => { e.preventDefault(); if (actions.addItemFromUrl(list.id, url.trim())) { setUrl(""); setAdding(false); setErr(""); } else setErr("Klistra in en giltig produktlänk."); }}>
            <label className="flex items-center gap-3 rounded-lg bg-field px-4 py-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
              <Search className="h-5 w-5" />
              <input autoFocus aria-label="Produktlänk" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="infoga länk..." className="flex-1 bg-transparent text-sm outline-none" />
            </label>
            {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
            <button className="mt-8 w-full rounded-lg bg-primary py-2 font-serif text-xl text-primary-foreground">Lägg till</button>
          </form>
        </Sheet>
      )}
      {editing && (
        <Sheet onClose={() => setEditing(false)} title="Redigera önskelista">
          <form onSubmit={(e) => { e.preventDefault(); if (!eName.trim()) return; actions.updateList(list.id, { name: eName.trim(), category: eCat, date: eDate.trim() || "Inget datum", image: eImage }); setEditing(false); }}>
            <label className="relative flex h-32 cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary items-center justify-center gap-2 overflow-hidden rounded-lg bg-rose font-semibold">
              {eImage ? <img src={eImage} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-chip"><Plus className="h-4 w-4" /></span>Byt bild</>}
              <input type="file" accept="image/*" aria-label="Välj bild" className="sr-only" onChange={(e) => onFileEdit(e.target.files?.[0])} />
            </label>
            {eImage && <button type="button" onClick={() => setEImage(undefined)} className="mt-2 text-sm underline">Ta bort bild</button>}
            <label htmlFor="enamn" className="mt-4 block font-semibold">Namn</label>
            <input id="enamn" value={eName} onChange={(e) => setEName(e.target.value)} className="mt-2 w-full rounded-lg bg-field px-3 py-3" />
            <label htmlFor="edatum" className="mt-4 block font-semibold">Datum</label>
            <input id="edatum" value={eDate} onChange={(e) => setEDate(e.target.value)} placeholder="t.ex. 24 December" className="mt-2 w-full rounded-lg bg-field px-3 py-3" />
            <div className="mt-4"><ThemePicker value={eCat} onChange={setECat} /></div>
            <button className="mt-8 w-full rounded-lg bg-primary py-2 font-serif text-xl text-primary-foreground">Spara</button>
          </form>
        </Sheet>
      )}
      {item && <ItemDetail item={item} listId={list.id} onClose={() => setOpenItem(null)} />}
    </Shell>
  );
}

function ItemCard({ item, onOpen }: { item: Item; onOpen: () => void }) {
  const drop = item.originalPrice && item.originalPrice > item.price;
  return (
    <button onClick={onOpen} className="relative flex aspect-[3/3.6] flex-col rounded-lg border border-primary/70 bg-card p-2 text-left shadow-md">
      <div className="relative flex-1 overflow-hidden rounded bg-muted">
        <div className={`h-full w-full ${item.bought ? "opacity-40" : ""}`}>
          {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> :
            <span className="grid h-full place-items-center font-serif text-2xl text-muted-foreground">{item.brand}</span>}
        </div>
        {drop && <span className="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">Prissänkt</span>}
        {item.bought && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-14 w-14 place-items-center rounded-xl bg-card shadow-xl ring-1 ring-primary/25">
              <Check className="h-8 w-8 text-primary" strokeWidth={3} />
            </span>
          </span>
        )}
      </div>
      <div className="mt-2 flex justify-between text-xs font-semibold"><span className="truncate">{item.name}</span><span>{item.price}kr</span></div>
    </button>
  );
}

function Sheet({ title, onClose, children }: { title?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <D.Root open onOpenChange={(o) => { if (!o) onClose(); }}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm" />
        <D.Content aria-describedby={undefined} className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-xl border border-primary/70 bg-card p-5 pb-10 animate-in slide-in-from-bottom">
          <div className="mb-6 flex items-center justify-between">
            <D.Title className="font-serif text-2xl">{title ?? "Produktdetaljer"}</D.Title>
            <D.Close aria-label="Stäng" className="grid h-7 w-7 place-items-center rounded-full bg-chip"><X className="h-4 w-4" /></D.Close>
          </div>
          {children}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

function ItemDetail({ item, listId, onClose }: { item: Item; listId: string; onClose: () => void }) {
  const cheapest = [...item.offers].sort((a, b) => a.price - b.price)[0];
  return (
    <Sheet onClose={onClose}>
      <div className="-mt-4 max-h-[75vh] overflow-y-auto">
        <div className="mx-auto aspect-[4/5] w-3/4 overflow-hidden rounded-lg border border-primary/60 bg-muted">
          {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> :
            <span className="grid h-full place-items-center font-serif text-3xl text-muted-foreground">{item.brand}</span>}
        </div>
        <div className="mt-5 flex items-baseline justify-between">
          <span className="font-semibold">{item.brand} - {item.name}</span>
          <span className="text-xl">{item.price}kr</span>
        </div>
        {item.originalPrice && item.originalPrice > item.price && (
          <p className="mt-1 text-sm text-primary">Prissänkt från {item.originalPrice} kr (−{item.originalPrice - item.price} kr)</p>
        )}
        <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary py-2 font-serif text-lg text-primary-foreground">
          Gå till butik <ArrowUpRight className="h-5 w-5" />
        </a>
        <h3 className="mt-6 font-semibold">Jämför priset</h3>
        <div className="mt-3 space-y-3">
          {item.offers.map((o) => (
            <a key={o.store} href={storeUrl(o.store)} target="_blank" rel="noreferrer"
              className="flex items-center justify-between rounded-lg bg-chip px-3 py-2 font-serif text-lg transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <span className="flex items-center gap-1.5">{o.store}
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                {o === cheapest && <span className="ml-1 font-sans text-xs font-semibold text-primary">Billigast</span>}
              </span>
              <span className="rounded-lg bg-primary px-3 py-1 text-primary-foreground">{o.price} kr</span>
            </a>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={() => actions.toggleBought(listId, item.id)} className="flex-1 rounded-lg bg-rose py-2 font-semibold">
            {item.bought ? "Ångra köpt" : "Markera som köpt"}
          </button>
          <button aria-label="Ta bort" onClick={() => { actions.removeItem(listId, item.id); onClose(); }} className="rounded-lg bg-chip px-3"><Trash2 className="h-5 w-5" /></button>
        </div>
      </div>
    </Sheet>
  );
}
