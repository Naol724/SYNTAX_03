'use client';

import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, ArrowUpRight } from 'lucide-react';
import { cn } from './motion';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  gradient: string;
  linkedin?: string;
  github?: string;
  email?: string;
}

interface TeamGridProps {
  columns?: 2 | 3 | 4 | 5;
  showFullTeam?: boolean;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Nathenal Teklay',
    role: 'Co-Founder & CEO',
    bio: 'Leads business strategy, vision, and client relationships. Passionate about building Ethiopia\'s tech ecosystem.',
    initials: 'NT',
    gradient: 'from-blue-500 to-blue-700',
    linkedin: 'https://linkedin.com/in/nathenaltek',
    email: 'mailto:nathenal@syntax.et',
  },
  {
    name: 'Leulseged Lemma',
    role: 'Co-Founder & CTO',
    bio: 'Oversees technical architecture and engineering standards. Full-stack expert with 10+ years experience.',
    initials: 'LL',
    gradient: 'from-indigo-500 to-indigo-700',
    linkedin: 'https://linkedin.com/in/leulsegedlemma',
    github: 'https://github.com/leulseged',
    email: 'mailto:leulseged@syntax.et',
  },
  {
    name: 'Tsega',
    role: 'Senior Developer',
    bio: 'Full-stack expert in scalable web & enterprise platforms. Specializes in React, Node.js, and cloud architecture.',
    initials: 'TS',
    gradient: 'from-blue-600 to-indigo-600',
    linkedin: 'https://linkedin.com/in/tsega',
  },
  {
    name: 'Nati',
    role: 'Senior Developer',
    bio: 'Backend architect focused on API design & high-performance systems. PostgreSQL and microservices specialist.',
    initials: 'NA',
    gradient: 'from-indigo-500 to-blue-700',
    github: 'https://github.com/nati',
  },
  {
    name: 'Kiya',
    role: 'Cybersecurity Specialist',
    bio: 'Penetration testing, data protection & security audits. Certified security professional protecting client assets.',
    initials: 'KI',
    gradient: 'from-slate-600 to-blue-800',
    linkedin: 'https://linkedin.com/in/kiya',
  },
];

export function TeamGrid({ columns = 5, showFullTeam = true }: TeamGridProps) {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
  };

  const displayMembers = showFullTeam ? teamMembers : teamMembers.slice(0, 4);

  return (
    <div className={`grid ${columnClasses[columns]} gap-6`}>
      {displayMembers.map((member, index) => (
        <motion.div
          key={member.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <div className="relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {/* Avatar */}
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

            {/* Name & Role */}
            <div className="text-center mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                {member.role}
              </p>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-4">
              {member.bio}
            </p>

            {/* Social Links */}
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

            {/* Hover arrow */}
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

// Team preview for home page
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
          <span className="section-label">
            Our Team
          </span>
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