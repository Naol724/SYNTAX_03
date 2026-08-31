"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, MessageSquare, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

const schema = z.object({
  sender_name: z.string().min(2, "Name must be at least 2 characters"),
  sender_email: z.string().email("Invalid email address"),
  sender_phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "syntaxsoftwaresolution@gmail.com", href: "mailto:syntaxsoftwaresolution@gmail.com" },
  { icon: Phone, label: "Phone", value: "+251 945 455 141", href: "tel:+251945455141" },
  { icon: MapPin, label: "Address", value: "Bole Dembel, Amir Complex, Addis Ababa", href: "#" },
  { icon: Clock, label: "Working Hours", value: "Mon–Fri: 8AM–6PM EAT", href: "#" },
];

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await api.messages.send(data);
      setSubmitted(true);
      reset();
      toast.success("Message sent! We'll get back to you soon.");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to send message. Please try again.");
    }
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="section-label">Contact Us</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mt-3 mb-4">
            Let's Build Something <span className="gradient-text">Great Together</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Get in Touch</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We're a full-stack software company based in Addis Ababa, Ethiopia. Whether you need a website, mobile app, or enterprise solution — we're here to help.
              </p>
            </div>

            <div className="space-y-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { label: "GitHub", href: "https://github.com/SYTAXSOFTWARESOLUTIONS" },
                  { label: "LinkedIn", href: "https://linkedin.com/company/syntax-software-solutions" },
                  { label: "Instagram", href: "https://instagram.com/syntax.software.solution" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-3">
            {submitted ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-10 rounded-3xl bg-muted/50 border border-border">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground text-sm mb-6">We've received your message and will reply within 24 hours.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" /> Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5">
                <h2 className="text-lg font-bold text-foreground mb-2">Send a Message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="sender_name">Your Name *</Label>
                    <Input id="sender_name" {...register("sender_name")} placeholder="John Smith" className={errors.sender_name ? "border-red-500" : ""} />
                    {errors.sender_name && <p className="text-xs text-red-500">{errors.sender_name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sender_email">Email Address *</Label>
                    <Input id="sender_email" type="email" {...register("sender_email")} placeholder="john@company.com" className={errors.sender_email ? "border-red-500" : ""} />
                    {errors.sender_email && <p className="text-xs text-red-500">{errors.sender_email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="sender_phone">Phone (optional)</Label>
                    <Input id="sender_phone" {...register("sender_phone")} placeholder="+251 9XX XXX XXX" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" {...register("subject")} placeholder="Project Inquiry" className={errors.subject ? "border-red-500" : ""} />
                    {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" rows={5} {...register("message")} placeholder="Tell us about your project, goals, and timeline..." className={errors.message ? "border-red-500" : ""} />
                  {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full gap-2 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                </Button>
                <p className="text-xs text-center text-muted-foreground">We typically respond within 24 hours on business days.</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
