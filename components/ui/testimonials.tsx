'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  location: string;
  project: string;
  quote: string;
  stars: number;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Abebe Kebede',
    role: 'CEO',
    company: 'Ethio Tech Solutions',
    location: 'Addis Ababa',
    project: 'E-commerce Platform',
    quote: 'SYNTAX transformed our digital presence with their innovative approach. Their expertise in web development helped us achieve 300% growth in online engagement.',
    stars: 5,
    initials: 'AK',
  },
  {
    name: 'Kebede Alemu',
    role: 'CTO',
    company: 'Digital Ethiopia',
    location: 'Bahir Dar',
    project: 'Mobile App',
    quote: 'Working with SYNTAX has been a game-changer. Their mobile app team delivered a solution that exceeded expectations and increased our user base by 250%.',
    stars: 5,
    initials: 'KA',
  },
  {
    name: 'Solomon Teklu',
    role: 'Director',
    company: 'Ethiopian Finance Corp',
    location: 'Addis Ababa',
    project: 'Enterprise System',
    quote: 'The enterprise solutions provided by SYNTAX significantly improved our operations. Their professionalism and technical skills are unmatched in the Ethiopian market.',
    stars: 5,
    initials: 'ST',
  },
];

interface TestimonialCarouselProps {
  autoPlay?: boolean;
  interval?: number;
}

export function TestimonialCarousel({ autoPlay = true, interval = 5000 }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-1 sm:px-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="absolute -top-4 sm:-top-6 left-4 sm:left-8 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 z-10">
            <Quote className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
          </div>

          <div className="p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl">
            <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4 md:mb-6">
              {Array.from({ length: testimonials[currentIndex].stars }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-amber-400 text-amber-400" />
                </motion.div>
              ))}
            </div>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4 sm:mb-6 md:mb-8">
              "{testimonials[currentIndex].quote}"
            </p>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-lg flex-shrink-0">
                {testimonials[currentIndex].initials}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate sm:whitespace-normal">
                  {testimonials[currentIndex].role}, {testimonials[currentIndex].company} • {testimonials[currentIndex].location}
                </p>
                <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 mt-0.5 font-medium">
                  Project: {testimonials[currentIndex].project}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-4 sm:mt-6 md:mt-8">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-600 w-6 sm:w-8'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-2 sm:w-2.5'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
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

// Static testimonials grid
interface TestimonialsGridProps {
  columns?: 2 | 3;
}

export function TestimonialsGrid({ columns = 3 }: TestimonialsGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : ''} gap-3 sm:gap-4 md:gap-6`}>
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative p-4 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          {/* Quote icon */}
          <div className="absolute top-5 right-6 text-5xl font-black text-blue-100 dark:text-blue-900/30 leading-none select-none">
            "
          </div>

          {/* Stars */}
          <div className="flex gap-0.5 mb-4">
            {Array.from({ length: testimonial.stars }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Quote */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
            "{testimonial.quote}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {testimonial.initials}
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">
                {testimonial.name}
              </p>
              <p className="text-xs text-gray-400">
                {testimonial.role}, {testimonial.company}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}