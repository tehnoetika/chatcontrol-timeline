# ChatControl — Kronologija

**Kronološki jedinstveni izvor istine o EU regulativi Chat Control.**
Objedinjuje hrvatski medijski prostor, službene EU izvore, izjave političara i
javne objave (peticije, CitizenGO, Patrick Breyer, društvene mreže) — poredano
kronološki, svaki događaj vodi na primarni izvor.

Dio mreže **[DOMOVINA](https://domovina.ai)** — otvoreni hrvatski
podcast / podatkovni / AI ekosustav. Namijenjeno javnom deployu na
`chatcontrol.domovina.ai` (Cloudflare Pages).

---

## Što je unutra

```
chatcontrol-timeline/
├─ frontend/                 # static React + Vite + TS + Tailwind PWA
│   ├─ src/                  # premium tamni editorijalni timeline
│   └─ public/data/timeline.json   # single source of truth (generiran)
└─ pipeline/                 # reproducibilni research → data pipeline
    ├─ data/raw/*.json       # discovery output (po segmentu)
    ├─ build.py              # merge + dedupe + flag → timeline.json
    └─ extract.py            # Firecrawl full-text ekstrakcija / verifikacija
```

## Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5174
npm run build      # -> frontend/dist (deploy na Cloudflare Pages)
```

Čisto klijentsko filtriranje nad jednim JSON-om; offline-capable (PWA);
tamni premium dizajn usklađen s DOMOVINA brand tokenima (navy #002F6C, flag red).
Filtriranje po tipu događaja i tekstualna pretraga; pivotalni događaji (glasovanja,
prekretnice) istaknuti; glasovanje 9.7.2026. označeno kao "u tijeku".

## Pipeline

Vidi [`pipeline/README.md`](pipeline/README.md). Ukratko: WebSearch subagenti za
*discovery* + Firecrawl za *ekstrakciju* + `build.py` za *merge*. Idempotentno —
`python3 pipeline/build.py` regenerira `timeline.json` iz `data/raw/`.

## Trenutno stanje

| Pokazatelj                        | Brojka |
|-----------------------------------|-------:|
| Događaja ukupno                   | **103** |
| Razdoblje                         | 2021.–2026. |
| Hrvatski mediji                   | 36 |
| Međunarodni kontekst / eksperti   | 19 |
| Civilno društvo / peticije        | 14 |
| Društvene mreže / YouTube / podcast | 12 |
| Izjave (hrvatskih) političara     | 9 |
| Službeni EU koraci                | 7 |
| Glasovanja                        | 4 |
| Okrugli stolovi (Sabor)           | 2 |

## Ključni događaji

- **11.5.2022.** — Europska komisija predlaže CSA uredbu (Chat Control 2.0), 2022/0155(COD)
- **18.9.2025.** — Okrugli stol Mosta u Saboru "Očuvanje privatnosti u eri masovnog nadzora"
- **listopad 2025.** — Njemačka + blokirajuća manjina ruše glasanje u Vijeću EU
- **26.3.2026.** — EP odbija produljenje Chat Controla 1.0 za **jedan glas** (307:306)
- **4.4.2026.** — Privremeni režim skeniranja istječe
- **29.6.2026.** — Peti trialog o Chat Controlu 2.0 propada
- **7.7.2026.** — EP izglasao hitnu proceduru (331:304:11)
- **9.7.2026.** — Obvezujuće glasovanje (prag 361); *ishod se ažurira*

## Licence

Kod: MIT. Podaci: CC-BY 4.0. Svaki događaj referira primarni izvor.
