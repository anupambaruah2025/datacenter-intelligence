'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const LenisContext = createContext<Lenis | null>(null);

/** Access the shared Lenis instance (e.g. for programmatic anchor scrolling). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Wires up Lenis smooth scrolling and synchronises it with GSAP's ticker and
 * ScrollTrigger so every scroll-driven animation reads the same, eased scroll
 * position. Disabled automatically when the user prefers reduced motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      // Honour reduced-motion: native scrolling, no smoothing.
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // Drive Lenis from GSAP's ticker for a single, frame-locked RAF loop.
    instance.on('scroll', ScrollTrigger.update);
    const update = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(update);
      instance.destroy();
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
