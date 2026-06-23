'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  startOnView?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 2,
  className = '',
  suffix = '',
  prefix = '',
  startOnView = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          if (!startOnView) observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!isInView) return;

    const startValue = 0;
    const endValue = value;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeProgress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={className}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.div>
  );
}

// Animated statistics with icons
interface StatItemProps {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
  prefix?: string;
  duration?: number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorThemes = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
  red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
};

export function StatItem({
  value,
  label,
  icon,
  suffix = '',
  prefix = '',
  duration = 2,
  color = 'blue',
}: StatItemProps) {
  const theme = colorThemes[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${theme.bg} ${theme.text} mb-4`}>
        {icon}
      </div>
      <div className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-2">
        {typeof value === 'number' ? (
          <AnimatedCounter value={value} duration={duration} suffix={suffix} prefix={prefix} />
        ) : (
          <span>{prefix}{value}{suffix}</span>
        )}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</div>
    </motion.div>
  );
}

// Stats grid component
interface StatsGridProps {
  stats: Array<{
    value: number | string;
    label: string;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    suffix?: string;
    prefix?: string;
    duration?: number;
  }>;
  columns?: 2 | 3 | 4 | 5;
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-6`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatItem {...stat} />
        </motion.div>
      ))}
    </div>
  );
}