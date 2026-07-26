'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe media-query hook. Returns `false` on the server and during the first
 * client render, then updates once the real match is known (avoids hydration
 * mismatches). Use for responsive behaviour that JS needs to know about.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Convenience wrapper: true on coarse-pointer / small screens. */
export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)');
}
