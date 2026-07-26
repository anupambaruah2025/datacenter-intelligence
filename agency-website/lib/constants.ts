/**
 * Single source of truth for site content.
 * Keeping copy and data here (not hard-coded in JSX) makes the site easy to
 * re-theme and keeps components declarative.
 */

export const SITE = {
  name: 'LUMEN',
  tagline: 'Digital experiences, engineered like light.',
  description:
    'LUMEN is an independent design & engineering studio crafting cinematic, high-performance digital products for ambitious brands.',
  url: 'https://lumen.studio',
  email: 'hello@lumen.studio',
  location: 'New York · London · Remote',
} as const;

export const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Studio', href: '#capabilities' },
  { label: 'Process', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
] as const;

/** Section 2 — capabilities with count-up metrics. */
export const CAPABILITIES = [
  {
    id: 'design',
    title: 'Brand & Product Design',
    description:
      'Identity systems, design language and interfaces built to be felt, not just seen.',
    metric: 120,
    suffix: '+',
    metricLabel: 'Brands shaped',
  },
  {
    id: 'engineering',
    title: 'Creative Engineering',
    description:
      'WebGL, motion and performance work that keeps 120fps interactions buttery on any device.',
    metric: 60,
    suffix: 'fps',
    metricLabel: 'Sustained motion',
  },
  {
    id: 'strategy',
    title: 'Strategy & Direction',
    description:
      'Positioning, narrative and art direction that make the work inevitable in its market.',
    metric: 14,
    suffix: 'yrs',
    metricLabel: 'Compound craft',
  },
] as const;

/** Section 3 — horizontal work gallery. Visuals are generated with CSS gradients
 *  (no external image dependencies) so the site is fully self-contained. */
export const PROJECTS = [
  {
    id: 'aurora',
    client: 'Aurora',
    title: 'Spatial banking, reimagined',
    year: '2025',
    discipline: 'Product · WebGL',
    gradient: 'from-[#6366f1] via-[#8b5cf6] to-[#ec4899]',
  },
  {
    id: 'helios',
    client: 'Helios',
    title: 'A clean-energy flagship',
    year: '2025',
    discipline: 'Brand · Site',
    gradient: 'from-[#f59e0b] via-[#f43f5e] to-[#8b5cf6]',
  },
  {
    id: 'north',
    client: 'North',
    title: 'Commerce at the speed of thought',
    year: '2024',
    discipline: 'Platform · Motion',
    gradient: 'from-[#22d3ee] via-[#3b82f6] to-[#6366f1]',
  },
  {
    id: 'monolith',
    client: 'Monolith',
    title: 'The developer cloud, distilled',
    year: '2024',
    discipline: 'Product · 3D',
    gradient: 'from-[#10b981] via-[#14b8a6] to-[#3b82f6]',
  },
  {
    id: 'vela',
    client: 'Vela',
    title: 'Luxury travel, in one gesture',
    year: '2023',
    discipline: 'App · Design',
    gradient: 'from-[#f472b6] via-[#c084fc] to-[#60a5fa]',
  },
] as const;

/** Section 4 — process timeline milestones (SVG path draws through these). */
export const PROCESS = [
  {
    step: '01',
    title: 'Discover',
    description:
      'We immerse in your market, users and ambition — then define the single idea worth building around.',
  },
  {
    step: '02',
    title: 'Design',
    description:
      'Systems, prototypes and motion studies. We design in-browser so what you approve is what ships.',
  },
  {
    step: '03',
    title: 'Engineer',
    description:
      'Production code from day one: typed, tested, accessible and tuned for a 95+ Lighthouse score.',
  },
  {
    step: '04',
    title: 'Launch',
    description:
      'We ship, measure and iterate — pairing craft with analytics so the work keeps compounding.',
  },
] as const;

