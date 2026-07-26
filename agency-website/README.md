# LUMEN — Premium Agency Website

An award-worthy, production-ready website for a fictional design & engineering
studio, built to feel in the same league as Apple, Stripe, Linear, Vercel and
Tesla: minimal luxury, cinematic lighting, large typography, glassmorphism and
motion that stays buttery on any device.

> Single-page, dark-first (with a full light theme), fully responsive,
> SEO-optimised and WCAG-conscious — every animation degrades gracefully under
> `prefers-reduced-motion`.

## Tech stack

| Concern            | Choice                                                        |
| ------------------ | ------------------------------------------------------------- |
| Framework          | **Next.js 15** (App Router) + **React 19** + **TypeScript**   |
| Styling            | **Tailwind CSS** (CSS-variable design tokens) + shadcn-style primitives |
| Scroll & timeline  | **GSAP** + **ScrollTrigger**, synced with **Lenis** smooth scroll |
| UI motion          | **Framer Motion**                                             |
| 3D / WebGL         | **Three.js** via **React Three Fiber** + **drei**             |
| Icons              | **lucide-react**                                              |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-checked)
npm run start    # serve the production build
npm run lint     # eslint
```

Node ≥ 18.18 is required.

## Project structure

```
agency-website/
├─ app/                      # App Router entry
│  ├─ layout.tsx             # SEO metadata, fonts, theme anti-flash, providers, global FX
│  ├─ page.tsx               # composes the eight sections
│  ├─ robots.ts / sitemap.ts # SEO routes
├─ components/
│  ├─ layout/                # Navbar, Footer
│  ├─ sections/              # Hero + Sections 2–8
│  ├─ ui/                    # cursor, loader, scroll progress, noise, tilt, reveal, button…
│  ├─ three/                 # HeroScene (R3F canvas: 3D object + particles)
│  └─ providers/             # SmoothScroll (Lenis+GSAP) & Theme (dark/light)
├─ hooks/                    # magnetic, count-up, mouse position, media query, reduced-motion
├─ lib/                      # utils (cn/lerp/clamp), animation variants, all site content
├─ public/                   # favicon
└─ styles/                   # globals.css (design tokens, base, utilities)
```

> The App Router replaces the legacy `pages/` directory; routing lives in `app/`.

## The scrolling experience

1. **Hero** — full-screen R3F canvas with a slowly rotating, distorting 3D
   object and a 900-point particle field; word-by-word masked headline reveal;
   magnetic CTAs; a cursor-following glow.
2. **Capabilities** — a sticky (pinned) media column that zooms/hue-shifts while
   a list of capabilities fades upward and their metrics count up.
3. **Work** — a horizontally scrolling gallery driven by vertical scroll, an
   infinite marquee, and glass project cards that tilt in 3D with a specular
   glare (native horizontal swipe on mobile).
4. **Process** — an interactive timeline whose SVG spine **draws itself** on
   scroll, with a travelling glow node and animated milestones.
5. **Story** — split-screen storytelling with sticky text and parallax media.
6. **Stats** — numbers count up, bars grow from zero, icons spring in.
7. **Testimonials** — two auto-scrolling infinite carousels (pause on hover).
8. **Pricing** — glass pricing cards with pointer-follow spotlights, hover lift
   and an animated gradient halo on the featured tier.
9. **Footer** — animated morphing wave, floating particles and a closing CTA.

## Global effects

Smooth scrolling · parallax · custom two-part cursor · magnetic buttons ·
animated gradients · morphing blobs · SVG noise overlay · cursor-follow glow ·
animated grid · scroll-progress indicator · cinematic loading screen · blur
reveals · dark/light theme with no flash of unstyled theme.

## Performance & accessibility

- **GPU-friendly** — animations use `transform`/`opacity`; heavy layers are
  `will-change`-promoted.
- **Lazy & split** — the WebGL scene is a `dynamic()` import with `ssr:false`,
  so it never blocks first paint or SSR; icon/motion libraries are tree-shaken
  via `optimizePackageImports`.
- **`requestAnimationFrame`** — Lenis is driven off GSAP's single ticker;
  pointer tracking and count-ups are rAF-throttled.
- **Reduced motion** — a global CSS guard plus a `usePrefersReducedMotion` hook
  disable smoothing, the 3D distortion, the custom cursor and count-ups.
- **SEO** — full Open Graph / Twitter metadata, `robots.txt` and `sitemap.xml`.

## Notes

Case-study artwork is generated with CSS gradients rather than bitmap images, so
the site is fully self-contained (the only remote asset is the Google Fonts
stylesheet, which falls back to a system stack if unavailable). No Lorem Ipsum,
no placeholder boxes — everything on screen is real, styled content.
