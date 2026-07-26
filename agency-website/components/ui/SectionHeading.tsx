'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, viewportOnce } from '@/lib/animations';
import { TextReveal } from './TextReveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

/** Consistent, animated section header: eyebrow label, revealed title, blurb. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex max-w-3xl flex-col gap-5',
        align === 'center' && 'mx-auto items-center text-center',
        className,
      )}
    >
      <motion.span
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground"
      >
        <span className="h-px w-6 bg-gradient-to-r from-primary to-transparent" />
        {eyebrow}
      </motion.span>

      <TextReveal
        as="h2"
        text={title}
        className={cn(
          'font-display text-display-sm font-semibold text-foreground',
          align === 'center' && 'justify-center',
        )}
      />

      {description && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-lg leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
