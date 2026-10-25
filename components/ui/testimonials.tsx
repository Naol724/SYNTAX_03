'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Loader2 } from 'lucide-react';
import { initialsFromName, usePublicList } from '@/lib/use-public-content';

type ApiTestimonial = {
  _id: string;
  name: string;
  company?: string;
  content: string;
  rating?: number;
  image?: string;
  active?: boolean;
  featured?: boolean;
};

type ViewTestimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  stars: number;
  initials: string;
};

function toView(t: ApiTestimonial): ViewTestimonial {
  return {
    id: t._id,
    name: t.name,
    role: 'Client',
    company: t.company || '',
    quote: t.content,
    stars: Math.min(5, Math.max(1, Number(t.rating) || 5)),
    initials: initialsFromName(t.name),
  };
}

interface TestimonialCarouselProps {
  autoPlay?: boolean;
  interval?: number;
}

export function TestimonialCarousel({ autoPlay = true, interval = 5000 }: TestimonialCarouselProps) {
  const { items, loading } = usePublicList<ApiTestimonial>(
    '/api/public/testimonials',
    'testimonials'
  );
  const testimonials = items.map(toView);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [testimonials.length]);

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, testimonials.length, currentIndex]);

  const goToNext = () => {
    if (!testimonials.length) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    if (!testimonials.length) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!testimonials.length) {
    return (
      <p className="text-center text-gray-500 py-12">No testimonials yet.</p>
    );
  }

  const current = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
          className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <div className="flex gap-0.5 mb-4 sm:mb-6">
            {Array.from({ length: current.stars }).map((_, i) => (
              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed mb-6 sm:mb-8 italic">
            &ldquo;{current.quote}&rdquo;
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm sm:text-base font-bold">
              {current.initials}
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                {current.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {current.role}
                {current.company ? `, ${current.company}` : ''}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-1.5">
          {testimonials.map((t, index) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.button
            onClick={goToPrev}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
          <motion.button
            onClick={goToNext}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

interface TestimonialsGridProps {
  columns?: 2 | 3;
}

export function TestimonialsGrid({ columns = 3 }: TestimonialsGridProps) {
  const { items, loading } = usePublicList<ApiTestimonial>(
    '/api/public/testimonials',
    'testimonials'
  );
  const testimonials = items.map(toView);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!testimonials.length) {
    return <p className="text-center text-gray-500 py-8">No testimonials yet.</p>;
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : ''} gap-3 sm:gap-4 md:gap-6`}>
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative p-4 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute top-5 right-6 text-5xl font-black text-blue-100 dark:text-blue-900/30 leading-none select-none">
            &ldquo;
          </div>

          <div className="flex gap-0.5 mb-4">
            {Array.from({ length: testimonial.stars }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
            &ldquo;{testimonial.quote}&rdquo;
          </p>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {testimonial.initials}
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">
                {testimonial.name}
              </p>
              <p className="text-xs text-gray-400">
                {testimonial.role}
                {testimonial.company ? `, ${testimonial.company}` : ''}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
