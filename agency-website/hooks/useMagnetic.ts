'use client';

import { useRef } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface MagneticOptions {
  /** How far the element is pulled toward the cursor (0..1 of the offset). */
  strength?: number;
}

interface MagneticReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onMouseMove: (e: React.MouseEvent<T>) => void;
  onMouseLeave: () => void;
}

/**
 * Magnetic hover: the returned spring-backed motion values pull an element
 * toward the pointer while it hovers, then snap back on leave. Attach `x`/`y`
 * to a `motion` element's `style` and spread the handlers on the target.
 */
export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  { strength = 0.35 }: MagneticOptions = {},
): MagneticReturn<T> {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(useMotionValue(0), springConfig);
  const y = useSpring(useMotionValue(0), springConfig);

  const onMouseMove = (e: React.MouseEvent<T>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, x, y, onMouseMove, onMouseLeave };
}
