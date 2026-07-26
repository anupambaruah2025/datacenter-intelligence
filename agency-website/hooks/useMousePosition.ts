'use client';

import { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Tracks the pointer position in viewport coordinates.
 * State updates are throttled to the animation frame to keep it cheap.
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        frame.current = null;
      });
    };
    window.addEventListener('mousemove', handle, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handle);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return position;
}
