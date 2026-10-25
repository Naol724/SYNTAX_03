'use client';

import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, ArrowUpRight, Loader2 } from 'lucide-react';
import { cn } from './motion';
import { initialsFromName, usePublicList } from '@/lib/use-public-content';

type ApiMember = {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  active?: boolean;
};

interface TeamGridProps {
  columns?: 2 | 3 | 4 | 5;
  showFullTeam?: boolean;
}

const gradients = [
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-indigo-700',
  'from-blue-600 to-indigo-600',
  'from-indigo-500 to-blue-700',
  'from-slate-600 to-blue-800',
];

export function TeamGrid({ columns = 5, showFullTeam = true }: TeamGridProps) {
  const { items, loading } = usePublicList<ApiMember>('/api/public/team', 'teamMembers');

  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
  };

  const members = items.map((m, i) => ({
    id: m._id,
    name: m.name,
    role: m.role,
    bio: m.bio || '',
    initials: initialsFromName(m.name),
    gradient: gradients[i % gradients.length],
    linkedin: m.linkedin || undefined,
    github: m.github || undefined,
    email: m.email ? (m.email.startsWith('mailto:') ? m.email : `mailto:${m.email}`) : undefined,
  }));

  const displayMembers = showFullTeam ? members : members.slice(0, 4);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!displayMembers.length) {
    return <p className="text-center text-gray-500 py-8">No team members yet.</p>;
  }

  return (
    <div className={`grid ${columnClasses[columns]} gap-6`}>
      {displayMembers.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <div className="relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-center mb-5">
              <motion.div
                className={cn(
                  'w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-xl font-black shadow-lg',
                  member.gradient
                )}
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {member.initials}
              </motion.div>
            </div>

            <div className="text-center mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                {member.role}
              </p>
            </div>

            {member.bio ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-4">
                {member.bio}
              </p>
            ) : null}

            <div className="flex justify-center gap-2">
              {member.linkedin && (
                <motion.a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </motion.a>
              )}
              {member.github && (
                <motion.a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </motion.a>
              )}
              {member.email && (
                <motion.a
                  href={member.email}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </motion.a>
              )}
            </div>

            <motion.div
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function TeamPreview() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-label">Our Team</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Meet the Experts
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            A talented team of developers, designers, and engineers passionate about building exceptional software.
          </p>
        </motion.div>

        <TeamGrid columns={5} showFullTeam={false} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl px-6 py-3.5 text-sm text-blue-700 dark:text-blue-300 font-medium">
            <span>Plus</span>
            <span className="font-black text-lg">30+</span>
            <span>more developers across full-stack, mobile, backend & DevOps</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
