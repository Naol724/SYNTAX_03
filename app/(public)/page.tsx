'use client';



import Link from "next/link";

import {

  ArrowRight, Globe, Smartphone, Gamepad2, Building2, Bot, Cloud,

  CheckCircle, Star, Zap, Shield, Users, Award, Target, Eye,

  Code2, Lightbulb, Clock, BarChart3, Layers, Mail, Phone,

  MapPin, Calendar, ChevronRight

} from "lucide-react";

import { motion } from "framer-motion";

import { FadeInUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem } from "@/components/ui/motion";

import { AnimatedCounter, StatItem, StatsGrid } from "@/components/ui/counter";

import { SocialIcons, SocialBar } from "@/components/ui/social";

import { TestimonialCarousel } from "@/components/ui/testimonials";

import { Newsletter } from "@/components/ui/newsletter";

import { FAQSection } from "@/components/ui/faq";

import { ContactCTA } from "@/components/ui/cta";

import { ServicesMarquee } from "@/components/ui/services-marquee";

import { TechLogos } from "@/components/ui/tech-logos";

import { LocationMap } from "@/components/ui/location-map";



// Services data

const services = [

  {

    icon: <Globe className="w-6 h-6" />,

    title: "Website Development",

    desc: "Next.js & React websites with SEO optimization and CMS integration.",

    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",

    link: "/services#website"

  },

  {

    icon: <Smartphone className="w-6 h-6" />,

    title: "Mobile Applications",

    desc: "Cross-platform iOS & Android apps with React Native.",

    color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",

    link: "/services#mobile"

  },

  {

    icon: <Gamepad2 className="w-6 h-6" />,

    title: "Gaming Platforms",

    desc: "Real-time multiplayer bingo, lottery, and gaming systems.",

    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",

    link: "/services#gaming"

  },

  {

    icon: <Building2 className="w-6 h-6" />,

    title: "Enterprise Systems",

    desc: "POS, inventory, rental management, and debt tracking.",

    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",

    link: "/services#enterprise"

  },

  {

    icon: <Bot className="w-6 h-6" />,

    title: "Bot Development",

    desc: "Telegram bots and AI chatbots for automation.",

    color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",

    link: "/services#bots"

  },

  {

    icon: <Cloud className="w-6 h-6" />,

    title: "Cloud & DevOps",

    desc: "AWS, Firebase, Docker, and CI/CD pipelines.",

    color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",

    link: "/services#cloud"

  },

];



// Stats data

const stats = [

  { value: 50, label: "Projects Delivered", icon: <Award className="w-5 h-5" />, suffix: "+", color: "blue" },

  { value: 100, label: "Happy Clients", icon: <Users className="w-5 h-5" />, suffix: "+", color: "green" },

  { value: 5, label: "Years of Excellence", icon: <Star className="w-5 h-5" />, suffix: "+", color: "purple" },

  { value: 30, label: "Expert Developers", icon: <Zap className="w-5 h-5" />, suffix: "+", color: "orange" },

];



// Process steps

const processSteps = [

  { step: "01", title: "Discovery", desc: "We learn your business goals, users, and requirements." },

  { step: "02", title: "Design", desc: "Wireframes and high-fidelity mockups with your approval." },

  { step: "03", title: "Build", desc: "Agile sprint development with regular demos." },

  { step: "04", title: "Launch", desc: "Full deployment and 24/7 ongoing support." },

];



// Benefits/Why choose us

const benefits = [

  { icon: "🚀", title: "Fast Delivery", desc: "Websites in days, apps in weeks" },

  { icon: "🔒", title: "Always Secure", desc: "Security audit on every project" },

  { icon: "⭐", title: "Top Quality", desc: "Clean, documented, maintainable code" },

  { icon: "🤝", title: "Full Support", desc: "We stay with you long after launch" },

  { icon: "💡", title: "Innovation", desc: "Latest tech and creative solutions" },

  { icon: "⚡", title: "Efficiency", desc: "On-time delivery, no shortcuts" },

];



// Tech stack

const techStack = [

  "React", "Next.js", "TypeScript", "Node.js", "Python", "Java",

  "Laravel", "Spring Boot", "MongoDB", "PostgreSQL", "Docker", "AWS", "Firebase", "Tailwind CSS",

];



// Testimonials are imported from motion.tsx

