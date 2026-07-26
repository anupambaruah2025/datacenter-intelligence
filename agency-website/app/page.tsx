import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Capabilities } from '@/components/sections/Capabilities';
import { Work } from '@/components/sections/Work';
import { Process } from '@/components/sections/Process';
import { Story } from '@/components/sections/Story';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { Pricing } from '@/components/sections/Pricing';

/**
 * The single-page LUMEN experience. Sections are composed top-to-bottom; each
 * owns its own scroll-driven animation and degrades gracefully under
 * reduced-motion. Global effects (cursor, background, smooth scroll, loader)
 * live in the root layout.
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main" className="relative">
        <Hero />
        <Capabilities />
        <Work />
        <Process />
        <Story />
        <Stats />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