/** Section 5 — split-screen storytelling chapters. */
export const STORY = [
  {
    kicker: 'Our belief',
    title: 'Craft is a business advantage',
    body:
      'The difference between good and unforgettable is measured in milliseconds and micro-interactions. We obsess over the details most teams never notice — because your customers feel every one of them.',
    accent: 'from-indigo-500/30 to-fuchsia-500/30',
  },
  {
    kicker: 'How we work',
    title: 'Small team, senior hands',
    body:
      'No layers, no handoffs, no juniors learning on your budget. The people who pitch the work are the people who make it — designers and engineers building side by side, in the same room.',
    accent: 'from-cyan-500/30 to-blue-500/30',
  },
  {
    kicker: 'The outcome',
    title: 'Experiences that convert',
    body:
      'Beauty that performs. Every project is instrumented, load-budgeted and accessibility-audited, so the polish you see is matched by the numbers you care about.',
    accent: 'from-amber-500/30 to-rose-500/30',
  },
] as const;

/** Section 6 — animated statistics with growing bars. */
export const STATS = [
  { value: 98, suffix: '', label: 'Avg. Lighthouse score', bar: 98 },
  { value: 2.4, suffix: 'x', label: 'Median conversion lift', bar: 80 },
  { value: 40, suffix: '+', label: 'Awards & mentions', bar: 66 },
  { value: 100, suffix: '%', label: 'Client return rate', bar: 100 },
] as const;

/** Section 7 — testimonials for the infinite carousel. */
export const TESTIMONIALS = [
  {
    quote:
      'LUMEN delivered the most polished product launch we have ever shipped. Our activation rate doubled in the first month.',
    name: 'Sofia Almeida',
    role: 'VP Product, Aurora',
  },
  {
    quote:
      'They think like founders and execute like a top-tier studio. The motion work alone became our biggest brand asset.',
    name: 'Marcus Lee',
    role: 'CEO, Helios',
  },
  {
    quote:
      'Every detail was considered. The site feels alive — reviewers literally applauded during the demo.',
    name: 'Priya Nair',
    role: 'Head of Design, North',
  },
  {
    quote:
      'Fast, senior and genuinely creative. We went from brief to award-nominated launch in nine weeks.',
    name: 'Daniel Roth',
    role: 'Founder, Monolith',
  },
  {
    quote:
      'The performance engineering is unreal. Buttery on a three-year-old phone, and it still looks like a film.',
    name: 'Yuki Tanaka',
    role: 'CTO, Vela',
  },
] as const;

/** Section 8 — pricing tiers. */
export const PRICING = [
  {
    id: 'sprint',
    name: 'Sprint',
    price: '$12k',
    cadence: 'per project',
    description: 'A focused, fixed-scope engagement to ship one thing beautifully.',
    features: [
      'One landing or product surface',
      'Design + build + motion',
      '2 week turnaround',
      'Performance & a11y audit',
    ],
    featured: false,
  },
  {
    id: 'partner',
    name: 'Partner',
    price: '$28k',
    cadence: 'per month',
    description: 'An embedded design & engineering pod for teams shipping continuously.',
    features: [
      'Dedicated senior duo',
      'Unlimited scope, one active stream',
      'Weekly launches',
      'Roadmap & strategy',
      'Priority support',
    ],
    featured: true,
  },
  {
    id: 'flagship',
    name: 'Flagship',
    price: 'Custom',
    cadence: "let's talk",
    description: 'End-to-end creation of a category-defining digital flagship.',
    features: [
      'Full brand + product build',
      'WebGL / 3D experiences',
      'Multi-quarter partnership',
      'On-site workshops',
      'Executive collaboration',
    ],
    featured: false,
  },
] as const;

export const FOOTER_LINKS = [
  {
    title: 'Studio',
    links: [
      { label: 'Work', href: '#work' },
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Process', href: '#process' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Twitter / X', href: '#' },
      { label: 'Dribbble', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Instagram', href: '#' },
    ],
  },
] as const;
