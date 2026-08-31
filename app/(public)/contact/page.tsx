import type { Metadata } from "next";
import ContactPageClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — Syntax Software Solutions",
  description: "Get in touch with Syntax Software Solutions. We'd love to hear about your project.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
