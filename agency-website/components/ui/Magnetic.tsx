'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/utils';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Wraps children in a magnetic-hover container. The element springs toward the
 * cursor while hovered and settles back on leave. Purely presentational — it
 * adds no layout, so it can wrap buttons, links or icons.
 */
export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic<HTMLDivElement>({ strength });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      className={cn('inline-flex', className)}
    >
      {children}
    </motion.div>
  );
}
