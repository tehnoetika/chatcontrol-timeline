export type MepPosition =
  | "za_odbacivanje"
  | "protiv_odbacivanja"
  | "suzdrzan"
  | "nije_glasao"
  | "UNKNOWN";

export interface Mep {
  name: string;
  party_hr: string;
  group_eu: string;
  position: MepPosition;
  note?: string;
}

export interface MepVotes {
  vote_source_url: string;
  vote_source_name: string;
  verified: boolean;
  overall: {
    za_odbacivanje: number;
    protiv_odbacivanja: number;
    suzdrzan: number;
    threshold: number;
  };
  meps: Mep[];
}

// Order + presentation for each position group.
export const POSITION_META: Record<
  MepPosition,
  { label: string; hint: string; dot: string; text: string; soft: string }
> = {
  za_odbacivanje: {
    label: "Za odbacivanje",
    hint: "glasali PROTIV Chat Controla",
    dot: "bg-type-civil",
    text: "text-type-civil",
    soft: "bg-type-civil/10",
  },
  protiv_odbacivanja: {
    label: "Protiv odbacivanja",
    hint: "pustili Chat Control da prođe",
    dot: "bg-type-vote",
    text: "text-type-vote",
    soft: "bg-type-vote/10",
  },
  suzdrzan: {
    label: "Suzdržan",
    hint: "suzdržani",
    dot: "bg-type-politician",
    text: "text-type-politician",
    soft: "bg-type-politician/10",
  },
  nije_glasao: {
    label: "Nije glasao",
    hint: "odsutni / nisu glasali",
    dot: "bg-type-intl",
    text: "text-type-intl",
    soft: "bg-type-intl/10",
  },
  UNKNOWN: {
    label: "Nepoznato",
    hint: "poimenični glas nije potvrđen",
    dot: "bg-slate-500",
    text: "text-slate-400",
    soft: "bg-white/5",
  },
};

export const POSITION_ORDER: MepPosition[] = [
  "za_odbacivanje",
  "protiv_odbacivanja",
  "suzdrzan",
  "nije_glasao",
  "UNKNOWN",
];

export async function loadMepVotes(): Promise<MepVotes | null> {
  try {
    const res = await fetch("/data/mep_votes.json", { cache: "no-cache" });
    if (!res.ok) return null;
    return (await res.json()) as MepVotes;
  } catch {
    return null;
  }
}
