import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CircleUserRound, Pencil } from "lucide-react";
import { Shell } from "@/components/Shell";
import { budgetSummary, monthKey, useStore } from "@/lib/store";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil – Saved" },
      { name: "description", content: "Dina uppgifter, födelsedag och appinställningar i Saved." },
      { property: "og:title", content: "Profil – Saved" },
      { property: "og:description", content: "Dina uppgifter, födelsedag och appinställningar i Saved." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

type Profile = {
  name: string; email: string; phone: string; birthday: string; address: string;
  priceAlerts: boolean; budgetAlerts: boolean; reminders: boolean; publicLists: boolean; currency: string;
};
const DEFAULT: Profile = {
  name: "Leia Jonasson", email: "leia@exempel.se", phone: "070-123 45 67", birthday: "1998-03-14",
  address: "Storgatan 1, 111 22 Stockholm", priceAlerts: true, budgetAlerts: true, reminders: false,
  publicLists: false, currency: "SEK",
};
const KEY = "saved-profile-v1";

function Profile() {
  const s = useStore();
  const [p, setP] = useState<Profile>(DEFAULT);
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState<Profile>(DEFAULT);
  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setP({ ...DEFAULT, ...JSON.parse(r) }); } catch {}
  }, []);
  const save = (n: Profile) => { setP(n); localStorage.setItem(KEY, JSON.stringify(n)); };

  const items = s.lists.flatMap((l) => l.items);
  const b = budgetSummary(s, monthKey());
  const stats: [string, string | number][] = [
    ["Listor", s.lists.filter((l) => !l.archived).length],
    ["Önskningar", items.length],
    ["Köpta", items.filter((i) => i.bought).length],
    ["Kvar", `${b.left} kr`],
  ];
  const bday = p.birthday
    ? new Date(p.birthday).toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" })
    : "–";
  const toggles: [keyof Profile, string, string][] = [
    ["priceAlerts", "Prissänkningar", "Notis när en önskan blir billigare"],
    ["budgetAlerts", "Budgetvarning", "Notis när 80 % av budgeten är använd"],
    ["reminders", "Påminnelser", "Inför födelsedagar och högtider"],
    ["publicLists", "Offentliga listor", "Vem som helst med länk kan se"],
  ];
  const field = (k: keyof Profile, label: string, type = "text") => (
    <label className="block">
      <span className="text-sm text-muted-foreground">{label}</span>
      <input type={type} value={draft[k] as string}
        onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
        className="mt-1 w-full rounded-lg border border-primary/40 bg-card px-3 py-2" />
    </label>
  );

  return (
    <Shell title="Profil">
      <div className="mx-2 rounded-xl bg-rose p-6 text-center">
        <CircleUserRound className="mx-auto h-16 w-16" strokeWidth={1.2} />
        <p className="mt-2 font-serif text-2xl">{p.name}</p>
        <p className="text-sm">{p.email}</p>
      </div>

      <div className="mx-2 mt-4 grid grid-cols-4 gap-2">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-primary/40 bg-card p-2 text-center">
            <p className="font-serif text-xl">{v}</p>
            <p className="text-xs text-muted-foreground">{k}</p>
          </div>
        ))}
      </div>

      <section className="mx-2 mt-6 rounded-xl border border-primary/40 bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Mina uppgifter</h2>
          {!edit && (
            <button aria-label="Redigera uppgifter" onClick={() => { setDraft(p); setEdit(true); }}
              className="rounded-full p-2 hover:bg-rose"><Pencil className="h-4 w-4" /></button>
          )}
        </div>
        {edit ? (
          <form className="mt-3 space-y-3" onSubmit={(e) => { e.preventDefault(); save(draft); setEdit(false); }}>
            {field("name", "Namn")}
            {field("birthday", "Födelsedag", "date")}
            {field("email", "E-post", "email")}
            {field("phone", "Telefon", "tel")}
            {field("address", "Adress")}
            <div className="flex gap-2 pt-1">
              <button type="submit" className="flex-1 rounded-lg bg-primary py-2 text-primary-foreground">Spara</button>
              <button type="button" onClick={() => setEdit(false)} className="flex-1 rounded-lg border border-primary/40 py-2">Avbryt</button>
            </div>
          </form>
        ) : (
          <dl className="mt-3 divide-y divide-primary/15 text-sm">
            {[["Födelsedag", bday], ["E-post", p.email], ["Telefon", p.phone], ["Adress", p.address]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v || "–"}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <section className="mx-2 mt-4 mb-6 rounded-xl border border-primary/40 bg-card p-4">
        <h2 className="font-serif text-xl">Appinställningar</h2>
        <div className="mt-2 divide-y divide-primary/15">
          {toggles.map(([k, t, d]) => {
            const on = p[k] as boolean;
            return (
              <div key={k} className="flex items-center justify-between gap-4 py-3">
                <div><p>{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
                <button role="switch" aria-checked={on} aria-label={t} onClick={() => save({ ...p, [k]: !on })}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            );
          })}
          <div className="flex items-center justify-between py-3">
            <p>Valuta</p>
            <select value={p.currency} onChange={(e) => save({ ...p, currency: e.target.value })}
              className="rounded-lg border border-primary/40 bg-card px-2 py-1">
              <option>SEK</option><option>EUR</option><option>NOK</option><option>DKK</option>
            </select>
          </div>
        </div>
      </section>
    </Shell>
  );
}
