import { useState } from "react";
import type { EventType } from "@/lib/types";
import { TYPE_META, TYPE_ORDER } from "@/lib/types";
import { TYPE_STYLE } from "@/lib/typeStyles";

interface Props {
  query: string;
  onQuery: (v: string) => void;
  active: Set<EventType>;
  onToggle: (t: EventType) => void;
  onClear: () => void;
  counts: Record<EventType, number>;
  showing: number;
  total: number;
}

function initialOpen(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(min-width: 640px)").matches; // expanded on desktop, collapsed on mobile
}

export function Filters({
  query, onQuery, active, onToggle, onClear, counts, showing, total,
}: Props) {
  const [open, setOpen] = useState(initialOpen);
  const activeCount = active.size + (query.trim() ? 1 : 0);

  return (
    <div className="glass rounded-lg shadow-card">
      {/* Header / toggle — always visible, slim */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 sm:px-4 py-2.5 text-left"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="text-slate-300 shrink-0">
          <path d="M3 5h18M6 12h12M10 19h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-semibold text-slate-200">Filtri i pretraga</span>
        {activeCount > 0 && (
          <span className="chip bg-type-eu/15 text-type-eu !py-0.5">{activeCount} aktivno</span>
        )}
        <span className="ml-auto flex items-center gap-2 text-xs text-slate-500">
          <span className="tabular-nums">{showing}/{total}</span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* Collapsed summary when filters are active but panel is closed */}
      {!open && activeCount > 0 && (
        <div className="flex items-center gap-2 px-3 sm:px-4 pb-2.5 -mt-1">
          <span className="truncate text-xs text-slate-400">
            {[...active].map((t) => TYPE_META[t].label).join(", ")}
            {query.trim() && (active.size ? " · " : "") + `„${query.trim()}"`}
          </span>
          <button
            onClick={onClear}
            className="ml-auto shrink-0 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Očisti
          </button>
        </div>
      )}

      {/* Body */}
      {open && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-white/5 pt-3">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-400 shrink-0">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Pretraži naslove, aktere, sažetke…"
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none py-1"
            />
            {(query || active.size > 0) && (
              <button
                onClick={onClear}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 shrink-0 px-2 py-1"
              >
                Očisti
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {TYPE_ORDER.map((t) => {
              const on = active.has(t);
              const style = TYPE_STYLE[t];
              const n = counts[t] ?? 0;
              return (
                <button
                  key={t}
                  onClick={() => onToggle(t)}
                  disabled={n === 0 && !on}
                  className={[
                    "chip border",
                    on
                      ? `${style.soft} border-transparent ring-1 ${style.ring}`
                      : "bg-transparent text-slate-400 border-white/10 hover:border-white/25",
                    n === 0 && !on ? "opacity-40 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  {TYPE_META[t].label}
                  <span className="tabular-nums opacity-70">{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
