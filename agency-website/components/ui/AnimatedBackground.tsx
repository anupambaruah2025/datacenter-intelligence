'use client';

import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useIsMobile } from '@/hooks/useMediaQuery';

/**
 * Site-wide ambient background: an animated grid, two morphing gradient blobs
 * that drift on their own, and a soft glow that follows the cursor. All layers
 * are GPU-composited (transform/opacity only) and sit behind every section.
 */
export function AnimatedBackground() {
  const { x, y } = useMousePosition();
  const isMobile = useIsMobile();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(to right, hsl(var(--foreground)/0.06) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)/0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)',
        }}
      />

      {/* Morphing blobs */}
      <motion.div
        className="absolute -left-32 top-[-10%] h-[42rem] w-[42rem] rounded-full bg-gradient-to-br from-indigo-600/30 to-fuchsia-600/20 blur-[120px]"
        animate={{
          borderRadius: ['40% 60% 70% 30%', '60% 40% 30% 70%', '40% 60% 70% 30%'],
          x: [0, 60, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-40 top-[30%] h-[38rem] w-[38rem] rounded-full bg-gradient-to-br from-cyan-500/25 to-blue-600/20 blur-[120px]"
        animate={{
          borderRadius: ['60% 40% 30% 70%', '30% 70% 60% 40%', '60% 40% 30% 70%'],
          x: [0, -50, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[30%] h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-amber-500/20 to-rose-500/15 blur-[120px]"
        animate={{
          borderRadius: ['50% 50% 40% 60%', '40% 60% 55% 45%', '50% 50% 40% 60%'],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Cursor-following glow (desktop only) */}
      {!isMobile && (
        <div
          className="absolute h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.12),transparent_60%)] blur-2xl transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${x - 288}px, ${y - 288}px, 0)`,
          }}
        />
      )}
    </div>
  );
}
