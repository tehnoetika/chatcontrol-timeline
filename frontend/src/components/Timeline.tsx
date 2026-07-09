import { Fragment } from "react";
import type { TimelineEvent } from "@/lib/types";
import { yearOf } from "@/lib/data";
import { EventCard } from "./EventCard";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="py-24 text-center text-slate-400">
        <p className="text-lg font-semibold">Nema rezultata za odabrane filtre.</p>
        <p className="text-sm mt-1">Pokušajte proširiti filtre ili očistiti pretragu.</p>
      </div>
    );
  }

  let lastYear = "";

  return (
    <div className="relative">
      {/* Vertical spine */}
      <div
        className="absolute left-[7px] sm:left-[11px] top-2 bottom-2 w-px
                   bg-gradient-to-b from-type-eu/50 via-white/10 to-type-vote/40"
        aria-hidden
      />
      <ol className="space-y-4">
        {events.map((ev) => {
          const y = yearOf(ev.date);
          const showYear = y !== lastYear;
          lastYear = y;
          return (
            <Fragment key={ev.id}>
              {showYear && (
                <li className="relative pl-8 sm:pl-12 pt-6 first:pt-0">
                  <div className="sticky top-2 z-10 inline-block">
                    <span className="chip glass text-slate-200 !text-sm font-extrabold tracking-brand">
                      {y}
                    </span>
                  </div>
                </li>
              )}
              <li className="relative pl-8 sm:pl-12 animate-fadeUp">
                {/* Node dot */}
                <span
                  className={[
                    "absolute left-0 sm:left-1 top-4 h-3.5 w-3.5 rounded-full ring-4 ring-ink",
                    ev.pivotal ? "scale-125" : "",
                  ].join(" ")}
                  aria-hidden
                >
                  <span className={`block h-full w-full rounded-full ${dotClass(ev)}`} />
                </span>
                <EventCard event={ev} />
              </li>
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}

import { TYPE_STYLE } from "@/lib/typeStyles";
function dotClass(ev: TimelineEvent): string {
  return TYPE_STYLE[ev.type].dot;
}
