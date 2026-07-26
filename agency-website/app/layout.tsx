import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { SITE } from '@/lib/constants';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'digital agency',
    'creative studio',
    'web design',
    'creative engineering',
    'WebGL',
    'brand design',
    'product design',
    'Next.js',
  ],
  authors: [{ name: `${SITE.name} Studio` }],
  creator: `${SITE.name} Studio`,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    creator: '@lumenstudio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
    { media: '(prefers-color-scheme: light)', color: '#faf8f5' },
  ],
  width: 'device-width',
  initialScale: 1,
};

/**
 * Runs before hydration to set the theme class, preventing a flash of the wrong
 * theme. Defaults to dark; respects a previously stored preference.
 */
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('lumen-theme') || 'dark';
    var r = document.documentElement;
    r.classList.add(t === 'light' ? 'light' : 'dark');
    r.style.colorScheme = t;
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Web fonts loaded at runtime (build stays offline-safe). App Router has
            no pages/_document, so the no-page-custom-font rule doesn't apply. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScrollProvider>
            <LoadingScreen />
            <AnimatedBackground />
            <NoiseOverlay />
            <ScrollProgress />
            <CustomCursor />
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
