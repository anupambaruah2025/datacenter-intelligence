/**
 * A full-screen film-grain / noise overlay rendered from an inline SVG turbulence
 * filter (no image request). Sits above the background but below content and is
 * fully non-interactive. Gives flat gradients a tactile, cinematic texture.
 */
export function NoiseOverlay() {
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-overlay dark:opacity-[0.05]"
      style={{ backgroundImage: noise, backgroundSize: '140px 140px' }}
    />
  );
}
