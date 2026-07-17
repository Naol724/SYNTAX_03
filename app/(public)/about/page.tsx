'use client';



import Link from "next/link";

import { motion } from "framer-motion";

import {

  ArrowRight, Target, Eye, Award, Code2, Users, MapPin,

  Zap, Shield, Lightbulb, Heart, Trophy, Calendar

} from "lucide-react";

import {

  FadeInUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem,

  PageTransition

} from "@/components/ui/motion";

import { StatsGrid } from "@/components/ui/counter";

import { TeamGrid } from "@/components/ui/team";

import { Newsletter } from "@/components/ui/newsletter";

import { ContactCTA } from "@/components/ui/cta";



// Timeline data from company intelligence report

const timeline = [

  { year: "2019", event: "Founded — Started as a small team with big dreams in Addis Ababa.", dot: "bg-blue-500" },

  { year: "2020", event: "First Gaming Platform — Launched the offline bingo caller system.", dot: "bg-indigo-500" },

  { year: "2021", event: "Expansion — Expanded into web development and enterprise solutions.", dot: "bg-blue-600" },

  { year: "2022", event: "Recognition — Became a leading software company in Ethiopia.", dot: "bg-indigo-600" },

  { year: "2023", event: "AI & Bots — Launched Telegram bots and AI-powered solutions.", dot: "bg-blue-600" },

  { year: "2024", event: "Global Reach — Now serving clients worldwide while rooted in Ethiopia.", dot: "bg-indigo-700" },

];



// Core values from company intelligence report

const values = [

  {

    icon: <Lightbulb className="w-6 h-6" />,

    title: "Innovation",

    desc: "Exploring new technologies and creative solutions to stay ahead of the curve.",

    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"

  },

  {

    icon: <Award className="w-6 h-6" />,

    title: "Quality",

    desc: "Rigorous testing and quality assurance on every project we deliver.",

    color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"

  },

  {

    icon: <Zap className="w-6 h-6" />,

    title: "Efficiency",

    desc: "On-time delivery without compromising on quality or attention to detail.",

    color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"

  },

  {

    icon: <Heart className="w-6 h-6" />,

    title: "Passion",

    desc: "We love what we do and it shows in every product we build.",

    color: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"

  },

];



// Stats data

const stats = [

  { value: "50+", label: "Projects Delivered", icon: <Trophy className="w-5 h-5" /> },

  { value: "100+", label: "Happy Clients", icon: <Users className="w-5 h-5" /> },

  { value: "5+", label: "Years Active", icon: <Calendar className="w-5 h-5" /> },

  { value: "30+", label: "Team Members", icon: <Users className="w-5 h-5" /> },

];



// Leadership team

const leadership = [

  { name: "Nathenal Teklay", role: "CEO & Co-Founder", initials: "NT", grad: "from-blue-500 to-blue-700", bio: "Leads business strategy, vision, and client relationships. Passionate about building Ethiopia's tech ecosystem." },

  { name: "Leulseged Lemma", role: "CTO & Co-Founder", initials: "LL", grad: "from-indigo-500 to-indigo-700", bio: "Oversees technical architecture and engineering standards. Full-stack expert with 10+ years experience." },

];



