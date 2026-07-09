import type { TimelineData, TimelineEvent } from "./types";

/** Sort newest → oldest; stable within a day. */
export function sortEvents(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort((a, b) => {
    if (a.date === b.date) return 0;
    return a.date < b.date ? 1 : -1;
  });
}

export async function loadTimeline(): Promise<TimelineData> {
  const res = await fetch("/data/timeline.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`timeline.json ${res.status}`);
  const data = (await res.json()) as TimelineData;
  data.events = sortEvents(data.events);
  return data;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja",
    "srpnja", "kolovoza", "rujna", "listopada", "studenoga", "prosinca",
  ];
  if (!y || !m || !d) return iso;
  return `${d}. ${months[m - 1]} ${y}.`;
}

export function yearOf(iso: string): string {
  return iso.slice(0, 4);
}

/** Human host label for a URL, e.g. "index.hr". */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
