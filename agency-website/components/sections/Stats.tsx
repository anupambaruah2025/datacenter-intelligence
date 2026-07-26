'use client';

import { motion } from 'framer-motion';
import { Gauge, TrendingUp, Award, Repeat, type LucideIcon } from 'lucide-react';
import { STATS } from '@/lib/constants';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useCountUp } from '@/hooks/useCountUp';
import { viewportOnce, EASE_OUT_EXPO } from '@/lib/animations';

const ICONS: LucideIcon[] = [Gauge, TrendingUp, Award, Repeat];

/**
 * Section 6 — animated statistics. Numbers count up, horizontal bars grow from
 * zero to their value, and each icon springs in. Everything is scroll-triggered.
 */
export function Stats() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="container">
        <SectionHeading
          eyebrow="By the numbers"
          title="Craft you can measure."
          description="Beautiful is table stakes. We instrument every build so the polish shows up in the metrics that matter."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} icon={ICONS[i]} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  icon: Icon,
  index,
}: {
  stat: (typeof STATS)[number];
  icon: LucideIcon;
  index: number;
}) {
  const decimals = stat.value % 1 !== 0 ? 1 : 0;
  const { ref, formatted } = useCountUp(stat.value, { duration: 2200, decimals });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE_OUT_EXPO }}
      data-cursor="hover"
      className="group relative overflow-hidden rounded-3xl border border-border bg-card/40 p-7 backdrop-blur-md transition-colors duration-500 hover:border-foreground/25"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={viewportOnce}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 + index * 0.08 }}
        className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background/60 text-primary transition-transform duration-500 group-hover:scale-110"
      >
        <Icon size={20} />
      </motion.div>

      {/* Value */}
      <div className="font-display text-5xl font-semibold tabular-nums text-foreground">
        <span ref={ref}>{formatted}</span>
        <span className="text-primary">{stat.suffix}</span>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>

      {/* Growing bar */}
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${stat.bar}%` }}
          viewport={viewportOnce}
          transition={{ duration: 1.4, delay: 0.3 + index * 0.08, ease: EASE_OUT_EXPO }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400"
        />
      </div>
    </motion.div>
  );
}
