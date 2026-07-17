'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe, Smartphone, Gamepad2, Building2, Bot, Palette,
  Cloud, Headset, ArrowRight, CheckCircle, Zap, Target,
  Shield, Clock, Star, Users, ChevronRight, Lightbulb,
  Server, Terminal, PenTool, Bug, Gauge, RefreshCw
} from "lucide-react";
import {
  FadeInUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem,
  PageTransition, HoverCard
} from "@/components/ui/motion";
import { TestimonialsGrid } from "@/components/ui/testimonials";
import { FAQSection } from "@/components/ui/faq";
import { ContactCTA } from "@/components/ui/cta";
import { Newsletter } from "@/components/ui/newsletter";

// Services data from company intelligence report
const services = [
  {
    id: "website",
    icon: <Globe className="w-7 h-7" />,
    title: "Website Development",
    tagline: "Modern, responsive websites built with modern frameworks",
    description: "High-performance websites and web applications that drive results. From business sites to complex web apps, we deliver solutions that look great and perform even better.",
    features: ["Next.js & React", "Responsive Design", "SEO Optimization", "CMS Integration", "E-commerce Solutions", "Performance Tuning"],
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
  },
  {
    id: "mobile",
    icon: <Smartphone className="w-7 h-7" />,
    title: "Mobile Applications",
    tagline: "Native and cross-platform mobile apps",
    description: "Deliver seamless user experiences on iOS and Android with React Native. We build apps that engage users and drive business growth.",
    features: ["React Native Development", "iOS & Android", "Push Notifications", "Offline Support", "App Store Deployment", "UI/UX Design"],
    color: "violet",
    gradient: "from-blue-600 to-indigo-600",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "gaming",
    icon: <Gamepad2 className="w-7 h-7" />,
    title: "Gaming Platforms",
    tagline: "Real-time multiplayer gaming experiences",
    description: "Custom bingo callers, lottery systems, and interactive gaming platforms with real-time capabilities and admin dashboards.",
    features: ["Real-Time Systems", "Admin Dashboards", "Payment Integration", "Multi-Player Support", "Live Scoring", "Analytics"],
    color: "green",
    gradient: "from-indigo-500 to-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
  },
  {
    id: "enterprise",
    icon: <Building2 className="w-7 h-7" />,
    title: "Enterprise Systems",
    tagline: "End-to-end business management solutions",
    description: "Streamline your operations with custom software including POS, inventory management, HR systems, and comprehensive ERP solutions.",
    features: ["Restaurant POS", "Inventory Control", "Rental Management", "Debt Tracking", "HR Systems", "ERP Integration"],
    color: "orange",
    gradient: "from-blue-700 to-indigo-700",
    iconBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  },
  {
    id: "bots",
    icon: <Bot className="w-7 h-7" />,
    title: "Bot Development",
    tagline: "Intelligent automation with Telegram bots and AI",
    description: "Automate customer service, orders, and internal workflows with intelligent Telegram bots and AI-powered chatbots.",
    features: ["Telegram Bots", "AI Chatbots", "Order Automation", "Customer Support", "Payment Integration", "Analytics"],
    color: "cyan",
    gradient: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
  },
  {
    id: "design",
    icon: <Palette className="w-7 h-7" />,
    title: "UI/UX Design",
    tagline: "User-centered design that combines aesthetics with usability",
    description: "Create interfaces people love to use. From research and wireframes to high-fidelity prototypes and design systems.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Mobile Design", "Web Design"],
    color: "pink",
    gradient: "from-indigo-600 to-blue-700",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "cloud",
    icon: <Cloud className="w-7 h-7" />,
    title: "Cloud & DevOps",
    tagline: "Scalable infrastructure and deployment automation",
    description: "Build reliable, scalable applications with modern cloud infrastructure, CI/CD pipelines, and deployment automation.",
    features: ["AWS & Firebase", "Docker", "CI/CD Pipelines", "24/7 Monitoring", "Security Updates", "Performance Optimization"],
    color: "indigo",
    gradient: "from-indigo-500 to-blue-600",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "support",
    icon: <Headset className="w-7 h-7" />,
    title: "Support & Maintenance",
    tagline: "Ongoing support for your digital products",
    description: "Keep your software running smoothly with 24/7 support, security updates, performance monitoring, and continuous improvements.",
    features: ["24/7 Support", "Security Audits", "Performance Tuning", "Feature Updates", "Bug Fixes", "Monitoring"],
    color: "red",
    gradient: "from-slate-600 to-blue-700",
    iconBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  },
];

