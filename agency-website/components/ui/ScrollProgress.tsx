'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A thin gradient progress bar pinned to the top of the viewport that fills as
 * the page scrolls. Uses Framer's scroll progress (0..1) smoothed by a spring.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[9998] h-[2px] origin-left bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400"
    />
  );
}
