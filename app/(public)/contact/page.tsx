"use client";



import { useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import { motion, AnimatePresence } from "framer-motion";

import {

  Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle,

  Github, Linkedin, Instagram, MessageSquare, ArrowRight,

  ChevronRight, Globe, Calendar, User, Building2, DollarSign

} from "lucide-react";

import {

  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,

} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {

  insertContactMessageSchema,

  type InsertContactMessage

} from "@/lib/schema";

import { apiRequest } from "@/lib/queryClient";

import {

  FadeInUp, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem,

  PageTransition, HoverCard

} from "@/components/ui/motion";

import { SocialBar } from "@/components/ui/social";

import { Newsletter } from "@/components/ui/newsletter";



// Contact info data

const contactInfo = [

  {

    icon: <MapPin className="w-5 h-5" />,

    label: "Address",

    value: "Bole Dembel, Amir Commercial Complex\nAddis Ababa, Ethiopia",

    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",

  },

  {

    icon: <Phone className="w-5 h-5" />,

    label: "Phone",

    value: "+251 945 455 141\n+251 940 023 840",

    color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",

  },

  {

    icon: <Mail className="w-5 h-5" />,

    label: "Email",

    value: "syntaxsoftwaresolution@gmail.com",

    color: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",

  },

  {

    icon: <Clock className="w-5 h-5" />,

    label: "Business Hours",

    value: "Mon–Fri: 8AM–6PM\nSat: 9AM–4PM\nSupport: 24/7",

    color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",

  },

];



// Social links data

const socialLinks = [

  {

    icon: <Github className="w-5 h-5" />,

    label: "GitHub",

    href: "https://github.com/SYTAXSOFTWARESOLUTIONS",

    color: "hover:bg-gray-900 hover:text-white",

  },

  {

    icon: <Linkedin className="w-5 h-5" />,

    label: "LinkedIn",

    href: "https://linkedin.com/company/syntax-software-solutions",

    color: "hover:bg-blue-600 hover:text-white",

  },

  {

    icon: <Instagram className="w-5 h-5" />,

    label: "Instagram",

    href: "https://instagram.com/syntax.software.solution",

    color: "hover:bg-blue-600 hover:text-white",

  },

];



// Project types for form

const projectTypes = [

  "Website Development",

  "Mobile Application",

  "Enterprise System",

  "Gaming Platform",

  "E-commerce",

  "Bot Development",

  "Custom Software",

  "UI/UX Design",

  "Cloud & DevOps",

  "Other",

];



// Budget ranges for form

const budgetRanges = [

  "Under $5,000",

  "$5,000 - $15,000",

  "$15,000 - $50,000",

  "$50,000 - $100,000",

  "$100,000+",

  "Not sure yet",

];



export default function Contact() {

  const [submitted, setSubmitted] = useState(false);



  const form = useForm<InsertContactMessage>({

    resolver: zodResolver(insertContactMessageSchema),

    defaultValues: { name: "", email: "", subject: "", message: "" },

  });



  const mutation = useMutation({

    mutationFn: async (data: InsertContactMessage) => {

      const res = await apiRequest("POST", "/api/contact", data);

      return res.json();

    },

    onSuccess: () => {

      setSubmitted(true);

      form.reset();

    },

  });



  const onSubmit = (data: InsertContactMessage) => {

    mutation.mutate(data);

  };



  return (

    <PageTransition>

      {/* Hero Section */}

      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 sm:py-24 md:py-32 overflow-hidden">

        {/* Background effects */}

        <div className="absolute inset-0">

          <div className="absolute right-1/4 top-1/3 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />

          <div className="absolute left-0 bottom-0 w-96 h-64 bg-blue-400/10 rounded-full blur-3xl" />

        </div>



        {/* Dot pattern */}

        <div className="absolute inset-0 opacity-20">

          <div className="absolute inset-0" style={{

            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',

            backgroundSize: '28px 28px'

          }} />

        </div>



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

              <MessageSquare className="w-4 h-4 text-blue-300" />

              <span className="text-sm font-medium">24-Hour Response Guaranteed</span>

            </motion.div>



            <motion.h1

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.08 }}

              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6"

            >

              Get In Touch

            </motion.h1>



            <motion.p

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.1 }}

              className="text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed"

            >

              Have a project in mind? We'd love to hear from you. Send us a message and we'll respond within 24 hours.

            </motion.p>

          </motion.div>

        </div>

      </section>



      {/* Contact Content */}

      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 md:gap-12">

            {/* Left: Contact Info */}

            <motion.div

              initial={{ opacity: 0, x: -30 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              className="lg:col-span-2 space-y-8"

            >

              <div>

                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">

                  Contact Information

                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">

                  Reach out through any of these channels. We're available Mon–Sat.

                </p>

              </div>



              {/* Contact details */}

              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-1 lg:gap-4">

                {contactInfo.map((item, index) => (

                  <motion.div

                    key={item.label}

                    initial={{ opacity: 0, y: 20 }}

                    whileInView={{ opacity: 1, y: 0 }}

                    viewport={{ once: true }}

                    transition={{ delay: index * 0.1 }}

                    className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200"

                  >

                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>

                      {item.icon}

                    </div>

                    <div>

                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">

                        {item.label}

                      </p>

                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-snug sm:leading-relaxed">

                        {item.value}

                      </p>

                    </div>

                  </motion.div>

                ))}

              </div>



              {/* Social Links */}

              <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">

                  Follow Us

                </p>

                <SocialBar />

              </div>



              {/* Quick response badge */}

              <motion.div

                initial={{ opacity: 0, y: 20 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-800"

              >

                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">

                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />

                </div>

                <div>

                  <p className="text-sm font-bold text-blue-700 dark:text-blue-300">

                    Fast Response

                  </p>

                  <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-0.5">

                    We respond to every inquiry within 24 hours on business days.

                  </p>

                </div>

              </motion.div>

            </motion.div>



            {/* Right: Contact Form */}

            <motion.div

              initial={{ opacity: 0, x: 30 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              className="lg:col-span-3"

            >

              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">

                {/* Form Header */}

                <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 md:pt-8 pb-4 sm:pb-5 md:pb-6 border-b border-gray-100 dark:border-gray-700">

                  <h2 className="text-base sm:text-lg md:text-xl font-black text-gray-900 dark:text-white">

                    Send Us a Message

                  </h2>

                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">

                    Fill in the details and we'll get back to you shortly.

                  </p>

                </div>



                {/* Form Content */}

                <div className="p-4 sm:p-6 md:p-8">

                  <AnimatePresence mode="wait">

                    {submitted ? (

                      <motion.div

                        key="success"

                        initial={{ opacity: 0, scale: 0.95 }}

                        animate={{ opacity: 1, scale: 1 }}

                        exit={{ opacity: 0, scale: 0.95 }}

                        className="text-center py-12"

                      >

                        <motion.div

                          initial={{ scale: 0 }}

                          animate={{ scale: 1 }}

                          transition={{ type: "spring", stiffness: 200, damping: 15 }}

                          className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/20"

                        >

                          <CheckCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />

                        </motion.div>

                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">

                          Message Sent! 🎉

                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 mb-2">

                          Thanks for reaching out to Syntax Software Solutions.

                        </p>

                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">

                          We'll get back to you within 24 hours.

                        </p>

                        <motion.button

                          onClick={() => setSubmitted(false)}

                          whileHover={{ scale: 1.02 }}

                          whileTap={{ scale: 0.97 }}

                          className="btn-outline"

                        >

                          Send Another Message

                        </motion.button>

                      </motion.div>

                    ) : (

                      <motion.div

                        key="form"

                        initial={{ opacity: 0 }}

                        animate={{ opacity: 1 }}

                        exit={{ opacity: 0 }}

                      >

                        {/* Error message */}

                        {mutation.isError && (

                          <motion.div

                            initial={{ opacity: 0, y: -10 }}

                            animate={{ opacity: 1, y: 0 }}

                            className="flex items-center gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-700 dark:text-red-400"

                          >

                            <AlertCircle className="w-5 h-5 flex-shrink-0" />

                            <span>Something went wrong. Please try again or email us directly.</span>

                          </motion.div>

                        )}



                        <Form {...form}>

                          <form

                            onSubmit={form.handleSubmit((d) => mutation.mutate(d))}

                            className="space-y-6"

                          >

                            {/* Name & Email */}

                            <div className="grid sm:grid-cols-2 gap-6">

                              <FormField

                                control={form.control}

                                name="name"

                                render={({ field }) => (

                                  <FormItem>

                                    <FormLabel className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">

                                      Full Name *

                                    </FormLabel>

                                    <FormControl>

                                      <div className="relative">

                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                        <Input

                                          placeholder="Abebe Kebede"

                                          className="pl-11 h-12 rounded-xl"

                                          {...field}

                                        />

                                      </div>

                                    </FormControl>

                                    <FormMessage className="text-xs" />

                                  </FormItem>

                                )}

                              />

                              <FormField

                                control={form.control}

                                name="email"

                                render={({ field }) => (

                                  <FormItem>

                                    <FormLabel className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">

                                      Email Address *

                                    </FormLabel>

                                    <FormControl>

                                      <div className="relative">

                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                        <Input

                                          type="email"

                                          placeholder="abebe@example.com"

                                          className="pl-11 h-12 rounded-xl"

                                          {...field}

                                        />

                                      </div>

                                    </FormControl>

                                    <FormMessage className="text-xs" />

                                  </FormItem>

                                )}

                              />

                            </div>



                            {/* Company & Phone (optional additional fields) */}

                            <div className="grid sm:grid-cols-2 gap-6">

                              <FormItem>

                                <FormLabel className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">

                                  Company Name

                                </FormLabel>

                                <FormControl>

                                  <div className="relative">

                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                    <Input

                                      placeholder="Your company name"

                                      className="pl-11 h-12 rounded-xl"

                                    />

                                  </div>

                                </FormControl>

                              </FormItem>

                              <FormItem>

                                <FormLabel className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">

                                  Phone Number

                                </FormLabel>

                                <FormControl>

                                  <div className="relative">

                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                    <Input

                                      type="tel"

                                      placeholder="+251 91 234 5678"

                                      className="pl-11 h-12 rounded-xl"

                                    />

                                  </div>

                                </FormControl>

                              </FormItem>

                            </div>



                            {/* Subject */}

                            <FormField

                              control={form.control}

                              name="subject"

                              render={({ field }) => (

                                <FormItem>

                                  <FormLabel className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">

                                    Project Type / Subject *

                                  </FormLabel>

                                  <FormControl>

                                    <div className="relative">

                                      <select

                                        className="w-full pl-4 pr-11 h-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"

                                      >

                                        <option value="">Select project type...</option>

                                        {projectTypes.map((type) => (

                                          <option key={type} value={type}>{type}</option>

                                        ))}

                                      </select>

                                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />

                                    </div>

                                  </FormControl>

                                  <FormMessage className="text-xs" />

                                </FormItem>

                              )}

                            />



                            {/* Budget Range */}

                            <FormItem>

                              <FormLabel className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">

                                Budget Range

                              </FormLabel>

                              <FormControl>

                                <div className="relative">

                                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                                  <select

                                    className="w-full pl-11 pr-11 h-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"

                                  >

                                    <option value="">Select budget range...</option>

                                    {budgetRanges.map((range) => (

                                      <option key={range} value={range}>{range}</option>

                                    ))}

                                  </select>

                                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />

                                </div>

                              </FormControl>

                            </FormItem>



                            {/* Message */}

                            <FormField

                              control={form.control}

                              name="message"

                              render={({ field }) => (

                                <FormItem>

                                  <FormLabel className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">

                                    Project Description *

                                  </FormLabel>

                                  <FormControl>

                                    <Textarea

                                      placeholder="Tell us about your project, goals, timeline, and any specific requirements..."

                                      rows={6}

                                      className="rounded-xl resize-none"

                                      {...field}

                                    />

                                  </FormControl>

                                  <FormMessage className="text-xs" />

                                </FormItem>

                              )}

                            />



                            {/* Submit Button */}

                            <motion.button

                              type="submit"

                              disabled={mutation.isPending}

                              whileHover={{ scale: 1.01 }}

                              whileTap={{ scale: 0.97 }}

                              className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"

                            >

                              {mutation.isPending ? (

                                <>

                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                                  Sending...

                                </>

                              ) : (

                                <>

                                  <Send className="w-4 h-4" />

                                  Send Message

                                </>

                              )}

                            </motion.button>



                            <p className="text-xs text-center text-gray-400">

                              By submitting this form, you agree to our Privacy Policy and Terms of Service.

                            </p>

                          </form>

                        </Form>

                      </motion.div>

                    )}

                  </AnimatePresence>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>



      {/* Map/Location Section */}

      <section className="relative z-20 py-20 bg-white/15 dark:bg-gray-950/15 backdrop-blur-lg">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center mb-12"

          >

            <span className="section-label">

              <Globe className="w-3.5 h-3.5" /> Visit Us

            </span>

            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">

              Our Location

            </h2>

            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">

              Located in the heart of Addis Ababa's business district.

            </p>

          </motion.div>



          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            transition={{ delay: 0.05 }}

            className="relative bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden h-[500px] shadow-2xl"

          >

            <iframe

              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.3174947725547!2d38.7862767!3d9.0295328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f3e2e8e17d%3A0x8a5e2e5e5e5e5e5e!2sBole%2C%20Addis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"

              width="100%"

              height="100%"

              style={{ border: 0 }}

              allowFullScreen

              loading="lazy"

              referrerPolicy="no-referrer-when-downgrade"

              className="w-full h-full"

              title="Syntax Software Solutions Office Location - Bole Dembel, Addis Ababa"

            />

          </motion.div>

        </div>

      </section>



      {/* FAQ Quick Links */}

      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            className="text-center mb-12"

          >

            <span className="section-label">

              <Calendar className="w-3.5 h-3.5" /> Quick Help

            </span>

            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">

              Common Questions

            </h2>

          </motion.div>



          <div className="grid md:grid-cols-2 gap-6">

            {[

              {

                q: "How long does a typical project take?",

                a: "Timelines vary by complexity. Simple websites take 2-4 weeks, while complex apps may take 2-6 months. We'll provide a detailed timeline during consultation.",

              },

              {

                q: "Do you provide ongoing support?",

                a: "Yes! We offer 24/7 support packages including bug fixes, security updates, and feature enhancements after launch.",

              },

              {

                q: "What is your pricing model?",

                a: "We work with budgets from $5K to $100K+. We provide detailed quotes after understanding your specific requirements.",

              },

              {

                q: "Do you work with international clients?",

                a: "Absolutely! While based in Ethiopia, we serve clients globally across East Africa, Europe, North America, and more.",

              },

            ].map((faq, index) => (

              <motion.div

                key={index}

                initial={{ opacity: 0, y: 20 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true }}

                transition={{ delay: index * 0.1 }}

                className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"

              >

                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{faq.q}</h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>



      {/* Newsletter */}

      <section className="py-20 bg-transparent">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <Newsletter

            title="Stay in the Loop"

            description="Get updates on our latest projects, tech insights, and company news delivered to your inbox."

            variant="featured"

          />

        </div>

      </section>

    </PageTransition>

  );

}