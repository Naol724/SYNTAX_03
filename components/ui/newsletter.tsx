'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from './motion';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

interface NewsletterProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'featured';
  title?: string;
  description?: string;
  placeholder?: string;
}

export function Newsletter({
  className = '',
  variant = 'default',
  title = 'Stay Updated',
  description = 'Subscribe to our newsletter for the latest tech insights and company updates.',
  placeholder = 'Enter your email',
}: NewsletterProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '', name: '' },
  });

  const onSubmit = async (data: NewsletterForm) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      reset();
      setError(null);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const variants = {
    default: 'bg-gray-50 dark:bg-gray-900 rounded-3xl',
    minimal: '',
    featured: 'bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white',
  };

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn('max-w-md', className)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                {...register('email')}
                type="email"
                placeholder={placeholder}
                className="w-full px-5 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.email && (
                <p className="absolute -bottom-6 left-0 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="ml-3 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Subscribe
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(variants[variant], 'p-8 sm:p-10', className)}
    >
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Thanks for subscribing!
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You'll receive our latest updates in your inbox.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Subscribe another email
          </button>
        </motion.div>
      ) : (
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className={cn(
              'inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4',
              variant === 'featured'
                ? 'bg-white/20 text-white'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            )}>
              NEWSLETTER
            </span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={cn(
              'text-2xl sm:text-3xl font-black mb-3',
              variant === 'featured' ? 'text-white' : 'text-gray-900 dark:text-white'
            )}
          >
            {title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={cn(
              'mb-8 max-w-lg mx-auto',
              variant === 'featured'
                ? 'text-blue-100'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {description}
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  {...register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className={cn(
                    'w-full px-5 py-3.5 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
                    variant === 'featured'
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-white/20 focus:border-white/30'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500'
                  )}
                />
                {errors.email && (
                  <p className="absolute -bottom-6 left-0 text-xs text-red-400 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                  variant === 'featured'
                    ? 'bg-white text-blue-700 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-red-400 flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.p>
            )}
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className={cn(
              'mt-6 text-xs',
              variant === 'featured' ? 'text-blue-200' : 'text-gray-400'
            )}
          >
            No spam, unsubscribe anytime. Read our Privacy Policy.
          </motion.p>
        </div>
      )}
    </motion.div>
  );
}