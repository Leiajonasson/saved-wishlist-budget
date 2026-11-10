import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, CircleUserRound, List, Archive } from "lucide-react";
import type { ReactNode } from "react";

export function Shell({ children, back = true, title }: { children: ReactNode; back?: boolean; title?: string }) {
  const router = useRouter();
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-xl">
      <header className="relative flex items-center justify-center px-5 pt-8 pb-4">
        {back && (
          <button aria-label="Tillbaka" onClick={() => router.history.back()}
            className="absolute left-5 grid h-12 w-12 place-items-center rounded-full border border-primary/50 text-primary">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <Link to="/" className="logo text-5xl">SAVED</Link>
      </header>
      {title && <h1 className="mb-5 text-center font-serif text-3xl">{title}</h1>}
      <main className="flex-1 px-2 pb-28">{children}</main>
      <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-md -translate-x-1/2 justify-around bg-primary py-3 text-primary-foreground">
        {[
          { to: "/profil", label: "Profil", Icon: CircleUserRound },
          { to: "/listor", label: "Listor", Icon: List },
          { to: "/arkiv", label: "Arkiv", Icon: Archive },
        ].map(({ to, label, Icon }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-1 font-serif text-lg opacity-90"
            activeProps={{ className: "opacity-100 underline underline-offset-4" }}>
            <Icon className="h-7 w-7" strokeWidth={1.6} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function BudgetRing({ left, spent, budget, ratio }: { left: number; spent: number; budget: number; ratio: number }) {
  const r = 92, c = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto h-64 w-64">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="var(--color-foreground)" strokeOpacity="0.55" strokeWidth="8" />
        <circle cx="100" cy="100" r={r} fill="none" stroke="var(--color-card)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * ratio} style={{ transition: "stroke-dashoffset .6s" }} />
      </svg>
      <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-primary font-serif text-primary-foreground shadow-2xl">
        <span className={`text-5xl ${left < 0 ? "opacity-80" : ""}`}>{left}</span>
        <span className="text-2xl">kr kvar</span>
        <span className="mt-4 text-2xl">{spent} av {budget} kr</span>
        <span className="text-lg">spenderat</span>
      </div>
    </div>
  );
}

export function ListCard({ name, image, faded }: { name: string; image?: string | undefined; faded?: boolean }) {
  return (
    <div className="flex h-full flex-col rounded-xl border-2 border-primary/80 bg-card p-2 shadow-md">
      <p className="pb-2 text-center text-sm font-semibold">{name}</p>
      <div className={`aspect-[4/5] overflow-hidden rounded-lg bg-muted ${faded ? "opacity-40" : ""}`}>
        {image && <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover" />}
      </div>
    </div>
  );
}
