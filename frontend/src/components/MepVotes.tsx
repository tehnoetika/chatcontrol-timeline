import { useState } from "react";
import type { MepVotes as MepVotesData, MepPosition } from "@/lib/mep";
import { POSITION_META, POSITION_ORDER } from "@/lib/mep";
import { formatDate, hostOf } from "@/lib/data";

function Bar({ o }: { o: MepVotesData["overall"] }) {
  const total = o.za_odbacivanje + o.protiv_odbacivanja + o.suzdrzan || 1;
  const seg = (n: number, cls: string) => (
    <div className={cls} style={{ width: `${(n / total) * 100}%` }} />
  );
  return (
    <div className="mt-1 flex h-2 w-full overflow-hidden rounded-full bg-white/5">
      {seg(o.za_odbacivanje, "bg-type-civil")}
      {seg(o.protiv_odbacivanja, "bg-type-vote")}
      {seg(o.suzdrzan, "bg-type-politician")}
    </div>
  );
}

export function MepVotes({ data }: { data: MepVotesData }) {
  const [open, setOpen] = useState(true);
  const byPos = (p: MepPosition) => data.meps.filter((m) => m.position === p);

  return (
    <section className="mt-4 glass rounded-lg shadow-card">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <span className="text-sm font-bold text-slate-100">
          Kako su glasali hrvatski eurozastupnici
        </span>
        <span className="chip bg-type-vote/15 text-type-vote !py-0.5">9. srpnja 2026.</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          className={`ml-auto text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3">
          <p className="text-xs leading-relaxed text-slate-400">
            Prijedlog za <strong className="text-slate-200">odbacivanje</strong> stajališta Vijeća
            (tj. protiv Chat Controla) trebao je apsolutnu većinu od{" "}
            <span className="tabular-nums">{data.overall.threshold}</span> glasova. Rezultat:{" "}
            <span className="text-type-civil font-semibold tabular-nums">{data.overall.za_odbacivanje} za odbacivanje</span>
            {" · "}
            <span className="text-type-vote font-semibold tabular-nums">{data.overall.protiv_odbacivanja} protiv</span>
            {" · "}
            <span className="text-type-politician font-semibold tabular-nums">{data.overall.suzdrzan} suzdržanih</span>
            {" "}→ prag nije dosegnut, Chat Control 1.0 prolazi.
          </p>
          <Bar o={data.overall} />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {POSITION_ORDER.map((pos) => {
              const list = byPos(pos);
              if (list.length === 0) return null;
              const meta = POSITION_META[pos];
              return (
                <div key={pos} className={`rounded-md ${meta.soft} p-3`}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    <span className={`text-sm font-bold ${meta.text}`}>{meta.label}</span>
                    <span className="text-xs text-slate-400">· {meta.hint}</span>
                    <span className="ml-auto text-xs font-semibold tabular-nums text-slate-300">
                      {list.length}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {list.map((m) => (
                      <li key={m.name} className="flex items-baseline gap-2 text-sm">
                        <span className="font-medium text-slate-100">{m.name}</span>
                        <span className="text-xs text-slate-400">{m.party_hr}</span>
                        <span className="text-[10px] uppercase tracking-wide text-slate-500">
                          {m.group_eu}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Izvor poimeničnog glasovanja:{" "}
            <a
              href={data.vote_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-type-eu hover:underline"
            >
              {data.vote_source_name || hostOf(data.vote_source_url)}
            </a>
            {data.verified ? " ✓ provjereno" : " (nepotvrđeno)"} · {formatDate("2026-07-09")}
          </div>
        </div>
      )}
    </section>
  );
}