const testimonials = [

  { name: "Abebe Kebede", role: "CEO, Ethio Tech Solutions", quote: "SYNTAX transformed our digital presence. 300% growth in online engagement!", stars: 5, initials: "AK" },

  { name: "Kebede Alemu", role: "CTO, Digital Ethiopia", quote: "Game-changer! Our mobile app increased user base by 250%.", stars: 5, initials: "KA" },

  { name: "Solomon Teklu", role: "Director, Ethiopian Finance Corp", quote: "Professionalism and technical skills unmatched in the Ethiopian market.", stars: 5, initials: "ST" },

];



// Page transition

export default function Home() {

  return (

    <>

      {/* Premium Hero Section with Fixed Cinematic Background */}

      <section className="relative text-white overflow-hidden h-screen flex items-center z-10">

        {/* Fixed Cinematic Background - Stays in place while content scrolls */}

        <div className="fixed inset-0 -z-10">

          <motion.div

            initial={{ scale: 1.1, opacity: 0 }}

            animate={{ scale: 1, opacity: 1 }}

            transition={{ duration: 1.5, ease: [0.6, 0.05, 0.01, 0.9] }}

            className="absolute inset-0"

          >

            <div

              className="absolute inset-0 bg-cover bg-center"

              style={{

                backgroundImage: 'url(/images/hero-workspace.jpg)',

                backgroundSize: 'cover',

                backgroundPosition: 'center',

                filter: 'brightness(0.7)',

              }}

            />

            

            {/* Cinematic Gradient Overlay */}

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

            

            {/* Premium Glow Effects */}

            <motion.div

              animate={{

                scale: [1, 1.2, 1],

                opacity: [0.3, 0.5, 0.3],

              }}

              transition={{

                duration: 8,

                repeat: Infinity,

                ease: "easeInOut"

              }}

              className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"

            />

            <motion.div

              animate={{

                scale: [1, 1.3, 1],

                opacity: [0.2, 0.4, 0.2],

              }}

              transition={{

                duration: 10,

                repeat: Infinity,

                ease: "easeInOut",

                delay: 2

              }}

              className="absolute bottom-0 left-1/3 w-[500px] h-80 bg-indigo-500/20 rounded-full blur-[120px]"

            />

          </motion.div>

        </div>



        {/* Floating Particles Effect */}

        <div className="fixed inset-0 -z-10 pointer-events-none">

          {[...Array(20)].map((_, i) => (

            <motion.div

              key={i}

              className="absolute w-1 h-1 bg-white/30 rounded-full"

              style={{

                left: `${Math.random() * 100}%`,

                top: `${Math.random() * 100}%`,

              }}

              animate={{

                y: [0, -30, 0],

                opacity: [0, 1, 0],

              }}

              transition={{

                duration: 3 + Math.random() * 4,

                repeat: Infinity,

                delay: Math.random() * 5,

              }}

            />

          ))}

        </div>



        {/* Content Container - Scrolls over fixed background */}

        <div className="relative z-20 w-full">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

            <div className="grid lg:grid-cols-2 gap-12 items-center">

              <motion.div

                initial={{ opacity: 0, y: 60 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9], delay: 0.2 }}

              >

                {/* Premium Floating Badge */}

                <motion.div

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}

                  whileHover={{ scale: 1.05, y: -2 }}

                  transition={{ delay: 0.4, duration: 0.6 }}

                  className="inline-flex items-center gap-3 glass-premium rounded-full px-6 py-3 mb-8 border border-white/20 hover:border-white/40 transition-all duration-500 shadow-2xl backdrop-blur-xl"

                >

                  <motion.span

                    animate={{ rotate: [0, 10, -10, 0] }}

                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}

                    className="text-2xl"

                  >

                    🇪🇹

                  </motion.span>

                  <span className="text-sm font-bold text-white/95 tracking-wide">

                    Founded 2019 • Addis Ababa, Ethiopia

                  </span>

                </motion.div>



                {/* Premium Animated Headline */}

                <motion.div

                  initial={{ opacity: 0, y: 40 }}

                  animate={{ opacity: 1, y: 0 }}

                  transition={{ delay: 0.5, duration: 0.8 }}

                >

                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-6">

                    <motion.span

                      initial={{ opacity: 0, y: 20 }}

                      animate={{ opacity: 1, y: 0 }}

                      transition={{ delay: 0.6 }}

                      className="block text-white text-shadow-premium"

                    >

                      Building the

                    </motion.span>

                    <motion.span

                      initial={{ opacity: 0, x: -20 }}

                      animate={{ opacity: 1, x: 0 }}

                      transition={{ delay: 0.8 }}

                      className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-2xl"

                    >

                      Digital Future

                    </motion.span>

                    <motion.span

                      initial={{ opacity: 0, y: 20 }}

                      animate={{ opacity: 1, y: 0 }}

                      transition={{ delay: 1 }}

                      className="block mt-2 text-white/80 text-shadow"

                    >

                      of Ethiopia.

                    </motion.span>

                  </h1>

                </motion.div>



                {/* Premium Subheadline */}

                <motion.p

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}

                  transition={{ delay: 1.2, duration: 0.8 }}

                  className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-xl leading-relaxed font-light"

                >

                  Full-stack software company delivering websites, mobile apps, gaming platforms, enterprise systems, and AI-powered bots — built to last.

                </motion.p>



                {/* Premium CTA Buttons with Magnetic Effect */}

                <motion.div

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}

                  transition={{ delay: 1.4 }}

                  className="flex flex-wrap gap-4"

                >

                  <motion.div

                    whileHover={{ scale: 1.05, y: -2 }}

                    whileTap={{ scale: 0.98 }}

                    transition={{ type: "spring", stiffness: 400, damping: 17 }}

                  >

                    <Link

                      href="/contact"

                      className="group relative inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 overflow-hidden"

                    >

                      <span className="relative z-10">Start Your Project</span>

                      <motion.span

                        whileHover={{ x: 3 }}

                        transition={{ type: "spring", stiffness: 400 }}

                        className="relative z-10"

                      >

                        <ArrowRight className="w-5 h-5" />

                      </motion.span>

                      {/* Animated Background */}

                      <motion.div

                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500"

                        initial={{ x: '-100%' }}

                        whileHover={{ x: 0 }}

                        transition={{ duration: 0.3 }}

                      />

                    </Link>

                  </motion.div>

                  

                  <motion.div

                    whileHover={{ scale: 1.05, y: -2 }}

                    whileTap={{ scale: 0.98 }}

                    transition={{ type: "spring", stiffness: 400, damping: 17 }}

                  >

                    <Link

                      href="/projects"

                      className="inline-flex items-center gap-3 glass-premium text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/30 hover:border-white/60 hover:bg-white/20 transition-all duration-500 shadow-xl backdrop-blur-xl"

                    >

                      View Our Work

                    </Link>

                  </motion.div>

                </motion.div>

              </motion.div>



              {/* Hero visual */}

              <motion.div

                initial={{ opacity: 0, x: 50 }}

                animate={{ opacity: 1, x: 0 }}

                transition={{ duration: 0.6, delay: 0.3 }}

                className="hidden lg:block"

              >

              <div className="relative">

                {/* Main card */}

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">

                  <div className="flex items-center gap-4 mb-6">

                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">

                      <Code2 className="w-6 h-6 text-white" />

                    </div>

                    <div>

                      <h3 className="font-bold text-white">Syntax Software</h3>

                      <p className="text-sm text-gray-300">Premium Development</p>

                    </div>

                  </div>



                  {/* Code-like visualization */}

                  <div className="space-y-3 font-mono text-sm">

                    <div className="flex items-center gap-2">

                      <span className="text-green-400">✓</span>

                      <span className="text-gray-300">Website Development</span>

                    </div>

                    <div className="flex items-center gap-2">

                      <span className="text-green-400">✓</span>

                      <span className="text-gray-300">Mobile Applications</span>

                    </div>

                    <div className="flex items-center gap-2">

                      <span className="text-green-400">✓</span>

                      <span className="text-gray-300">Enterprise Systems</span>

                    </div>

                    <div className="flex items-center gap-2">

                      <span className="text-green-400">✓</span>

                      <span className="text-gray-300">AI & Automation</span>

                    </div>

                    <div className="flex items-center gap-2">

                      <span className="text-green-400">✓</span>

                      <span className="text-gray-300">Cloud & DevOps</span>

                    </div>

                  </div>



                  {/* Floating badges */}

                  <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">

                    50+ Projects

                  </div>

                  <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">

                    5+ Years

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

        </div>



        {/* Scroll indicator */}

        <motion.div

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          transition={{ delay: 1 }}

          className="absolute bottom-8 left-1/2 -translate-x-1/2"

        >

          <motion.div

            animate={{ y: [0, 10, 0] }}

            transition={{ duration: 2, repeat: Infinity }}

            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"

          >

            <motion.div

              animate={{ y: [0, 12, 0] }}

              transition={{ duration: 2, repeat: Infinity }}

              className="w-1.5 h-1.5 rounded-full bg-white/60"

            />

          </motion.div>

        </motion.div>

      </section>



      {/* Services Marquee - Infinite Horizontal Scroll */}

      <div className="relative z-20">

        <ServicesMarquee />

      </div>



      {/* Stats Section with Glassmorphism */}

      <section className="relative z-20 py-20 bg-white/75 dark:bg-gray-950/75 backdrop-blur-lg overflow-hidden">

        <div className="absolute inset-0 opacity-30">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.08),transparent_50%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.08),transparent_50%)]" />

        </div>



        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {stats.map((stat, i) => (

              <motion.div

                key={stat.label}

                initial={{ opacity: 0, y: 20 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                transition={{ delay: i * 0.1 }}

                whileHover={{ y: -8, scale: 1.05 }}

                className="relative group"

              >

                <div className="relative p-8 rounded-3xl glass-card-hover-premium shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full text-center">

                  {/* Gradient Overlay */}

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

                  

                  {/* Icon */}

                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">

                    {stat.icon}

                  </div>

                  

                  {/* Value */}

                  <div className="relative">

                    <AnimatedCounter

                      value={stat.value}

                      suffix={stat.suffix}

                      className="text-4xl font-black text-gray-900 dark:text-white mb-2"

                    />

                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>

                  </div>



                  {/* Shine Effect */}

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>



      {/* Process Section with Premium Animations */}

      <section className="relative z-20 py-32 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl overflow-hidden">

        {/* Subtle Grid Background */}

        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 30 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center mb-20"

          >

            <motion.span

              initial={{ opacity: 0, scale: 0.9 }}

              whileInView={{ opacity: 1, scale: 1 }}

              viewport={{ once: true }}

              transition={{ delay: 0.2 }}

              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold tracking-wide mb-6"

            >

              <Target className="w-4 h-4" /> Our Process

            </motion.span>

            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6">

              How We Work

            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">

              Agile, transparent, and delivery-focused. Every project gets full team attention.

            </p>

          </motion.div>



          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">

            {processSteps.map((step, index) => (

              <motion.div

                key={step.step}

                initial={{ opacity: 0, y: 40 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                transition={{ delay: index * 0.2, duration: 0.6 }}

                className="relative"

              >

                <motion.div

                  className="text-center relative z-10"

                  whileHover={{ y: -5 }}

                  transition={{ type: "spring", stiffness: 300 }}

                >

                  {/* Premium Step Number */}

                  <motion.div

                    className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white font-black text-2xl shadow-2xl shadow-blue-500/30 mb-8"

                    whileHover={{ scale: 1.1, rotate: 5 }}

                    transition={{ type: "spring", stiffness: 400, damping: 10 }}

                  >

                    <span className="relative z-10">{step.step}</span>

                    {/* Animated Ring */}

                    <motion.div

                      className="absolute inset-0 rounded-3xl border-2 border-blue-400"

                      animate={{

                        scale: [1, 1.2, 1],

                        opacity: [0.5, 0, 0.5],

                      }}

                      transition={{

                        duration: 2,

                        repeat: Infinity,

                        delay: index * 0.3,

                      }}

                    />

                  </motion.div>



                  {/* Animated Connector Line */}

                  {index < processSteps.length - 1 && (

                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-1 z-0">

                      <motion.div

                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"

                        initial={{ scaleX: 0, originX: 0 }}

                        whileInView={{ scaleX: 1 }}

                        viewport={{ once: true }}

                        transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}

                      />

                      {/* Animated Dot */}

                      <motion.div

                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"

                        initial={{ left: '0%' }}

                        animate={{ left: ['0%', '100%', '0%'] }}

                        transition={{

                          duration: 3,

                          repeat: Infinity,

                          delay: index * 0.5,

                          ease: "linear"

                        }}

                      />

                    </div>

                  )}



                  <h3 className="font-black text-gray-900 dark:text-white text-xl mb-3">{step.title}</h3>

                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed px-2">{step.desc}</p>

                </motion.div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>



      {/* Why Choose Us Section with Premium Cards */}

      <section className="relative z-20 py-32 bg-white/85 dark:bg-gray-950/85 backdrop-blur-xl overflow-hidden">

        {/* Animated Background Pattern */}

        <div className="absolute inset-0 opacity-30">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.1),transparent_50%)]" />

        </div>



        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <motion.div

              initial={{ opacity: 0, x: -40 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              transition={{ duration: 0.7 }}

            >

              <motion.span

                initial={{ opacity: 0, scale: 0.9 }}

                whileInView={{ opacity: 1, scale: 1 }}

                viewport={{ once: true }}

                transition={{ delay: 0.2 }}

                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-bold tracking-wide mb-6"

              >

                <Shield className="w-4 h-4" /> Why Choose Us

              </motion.span>

              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">

                We Own Every Project From Start to Finish.

              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">

                We're not a body shop. Every project gets our full team's attention — agile planning, sprint delivery, cybersecurity audits, and long-term support. That's the Syntax way.

              </p>



              <ul className="space-y-5 mb-10">

                {[

                  { text: "Cybersecurity audit on every project", icon: Shield },

                  { text: "Agile sprints with regular demos", icon: Target },

                  { text: "Full product lifecycle support", icon: Clock },

                  { text: "24/7 post-launch availability", icon: Zap },

                  { text: "Clean, documented, maintainable code", icon: Code2 },

                ].map((item, index) => (

                  <motion.li

                    key={item.text}

                    initial={{ opacity: 0, x: -20 }}

                    whileInView={{ opacity: 1, x: 0 }}

                    viewport={{ once: true }}

                    transition={{ delay: index * 0.1 }}

                    className="flex items-start gap-4"

                  >

                    <motion.span

                      className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 shadow-sm"

                      whileHover={{ scale: 1.1, rotate: 5 }}

                      transition={{ type: "spring", stiffness: 400 }}

                    >

                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />

                    </motion.span>

                    <span className="text-gray-700 dark:text-gray-300 font-medium text-lg pt-1.5">{item.text}</span>

                  </motion.li>

                ))}

              </ul>



              <motion.div

                whileHover={{ scale: 1.05 }}

                whileTap={{ scale: 0.98 }}

              >

                <Link href="/about" className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:bg-blue-700 transition-all duration-300">

                  About Our Team <ArrowRight className="w-5 h-5" />

                </Link>

              </motion.div>

            </motion.div>



            <motion.div

              initial={{ opacity: 0, x: 40 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              transition={{ duration: 0.7 }}

              className="grid grid-cols-2 gap-6"

            >

              {benefits.map((benefit, index) => (

                <motion.div

                  key={benefit.title}

                  initial={{ opacity: 0, scale: 0.8 }}

                  whileInView={{ opacity: 1, scale: 1 }}

                  viewport={{ once: true }}

                  transition={{ delay: index * 0.1, duration: 0.5 }}

                  whileHover={{ y: -8, scale: 1.05 }}

                  className="relative group"

                >

                  <div className="relative p-8 rounded-3xl glass-card-hover-premium shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">

                    {/* Gradient Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/8 group-hover:to-purple-500/8 transition-all duration-500" />

                    

                    {/* Animated Icon */}

                    <motion.div

                      className="relative text-5xl mb-4"

                      animate={{ y: [0, -5, 0] }}

                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}

                    >

                      {benefit.icon}

                    </motion.div>

                    

                    <h4 className="relative font-black text-gray-900 dark:text-white text-lg mb-2">{benefit.title}</h4>

                    <p className="relative text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.desc}</p>



                    {/* Shine Effect */}

                    <motion.div

                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"

                      style={{ transform: 'skewX(-20deg)' }}

                    />

                  </div>

                </motion.div>

              ))}

            </motion.div>

          </div>

        </div>

      </section>



      {/* Tech Stack Section with Logo Cards */}

      <div className="relative z-20 bg-white dark:bg-gray-950">

        <TechLogos />

      </div>



      {/* Testimonials Section */}

      <section className="relative z-20 py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center mb-16"

          >

            <span className="section-label text-cyan-300">

              <Star className="w-3.5 h-3.5" /> Client Stories

            </span>

            <h2 className="text-3xl sm:text-4xl font-black mb-4">

              What Our Clients Say

            </h2>

            <p className="text-blue-100 max-w-2xl mx-auto">

              Real results from real businesses across Ethiopia and beyond.

            </p>

          </motion.div>



          <TestimonialCarousel />

        </div>

      </section>



      {/* Projects Preview Section with Zoom Effects */}

      <section className="relative z-20 py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 30 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center mb-20"

          >

            <motion.span

              initial={{ opacity: 0, scale: 0.9 }}

              whileInView={{ opacity: 1, scale: 1 }}

              viewport={{ once: true }}

              transition={{ delay: 0.2 }}

              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-bold tracking-wide mb-6"

            >

              <Layers className="w-4 h-4" /> Featured Work

            </motion.span>

            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6">

              Selected Projects

            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">

              A showcase of our work across healthcare, e-commerce, enterprise, and gaming.

            </p>

          </motion.div>



          {/* Premium project cards with hover effects */}

          <div className="grid md:grid-cols-3 gap-8 mb-16">

            {[

              { name: "Saron Orthopedic", category: "Healthcare", color: "red", icon: "🏥", gradient: "from-red-500 to-pink-500" },

              { name: "Dubai Furniture", category: "E-Commerce", color: "orange", icon: "🛋️", gradient: "from-orange-500 to-amber-500" },

              { name: "King Bingo", category: "Gaming", color: "green", icon: "🎰", gradient: "from-green-500 to-emerald-500" },

            ].map((project, index) => (

              <motion.div

                key={project.name}

                initial={{ opacity: 0, y: 30 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                transition={{ delay: index * 0.15, duration: 0.6 }}

              >

                <Link href="/projects">

                  <motion.div

                    className="group relative overflow-hidden rounded-3xl glass-card-hover-premium shadow-lg hover:shadow-2xl cursor-pointer"

                    whileHover={{ y: -12, scale: 1.02 }}

                    whileTap={{ scale: 0.98 }}

                    transition={{ type: "spring", stiffness: 300, damping: 20 }}

                  >

                    {/* Icon Container with Gradient */}

                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">

                      {/* Animated background gradient */}

                      <motion.div

                        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}

                      />

                      

                      {/* Large animated icon */}

                      <motion.div

                        className="text-8xl filter drop-shadow-2xl relative z-10"

                        animate={{ 

                          y: [0, -10, 0],

                          rotate: [0, 5, -5, 0]

                        }}

                        transition={{ 

                          duration: 4,

                          repeat: Infinity,

                          delay: index * 0.5

                        }}

                      >

                        {project.icon}

                      </motion.div>



                      {/* Floating particles */}

                      {[...Array(5)].map((_, i) => (

                        <motion.div

                          key={i}

                          className={`absolute w-2 h-2 bg-gradient-to-r ${project.gradient} rounded-full opacity-0 group-hover:opacity-60`}

                          style={{

                            left: `${20 + i * 15}%`,

                            top: `${30 + i * 10}%`,

                          }}

                          animate={{

                            y: [0, -20, 0],

                            opacity: [0, 0.6, 0],

                          }}

                          transition={{

                            duration: 2 + i * 0.5,

                            repeat: Infinity,

                            delay: i * 0.3,

                          }}

                        />

                      ))}

                    </div>



                    {/* Content */}

                    <div className="p-8">

                      <h3 className="font-black text-gray-900 dark:text-white text-2xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">

                        {project.name}

                      </h3>

                      <p className="text-base text-gray-600 dark:text-gray-400 mb-4">{project.category}</p>

                      

                      {/* Animated arrow */}

                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">

                        <span>View Project</span>

                        <motion.div

                          animate={{ x: [0, 5, 0] }}

                          transition={{ duration: 1.5, repeat: Infinity }}

                        >

                          <ArrowRight className="w-5 h-5" />

                        </motion.div>

                      </div>

                    </div>



                    {/* Premium shine effect */}

                    <motion.div

                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"

                      style={{ transform: 'skewX(-20deg)' }}

                    />

                  </motion.div>

                </Link>

              </motion.div>

            ))}

          </div>



          <motion.div

            initial={{ opacity: 0 }}

            whileInView={{ opacity: 1 }}

            viewport={{ once: true }}

            className="text-center"

          >

            <motion.div

              whileHover={{ scale: 1.05 }}

              whileTap={{ scale: 0.98 }}

            >

              <Link href="/projects" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl">

                View All Projects <ArrowRight className="w-5 h-5" />

              </Link>

            </motion.div>

          </motion.div>

        </div>

      </section>



      {/* Location Map Section */}

      <div className="relative z-20 bg-white dark:bg-gray-950">

        <LocationMap />

      </div>



      {/* FAQ Section */}

      <div className="relative z-20 bg-gray-50 dark:bg-gray-900">

        <FAQSection />

      </div>



      {/* Newsletter Section */}

      <section className="relative z-20 py-24 bg-gray-50 dark:bg-gray-900">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <Newsletter

            title="Stay Updated"

            description="Subscribe to our newsletter for the latest tech insights, company updates, and industry trends."

            variant="featured"

          />

        </div>

      </section>



      {/* CTA Section */}

      <div className="relative z-20">

        <ContactCTA />

      </div>

    </>

  );

}