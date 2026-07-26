'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Magnetic } from '@/components/ui/Magnetic';
import { Button } from '@/components/ui/button';
import { staggerContainer, wordReveal, fadeUp, EASE_OUT_EXPO } from '@/lib/animations';
import { useLenis } from '@/components/providers/SmoothScrollProvider';

// The WebGL scene is heavy and browser-only — load it on the client, after paint,
// so it never blocks first render or SSR.
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => null,
});

const HEADLINE = ['We', 'craft', 'digital', 'experiences', 'engineered', 'like', 'light.'];

export function Hero() {
  const lenis = useLenis();

  const toWork = () => {
    const el = document.querySelector('#work');
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
    else el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-28"
    >
      {/* 3D object + particle system */}
      <div className="absolute inset-0 -z-[1]">
        <HeroScene />
      </div>

      {/* Radial vignette to seat the type over the scene */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,transparent,hsl(var(--background)/0.75))]" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-md"
        >
          <Sparkles size={13} className="text-primary" />
          Award-winning design & engineering studio
        </motion.div>

        {/* Word-by-word headline reveal */}
        <motion.h1
          variants={staggerContainer(0.09, 0.4)}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center font-display text-display font-semibold leading-none text-foreground"
        >
          {HEADLINE.map((word, i) => (
            <span key={i} className="inline-flex overflow-hidden pb-[0.1em] pr-[0.28em]">
              <motion.span
                variants={wordReveal}
                className={
                  i >= 4
                    ? 'inline-block bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent will-change-transform'
                    : 'inline-block will-change-transform'
                }
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.1, duration: 0.9, ease: EASE_OUT_EXPO }}
          className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground"
        >
          An independent studio building cinematic, high-performance digital products for the
          world&apos;s most ambitious brands.
        </motion.p>

        {/* CTAs with magnetic hover */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.9, ease: EASE_OUT_EXPO }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic strength={0.4}>
            <Button size="lg" variant="glow" onClick={toWork}>
              View our work
            </Button>
          </Magnetic>
          <Magnetic strength={0.4}>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const el = document.querySelector('#pricing');
                if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
                else el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start a project
            </Button>
          </Magnetic>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={toWork}
        aria-label="Scroll to work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} />
        </motion.span>
      </motion.button>
    </section>
  );
}
