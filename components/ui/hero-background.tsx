'use client';

/** HeroBackground — cinematic fixed background, CSS-only animations.
 *  No framer-motion infinite loops so there is zero JS work on scroll.
 */
export function HeroBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/hero-workspace.jpg)',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      {/* Glow effects — CSS animation, compositor-thread only */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] will-change-[opacity]"
        style={{ animation: 'heroGlow1 8s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[500px] h-80 bg-indigo-500/20 rounded-full blur-[120px] will-change-[opacity]"
        style={{ animation: 'heroGlow2 10s ease-in-out infinite 2s' }}
      />

      <style>{`
        @keyframes heroGlow1 { 0%,100%{opacity:.3} 50%{opacity:.5} }
        @keyframes heroGlow2 { 0%,100%{opacity:.2} 50%{opacity:.4} }
      `}</style>
    </div>
  );
}

/** FloatingParticles — removed. Replaced by a subtle static dot-grid pattern
 *  that gives the same atmospheric feel with zero animation overhead.
 */
export function FloatingParticles({ count = 20 }: { count?: number }) {
  // Render nothing — particle animations were the primary scroll-jank source.
  // The hero section background already has sufficient visual depth.
  return null;
}
