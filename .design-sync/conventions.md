# DataCenter Intelligence — design conventions

**This is a tokens-and-stylesheet design system, not a component library.** `window.DCI` is empty: there are no React components to import. Build your own JSX and style it with the CSS custom properties and classes below. Everything is dark-only (premium dark glassmorphism); there is no light theme.

## Setup and gotchas

- Link `styles.css` once. It ships the Inter font (400–800) and the full stylesheet. No provider or wrapper is needed.
- `styles.css` styles `html, body` globally: near-black layered radial-gradient background, `color: var(--t-1)`, Inter, and **`overflow: hidden`** (the source app is a full-viewport canvas). For a scrolling page, give your root `height: 100vh; overflow-y: auto`, or override `html, body { overflow: auto }`.
- Do not reuse the app-shell IDs and scene classes (`#app`, `#scene-hero`, `#scene-graph`, `.scene`, `.topbar`): they are absolutely/fixed positioned for the original single-page app.
- Optional ambient layers: `<div class="grid-bg"></div>` (animated grid) and `<div class="noise"></div>`. Both are `position: fixed` and sit behind content at `z-index: 0`, so give your content `position: relative; z-index: 1`.

## Styling idiom: CSS variables first

Style your own layout with `var(--*)`. These tokens are defined in `:root`:

| Family | Tokens |
|---|---|
| Backgrounds | `--bg-0` `--bg-1` `--bg-2` |
| Glass surfaces | `--panel` (4.5% white) `--panel-strong` (7%) `--border` `--border-strong` |
| Accents | `--blue` `--cyan` `--purple` `--silver` `--white` |
| Status | `--green` `--orange` `--red` |
| Text | `--t-1` (primary) `--t-2` (secondary) `--t-3` (muted/labels) |
| Shape / motion | `--radius` (18px) `--radius-sm` (12px) `--shadow` `--ease` `--ease-soft` `--font` |

Glass panel recipe: `background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius); backdrop-filter: blur(16px);`. Section labels: 11–12px, uppercase, `letter-spacing: 1.2px`, `color: var(--t-3)`. Headings: weight 800, negative letter-spacing. Many rules read `var(--accent, var(--blue))`, so set `--accent` inline on an element to re-tint it.

## Reusable classes (standalone, safe anywhere)

- `.btn` is the primary glass button with a blue gradient and a hover lift; `.btn.ghost` is the neutral variant.
- `.pstats > .pstat > .v + .k` is a grid of stat tiles with a gradient numeral (`.v`) and a muted label (`.k`).
- `.pfacts > .pfact > .fv + .fk` is a grid of key-fact tiles; add `.pfact.rev` for the big gradient revenue figure.

Other classes (`.pill`, `.metric`, `.child`, `.crumb`) are scoped under app containers (`.profile-hero`, `.detail`, `.breadcrumb`) and don't style on their own. Copy their look with tokens instead.

## Where the truth lives

Read `_ds_bundle.css` (the original `assets/css/styles.css`) before styling. It holds every token and class above.

## Example

```jsx
<main style={{ height: '100vh', overflowY: 'auto', padding: 32, position: 'relative', zIndex: 1 }}>
  <p style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--t-3)' }}>Market snapshot</p>
  <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, margin: '6px 0 20px' }}>Cooling vendors</h1>
  <div className="pstats">
    <div className="pstat"><div className="v">140+</div><div className="k">Companies mapped</div></div>
    <div className="pstat"><div className="v">11</div><div className="k">Disciplines</div></div>
  </div>
  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
    <button className="btn">Explore graph</button>
    <button className="btn ghost">Search</button>
  </div>
</main>
```
