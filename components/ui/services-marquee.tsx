'use client';

import { Globe, Smartphone, Gamepad2, Building2, Bot, Cloud } from "lucide-react";

const services = [
  { icon: Globe, title: "Website Development", gradient: "from-blue-500 to-cyan-500" },
  { icon: Smartphone, title: "Mobile Applications", gradient: "from-violet-500 to-purple-500" },
  { icon: Gamepad2, title: "Gaming Platforms", gradient: "from-green-500 to-emerald-500" },
  { icon: Building2, title: "Enterprise Systems", gradient: "from-orange-500 to-amber-500" },
  { icon: Bot, title: "Bot Development", gradient: "from-cyan-500 to-blue-500" },
  { icon: Cloud, title: "Cloud & DevOps", gradient: "from-indigo-500 to-blue-500" },
];

export function ServicesMarquee() {
  // Duplicate services for seamless loop
  const duplicatedServices = [...services, ...services, ...services];

  return (
    <div className="relative overflow-hidden py-24 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold tracking-wide mb-6">
            Full-Stack Services
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-4">
            What We Build
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From MVPs to enterprise-grade systems — we cover the complete product lifecycle
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative group">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling Container */}
        <div className="flex gap-6 animate-marquee group-hover:[animation-play-state:paused]">
          {duplicatedServices.map((service, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[400px] glass-card-hover-premium group/card relative overflow-hidden"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover/card:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative flex items-center gap-6 p-8">
                {/* Icon */}
                <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-2xl group-hover/card:scale-110 transition-transform duration-500`}>
                  <service.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
                  {service.title}
                </h3>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/card:translate-x-[200%] transition-transform duration-1000" style={{ transform: 'skewX(-20deg)' }} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
