# design-sync notes

- **Tokens-only sync.** The site is vanilla HTML/CSS/JS with no component library, so `window.DCI` is empty and the Claude Design project carries only the stylesheet, tokens and fonts, plus `conventions.md` as the README header.
- **Scaffold package.** `.design-sync/pkg/` is a stub npm package that exists only to satisfy the converter. The converter ignores a `cssEntry` outside the package dir, so `buildCmd` copies `assets/css/styles.css` into `pkg/styles.css` (gitignored). Run the `buildCmd` from `.design-sync/pkg/` before every build.
- **Fonts.** Inter (latin, 400–800) ships from the `@fontsource/inter` devDependency via `extraFonts`. The live site loads Inter from Google Fonts in `index.html`, and `styles.css` has no font import of its own.
- **Converter deps.** The converter needs `react`/`react-dom` in `.ds-sync/node_modules` for vendoring even with zero components (`npm i react@18 react-dom@18` there). Pin `playwright@1.56` so it matches the preinstalled `/opt/pw-browsers/chromium*-1194`.
- **Build commands** (from `.design-sync/pkg/`): `node ../../.ds-sync/resync.mjs --config ../config.json --node-modules ../../.ds-sync/node_modules --out ../../ds-bundle --entry ./index.js`

## Re-sync risks

- `conventions.md` names classes and tokens from `assets/css/styles.css`. Renaming `.btn`, `.pstat*` or `.pfact*`, or any `--*` token, makes it stale, so re-run the name check against `ds-bundle/_ds_bundle.css`.
- The generated README boilerplate still says "React library … 0 components". The conventions header above it corrects this for the design agent.
- `html, body { overflow: hidden }` in the source CSS stops designs from scrolling. The conventions header documents the workaround. Changing the CSS instead would affect the live site.
- The first upload hasn't happened yet: DesignSync authorization isn't available in claude.ai/code sessions. `projectId` is not yet recorded in `config.json`.
