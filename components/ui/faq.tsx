'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { cn } from './motion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items?: FAQItem[];
  className?: string;
  variant?: 'default' | 'bordered' | 'card';
}

const faqData: FAQItem[] = [
  {
    question: 'What services does Syntax Software Solutions offer?',
    answer: 'We offer a comprehensive range of services including Website Development (Next.js & React), Mobile Applications (React Native), Gaming Platforms, Enterprise Systems (POS, Inventory, ERP), Bot Development (Telegram & AI chatbots), UI/UX Design, Cloud & DevOps, and ongoing Support & Maintenance.',
  },
  {
    question: 'How long does it typically take to complete a project?',
    answer: 'Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex enterprise applications may take 2-6 months. We provide detailed timelines during our initial consultation and maintain transparent communication throughout the development process.',
  },
  {
    question: 'Do you provide ongoing maintenance and support?',
    answer: 'Yes! We offer 24/7 support packages that include bug fixes, security updates, performance monitoring, and feature enhancements. Our team remains committed to your project long after the initial launch.',
  },
  {
    question: 'What is your development process?',
    answer: 'Our process follows four key phases: Discovery (requirements gathering and planning), Design (wireframes and mockups), Build (agile sprint development with regular demos), and Launch & Support (deployment and ongoing maintenance).',
  },
  {
    question: 'How much do your services cost?',
    answer: 'Our pricing varies based on project scope and complexity. We work with budgets ranging from under $5K to $100K+. We provide detailed quotes after understanding your specific requirements during our free consultation.',
  },
  {
    question: 'Do you work with international clients?',
    answer: 'Absolutely! While based in Addis Ababa, Ethiopia, we serve clients globally. We have experience working with clients across East Africa, Europe, North America, and the Middle East.',
  },
];

export function FAQ({ items = faqData, className = '', variant = 'default' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const variants = {
    default: 'max-w-3xl mx-auto',
    bordered: 'max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700',
    card: 'grid md:grid-cols-2 gap-6',
  };

  return (
    <div className={cn(variants[variant], className)}>
      {items.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => toggleIndex(index)}
          variant={variant}
        />
      ))}
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  variant?: 'default' | 'bordered' | 'card';
}

function FAQItem({ question, answer, isOpen, onClick, variant = 'default' }: FAQItemProps) {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700',
    bordered: 'py-6 border-b border-gray-100 dark:border-gray-800 last:border-0',
    card: 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700',
  };

  const contentClasses = {
    default: 'px-6 pb-6',
    bordered: 'px-0 pb-6',
    card: 'px-6 pb-6',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(variantClasses[variant], variant === 'bordered' ? '' : 'mb-4 last:mb-0')}
    >
      <motion.button
        onClick={onClick}
        className={cn(
          'w-full flex items-center justify-between text-left p-6 focus:outline-none',
          variant === 'bordered' && 'px-0 py-6'
        )}
        whileHover={{ scale: 1.001 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="font-semibold text-gray-900 dark:text-white pr-4">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
            isOpen
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn('overflow-hidden', contentClasses[variant])}
          >
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Simple FAQ section for home page
export function FAQSection() {
  return (
    <section className="py-20 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-label">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Find answers to common questions about our services, process, and pricing.
          </p>
        </motion.div>

        <FAQ />
      </div>
    </section>
  );
}