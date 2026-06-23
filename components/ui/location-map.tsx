'use client';

import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function LocationMap() {
  return (
    <section className="relative py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-bold tracking-wide mb-6">
            <MapPin className="w-4 h-4" /> Our Location
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-4">
            Visit Our Office
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Located in the heart of Addis Ababa, Ethiopia. Come visit us or reach out anytime.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="glass-card-hover-premium group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Address</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Bole Dembel, Amir Commercial Complex<br />
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card-hover-premium group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    <a href="tel:+251945455141" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      +251 945 455 141
                    </a>
                    <br />
                    <a href="tel:+251940023840" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      +251 940 023 840
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card-hover-premium group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Email</h3>
                  <a
                    href="mailto:syntaxsoftwaresolution@gmail.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
                  >
                    syntaxsoftwaresolution@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card-hover-premium group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Business Hours</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 4:00 PM<br />
                    Sunday: Closed<br />
                    <span className="text-green-600 dark:text-green-400 font-semibold">24/7 Support Available</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="glass-card-premium overflow-hidden h-[600px] group">
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
