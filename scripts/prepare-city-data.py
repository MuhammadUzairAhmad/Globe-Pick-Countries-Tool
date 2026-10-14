"""Adapt a staged Natural Earth GeoJSON. No runtime/build-time network access."""
import collections
import hashlib
import json
import pathlib
import sys

root = pathlib.Path(__file__).resolve().parent.parent
source = pathlib.Path(sys.argv[1])
commit = "ca96624a56bd078437bca8184e78163e5039ad19"
countries = json.loads((root / "src/data/countries/countries.json").read_text())
known = {country["id"] for country in countries}
features = json.loads(source.read_text())["features"]
records = []
excluded = collections.Counter()
seen = set()
for feature in sorted(features, key=lambda feature: feature["properties"]["ne_id"]):
    props = feature["properties"]
    if props["iso_a2"] not in known:
        excluded["outsideCountryScope"] += 1
        continue
    if props["featurecla"].lower() in {"historic place", "scientific station", "meteorological station"}:
        excluded["nonCityTown"] += 1
        continue
    identity = (props["iso_a2"], props["name"], props["adm1name"] or "")
    if identity in seen:
        excluded["duplicateNameCountryRegion"] += 1
        continue
    seen.add(identity)
    longitude, latitude = feature["geometry"]["coordinates"][:2]
    records.append({"id": f"ne-{props['ne_id']}", "name": props["name"],
                    "countryId": props["iso_a2"], "adminRegion": props["adm1name"] or "",
                    "location": {"lat": round(latitude, 5), "lng": round(longitude, 5)}})
records.sort(key=lambda city: (city["countryId"], city["name"], city["id"]))
raw = (json.dumps(records, ensure_ascii=False, separators=(",", ":")) + "\n").encode()
coverage = dict(sorted(collections.Counter(city["countryId"] for city in records).items()))
manifest = {"version": 1, "reviewed": "2026-10-14", "cityCount": len(records),
            "coveredCountryCount": len(coverage), "coverage": coverage,
            "missingCountryIds": sorted(known - set(coverage)), "sha256": hashlib.sha256(raw).hexdigest(),
            "source": f"https://github.com/nvkelso/natural-earth-vector/blob/{commit}/geojson/ne_10m_populated_places_simple.geojson",
            "sourceCommit": commit, "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
            "sourceFeatureCount": len(features), "excluded": dict(excluded),
            "license": "Public domain", "licenseUrl": "https://www.naturalearthdata.com/about/terms-of-use/",
            "descriptionUrl": "https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-populated-places/",
            "method": "Retain city/town records with an ISO alpha-2 reference in GlobePick's country scope; exclude historic places and scientific/meteorological stations. For identical name/country/admin-region records, retain the lowest Natural Earth ID. Keep regional-significance sampling; do not filter or weight by population.",
            "limitations": "Selected cities and towns, not a complete list. Source names, administrative regions, and point locations are a dated cartographic snapshot, not an independent factual audit or current boundary/capital authority. Countries with more retained records have more chances in all-country mode."}
for folder in [root / "src/data/cities", root / "public/data/cities"]:
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "cities.json").write_bytes(raw)
    (folder / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(f"Prepared {len(records)} cities/towns across {len(coverage)} countries. Missing: {manifest['missingCountryIds']}")
