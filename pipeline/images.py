#!/usr/bin/env python3
"""Fetch a primary visualization (og:image) per source URL via Firecrawl.

For every unique source_url across pipeline/data/raw/*.json, fetch the page
metadata via Firecrawl and record its og:image (the source's own primary
visual). Writes a url -> {image, title} map to pipeline/data/images.json,
which build.py merges onto each event as `event.image`.

Idempotent: URLs already present in images.json are skipped (unless --refresh).
Requires FIRECRAWL_API_KEYS (env or .env). Multi-key rotate on 402.

    python3 pipeline/images.py
    python3 pipeline/images.py --refresh   # re-fetch everything
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit("pip install requests")

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "pipeline" / "data" / "raw"
OUT = ROOT / "pipeline" / "data" / "images.json"
API = "https://api.firecrawl.dev/v2/scrape"


def load_keys() -> list[str]:
    env = ROOT / ".env"
    if env.exists() and not os.environ.get("FIRECRAWL_API_KEYS"):
        for line in env.read_text().splitlines():
            if line.startswith("FIRECRAWL_API_KEYS="):
                os.environ["FIRECRAWL_API_KEYS"] = line.split("=", 1)[1].strip()
    keys = [k.strip() for k in os.environ.get("FIRECRAWL_API_KEYS", "").split(",") if k.strip()]
    if not keys:
        sys.exit("Set FIRECRAWL_API_KEYS in env or .env")
    return keys


def pick_image(meta: dict) -> str | None:
    # Firecrawl normalises OpenGraph into metadata; try the common keys.
    for k in ("ogImage", "og:image", "image", "twitter:image", "twitterImage"):
        v = meta.get(k)
        if isinstance(v, list):
            v = v[0] if v else None
        if isinstance(v, str) and v.startswith("http"):
            return v
    return None


class FC:
    def __init__(self, keys: list[str]):
        self.keys, self.i = keys, 0

    def meta(self, url: str) -> dict | None:
        for _ in range(len(self.keys)):
            try:
                r = requests.post(
                    API, headers={"Authorization": f"Bearer {self.keys[self.i]}"},
                    json={"url": url, "formats": ["markdown"], "onlyMainContent": True},
                    timeout=60,
                )
            except requests.RequestException:
                return None
            if r.status_code == 402:
                self.i = (self.i + 1) % len(self.keys)
                continue
            if r.status_code != 200:
                return None
            return (r.json().get("data") or {}).get("metadata") or {}
        return None


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh", action="store_true")
    args = ap.parse_args()

    cache: dict = {}
    if OUT.exists() and not args.refresh:
        cache = json.loads(OUT.read_text())

    urls: list[str] = []
    seen = set()
    for f in sorted(RAW_DIR.glob("*.json")):
        for ev in json.loads(f.read_text()):
            u = ev["source_url"]
            if u not in seen:
                seen.add(u)
                urls.append(u)

    fc = FC(load_keys())
    added = 0
    for u in urls:
        if u in cache and not args.refresh:
            continue
        meta = fc.meta(u)
        img = pick_image(meta) if meta else None
        cache[u] = {"image": img, "title": (meta or {}).get("title")}
        if img:
            added += 1
            print(f"  img  {u}")
        else:
            print(f"  --   {u}")
        OUT.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n")
        time.sleep(0.4)

    have = sum(1 for v in cache.values() if v.get("image"))
    print(f"\n{have}/{len(cache)} sources have an image (+{added} new) -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
