'use client';

import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactItems = [
  {
    icon: MapPin,
    title: "Address",
    content: <>Bole Dembel, Amir Commercial Complex<br />Addis Ababa, Ethiopia</>,
    gradient: "from-blue-500 to-blue-700",
  },
  {
    icon: Phone,
    title: "Phone",
    content: (
      <>
        <a href="tel:+251945455141" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">
          +251 945 455 141
        </a>
        <a href="tel:+251940023840" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">
          +251 940 023 840
        </a>
      </>
    ),
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    icon: Mail,
    title: "Email",
    content: (
      <a
        href="mailto:syntaxsoftwaresolution@gmail.com"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
      >
        syntaxsoftwaresolution@gmail.com
      </a>
    ),
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    icon: Clock,
    title: "Business Hours",
    content: (
      <>
        Monday - Friday: 8:00 AM - 6:00 PM<br />
        Saturday: 9:00 AM - 4:00 PM<br />
        Sunday: Closed<br />
        <span className="text-blue-600 dark:text-blue-400 font-semibold">24/7 Support Available</span>
      </>
    ),
    gradient: "from-blue-700 to-indigo-700",
  },
];

export function LocationMap() {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold tracking-wide mb-4 sm:mb-6">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Our Location
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4">
            Visit Our Office
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-2">
            Located in the heart of Addis Ababa, Ethiopia. Come visit us or reach out anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-1 lg:gap-4">
            {contactItems.map((item) => (
              <div key={item.title} className="glass-card-hover-premium group p-3 sm:p-4 lg:p-5">
                <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1">{item.title}</h3>
                    <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400 leading-snug sm:leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card-premium overflow-hidden h-[220px] sm:h-[350px] lg:h-[600px] group col-span-2 lg:col-span-1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.3174947725547!2d38.7862767!3d9.0295328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f3e2e8e17d%3A0x8a5e2e5e5e5e5e5e!2sBole%2C%20Addis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="group-hover:scale-105 transition-transform duration-700"
              title="Syntax Software Solutions Office Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
