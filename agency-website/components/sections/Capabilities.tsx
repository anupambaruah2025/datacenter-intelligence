'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CAPABILITIES } from '@/lib/constants';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useCountUp } from '@/hooks/useCountUp';
import { fadeUp, viewportOnce, EASE_OUT_EXPO } from '@/lib/animations';

/**
 * Section 2 — a sticky (pinned) media column paired with a scrolling list of
 * capabilities. The media panel zooms as the section scrolls, each capability
 * fades upward into view, and its headline metric counts up smoothly.
 */
export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Zoom + drift the pinned media as the section passes through the viewport.
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.28]);
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const filter = useTransform(scrollYProgress, [0, 1], [0, 60], {
    clamp: true,
  });
  const hueFilter = useTransform(filter, (h) => `hue-rotate(${h}deg)`);

  return (
    <section id="capabilities" ref={sectionRef} className="relative py-28 md:py-36">
      <div className="container">
        <SectionHeading
          eyebrow="What we do"
          title="Three disciplines, one obsessive standard."
          description="We fold strategy, design and engineering into a single team so nothing is lost in translation — and everything ships at the highest possible fidelity."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Sticky, zooming media */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28 h-[70vh] overflow-hidden rounded-4xl border border-border">
              <motion.div
                style={{ scale, y, filter: hueFilter }}
                className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-amber-500"
              />
              {/* Glass panel + floating orbs over the zooming gradient */}
              <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px]" />
              <div className="absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-white/20 blur-2xl" />
                <div className="absolute left-[20%] top-[30%] h-24 w-24 animate-float rounded-full bg-white/15 blur-xl [animation-delay:1s]" />
                <div className="absolute bottom-[18%] right-[22%] h-32 w-32 animate-float rounded-full bg-black/20 blur-2xl [animation-delay:2s]" />
              </div>
              <div className="absolute inset-0 flex items-end p-8">
                <div className="rounded-2xl border border-white/20 bg-black/20 p-6 backdrop-blur-md">
                  <p className="font-display text-xl font-medium text-white">
                    Design in-browser. Ship what you approve.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Capability list */}
          <div className="flex flex-col gap-6">
            {CAPABILITIES.map((cap, i) => (
              <CapabilityCard key={cap.id} cap={cap} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({
  cap,
  index,
}: {
  cap: (typeof CAPABILITIES)[number];
  index: number;
}) {
  const { ref, formatted } = useCountUp(cap.metric, { duration: 2200 });

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: index * 0.05, ease: EASE_OUT_EXPO }}
      data-cursor="hover"
      className="group relative overflow-hidden rounded-3xl border border-border bg-card/40 p-8 backdrop-blur-md transition-colors duration-500 hover:border-foreground/25"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/10 to-transparent" />
      </div>

      <div className="relative flex items-start justify-between gap-6">
        <div className="max-w-md">
          <h3 className="font-display text-2xl font-semibold text-foreground">{cap.title}</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">{cap.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-4xl font-semibold tabular-nums text-foreground">
            <span ref={ref}>{formatted}</span>
            <span className="text-primary">{cap.suffix}</span>
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            {cap.metricLabel}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
