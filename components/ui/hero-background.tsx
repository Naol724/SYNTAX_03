'use client';

import { motion } from 'framer-motion';

export function HeroBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.6, 0.05, 0.01, 0.9] }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/hero-workspace.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)',
          }}
        />
        
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
        
        {/* Premium Glow Effects */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-0 left-1/3 w-[500px] h-80 bg-indigo-500/20 rounded-full blur-[120px]"
        />
      </motion.div>
    </div>
  );
}

const PARTICLE_POSITIONS = Array.from({ length: 20 }, (_, i) => ({
  left: ((i * 37 + 17) % 97) + 1,
  top: ((i * 53 + 23) % 93) + 2,
  duration: 3 + (i % 4),
  delay: (i * 0.25) % 5,
}));

export function FloatingParticles({ count = 20 }: { count?: number }) {
  const particles = PARTICLE_POSITIONS.slice(0, count);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
