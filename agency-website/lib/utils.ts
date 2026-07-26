import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * `cn` merges conditional class names and resolves Tailwind conflicts
 * (e.g. `px-2 px-4` → `px-4`). Used everywhere for composable styling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Linearly interpolate between `a` and `b` by `t` (0..1). */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Clamp `value` into the inclusive `[min, max]` range. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Map a value from one numeric range to another. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}
