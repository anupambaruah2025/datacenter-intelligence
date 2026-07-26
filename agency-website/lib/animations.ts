import type { Variants } from 'framer-motion';

/**
 * Shared Framer Motion variants and easing tokens.
 * Centralising these keeps motion consistent and "designed" across the site.
 */

/** Signature easing — an expo-out curve that feels expensive and settled. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.83, 0, 0.17, 1] as const;

/** Fade + rise, staggered by a parent container. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
};

/** Container that reveals children one after another. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Per-word mask reveal used for large headline typography. */
export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

/** Subtle scale-in for cards and media. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

/** Default viewport config for scroll-triggered reveals. */
export const viewportOnce = { once: true, amount: 0.35 } as const;
