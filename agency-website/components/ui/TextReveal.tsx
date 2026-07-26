'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { staggerContainer, wordReveal, viewportOnce } from '@/lib/animations';

interface TextRevealProps {
  text: string;
  className?: string;
  /** Delay before the first word rises. */
  delay?: number;
  /** Stagger between words. */
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Word-by-word masked reveal for headlines. Each word sits in an overflow-hidden
 * mask and rises into place, staggered. Whitespace is preserved so wrapping
 * matches normal text. Scroll-triggered, once.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  as = 'h2',
}: TextRevealProps) {
  const words = text.split(' ');
  // `as` is a controlled union; cast to a single concrete motion component so
  // JSX doesn't choke on the union of element props (behaviour is identical).
  const MotionTag = motion[as] as typeof motion.h2;

  return (
    <MotionTag
      className={cn('flex flex-wrap', className)}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-flex overflow-hidden pb-[0.12em] pr-[0.28em]">
          <motion.span variants={wordReveal} className="inline-block will-change-transform">
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
