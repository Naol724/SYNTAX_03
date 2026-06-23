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

// Contact CTA with phone/email
export function ContactCTA() {
  return (
    <section className="relative py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-5">
            Ready to Start Your Project?
          </h2>
          <p className="text-blue-100/90 text-lg mb-10 max-w-2xl mx-auto">
            Let's build something great together. Contact us today and we'll respond within 24 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            <motion.a
              href="tel:+251945455141"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">+251 945 455 141</span>
            </motion.a>

            <motion.a
              href="mailto:syntaxsoftwaresolution@gmail.com"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email Us</span>
            </motion.a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 shadow-lg transition-all"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
              >
                View Services
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}