'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Facebook, Instagram, Twitter, Send, Globe } from 'lucide-react';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
  color: string;
  hoverColor: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: <Github className="w-5 h-5" />,
    href: 'https://github.com/SYTAXSOFTWARESOLUTIONS',
    label: 'GitHub',
    color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    hoverColor: 'hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900',
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    href: 'https://linkedin.com/company/syntax-software-solutions',
    label: 'LinkedIn',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    hoverColor: 'hover:bg-blue-600 hover:text-white',
  },
  {
    icon: <Facebook className="w-5 h-5" />,
    href: 'https://facebook.com/syntaxsoftware',
    label: 'Facebook',
    color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    hoverColor: 'hover:bg-indigo-600 hover:text-white',
  },
  {
    icon: <Instagram className="w-5 h-5" />,
    href: 'https://instagram.com/syntax.software.solution',
    label: 'Instagram',
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
    hoverColor: 'hover:bg-pink-600 hover:text-white',
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    href: 'https://twitter.com/syntaxsoftware',
    label: 'X (Twitter)',
    color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
    hoverColor: 'hover:bg-sky-600 hover:text-white',
  },
  {
    icon: <Send className="w-5 h-5" />,
    href: 'https://t.me/syntaxsoftware',
    label: 'Telegram',
    color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
    hoverColor: 'hover:bg-cyan-600 hover:text-white',
  },
];

interface SocialIconsProps {
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'rounded';
}

const sizeClasses = {
  sm: { icon: 'w-4 h-4', container: 'w-8 h-8' },
  md: { icon: 'w-5 h-5', container: 'w-10 h-10' },
  lg: { icon: 'w-6 h-6', container: 'w-12 h-12' },
};

const variantClasses = {
  default: 'rounded-xl',
  minimal: 'rounded-full',
  rounded: 'rounded-2xl',
};

export function SocialIcons({
  size = 'md',
  showLabels = false,
  className = '',
  variant = 'default',
}: SocialIconsProps) {
  const { icon: iconSize, container: containerSize } = sizeClasses[size];
  const roundedClass = variantClasses[variant];

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-flex items-center justify-center ${containerSize} ${roundedClass} ${social.color} ${social.hoverColor} transition-all duration-300`}
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  );
}

// Compact social bar for footer
export function SocialBar({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 ${className}`}
    >
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          whileHover={{ scale: 1.1, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-9 h-9 inline-flex items-center justify-center rounded-lg ${social.color} ${social.hoverColor} transition-all duration-200`}
        >
          {social.icon}
        </motion.a>
      ))}
    </motion.div>
  );
}

// Social proof section
interface SocialProofProps {
  logos?: Array<{ name: string; icon?: React.ReactNode }>;
  text?: string;
}

export function SocialProof({ logos, text = 'Trusted by companies worldwide' }: SocialProofProps) {
  return (
    <div className="py-8 border-y border-gray-100 dark:border-gray-800">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6"
      >
        {text}
      </motion.p>
      <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
        {/* Company logos as placeholders */}
        {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'].map((company, index) => (
          <motion.span
            key={company}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-lg font-bold text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            {company}
          </motion.span>
        ))}
      </div>
    </div>
  );
}