#!/usr/bin/env python3
"""Firecrawl full-text extraction / verification for timeline sources.

For every event in pipeline/data/raw/*.json, fetch the source URL as clean
markdown via Firecrawl v2 and cache it under pipeline/data/extracted/<sha>.md.
This is the "extraction" half of the hybrid pipeline (WebSearch subagents do
discovery; Firecrawl does reliable full-content extraction behind cookie / JS
walls that plain fetch chokes on).

Use the cached markdown to (a) verify a source actually says what the event
claims, and (b) enrich summaries. Re-running skips already-cached URLs.

Requires FIRECRAWL_API_KEYS (comma-separated) in the environment / .env.
Multi-key auto-rotate: rotates to the next key on 402 / insufficient credits.

    export FIRECRAWL_API_KEYS=fc-aaa,fc-bbb
    python3 pipeline/extract.py            # all sources
    python3 pipeline/extract.py --only hr_media.json
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit("pip install requests  (or: uv add requests)")

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "pipeline" / "data" / "raw"
OUT_DIR = ROOT / "pipeline" / "data" / "extracted"
API = "https://api.firecrawl.dev/v2/scrape"


def load_keys() -> list[str]:
    # lightweight .env loader (only FIRECRAWL_API_KEYS)
    env = ROOT / ".env"
    if env.exists() and not os.environ.get("FIRECRAWL_API_KEYS"):
        for line in env.read_text().splitlines():
            if line.startswith("FIRECRAWL_API_KEYS="):
                os.environ["FIRECRAWL_API_KEYS"] = line.split("=", 1)[1].strip()
    raw = os.environ.get("FIRECRAWL_API_KEYS", "")
    keys = [k.strip() for k in raw.split(",") if k.strip()]
    if not keys:
        sys.exit("Set FIRECRAWL_API_KEYS (comma-separated) in env or .env")
    return keys


class Firecrawl:
    def __init__(self, keys: list[str]):
        self.keys = keys
        self.i = 0

    def scrape(self, url: str) -> str | None:
        for _ in range(len(self.keys)):
            key = self.keys[self.i]
            try:
                r = requests.post(
                    API,
                    headers={"Authorization": f"Bearer {key}"},
                    json={"url": url, "formats": ["markdown"], "onlyMainContent": True},
                    timeout=60,
                )
            except requests.RequestException as e:
                print(f"  ! network error {url}: {e}")
                return None
            if r.status_code == 402:  # insufficient credits -> rotate key
                self.i = (self.i + 1) % len(self.keys)
                continue
            if r.status_code != 200:
                print(f"  ! {r.status_code} {url}")
                return None
            data = r.json()
            return (data.get("data") or {}).get("markdown")
        print(f"  ! all keys exhausted on {url}")
        return None


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="restrict to one raw file, e.g. hr_media.json")
    args = ap.parse_args()

    fc = Firecrawl(load_keys())
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    files = [RAW_DIR / args.only] if args.only else sorted(RAW_DIR.glob("*.json"))
    seen: set[str] = set()
    fetched = cached = failed = 0

    for f in files:
        for ev in json.loads(f.read_text()):
            url = ev["source_url"]
            if url in seen:
                continue
            seen.add(url)
            sha = hashlib.sha1(url.encode()).hexdigest()[:16]
            out = OUT_DIR / f"{sha}.md"
            if out.exists():
                cached += 1
                continue
            md = fc.scrape(url)
            if md:
                out.write_text(f"<!-- {url} -->\n\n{md}")
                fetched += 1
                print(f"  ok  {url}")
            else:
                failed += 1
            time.sleep(0.5)

    print(f"\nfetched={fetched} cached={cached} failed={failed} -> {OUT_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
