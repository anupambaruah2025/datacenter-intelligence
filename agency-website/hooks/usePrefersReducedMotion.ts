'use client';

import { useMediaQuery } from './useMediaQuery';

/**
 * Respects the OS-level "reduce motion" accessibility setting.
 * Every heavy animation in the site checks this and degrades gracefully.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
