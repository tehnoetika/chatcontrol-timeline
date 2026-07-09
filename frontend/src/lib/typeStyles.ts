import type { EventType } from "./types";

// Literal class strings so Tailwind's JIT picks them up from source.
export interface TypeStyle {
  dot: string;    // background for the timeline node + badge dot
  text: string;   // accent text
  border: string; // left accent border on cards
  soft: string;   // soft translucent background for chips
  ring: string;   // focus/active ring
}

export const TYPE_STYLE: Record<EventType, TypeStyle> = {
  EU_sluzbeno: {
    dot: "bg-type-eu",
    text: "text-type-eu",
    border: "border-l-type-eu",
    soft: "bg-type-eu/10 text-type-eu",
    ring: "ring-type-eu/40",
  },
  glasovanje: {
    dot: "bg-type-vote",
    text: "text-type-vote",
    border: "border-l-type-vote",
    soft: "bg-type-vote/10 text-type-vote",
    ring: "ring-type-vote/40",
  },
  hr_mediji: {
    dot: "bg-type-media",
    text: "text-type-media",
    border: "border-l-type-media",
    soft: "bg-type-media/10 text-type-media",
    ring: "ring-type-media/40",
  },
  izjava_politicara: {
    dot: "bg-type-politician",
    text: "text-type-politician",
    border: "border-l-type-politician",
    soft: "bg-type-politician/10 text-type-politician",
    ring: "ring-type-politician/40",
  },
  okrugli_stol: {
    dot: "bg-type-roundtable",
    text: "text-type-roundtable",
    border: "border-l-type-roundtable",
    soft: "bg-type-roundtable/10 text-type-roundtable",
    ring: "ring-type-roundtable/40",
  },
  civilno_drustvo: {
    dot: "bg-type-civil",
    text: "text-type-civil",
    border: "border-l-type-civil",
    soft: "bg-type-civil/10 text-type-civil",
    ring: "ring-type-civil/40",
  },
  medjunarodni_kontekst: {
    dot: "bg-type-intl",
    text: "text-type-intl",
    border: "border-l-type-intl",
    soft: "bg-type-intl/10 text-type-intl",
    ring: "ring-type-intl/40",
  },
  drustvene_mreze: {
    dot: "bg-type-social",
    text: "text-type-social",
    border: "border-l-type-social",
    soft: "bg-type-social/10 text-type-social",
    ring: "ring-type-social/40",
  },
};
