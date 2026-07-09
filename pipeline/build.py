#!/usr/bin/env python3
"""Merge raw discovery outputs into the canonical timeline.json.

Reads every pipeline/data/raw/*.json (each a JSON array of event objects as
returned by the discovery subagents / Firecrawl extraction), then:
  - deduplicates by source_url (keeps the entry with the longer summary),
  - assigns a stable id,
  - flags pivotal events and the live/pending status,
  - sorts newest -> oldest,
  - writes frontend/public/data/timeline.json as {updated, count, events}.

Idempotent: safe to re-run after adding/replacing raw files.

    python3 pipeline/build.py
"""
from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "pipeline" / "data" / "raw"
EXTRACT_DIR = ROOT / "pipeline" / "data" / "extracted"
IMAGES = ROOT / "pipeline" / "data" / "images.json"
OUT = ROOT / "frontend" / "public" / "data" / "timeline.json"

IMAGE_MAP: dict = json.loads(IMAGES.read_text()) if IMAGES.exists() else {}

# Topic tokens: if a cached Firecrawl extraction of a source contains any of
# these, we treat the source as confirmed on-topic and flip verified -> true.
TOPIC_TOKENS = (
    "chat control", "chatcontrol", "chatkontrolle", "csar", "nadzor",
    "skenir", "scanning", "enkripcij", "encryption", "kontrola razgovora",
)


def extraction_confirms(url: str) -> bool:
    sha = hashlib.sha1(url.encode()).hexdigest()[:16]
    p = EXTRACT_DIR / f"{sha}.md"
    if not p.exists():
        return False
    txt = p.read_text(errors="ignore").lower()
    return any(t in txt for t in TOPIC_TOKENS)

VALID_TYPES = {
    "EU_sluzbeno", "glasovanje", "hr_mediji", "izjava_politicara",
    "okrugli_stol", "civilno_drustvo", "medjunarodni_kontekst", "drustvene_mreze",
}

# Source URLs that are pivotal turning points (rendered larger, always kept).
PIVOTAL_URLS = {
    "https://howtheyvote.eu/votes/189574",  # 26 Mar 2026 rejection by one vote
}
# Substrings that mark a pivotal event regardless of exact URL.
PIVOTAL_HINTS = (
    "rule 170", "urgent procedure", "urgency procedure",
    "binding second-reading", "rejects extension", "one vote",
    "okrugli stol", "trilogue collapses", "expires",
)
# The live/unfolding vote (result pending at build time). Empty once concluded.
LIVE_DATE = ""


def slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:60]


def make_id(ev: dict) -> str:
    h = hashlib.sha1((ev.get("source_url", "") + ev["title"]).encode()).hexdigest()[:6]
    return f"{ev['date']}-{slug(ev['title'])}-{h}"


def is_pivotal(ev: dict) -> bool:
    if ev.get("source_url") in PIVOTAL_URLS:
        return True
    hay = (ev["title"] + " " + ev.get("summary", "")).lower()
    if ev["type"] == "glasovanje" and any(k in hay for k in ("361", "one vote", "331", "307")):
        return True
    return any(h in hay for h in PIVOTAL_HINTS)


def load_raw() -> list[dict]:
    events: list[dict] = []
    if not RAW_DIR.exists():
        raise SystemExit(f"No raw dir: {RAW_DIR}")
    for f in sorted(RAW_DIR.glob("*.json")):
        arr = json.loads(f.read_text())
        for ev in arr:
            ev["_src_file"] = f.stem
            events.append(ev)
    return events


def normalize(ev: dict) -> dict | None:
    for req in ("date", "title", "type", "source_url"):
        if not ev.get(req):
            return None
    if ev["type"] not in VALID_TYPES:
        return None
    return {
        "id": make_id(ev),
        "date": ev["date"][:10],
        "title": ev["title"].strip(),
        "type": ev["type"],
        "actor": (ev.get("actor") or "").strip(),
        "summary": (ev.get("summary") or "").strip(),
        "source_url": ev["source_url"].strip(),
        "source_name": (ev.get("source_name") or "").strip(),
        "eu_ref_url": ev.get("eu_ref_url") or None,
        "image": (IMAGE_MAP.get(ev["source_url"]) or {}).get("image"),
        "verified": bool(ev.get("verified", False)) or extraction_confirms(ev["source_url"]),
        "pivotal": is_pivotal(ev),
        "status": "pending" if ev["date"][:10] == LIVE_DATE and ev["type"] == "glasovanje" else None,
    }


def dedupe(events: list[dict]) -> list[dict]:
    by_url: dict[str, dict] = {}
    for ev in events:
        key = ev["source_url"].rstrip("/")
        cur = by_url.get(key)
        if cur is None or len(ev["summary"]) > len(cur["summary"]):
            # preserve pivotal/verified/status if either had it
            if cur:
                ev["pivotal"] = ev["pivotal"] or cur["pivotal"]
                ev["verified"] = ev["verified"] or cur["verified"]
                ev["status"] = ev["status"] or cur["status"]
            by_url[key] = ev
    return list(by_url.values())


def main() -> None:
    raw = load_raw()
    norm = [n for n in (normalize(e) for e in raw) if n]
    deduped = dedupe(norm)
    deduped.sort(key=lambda e: (e["date"], e["title"]), reverse=True)
    payload = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "count": len(deduped),
        "events": deduped,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    nverified = sum(1 for e in deduped if e["verified"])
    print(f"Wrote {len(deduped)} events (from {len(raw)} raw) -> {OUT.relative_to(ROOT)}")
    print(f"  verified: {nverified}/{len(deduped)}")
    by_type: dict[str, int] = {}
    for e in deduped:
        by_type[e["type"]] = by_type.get(e["type"], 0) + 1
    for t, n in sorted(by_type.items(), key=lambda kv: -kv[1]):
        print(f"  {t:24} {n}")


if __name__ == "__main__":
    main()
