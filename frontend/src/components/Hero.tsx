import { formatDate } from "@/lib/data";
import type { TimelineEvent } from "@/lib/types";

interface Props {
  total: number;
  sources: number;
  euRefs: number;
  first: string;
  last: string;
  live?: TimelineEvent;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass rounded-lg px-4 py-3">
      <div className="text-2xl font-extrabold tabular-nums text-slate-50">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400 mt-0.5">{label}</div>
    </div>
  );
}

export function Hero({ total, sources, euRefs, first, last, live }: Props) {
  return (
    <header className="pt-10 sm:pt-16 pb-8">
      <div className="flex items-center gap-2 text-xs font-bold tracking-brand text-slate-400 uppercase">
        <span className="h-2 w-2 rounded-full bg-flag-red" />
        DOMOVINA · Jedinstveni izvor istine
      </div>

      <h1 className="mt-4 text-4xl sm:text-6xl font-black leading-[1.05] text-slate-50">
        Chat Control
        <span className="block text-type-eu">kronologija nadzora privatne komunikacije</span>
      </h1>

      <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
        Cijela saga o EU regulativi <strong className="text-slate-100">Chat Control</strong> na
        jednom mjestu — objedinjeni hrvatski medijski prostor, službeni EU izvori, izjave
        političara i javne objave, poredani kronološki. Svaki događaj vodi na primarni izvor.
      </p>

      {live && (
        <a
          href={live.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-start gap-3 rounded-lg border border-type-vote/30
                     bg-type-vote/10 p-4 shadow-glow transition-colors hover:bg-type-vote/15"
        >
          <span
            className={[
              "mt-1 h-3 w-3 shrink-0 rounded-full bg-type-vote",
              live.status ? "animate-pulseDot" : "",
            ].join(" ")}
          />
          <span>
            <span className="chip bg-type-vote/20 text-type-vote mr-2">
              {live.status ? "U TIJEKU" : "ISHOD"} · {formatDate(live.date)}
            </span>
            <span className="font-semibold text-slate-100">{live.title}</span>
            <span className="block text-sm text-slate-300 mt-1">{live.summary}</span>
          </span>
        </a>
      )}

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat value={String(total)} label="događaja" />
        <Stat value={String(sources)} label="izvora" />
        <Stat value={String(euRefs)} label="EU službenih referenci" />
        <Stat value={`${first}–${last}`} label="razdoblje" />
      </div>
    </header>
  );
}
