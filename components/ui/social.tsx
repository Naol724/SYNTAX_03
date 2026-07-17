'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Facebook, Instagram, Twitter, Send } from 'lucide-react';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

/** Shared brand styling for all social icons — blue / slate only */
const socialBase =
  'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white';

const socialLinks: SocialLink[] = [
  {
    icon: <Github className="w-5 h-5" />,
    href: 'https://github.com/SYTAXSOFTWARESOLUTIONS',
    label: 'GitHub',
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    href: 'https://linkedin.com/company/syntax-software-solutions',
    label: 'LinkedIn',
  },
  {
    icon: <Facebook className="w-5 h-5" />,
    href: 'https://facebook.com/syntaxsoftware',
    label: 'Facebook',
  },
  {
    icon: <Instagram className="w-5 h-5" />,
    href: 'https://instagram.com/syntax.software.solution',
    label: 'Instagram',
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    href: 'https://twitter.com/syntaxsoftware',
    label: 'X (Twitter)',
  },
  {
    icon: <Send className="w-5 h-5" />,
    href: 'https://t.me/syntaxsoftware',
    label: 'Telegram',
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
  const { container: containerSize } = sizeClasses[size];
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
          title={showLabels ? social.label : undefined}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`inline-flex items-center justify-center ${containerSize} ${roundedClass} ${socialBase} transition-all duration-300`}
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  );
}

export function SocialBar({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 ${className}`}
    >
      {socialLinks.map((social) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          whileHover={{ scale: 1.1, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-9 h-9 inline-flex items-center justify-center rounded-lg ${socialBase} transition-all duration-200`}
        >
          {social.icon}
        </motion.a>
      ))}
    </motion.div>
  );
}

interface SocialProofProps {
  logos?: Array<{ name: string; icon?: React.ReactNode }>;
  text?: string;
}

export function SocialProof({ logos, text = 'Trusted by companies worldwide' }: SocialProofProps) {
  return (
    <div className="py-8 border-y border-slate-100 dark:border-slate-800">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6"
      >
        {text}
      </motion.p>
      <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
        {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'].map((company, index) => (
          <motion.span
            key={company}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="text-sm font-semibold text-slate-500 dark:text-slate-400"
          >
            {company}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
