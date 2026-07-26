'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface CountUpOptions {
  duration?: number;
  decimals?: number;
}

/**
 * Counts a number up from 0 to `target` when the returned ref scrolls into
 * view. Uses requestAnimationFrame with an expo-out ease for a smooth,
 * non-linear settle. Respects reduced-motion by snapping to the final value.
 */
export function useCountUp(
  target: number,
  { duration = 2000, decimals = 0 }: CountUpOptions = {},
) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(target);
      return;
    }

    let raf = 0;
    let start: number | null = null;
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      setValue(target * easeOutExpo(progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduced]);

  const formatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US');

  return { ref, value, formatted } as const;
}