export default function About() {

  return (

    <PageTransition>

      {/* Hero Section with Static Office Background */}

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

              backgroundImage: 'url(/images/office-team.jpg)',

            }}

          />

          {/* More Transparent Gradient Overlay */}

          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/75 via-blue-950/70 to-indigo-950/75" />

          

          {/* Lighter Animated Glow Effects */}

          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse" />

          <div className="absolute left-1/2 bottom-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

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

              <MapPin className="w-4 h-4 text-blue-400" />

              <span className="text-sm font-medium">Bole Dembel, Addis Ababa • Est. 2019</span>

            </motion.div>



            <motion.h1

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.08 }}

              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight"

            >

              Building the Digital Future<br />

              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">

                of Ethiopia

              </span>

            </motion.h1>



            <motion.p

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.1 }}

              className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"

            >

              Product-led, design-driven, delivery-focused. We help businesses across Ethiopia and the world grow through world-class software.

            </motion.p>

          </motion.div>

        </div>

      </section>



      {/* Company Overview */}

      <section className="py-24 bg-white dark:bg-gray-950">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <motion.div

              initial={{ opacity: 0, x: -40 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              transition={{ duration: 0.2 }}

            >

              <span className="section-label">

                <Target className="w-3.5 h-3.5" /> Who We Are

              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-6">

                Not a Body Shop. A Real Software Partner.

              </h2>

              <div className="space-y-5 text-gray-600 dark:text-gray-400 leading-relaxed">

                <p>

                  Founded in 2019 in Addis Ababa, Syntax Software Solutions started with a mission to bridge the digital divide and bring world-class software to Ethiopian businesses. From a small team of passionate developers, we've grown into a comprehensive software house serving clients across healthcare, gaming, e-commerce, enterprise, and more.

                </p>

                <p>

                  Every project gets our full attention — from discovery and design through development, deployment, and long-term support. We run cybersecurity audits on everything we ship and follow agile methodologies with sprint-based delivery.

                </p>

                <p>

                  Our approach is transparent and collaborative: we plan carefully, communicate clearly, and deliver on time. We're not just code writers — we're your technology partner.

                </p>

              </div>



              <motion.div

                initial={{ opacity: 0, y: 20 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                transition={{ delay: 0.08 }}

                className="mt-8"

              >

                <Link href="/contact" className="btn-primary">

                  Work With Us <ArrowRight className="w-4 h-4" />

                </Link>

              </motion.div>

            </motion.div>



            <motion.div

              initial={{ opacity: 0, x: 40 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              transition={{ duration: 0.2, delay: 0.05 }}

            >

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/20">

                <div className="grid grid-cols-2 gap-6">

                  {stats.map((stat, index) => (

                    <motion.div

                      key={stat.label}

                      initial={{ opacity: 0, scale: 0.9 }}

                      whileInView={{ opacity: 1, scale: 1 }}

                      viewport={{ once: true }}

                      transition={{ delay: index * 0.1 }}

                      className="text-center p-5 rounded-2xl bg-white/10 backdrop-blur-sm"

                    >

                      <div className="text-3xl sm:text-4xl font-black mb-1">{stat.value}</div>

                      <div className="text-blue-200 text-sm font-medium">{stat.label}</div>

                    </motion.div>

                  ))}

                </div>

                <div className="border-t border-white/20 mt-6 pt-6 flex items-start gap-3">

                  <MapPin className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />

                  <div>

                    <p className="font-medium text-blue-100">Headquarters</p>

                    <p className="text-sm text-blue-200/80">Bole Dembel, Amir Commercial Complex<br />Addis Ababa, Ethiopia</p>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>



      {/* Mission & Vision */}

      <section className="py-24 bg-gray-50 dark:bg-gray-900">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center mb-16"

          >

            <span className="section-label">

              <Eye className="w-3.5 h-3.5" /> Our Direction

            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">

              Mission & Vision

            </h2>

            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">

              Guiding principles that shape everything we do at Syntax Software Solutions.

            </p>

          </motion.div>



          <div className="grid md:grid-cols-2 gap-8 mb-16">

            {/* Mission */}

            <motion.div

              initial={{ opacity: 0, y: 30 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}

              transition={{ delay: 0.1 }}

              className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"

            >

              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">

                <Target className="w-7 h-7" />

              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Our Mission</h3>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">

                To build modern software products for ambitious businesses. We design, develop, launch, and support digital systems that help organizations grow with confidence and achieve their goals.

              </p>

            </motion.div>



            {/* Vision */}

            <motion.div

              initial={{ opacity: 0, y: 30 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}

              transition={{ delay: 0.05 }}

              className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"

            >

              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">

                <Eye className="w-7 h-7" />

              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Our Vision</h3>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">

                To become the most trusted software partner for businesses in Ethiopia and East Africa — known for quality, reliability, exceptional results, and making a real impact on the local tech ecosystem.

              </p>

            </motion.div>

          </div>



          {/* Core Values Pillars */}

          <div className="flex flex-wrap justify-center gap-4">

            {["Innovation", "Quality", "Efficiency", "Passion"].map((pillar, index) => (

              <motion.div

                key={pillar}

                initial={{ opacity: 0, scale: 0.9 }}

                whileInView={{ opacity: 1, scale: 1 }}

                viewport={{ once: true }}

                transition={{ delay: index * 0.1 }}

                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-3.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-default"

              >

                <span className="text-xl">{index === 0 ? "💡" : index === 1 ? "✅" : index === 2 ? "⚡" : "🔥"}</span>

                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{pillar}</span>

              </motion.div>

            ))}

          </div>

        </div>

      </section>



      {/* Core Values Detail */}

      <section className="py-24 bg-white dark:bg-gray-950">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center mb-16"

          >

            <span className="section-label">

              <Award className="w-3.5 h-3.5" /> Core Values

            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">

              How We Operate

            </h2>

            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">

              Principles that guide every decision, every line of code, and every client interaction.

            </p>

          </motion.div>



          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">

            {values.map((value, index) => (

              <motion.div

                key={value.title}

                initial={{ opacity: 0, y: 30 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                transition={{ delay: index * 0.1 }}

                className="p-3 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"

              >

                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-5 ${value.color}`}>

                  {value.icon}

                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm md:text-lg mb-1 sm:mb-2">{value.title}</h3>

                <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-snug sm:leading-relaxed">{value.desc}</p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>



      {/* Timeline */}

      <section className="py-24 bg-gray-50 dark:bg-gray-900">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center mb-16"

          >

            <span className="section-label">

              <Calendar className="w-3.5 h-3.5" /> Our Journey

            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">

              From Dream to Reality

            </h2>

            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">

              Six years of growth, innovation, and delivering exceptional software solutions.

            </p>

          </motion.div>



          <div className="relative max-w-3xl mx-auto">

            {/* Vertical line */}

            <div className="absolute left-4 sm:left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-indigo-400 to-green-400 rounded-full" />

            

            <div className="space-y-8">

              {timeline.map((item, index) => (

                <motion.div

                  key={item.year}

                  initial={{ opacity: 0, x: -30 }}

                  whileInView={{ opacity: 1, x: 0 }}

                  viewport={{ once: true }}

                  transition={{ delay: index * 0.15 }}

                  className="relative flex items-start gap-3 sm:gap-5 md:gap-8 pl-12 sm:pl-16 md:pl-20"

                >

                  {/* Year badge */}

                  <div className={`absolute left-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl sm:rounded-2xl ${item.dot} flex items-center justify-center text-white font-black shadow-lg z-10`}>

                    <span className="text-[10px] sm:text-xs md:text-sm">{item.year.slice(2)}</span>

                  </div>



                  {/* Content */}

                  <div className="flex-1 min-w-0">

                    <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">{item.year}</div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">

                      <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 leading-snug sm:leading-relaxed">{item.event}</p>

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          </div>

        </div>

      </section>



      {/* Leadership Team */}

      <section className="py-24 bg-white dark:bg-gray-950">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center mb-16"

          >

            <span className="section-label">

              <Users className="w-3.5 h-3.5" /> Leadership

            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">

              Meet Our Founders

            </h2>

            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">

              Two visionaries leading Syntax Software Solutions to transform Ethiopia's digital landscape.

            </p>

          </motion.div>



          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {leadership.map((member, index) => (

              <motion.div

                key={member.name}

                initial={{ opacity: 0, y: 30 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                transition={{ delay: index * 0.2 }}

                className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300"

              >

                <div className="flex items-start gap-6">

                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.grad} flex items-center justify-center text-white text-2xl font-black shadow-lg flex-shrink-0`}>

                    {member.initials}

                  </div>

                  <div>

                    <h3 className="font-black text-gray-900 dark:text-white text-xl mb-1">{member.name}</h3>

                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">{member.role}</p>

                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{member.bio}</p>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>



      {/* Team Section */}

      <section className="py-24 bg-gray-50 dark:bg-gray-900">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center mb-16"

          >

            <span className="section-label">

              <Users className="w-3.5 h-3.5" /> Our Team

            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">

              The People Behind the Code

            </h2>

            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">

              A talented team of developers, designers, and engineers passionate about building exceptional software.

            </p>

          </motion.div>



          <TeamGrid columns={5} />



          <motion.div

            initial={{ opacity: 0 }}

            whileInView={{ opacity: 1 }}

            viewport={{ once: true }}

            transition={{ delay: 0.5 }}

            className="text-center mt-10"

          >

            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl px-6 py-3.5 text-sm text-blue-700 dark:text-blue-300 font-medium">

              <Users className="w-4 h-4" />

              Plus <span className="font-black mx-1">30+</span> developers across full-stack, mobile, backend & DevOps

            </div>

          </motion.div>

        </div>

      </section>



      {/* Community Engagement */}

      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <motion.div

              initial={{ opacity: 0, x: -30 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

            >

              <span className="section-label text-blue-300">

                <Heart className="w-3.5 h-3.5" /> Community

              </span>

              <h2 className="text-3xl sm:text-4xl font-black mb-6">

                Building More Than Software

              </h2>

              <p className="text-blue-100/90 text-lg leading-relaxed mb-8">

                Beyond software, Syntax Software Solutions believes in building community. The company fields an active football team that represents their commitment to teamwork, health, and social contribution.

              </p>

              <p className="text-blue-100/90 text-lg leading-relaxed">

                This reflects how we approach every project — with collaboration, dedication, and a focus on collective success. We believe that great teams create great software.

              </p>

            </motion.div>



            <motion.div

              initial={{ opacity: 0, x: 30 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              className="relative"

            >

              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">

                <div className="text-center">

                  <div className="text-6xl mb-4">⚽</div>

                  <h3 className="text-xl font-black mb-2">Syntax FC</h3>

                  <p className="text-blue-100/80 mb-6">Company Football Team</p>

                  

                  <div className="grid grid-cols-3 gap-4">

                    <div className="p-4 rounded-xl bg-white/10">

                      <div className="text-2xl font-black">2020</div>

                      <div className="text-xs text-blue-200">Founded</div>

                    </div>

                    <div className="p-4 rounded-xl bg-white/10">

                      <div className="text-2xl font-black">15+</div>

                      <div className="text-xs text-blue-200">Players</div>

                    </div>

                    <div className="p-4 rounded-xl bg-white/10">

                      <div className="text-2xl font-black">5</div>

                      <div className="text-xs text-blue-200">Trophies</div>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>



      {/* Contact CTA */}

      <ContactCTA />

    </PageTransition>

  );

}