# Brand — LinkedIn cover banner

Redesign of the personal LinkedIn cover for **Anupam Baruah, PMP**, built as code so it
can be re-rendered whenever a number, a title or the photo changes.

## Output

`out/` holds three finished variants, exported at LinkedIn's personal cover size
**1584 × 396** plus a `@2x` (3168 × 792) copy for retina displays:

| File | Variant | Idea |
|---|---|---|
| `banner-a-command-deck.png` | **A — Command deck** | Portrait bleeds off the right edge and feathers into the field; left column carries a labelled metric strip. Highest contrast, most "operator". |
| `banner-b-split-panel.png` | **B — Split panel** | Hard vertical seam; portrait sits in its own panel with the *Focus / Plan / Execute / Repeat* wall legible. Metrics become bordered cards. Most corporate. |
| `banner-c-editorial.png` | **C — Editorial** | Near-black field, framed headshot, credentials condensed to a single small-caps line. Quietest and the most typographic. |

Upload the `@1x` file — LinkedIn re-encodes anything larger anyway.

## Re-rendering

```bash
node render.mjs                      # writes out/*.png at 1x and 2x
GUIDES=1 OUT_DIR=/tmp/g node render.mjs   # same, with the avatar-overlap guide drawn
```

Requires Playwright + Chromium. Open `banner.html` directly in a browser to edit and
preview all three side by side; `render.mjs` screenshots each `.banner` element, so
whatever the browser shows is exactly what gets exported.

## Design constraints baked in

- **Avatar cut-in.** On the LinkedIn desktop profile the round profile photo overlaps the
  cover's bottom-left — roughly a 213 px circle at `left: 34px, top: 295px` in cover
  coordinates (approximate; LinkedIn changes its layout periodically). All three variants
  keep live content above ~y 285, so nothing is ever hidden behind it. `GUIDES=1` draws
  that circle in red to re-check after any edit.
- **No cut-out.** The portrait is never keyed off its background — masks and gradients
  blend it into the field instead, which avoids the halo/fringe artefacts of a hand-cut
  subject and survives re-cropping.
- **One claim, one place.** The role line and the metric strip say different things; the
  earlier banner repeated the same tagline twice.
- **Type.** Inter (variable, subset to latin) is vendored in `fonts/` so renders are
  byte-identical offline.

## Editing the content

Everything live is plain markup in `banner.html` — name, the `PMP` chip, the role line and
the three metrics. Numbers are split into value + unit (`160` + `MW`) so the unit can keep
its own size and colour.

`photo.webp` is the source portrait (1122 × 1402). `reference-original.jpg` is the previous
banner, kept for comparison.
