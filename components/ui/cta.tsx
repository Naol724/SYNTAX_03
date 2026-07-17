'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { cn } from './motion';

interface CTAProps {
  title: string;
  description?: string;
  primaryButton?: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
  variant?: 'default' | 'gradient' | 'dark' | 'minimal';
  className?: string;
}

export function CTA({
  title,
  description,
  primaryButton,
  secondaryButton,
  variant = 'gradient',
  className = '',
}: CTAProps) {
  const variants = {
    default: 'bg-gray-50 dark:bg-gray-900',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white',
    dark: 'bg-gray-900 dark:bg-gray-950 text-white',
    minimal: 'bg-transparent',
  };

  return (
    <section className={cn('py-20', variants[variant], className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className={cn(
            'text-3xl sm:text-4xl font-black mb-4',
            variant === 'default' || variant === 'minimal'
              ? 'text-gray-900 dark:text-white'
              : 'text-white'
          )}>
            {title}
          </h2>

          {description && (
            <p className={cn(
              'mb-8 text-lg max-w-2xl mx-auto',
              variant === 'default' || variant === 'minimal'
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-blue-100'
            )}>
              {description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4">
            {primaryButton && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href={primaryButton.href}
                  className={cn(
                    'inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all',
                    variant === 'gradient'
                      ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-lg'
                      : variant === 'dark'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                  )}
                >
                  {primaryButton.text}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}

            {secondaryButton && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={secondaryButton.href}
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all',
                    variant === 'gradient' || variant === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  {secondaryButton.text}
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Contact CTA — professional brand block that fits light & dark mode
export function ContactCTA() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden border-t border-blue-700/20 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
      >
        <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-indigo-300 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-5 tracking-tight">
            Ready to Start Your Project?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2 leading-relaxed">
            Let&apos;s build something great together. Contact us today and we&apos;ll respond within 24 hours.
          </p>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-md sm:max-w-none mx-auto mb-6 sm:mb-8 md:mb-10">
            <motion.a
              href="tel:+251945455141"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-xs sm:text-sm"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium truncate">+251 945 455 141</span>
            </motion.a>

            <motion.a
              href="mailto:syntaxsoftwaresolution@gmail.com"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-xs sm:text-sm"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">Email Us</span>
            </motion.a>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 w-full px-4 py-2.5 sm:px-8 sm:py-3.5 rounded-lg sm:rounded-xl bg-white text-blue-800 font-semibold text-xs sm:text-sm hover:bg-blue-50 shadow-lg transition-all"
              >
                Get in Touch
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 w-full px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-xl border border-white/35 bg-white/10 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all"
              >
                View Services
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}