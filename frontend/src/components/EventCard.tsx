import type { TimelineEvent } from "@/lib/types";
import { TYPE_STYLE } from "@/lib/typeStyles";
import { formatDate, hostOf } from "@/lib/data";
import { TypeBadge } from "./TypeBadge";

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="inline-block -mt-0.5">
      <path d="M14 3h7v7M21 3l-9 9M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EventCard({ event }: { event: TimelineEvent }) {
  const style = TYPE_STYLE[event.type];
  const isLive = event.status === "live" || event.status === "pending";

  return (
    <article
      className={[
        "group glass card-hover rounded-lg border-l-4 p-4 sm:p-5",
        style.border,
        event.pivotal ? "shadow-glow ring-1 ring-white/5" : "",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <time className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {formatDate(event.date)}
        </time>
        <TypeBadge type={event.type} />
        {isLive && (
          <span className="chip bg-type-vote/15 text-type-vote">
            <span className="h-1.5 w-1.5 rounded-full bg-type-vote animate-pulseDot" />
            {event.status === "live" ? "UŽIVO" : "U TIJEKU"}
          </span>
        )}
        {event.pivotal && !isLive && (
          <span className="chip bg-white/5 text-slate-300">★ prekretnica</span>
        )}
      </div>

      <div className="flex gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] sm:text-base font-bold leading-snug text-slate-50">
            <a
              href={event.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`decoration-transparent hover:${style.text} transition-colors`}
            >
              {event.title}
            </a>
          </h3>

          {event.summary && (
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{event.summary}</p>
          )}
        </div>

        {event.image && (
          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 self-start"
          >
            <img
              src={event.image}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget.closest("a") as HTMLElement).style.display = "none";
              }}
              className="h-16 w-16 sm:h-24 sm:w-24 rounded-md object-cover ring-1 ring-white/10
                         bg-ink-700"
            />
          </a>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
        {event.actor && <span className="font-medium text-slate-300">{event.actor}</span>}
        <a
          href={event.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 font-medium ${style.text} hover:underline`}
        >
          {hostOf(event.source_url)} <ExternalIcon />
        </a>
        {event.eu_ref_url && (
          <a
            href={event.eu_ref_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-type-eu hover:underline"
          >
            EU izvor <ExternalIcon />
          </a>
        )}
        {event.verified && (
          <span className="inline-flex items-center gap-1 text-emerald-400/80" title="Izvor provjeren">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            provjereno
          </span>
        )}
      </div>
    </article>
  );
}
