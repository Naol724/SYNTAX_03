'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 120);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.08 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* CSS animate-spin — no JS per frame */}
          <div className="w-8 h-8 rounded-full border-2 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
