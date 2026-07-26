'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PROCESS } from '@/lib/constants';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EASE_OUT_EXPO, viewportOnce } from '@/lib/animations';

/**
 * Section 4 — an interactive process timeline. A vertical SVG path draws itself
 * (via `pathLength`) as the section scrolls, a glowing node travels down it, and
 * each milestone animates in when reached.
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 75%'],
  });

  // The travelling node's vertical position follows scroll progress.
  const nodeTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="process" className="relative py-28 md:py-36">
      <div className="container">
        <SectionHeading
          eyebrow="How it happens"
          title="A process built for momentum."
          description="Four phases, no dead weight. Each one produces something real you can see, click and pressure-test."
          align="center"
        />

        <div ref={ref} className="relative mx-auto mt-20 max-w-3xl">
          {/* Self-drawing SVG spine */}
          <svg
            className="pointer-events-none absolute left-1/2 top-0 h-full w-6 -translate-x-1/2"
            viewBox="0 0 8 1000"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            {/* Track */}
            <line x1="4" y1="0" x2="4" y2="1000" stroke="hsl(var(--border))" strokeWidth="1.5" />
            {/* Drawn progress */}
            <motion.line
              x1="4"
              y1="0"
              x2="4"
              y2="1000"
              stroke="url(#processGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
            <defs>
              <linearGradient id="processGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          {/* Travelling glow node */}
          <motion.div
            style={{ top: nodeTop }}
            className="absolute left-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_24px_6px_hsl(var(--primary)/0.6)]"
            aria-hidden
          />

          {/* Milestones, alternating sides on desktop */}
          <div className="flex flex-col gap-16 md:gap-24">
            {PROCESS.map((item, i) => (
              <Milestone key={item.step} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Milestone({
  item,
  index,
}: {
  item: (typeof PROCESS)[number];
  index: number;
}) {
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`relative flex ${isLeft ? 'md:justify-start' : 'md:justify-end'} justify-center`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={viewportOnce}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        data-cursor="hover"
        className="group relative w-full max-w-sm rounded-3xl border border-border bg-card/40 p-7 backdrop-blur-md transition-colors duration-500 hover:border-foreground/25"
      >
        <div className="flex items-center gap-4">
          <span className="font-display text-5xl font-semibold text-transparent [-webkit-text-stroke:1px_hsl(var(--foreground)/0.35)]">
            {item.step}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-foreground/25 to-transparent" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">{item.title}</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{item.description}</p>
      </motion.div>
    </div>
  );
}
