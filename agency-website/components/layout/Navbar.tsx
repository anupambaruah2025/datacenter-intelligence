'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/ui/Magnetic';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { EASE_OUT_EXPO } from '@/lib/animations';

/**
 * Glassmorphic sticky navigation. Condenses on scroll, uses Lenis for smooth
 * anchor jumps, includes an animated theme toggle and a full-screen mobile menu.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            'flex w-full max-w-6xl items-center justify-between rounded-full border px-3 py-2.5 transition-all duration-500 ease-out-expo',
            scrolled
              ? 'border-border bg-background/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl'
              : 'border-transparent bg-transparent',
          )}
        >
          {/* Logo */}
          <button
            onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0 }))}
            className="flex items-center gap-2 pl-3 pr-2"
            aria-label={`${SITE.name} — back to top`}
          >
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-400 opacity-90" />
              <span className="absolute inset-[3px] rounded-full bg-background" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-foreground" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">{SITE.name}</span>
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="group relative rounded-full px-4 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute inset-x-4 bottom-1 h-px scale-x-0 bg-foreground/50 transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle colour theme"
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <div className="hidden md:block">
              <Magnetic strength={0.4}>
                <Button size="sm" variant="primary" onClick={() => scrollTo('#pricing')}>
                  Start a project
                </Button>
              </Magnetic>
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-background/95 px-8 backdrop-blur-xl md:hidden"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07, ease: EASE_OUT_EXPO }}
                onClick={() => scrollTo(link.href)}
                className="py-2 text-left font-display text-4xl font-semibold text-foreground"
              >
                {link.label}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Button size="lg" className="w-full" onClick={() => scrollTo('#pricing')}>
                Start a project
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
