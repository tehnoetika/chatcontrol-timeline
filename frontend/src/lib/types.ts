// Canonical event-type taxonomy for the ChatControl timeline.
// Keep in sync with pipeline/schema.json and tailwind `colors.type`.
export type EventType =
  | "EU_sluzbeno"        // official EU institutional/procedural steps
  | "glasovanje"         // votes (the pivot points)
  | "hr_mediji"          // Croatian media coverage
  | "izjava_politicara"  // statements by (Croatian) politicians
  | "okrugli_stol"       // round tables / public hearings (e.g. Sabor)
  | "civilno_drustvo"    // civil society / petitions / campaigns (CitizenGO, Breyer)
  | "medjunarodni_kontekst" // international context / experts / tech press
  | "drustvene_mreze";   // social media / YouTube / podcasts

export interface TimelineEvent {
  id: string;
  date: string;            // ISO YYYY-MM-DD
  title: string;
  type: EventType;
  actor: string;
  summary: string;
  source_url: string;
  source_name: string;
  eu_ref_url?: string | null;
  /** Primary visualization (og:image) from the source, if any. */
  image?: string | null;
  /** Optional pinned significance — pivotal events render larger. */
  pivotal?: boolean;
  /** Live/unfolding status, e.g. today's vote before the result is in. */
  status?: "live" | "pending" | null;
  verified?: boolean;
}

export interface TimelineData {
  updated: string;         // ISO timestamp of last build
  count: number;
  events: TimelineEvent[];
}

export const TYPE_META: Record<
  EventType,
  { label: string; color: string; short: string }
> = {
  EU_sluzbeno: { label: "Službeno EU", color: "type-eu", short: "EU" },
  glasovanje: { label: "Glasovanje", color: "type-vote", short: "VOTE" },
  hr_mediji: { label: "Hrvatski mediji", color: "type-media", short: "HR" },
  izjava_politicara: { label: "Izjava političara", color: "type-politician", short: "IZJ" },
  okrugli_stol: { label: "Okrugli stol", color: "type-roundtable", short: "OKR" },
  civilno_drustvo: { label: "Civilno društvo", color: "type-civil", short: "CIV" },
  medjunarodni_kontekst: { label: "Međunarodni kontekst", color: "type-intl", short: "INT" },
  drustvene_mreze: { label: "Društvene mreže", color: "type-social", short: "SOC" },
};

export const TYPE_ORDER: EventType[] = [
  "glasovanje",
  "EU_sluzbeno",
  "hr_mediji",
  "izjava_politicara",
  "okrugli_stol",
  "civilno_drustvo",
  "medjunarodni_kontekst",
  "drustvene_mreze",
];
