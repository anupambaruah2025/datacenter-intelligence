'use client';

import type { CSSProperties } from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/constants';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Section 7 — an auto-scrolling, infinite testimonial carousel. Two rows drift
 * in opposite directions using pure-CSS marquee animation (duplicated content
 * for a seamless loop). Hovering pauses the motion for readability.
 */
export function Testimonials() {
  const firstRow = TESTIMONIALS;
  const secondRow = [...TESTIMONIALS].reverse();

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="container">
        <SectionHeading
          eyebrow="Kind words"
          title="Teams that trusted the details."
          align="center"
        />
      </div>

      <div className="mt-16 flex flex-col gap-6">
        <MarqueeRow items={firstRow} duration="55s" />
        <MarqueeRow items={secondRow} duration="45s" reverse />
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  duration,
  reverse = false,
}: {
  items: readonly (typeof TESTIMONIALS)[number][];
  duration: string;
  reverse?: boolean;
}) {
  const row = [...items, ...items];
  return (
    <div className="group relative flex overflow-hidden">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <div
        className={`flex shrink-0 gap-6 pr-6 ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        } group-hover:[animation-play-state:paused]`}
        style={{ '--marquee-duration': duration } as CSSProperties}
      >
        {row.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure
      data-cursor="hover"
      className="flex w-[340px] shrink-0 flex-col gap-5 rounded-3xl border border-border bg-card/40 p-7 backdrop-blur-md transition-colors duration-500 hover:border-foreground/25 md:w-[420px]"
    >
      <Quote size={26} className="text-primary/70" />
      <blockquote className="text-lg leading-relaxed text-foreground/90">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-semibold text-white">
          {testimonial.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{testimonial.name}</div>
          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
        </div>
      </figcaption>
    </figure>
  );
}
