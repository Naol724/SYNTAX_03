'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ChevronRight, ArrowRight } from "lucide-react";
import { SocialBar } from "@/components/ui/social";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const services = [
  { href: "/services#website", label: "Website Development" },
  { href: "/services#mobile", label: "Mobile Applications" },
  { href: "/services#gaming", label: "Gaming Platforms" },
  { href: "/services#enterprise", label: "Enterprise Systems" },
  { href: "/services#bots", label: "Bot Development" },
  { href: "/services#cloud", label: "Cloud & DevOps" },
  { href: "/services#design", label: "UI/UX Design" },
  { href: "/services#support", label: "Support & Maintenance" },
];

/**
 * Professional site-wide footer — readable in light and dark mode.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="sm:col-span-2 lg:col-span-4"
          >
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:bg-blue-500 transition-colors">
                <span className="text-white font-bold text-lg leading-none">S</span>
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-slate-900 dark:text-white text-base tracking-tight">
                  Syntax Software
                </div>
                <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium tracking-[0.12em] uppercase">
                  Solutions
                </div>
              </div>
            </Link>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 max-w-md">
              Building the Digital Future of Ethiopia since 2019. A full-stack software company
              delivering websites, mobile apps, gaming platforms, enterprise systems, and AI-powered
              bots.
            </p>

            <div className="mb-6">
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] mb-3">
                Follow Us
              </p>
              <SocialBar />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/80">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                Ready to start?
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3.5">
                Get in touch and let&apos;s build something great.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-colors"
              >
                Contact Us <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="lg:col-span-2"
          >
            <h4 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] mb-4 sm:mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-blue-500 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <h4 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] mb-4 sm:mb-5">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-blue-500 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="sm:col-span-2 lg:col-span-3"
          >
            <h4 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] mb-4 sm:mb-5">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    Bole Dembel, Amir Commercial Complex
                    <br />
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    +251 945 455 141
                    <br />
                    +251 940 023 840
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:syntaxsoftwaresolution@gmail.com"
                    className="text-sm text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors break-all"
                  >
                    syntaxsoftwaresolution@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Hours
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    Mon–Fri: 8AM–6PM
                    <br />
                    Sat: 9AM–4PM · Support: 24/7
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
              © {currentYear} Syntax Software Solutions. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs sm:text-sm">
              <Link
                href="/privacy"
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Get Support
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-600">
              syntaxsoftwaresolution.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
