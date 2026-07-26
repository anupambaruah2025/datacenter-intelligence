'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * A two-part custom cursor: a small solid dot that tracks the pointer exactly,
 * and a larger ring that lags behind with spring physics. The ring grows and
 * inverts over interactive elements (anything with [data-cursor="hover"], links
 * or buttons). Hidden on touch devices and when reduced-motion is requested.
 */
export function CustomCursor() {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 });

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isMobile || reduced) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [data-cursor="hover"], input, textarea, [role="button"]',
      );
      setHovering(Boolean(interactive));
    };

    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    document.body.addEventListener('mouseleave', leave);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.body.removeEventListener('mouseleave', leave);
    };
  }, [isMobile, reduced, visible, x, y]);

  if (isMobile || reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Lagging ring */}
      <motion.div
        className="absolute left-0 top-0 rounded-full border border-foreground/40 mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: hovering ? 56 : 34,
          height: hovering ? 56 : 34,
          opacity: visible ? 1 : 0,
          backgroundColor: hovering ? 'hsl(var(--foreground) / 0.08)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      />
      {/* Exact dot */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-foreground mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