// Process steps
const process = [
  { step: "01", title: "Discovery", desc: "We learn your business goals, users, and requirements in a focused kickoff session." },
  { step: "02", title: "Design", desc: "Wireframes and high-fidelity mockups reviewed and approved before any code is written." },
  { step: "03", title: "Build", desc: "Agile sprint development with regular demos, clean code, and security reviews." },
  { step: "04", title: "Launch", desc: "Full deployment, handover, and ongoing 24/7 support after go-live." },
];

// Commitments
const commitments = [
  { icon: <Shield className="w-5 h-5" />, text: "Cybersecurity audit on every project" },
  { icon: <Target className="w-5 h-5" />, text: "Full product lifecycle ownership" },
  { icon: <CheckCircle className="w-5 h-5" />, text: "Clean, documented, maintainable code" },
  { icon: <Clock className="w-5 h-5" />, text: "24/7 post-launch support available" },
  { icon: <Zap className="w-5 h-5" />, text: "Agile sprints with regular demos" },
  { icon: <Users className="w-5 h-5" />, text: "Not a body shop — full team attention" },
];

export default function Services() {
  return (
    <PageTransition>
      {/* Hero Section with Static Developer Background */}
      <section className="relative text-white py-32 overflow-hidden min-h-[70vh] flex items-center">
        {/* Static Background Image (No Parallax) */}
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/images/developer-close.jpg)',
            }}
          />
          {/* More Transparent Blue Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/75 via-blue-900/70 to-blue-800/75" />
          
          {/* Lighter Animated Glow Effects */}
          <div className="absolute right-0 bottom-0 w-96 h-64 bg-blue-400/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </motion.div>

        {/* Dot Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 z-10 dot-grid" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/10"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">8 Core Services</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
            >
              Our Services
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed"
            >
              Full product lifecycle — from discovery and design through development, deployment, and long-term support. Building digital products that drive business growth.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative z-20 py-24 bg-white/15 dark:bg-gray-950/15 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">
              <Target className="w-3.5 h-3.5" /> What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
              Complete Software Solutions
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              From concept to launch and beyond — we offer end-to-end development services for businesses of all sizes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                id={service.id}
                className="scroll-mt-32"
              >
                <div className="group glass-card-hover-premium p-8 rounded-3xl h-full">
                  {/* Header */}
                  <div className="flex items-start gap-5 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.iconBg} shadow-lg`}
                    >
                      {service.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features with enhanced styling */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced CTA Button */}
                  <Link href="/contact">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`ripple-button inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${service.gradient} text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">
              <Target className="w-3.5 h-3.5" /> Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
              How We Work
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Agile, transparent, and delivery-focused. Every project gets full team attention.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
            {process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-sm sm:text-base md:text-lg lg:text-xl shadow-lg sm:shadow-xl shadow-blue-500/25 mb-2 sm:mb-4 md:mb-6 z-10">
                  {step.step}
                </div>

                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800" />
                )}

                <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-2">{step.title}</h4>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-snug sm:leading-relaxed px-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="section-label">
              <Shield className="w-3.5 h-3.5" /> Our Commitment
            </span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              What Every Project Gets
            </h2>
          </motion.div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-3xl p-8 sm:p-10 border border-blue-100 dark:border-blue-800/50">
            <div className="grid sm:grid-cols-2 gap-4">
              {commitments.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-label">
              <Star className="w-3.5 h-3.5" /> Client Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
          </motion.div>

          <TestimonialsGrid columns={3} />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Newsletter */}
      <section className="py-24 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Newsletter
            title="Tech Insights Delivered"
            description="Get the latest updates on technology trends, our projects, and company news."
            variant="featured"
          />
        </div>
      </section>

      {/* CTA */}
      <ContactCTA />
    </PageTransition>
  );
}