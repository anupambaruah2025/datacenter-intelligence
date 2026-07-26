'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { FOOTER_LINKS, SITE } from '@/lib/constants';
import { TextReveal } from '@/components/ui/TextReveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { buttonVariants } from '@/components/ui/button';
import { fadeUp, viewportOnce } from '@/lib/animations';

/**
 * Footer with an animated wave, floating particles and a large closing CTA.
 * The wave is an inline SVG that morphs continuously; particles drift on their
 * own transforms (GPU-composited).
 */
export function Footer() {
  const particles = Array.from({ length: 14 });

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/60 bg-background pt-24">
      {/* Animated wave */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden opacity-60">
        <svg
          className="absolute inset-x-0 top-0 h-24 w-[200%]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden
        >
          <motion.path
            fill="none"
            stroke="url(#footerWave)"
            strokeWidth={1.5}
            initial={{ d: 'M0,60 C360,10 720,110 1080,60 C1260,35 1350,80 1440,60' }}
            animate={{
              d: [
                'M0,60 C360,10 720,110 1080,60 C1260,35 1350,80 1440,60',
                'M0,60 C360,110 720,10 1080,60 C1260,90 1350,30 1440,60',
                'M0,60 C360,10 720,110 1080,60 C1260,35 1350,80 1440,60',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="footerWave" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {particles.map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-foreground/30"
            style={{ left: `${(i * 7.3) % 100}%`, top: `${(i * 13.7) % 90 + 5}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.6, 0.1] }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="container relative">
        {/* Closing CTA */}
        <div className="flex flex-col items-start gap-8 pb-20">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Let&apos;s build something luminous
          </span>
          <TextReveal
            as="h2"
            text="Have a project in mind?"
            className="font-display text-display-sm font-semibold"
          />
          <Magnetic strength={0.4}>
            <a
              href={`mailto:${SITE.email}`}
              className={buttonVariants({ variant: 'glow', size: 'lg' })}
            >
              {SITE.email}
              <ArrowUpRight size={18} />
            </a>
          </Magnetic>
        </div>

        {/* Link columns */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-10 border-t border-border/60 py-14 md:grid-cols-4"
        >
          <div className="col-span-2 flex flex-col gap-3">
            <span className="font-display text-2xl font-semibold">{SITE.name}</span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE.description}
            </p>
            <span className="mt-2 text-sm text-muted-foreground">{SITE.location}</span>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {col.title}
              </span>
              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group inline-flex w-fit items-center gap-1 text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Base line */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 py-8 text-xs text-muted-foreground md:flex-row">
          <span>
            © {new Date().getFullYear()} {SITE.name} Studio. Crafted with obsessive care.
          </span>
          <span className="tracking-widest uppercase">{SITE.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
