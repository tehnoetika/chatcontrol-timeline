import { useEffect, useMemo, useState } from "react";
import type { EventType, TimelineData, TimelineEvent } from "./lib/types";
import { TYPE_ORDER } from "./lib/types";
import { loadTimeline, hostOf, yearOf } from "./lib/data";
import { Hero } from "./components/Hero";
import { Filters } from "./components/Filters";
import { Timeline } from "./components/Timeline";
import { Footer } from "./components/Footer";
import { MepVotes } from "./components/MepVotes";
import { loadMepVotes, type MepVotes as MepVotesData } from "./lib/mep";

export default function App() {
  const [data, setData] = useState<TimelineData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<EventType>>(new Set());
  const [mepVotes, setMepVotes] = useState<MepVotesData | null>(null);

  useEffect(() => {
    loadTimeline().then(setData).catch((e) => setError(String(e)));
    loadMepVotes().then(setMepVotes);
  }, []);

  const counts = useMemo(() => {
    const c = Object.fromEntries(TYPE_ORDER.map((t) => [t, 0])) as Record<EventType, number>;
    data?.events.forEach((e) => (c[e.type] += 1));
    return c;
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [] as TimelineEvent[];
    const q = query.trim().toLowerCase();
    return data.events.filter((e) => {
      if (active.size > 0 && !active.has(e.type)) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.actor.toLowerCase().includes(q) ||
        e.source_name.toLowerCase().includes(q)
      );
    });
  }, [data, query, active]);

  const stats = useMemo(() => {
    if (!data || data.events.length === 0)
      return { sources: 0, euRefs: 0, first: "", last: "", live: undefined as TimelineEvent | undefined };
    const hosts = new Set(data.events.map((e) => hostOf(e.source_url)));
    const euRefs = data.events.filter((e) => e.eu_ref_url).length;
    const years = data.events.map((e) => yearOf(e.date)).sort();
    const live = data.events.find((e) => e.status === "live" || e.status === "pending");
    // If no vote is live, surface the most recent vote as the headline outcome.
    const latestVote = data.events.find((e) => e.type === "glasovanje");
    return {
      sources: hosts.size, euRefs, first: years[0], last: years[years.length - 1],
      live: live ?? latestVote,
    };
  }, [data]);

  function toggle(t: EventType) {
    setActive((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  }
  function clear() {
    setActive(new Set());
    setQuery("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      {error && (
        <div className="mt-10 rounded-lg border border-type-vote/30 bg-type-vote/10 p-4 text-sm text-slate-200">
          Greška pri učitavanju podataka: {error}
        </div>
      )}

      {data && (
        <>
          <Hero
            total={data.events.length}
            sources={stats.sources}
            euRefs={stats.euRefs}
            first={stats.first}
            last={stats.last}
            live={stats.live}
          />

          {mepVotes && <MepVotes data={mepVotes} />}

          <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-ink/80 backdrop-blur-md">
            <Filters
              query={query}
              onQuery={setQuery}
              active={active}
              onToggle={toggle}
              onClear={clear}
              counts={counts}
              showing={filtered.length}
              total={data.events.length}
            />
          </div>

          <main className="mt-6">
            <Timeline events={filtered} />
          </main>

          <Footer updated={data.updated} />
        </>
      )}

      {!data && !error && (
        <div className="py-32 text-center text-slate-400 animate-pulseDot">Učitavanje kronologije…</div>
      )}
    </div>
  );
}
