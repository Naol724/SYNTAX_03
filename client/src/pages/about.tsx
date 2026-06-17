import { Link } from "wouter";
import { ArrowRight, Target, Eye, Award, Code2, Users, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const timeline = [
  { year: "2019", event: "Founded in Addis Ababa. Built our first offline desktop bingo caller app.", dot: "bg-blue-500" },
  { year: "2020", event: "Launched first real-time online gaming platform with multiplayer support.", dot: "bg-indigo-500" },
  { year: "2021", event: "Expanded into web development & enterprise solutions for Ethiopian businesses.", dot: "bg-violet-500" },
  { year: "2022", event: "Became a leading software company in Ethiopia with 30+ active developers.", dot: "bg-purple-500" },
  { year: "2023", event: "Launched Telegram bots and AI-powered automation solutions.", dot: "bg-blue-600" },
  { year: "2024", event: "Achieved global reach — serving clients worldwide from Addis Ababa.", dot: "bg-green-500" },
];

const values = [
  { icon: <Eye className="w-5 h-5" />, title: "Clarity over Complexity", desc: "We build systems that are easy to understand, maintain, and evolve.", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" },
  { icon: <Award className="w-5 h-5" />, title: "Ownership over Excuses", desc: "We take full responsibility for every project — no finger-pointing.", color: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400" },
  { icon: <Code2 className="w-5 h-5" />, title: "Craft over Shortcuts", desc: "Clean, tested, documented code. We never cut corners.", color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400" },
  { icon: <Users className="w-5 h-5" />, title: "Relationships That Matter", desc: "Long-term partnerships — not just one-time deliveries.", color: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" },
];

const team = [
  { name: "Nathenal Teklay", role: "Co-Founder & CEO", initials: "NT", bio: "Leads business strategy, vision, and client relationships.", grad: "from-blue-500 to-blue-700" },
  { name: "Leulseged Lemma", role: "Co-Founder & CTO", initials: "LL", bio: "Oversees technical architecture and engineering standards.", grad: "from-indigo-500 to-indigo-700" },
  { name: "Tsega", role: "Senior Developer", initials: "TS", bio: "Full-stack expert in scalable web & enterprise platforms.", grad: "from-violet-500 to-violet-700" },
  { name: "Nati", role: "Senior Developer", initials: "NA", bio: "Backend architect focused on API design & high-performance systems.", grad: "from-cyan-500 to-cyan-700" },
  { name: "Kiya", role: "Cybersecurity Specialist", initials: "KI", bio: "Penetration testing, data protection & security audits.", grad: "from-red-500 to-red-700" },
];

const pillars = [
  { label: "Innovation", emoji: "💡" },
  { label: "Quality", emoji: "✅" },
  { label: "Efficiency", emoji: "⚡" },
  { label: "Passion", emoji: "🔥" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-up">
            <div className="glass rounded-full inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium mb-7">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Addis Ababa, Ethiopia · Est. 2019
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
              About Syntax<br />
              <span className="gradient-text">Software Solutions</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Product-led, design-driven, delivery-focused. We help businesses across Ethiopia and the world grow through world-class software.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <p className="section-label"><Target className="w-3.5 h-3.5" /> Who We Are</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-6">
                Not a body shop.<br />A real software partner.
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                Founded in 2019 in Addis Ababa, Syntax Software Solutions started with a single offline bingo caller and has grown into a full-service software house with 30+ developers delivering projects worldwide.
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                Every project gets our full attention — from discovery and design through development, deployment, and long-term support. We run cybersecurity audits on everything we ship.
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Our approach is agile and sprint-based: we plan transparently, communicate clearly, and deliver on time.
              </p>
            </div>

            <div className="animate-fade-up delay-200">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/20">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "2019", label: "Founded" },
                    { value: "50+", label: "Projects" },
                    { value: "100+", label: "Clients" },
                    { value: "30+", label: "Developers" },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 rounded-2xl bg-white/10">
                      <div className="text-3xl font-black">{item.value}</div>
                      <div className="text-blue-200 text-sm mt-1 font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/20 mt-6 pt-5 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-100 text-sm">Bole Dembel, Amir Commercial Complex, Addis Ababa, Ethiopia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label"><Eye className="w-3.5 h-3.5" /> Our Direction</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Mission & Vision</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">Our Mission</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Help businesses grow by delivering software that solves real problems — built with modern tools, clear communication, and disciplined execution.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">Our Vision</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Become the most trusted software partner for businesses in Ethiopia and East Africa — known for quality, reliability, and results.
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="flex flex-wrap justify-center gap-3">
            {pillars.map((p) => (
              <div key={p.label} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3 shadow-sm hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 cursor-default">
                <span className="text-xl">{p.emoji}</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label"><Award className="w-3.5 h-3.5" /> Core Values</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">How We Operate</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Principles that guide every decision, every line of code, every client interaction.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div key={v.title} className={`group p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 card-hover animate-fade-up delay-${(i + 1) * 100}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${v.color}`}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">{v.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label">📅 History</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-gray-500 dark:text-gray-400">From one desktop app to a global software company.</p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-indigo-400 to-green-400 rounded-full" />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={item.year} className={`relative flex items-start gap-6 pl-20 animate-fade-up delay-${(i + 1) * 100}`}>
                  <div className={`absolute left-4 w-8 h-8 rounded-full ${item.dot} flex items-center justify-center text-white text-xs font-black shadow-lg`}>
                    {item.year.slice(2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">{item.year}</div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.event}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label"><Users className="w-3.5 h-3.5" /> Core Team</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">Meet the People Behind It</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Led by two founders, backed by 30+ developers across web, mobile, and DevOps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((m, i) => (
              <div key={m.name} className={`group p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 card-hover animate-fade-up delay-${(i + 1) * 100}`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.grad} flex items-center justify-center text-white text-lg font-black mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {m.initials}
                </div>
                <h3 className="font-black text-gray-900 dark:text-white">{m.name}</h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">{m.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl px-6 py-3.5 text-sm text-blue-700 dark:text-blue-300 font-medium">
              <Users className="w-4 h-4" />
              Plus <span className="font-black mx-1">30+</span> developers across full-stack, mobile, backend & DevOps
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-4">Ready to Work With Us?</h2>
          <p className="text-blue-100/90 mb-8">Let's discuss your project. We respond within 24 hours.</p>
          <Link href="/contact" className="btn-white text-base px-8 py-3">
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
