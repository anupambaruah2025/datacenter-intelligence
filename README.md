# DataCenter Intelligence

An immersive, exploration-based **market-intelligence platform for the global data center industry** — built as a dependency-free web app (no build step, no framework runtime).

🔗 **Live demo:** https://anupambaruah2025.github.io/datacenter-intelligence/

## What it does
- **Cinematic lifecycle hero** — the full project journey from feasibility → operations → decommissioning, animated.
- **Interactive knowledge graph** — drill from the data center down through **11 disciplines → systems → equipment → vendors** (242 nodes, no dead ends). Click to expand, double-click to dive, drag to pan, scroll to zoom.
- **Spotlight-style search** (`/`) across every node.
- **Company profiles** — logo, segment, a **relationship ego-map**, peers/competitors, and **researched key facts** (HQ, founded, employees, latest revenue with sources) for marquee vendors.
- **140+ companies mapped** across electrical, cooling, ICT, civil, fire, security, automation, operations, finance, legal and sustainability.

## Tech
Vanilla HTML / CSS / JavaScript. Custom `<canvas>` graph engine, SVG self-drawing animations — zero external runtime dependencies. The only remote assets are Google Fonts and company favicons.

```
index.html
assets/
  css/styles.css        design system (glassmorphism, tokens)
  js/data.js            knowledge-graph dataset
  js/enrich.js          researched company facts (by domain)
  js/graph.js           canvas knowledge-graph engine
  js/hero.js            lifecycle hero animation
  js/profile.js         company profile overlay
  js/app.js             search, breadcrumb, scene orchestration
```

## Run locally
Any static server works. On Windows without Node:
```powershell
powershell -ExecutionPolicy Bypass -File server.ps1 -Port 8099
# then open http://localhost:8099
```

## Notes
Company **key facts** are researched from primary filings / investor releases (FY2025–FY2026) and carry source links. Relationships are derived from the knowledge graph. No financials are estimated and no customer project names are included.
