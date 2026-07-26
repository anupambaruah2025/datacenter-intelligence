'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE } from '@/lib/constants';
import { EASE_OUT_EXPO } from '@/lib/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Cinematic first-paint loading screen. Counts to 100 while the page settles,
 * then splits open with a masked reveal. It locks scroll while visible and
 * self-dismisses; reduced-motion users get an instant, quiet fade.
 */
export function LoadingScreen() {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    if (reduced) {
      setProgress(100);
      const t = setTimeout(() => finish(), 300);
      return () => clearTimeout(t);
    }

    let raf = 0;
    const duration = 1600;
    let start: number | null = null;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round(ease(p) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const finish = () => {
    // brief hold so 100% is legible before the reveal
    setTimeout(() => {
      setDone(true);
      document.body.style.overflow = '';
    }, 400);
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          {/* Reveal panels that split away */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 origin-top bg-background"
            initial={{ scaleY: 1 }}
            animate={done ? { scaleY: 0 } : { scaleY: 1 }}
          />
          <div className="relative flex flex-col items-center gap-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
              className="font-display text-2xl font-semibold tracking-[0.3em] text-foreground"
            >
              {SITE.name}
            </motion.span>

            {/* Progress bar */}
            <div className="h-px w-56 overflow-hidden bg-foreground/15">
              <motion.div
                className="h-full bg-foreground"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex w-56 items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
              <span>Loading</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
