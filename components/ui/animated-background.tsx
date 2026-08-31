'use client';

/** Soft page atmosphere shared behind all public pages.
 *  Uses CSS keyframes instead of framer-motion so the browser
 *  can run these entirely on the compositor thread — no JS
 *  involvement on every frame, no scroll jank.
 */
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/30" />

      {/* Blob 1 — CSS animation, compositor-only */}
      <div
        className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-blue-500/15 rounded-full blur-3xl will-change-transform"
        style={{ animation: 'blob1 20s ease-in-out infinite' }}
      />

      {/* Blob 2 — CSS animation, compositor-only */}
      <div
        className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-400/20 to-blue-400/15 rounded-full blur-3xl will-change-transform"
        style={{ animation: 'blob2 25s ease-in-out infinite 5s' }}
      />

      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50%       { transform: translate(100px, 50px) scale(1.2); opacity: 0.5; }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50%       { transform: translate(-80px, 100px) scale(1.3); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
