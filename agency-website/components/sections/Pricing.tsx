'use client';

import { useRef, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PRICING, SITE } from '@/lib/constants';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Magnetic } from '@/components/ui/Magnetic';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { viewportOnce, EASE_OUT_EXPO } from '@/lib/animations';

/**
 * Section 8 — pricing tiers. Cards lift and glow on hover, the featured tier is
 * haloed with an animated gradient border, and a spotlight follows the pointer
 * across each card.
 */
export function Pricing() {
  return (
    <section id="pricing" className="relative py-28 md:py-36">
      <div className="container">
        <SectionHeading
          eyebrow="Engagements"
          title="Ways to work together."
          description="Transparent, senior and flexible. Pick the shape that fits — we'll tailor the rest on a quick call."
          align="center"
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PRICING.map((tier, i) => (
            <PricingCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  tier,
  index,
}: {
  tier: (typeof PRICING)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Pointer-following spotlight.
  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE_OUT_EXPO }}
      className={cn('relative', tier.featured && 'lg:-mt-4 lg:mb-4')}
    >
      {/* Animated gradient halo for the featured tier */}
      {tier.featured && (
        <div className="absolute -inset-px rounded-[calc(1.5rem+1px)] bg-gradient-to-b from-indigo-500 via-fuchsia-500 to-amber-400 opacity-60 blur-[2px]" />
      )}

      <div
        ref={ref}
        onPointerMove={handleMove}
        data-cursor="hover"
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card/60 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1',
          tier.featured ? 'border-transparent' : 'border-border hover:border-foreground/25',
        )}
      >
        {/* Pointer spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(320px circle at var(--mx) var(--my), hsl(var(--primary)/0.12), transparent 60%)',
          }}
        />

        {tier.featured && (
          <span className="absolute right-6 top-6 rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-background">
            Most popular
          </span>
        )}

        <div className="relative">
          <h3 className="font-display text-xl font-semibold text-foreground">{tier.name}</h3>
          <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-muted-foreground">
            {tier.description}
          </p>

          <div className="mt-6 flex items-end gap-2">
            <span className="font-display text-5xl font-semibold text-foreground">{tier.price}</span>
            <span className="mb-2 text-sm text-muted-foreground">{tier.cadence}</span>
          </div>

          <ul className="mt-8 flex flex-col gap-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-foreground/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check size={12} strokeWidth={3} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-10 pt-2">
          <Magnetic strength={0.25} className="w-full">
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(`${tier.name} enquiry`)}`}
              className={cn(
                buttonVariants({ variant: tier.featured ? 'glow' : 'outline', size: 'lg' }),
                'w-full',
              )}
            >
              {tier.price === 'Custom' ? 'Book a call' : 'Get started'}
            </a>
          </Magnetic>
        </div>
      </div>
    </motion.div>
  );
}
