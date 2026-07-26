'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '@/lib/constants';
import { TiltCard } from '@/components/ui/TiltCard';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMediaQuery';

/** Infinite, seamless marquee of studio credentials. */
function Marquee() {
  const items = [
    'Brand Systems',
    'WebGL & 3D',
    'Product Design',
    'Motion',
    'Creative Engineering',
    'Art Direction',
    'Design Systems',
    'Performance',
  ];
  const row = [...items, ...items];

  return (
    <div className="relative flex overflow-hidden border-y border-border/60 py-6">
      <div className="flex min-w-full shrink-0 animate-marquee items-center gap-8 pr-8">
        {row.map((item, i) => (
          <MarqueeItem key={`a-${i}`} label={item} />
        ))}
      </div>
      <div
        aria-hidden
        className="flex min-w-full shrink-0 animate-marquee items-center gap-8 pr-8"
      >
        {row.map((item, i) => (
          <MarqueeItem key={`b-${i}`} label={item} />
        ))}
      </div>
    </div>
  );
}

function MarqueeItem({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-8 text-2xl font-medium text-muted-foreground md:text-4xl">
      {label}
      <span className="text-primary">✦</span>
    </span>
  );
}

/**
 * Section 3 — a horizontally scrolling gallery driven by vertical scroll. The
 * section is tall; its inner track is pinned (sticky) and translated on X as you
 * scroll through, revealing tilting glass project cards. On mobile it degrades
 * to a native horizontal swipe strip.
 */
export function Work() {
  const isMobile = useIsMobile();

  return (
    <section id="work" className="relative py-24">
      <div className="container mb-14">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          <span className="h-px w-6 bg-gradient-to-r from-primary to-transparent" />
          Selected work
        </span>
        <h2 className="mt-5 max-w-2xl font-display text-display-sm font-semibold">
          Work that earns a second look.
        </h2>
      </div>

      <div className="mb-14">
        <Marquee />
      </div>

      {isMobile ? <MobileGallery /> : <HorizontalGallery />}
    </section>
  );
}

function HorizontalGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // Measure how far the track must translate to reveal its last card.
  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(trackRef.current.scrollWidth - window.innerWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -distance]), {
    stiffness: 120,
    damping: 30,
    restDelta: 0.5,
  });

  return (
    // Height drives how long the horizontal scroll lasts.
    <div ref={sectionRef} style={{ height: `${distance + 800}px` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex gap-8 px-6 md:px-10 will-change-transform">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
          <EndCard />
        </motion.div>
      </div>
    </div>
  );
}

function MobileGallery() {
  return (
    <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {PROJECTS.map((project, i) => (
        <div key={project.id} className="snap-center">
          <ProjectCard project={project} index={i} />
        </div>
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
}) {
  return (
    <TiltCard
      intensity={8}
      className="group relative h-[62vh] max-h-[560px] w-[78vw] shrink-0 overflow-hidden rounded-4xl border border-border md:w-[46vw] lg:w-[38vw]"
    >
      {/* Gradient artwork */}
      <div className={cn('absolute inset-0 bg-gradient-to-br', project.gradient)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 backdrop-blur-[1px] transition-opacity duration-500 group-hover:opacity-100" />

      {/* Floating index chip */}
      <div className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-sm font-medium text-white backdrop-blur-md">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-8" style={{ transform: 'translateZ(40px)' }}>
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-white/80">
          <span>{project.discipline}</span>
          <span className="h-1 w-1 rounded-full bg-white/60" />
          <span>{project.year}</span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-white/80">{project.client}</div>
            <h3 className="mt-1 max-w-xs font-display text-3xl font-semibold text-white">
              {project.title}
            </h3>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function EndCard() {
  return (
    <div className="flex h-[62vh] max-h-[560px] w-[70vw] shrink-0 flex-col items-center justify-center gap-6 rounded-4xl border border-dashed border-border p-10 text-center md:w-[34vw]">
      <span className="font-display text-3xl font-semibold">Your project, next.</span>
      <p className="max-w-xs text-muted-foreground">
        We take on a handful of partners each quarter. Let&apos;s make something worth remembering.
      </p>
      <a
        href="#pricing"
        data-cursor="hover"
        className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground/5"
      >
        See engagements <ArrowUpRight size={16} />
      </a>
    </div>
  );
}
