'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { STORY } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { fadeUp, viewportOnce, EASE_OUT_EXPO } from '@/lib/animations';

/**
 * Section 5 — split-screen storytelling. Each chapter pairs a sticky text panel
 * with a parallax media panel; the media drifts against the scroll and its inner
 * gradient shifts, creating depth as the reader moves through the narrative.
 */
export function Story() {
  return (
    <section className="relative py-24">
      <div className="container flex flex-col gap-24 md:gap-40">
        {STORY.map((chapter, i) => (
          <Chapter key={chapter.title} chapter={chapter} index={i} />
        ))}
      </div>
    </section>
  );
}

function Chapter({
  chapter,
  index,
}: {
  chapter: (typeof STORY)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reversed = index % 2 === 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);
  const innerScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  return (
    <div
      ref={ref}
      className={cn(
        'grid items-center gap-10 md:grid-cols-2 md:gap-16',
        reversed && 'md:[direction:rtl]',
      )}
    >
      {/* Sticky text */}
      <div className="md:[direction:ltr]">
        <div className="md:sticky md:top-1/3">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-xs font-medium uppercase tracking-[0.25em] text-primary"
          >
            {chapter.kicker}
          </motion.span>
          <motion.h3
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: 0.08, ease: EASE_OUT_EXPO }}
            className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground md:text-5xl"
          >
            {chapter.title}
          </motion.h3>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: 0.16, ease: EASE_OUT_EXPO }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            {chapter.body}
          </motion.p>
        </div>
      </div>

      {/* Parallax media */}
      <div className="md:[direction:ltr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-4xl border border-border">
          <motion.div style={{ y: mediaY, scale: innerScale }} className="absolute inset-0">
            <div className={cn('absolute inset-0 bg-gradient-to-br', chapter.accent)} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
            {/* Floating glass shards */}
            <div className="absolute left-[15%] top-[20%] h-28 w-28 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md" />
            <div className="absolute bottom-[22%] right-[18%] h-40 w-40 rounded-full border border-white/15 bg-white/5 backdrop-blur-md" />
          </motion.div>
          {/* Chapter number watermark */}
          <span className="absolute bottom-6 right-8 font-display text-8xl font-bold text-white/10">
            0{index + 1}
          </span>
        </div>
      </div>
    </div>
  );
}
