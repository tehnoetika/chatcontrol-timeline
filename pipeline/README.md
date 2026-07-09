# ChatControl timeline — pipeline

Reproducible research → data pipeline that produces
`frontend/public/data/timeline.json`, the single source of truth the site renders.

## Hybrid discovery + extraction

```
 discovery  (WebSearch subagents)      →  pipeline/data/raw/*.json
 extraction (Firecrawl, full text)     →  pipeline/data/extracted/*.md   (verify/enrich)
 build      (merge + dedupe + flag)    →  frontend/public/data/timeline.json
```

- **Discovery** — parallel Claude subagents sweep a slice of the space each
  (EU official, Croatian media, Croatian political actors, civil society /
  CitizenGO, international / experts, social & YouTube) and return arrays of
  structured event objects. Superior for *what exists* across the whole
  Croatian media space. Output is committed under `data/raw/` (one file per
  slice) so the corpus is auditable and re-runnable.
- **Extraction** — `extract.py` pulls each source URL as clean markdown via
  **Firecrawl v2** (multi-key auto-rotate on 402), caching under
  `data/extracted/`. Superior for *reliable full-content* behind cookie / JS /
  soft-paywall walls (index.hr, jutarnji, večernji, tportal, nacional…). Use it
  to verify a source really says what an event claims, and to enrich summaries.
- **Build** — `build.py` merges every `data/raw/*.json`, dedupes by
  `source_url` (keeps the richer summary), assigns stable ids, flags pivotal
  events and the live/pending vote, sorts newest→oldest, and writes
  `timeline.json` as `{updated, count, events}`.

## Run

```bash
python3 pipeline/build.py                      # rebuild timeline.json from raw/
export FIRECRAWL_API_KEYS=fc-aaa,fc-bbb
python3 pipeline/extract.py                     # cache full text for verification
python3 pipeline/extract.py --only hr_media.json
```

## Event schema

See `schema.json`. Types: `EU_sluzbeno`, `glasovanje`, `hr_mediji`,
`izjava_politicara`, `okrugli_stol`, `civilno_drustvo`, `medjunarodni_kontekst`,
`drustvene_mreze`.

## Adding / updating events

Edit or add a file under `data/raw/`, then re-run `build.py` (idempotent).
To capture the 9 July 2026 vote result, update the `2026-07-09` entry in
`data/raw/eu_official.json` with the final tally + an official europarl source,
set `verified: true`, and rebuild. The build clears the live/pending status once
that date is no longer the latest vote in flight (adjust `LIVE_DATE` in
`build.py`).

## Provenance & caveats

Every event carries `verified` — `true` only when a subagent actually opened the
source. Notable: individual Croatian MEP vote records for 9 July 2026 were **not**
fabricated (outcome pending at build time); the Sabor round table is dated
**18 September 2025** (organised by MOST/Grmoja, "Očuvanje privatnosti u eri
masovnog nadzora"), not October.
