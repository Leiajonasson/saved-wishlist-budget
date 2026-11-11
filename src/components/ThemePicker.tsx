import { useState } from "react";
import { CATEGORIES } from "@/lib/store";

const MORE_THEMES = ["Bröllop", "Babyshower", "Student", "Inflyttning", "Resa", "Hem & inredning", "Mode", "Teknik"];

export function ThemePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [showMore, setShowMore] = useState(MORE_THEMES.includes(value));
  const [custom, setCustom] = useState("");
  const all = [...CATEGORIES, ...MORE_THEMES];
  const addCustom = () => { const t = custom.trim(); if (t) { onChange(t); setCustom(""); } };
  const shown = [...CATEGORIES, ...(showMore ? MORE_THEMES : []), ...(value && !all.includes(value) ? [value] : [])];
  return (
    <div>
      <p className="font-semibold">Tema</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {shown.map((c) => (
          <button type="button" key={c} onClick={() => onChange(c)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${value === c ? "bg-primary text-primary-foreground" : "bg-chip"}`}>{c}</button>
        ))}
        <button type="button" onClick={() => setShowMore((v) => !v)} aria-expanded={showMore}
          className="rounded-full border border-primary px-3 py-1.5 text-sm font-semibold">{showMore ? "Färre ‹" : "Fler ›"}</button>
      </div>
      {showMore && (
        <div className="mt-3 flex gap-2">
          <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Skriv eget tema…"
            aria-label="Eget tema" className="min-w-0 flex-1 rounded-lg bg-field px-3 py-2 text-sm"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }} />
          <button type="button" onClick={addCustom} className="rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">Lägg till</button>
        </div>
      )}
    </div>
  );
}
