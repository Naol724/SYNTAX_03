'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Grid,
  Maximize2,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
}

interface GalleryProps {
  items: GalleryItem[];
  columns?: 1 | 2 | 3 | 4;
  gap?: 4 | 6 | 8;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Healthcare: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
  Corporate: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  'E-Commerce': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
  EdTech: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
  Gaming: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' },
  'Chatbot / Trading': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300' },
  All: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300' },
};

export function Gallery({ items, columns = 3, gap = 6 }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setSelectedIndex(null);
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (selectedIndex === null) return;
    const currentItems = filteredItems;
    let newIndex = direction === 'prev' ? selectedIndex - 1 : selectedIndex + 1;
    if (newIndex < 0) newIndex = currentItems.length - 1;
    if (newIndex >= currentItems.length) newIndex = 0;
    setSelectedIndex(newIndex);
  }, [selectedIndex, filteredItems]);

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div className="space-y-8">
      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {categories.map((category, index) => {
          const colors = categoryColors[category] || categoryColors.All;
          const isSelected = selectedCategory === category;

          return (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                ${isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : `${colors.bg} ${colors.text} hover:shadow-md hover:-translate-y-0.5`
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {category}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        layout
        className={`grid ${columnClasses[columns]} ${gapClasses[gap]}`}
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative"
            >
              <motion.div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => openLightbox(index)}
              >
                {/* Image placeholder with gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20
                  group-hover:from-blue-500/30 group-hover:to-indigo-600/30 transition-all duration-300`}
                />
                
                {/* Image or placeholder icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Maximize2 className="w-12 h-12 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[item.category]?.bg} ${categoryColors[item.category]?.text}`}>
                    {item.category}
                  </span>
                  <h4 className="text-white font-bold mt-2">{item.title}</h4>
                </div>

                {/* Zoom icon */}
                <motion.div
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Navigation */}
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
              className="absolute left-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-7 h-7 text-white" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
              className="absolute right-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-7 h-7 text-white" />
            </motion.button>

            {/* Image container */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[80vh] mx-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image placeholder */}
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/30 to-indigo-600/30 flex items-center justify-center">
                <Grid className="w-24 h-24 text-white/30" />
              </div>

              {/* Info */}
              <div className="absolute -bottom-16 left-0 right-0 text-center">
                <h3 className="text-white text-xl font-bold">{filteredItems[selectedIndex].title}</h3>
                <p className="text-gray-400 text-sm mt-1">{filteredItems[selectedIndex].category}</p>
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
              {selectedIndex + 1} / {filteredItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple gallery card without lightbox
interface GalleryCardProps {
  item: GalleryItem;
  onClick?: () => void;
}

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  const colors = categoryColors[item.category] || categoryColors.All;

  return (
    <motion.div
      className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20
        group-hover:from-blue-500/30 group-hover:to-indigo-600/30 transition-all duration-300`}
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <Grid className="w-12 h-12 text-white/30" />
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
          {item.category}
        </span>
        <h4 className="text-white font-bold mt-2">{item.title}</h4>
      </div>

      <motion.div
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
      >
        <ZoomIn className="w-5 h-5 text-white" />
      </motion.div>
    </motion.div>
  );
}