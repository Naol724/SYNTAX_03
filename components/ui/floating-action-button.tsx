'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

export function FloatingActionButton() {
  const [showScroll, setShowScroll] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {showActions && (
          <>
            {/* Contact Actions */}
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                href="/contact"
                className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all group"
              >
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 pr-2">
                  Contact Us
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ delay: 0.05 }}
            >
              <a
                href="tel:+251945455141"
                className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all group"
              >
                <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 pr-2">
                  Call Now
                </span>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setShowActions(!showActions)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          showActions
            ? 'bg-gray-700 dark:bg-gray-600 rotate-45'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}
      >
        <motion.div
          animate={{ rotate: showActions ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {showActions ? (
            <div className="w-6 h-0.5 bg-white rounded-full" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <ArrowUp className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
