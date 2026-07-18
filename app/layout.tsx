import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { OrganizationStructuredData, WebSiteStructuredData } from "@/components/seo/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});



export const metadata: Metadata = {

  metadataBase: new URL('https://syntaxsoftwaresolution.com'),

  title: {

    default: "Syntax Software Solutions — Building the Digital Future of Ethiopia",

    template: "%s | Syntax Software Solutions"

  },

  description: "Full-stack software company delivering websites, mobile apps, gaming platforms, enterprise systems, and AI-powered bots. Based in Addis Ababa, Ethiopia.",

  keywords: [

    "Software Development Ethiopia",

    "Web Development Addis Ababa",

    "Mobile App Development",

    "Enterprise Software",

    "Gaming Platforms",

    "AI Chatbots",

    "Full Stack Development",

    "Next.js Development",

    "React Native Apps",

    "Ethiopia Tech Company"

  ],

  authors: [{ name: "Syntax Software Solutions" }],

  creator: "Syntax Software Solutions",

  publisher: "Syntax Software Solutions",

  formatDetection: {

    email: false,

    address: false,

    telephone: false,

  },

  openGraph: {

    type: 'website',

    locale: 'en_US',

    url: 'https://syntaxsoftwaresolution.com',

    title: 'Syntax Software Solutions — Building the Digital Future of Ethiopia',

    description: 'Full-stack software company delivering websites, mobile apps, gaming platforms, enterprise systems, and AI-powered bots.',

    siteName: 'Syntax Software Solutions',

  },

  twitter: {

    card: 'summary_large_image',

    title: 'Syntax Software Solutions',

    description: 'Full-stack software company in Addis Ababa, Ethiopia',

  },

  robots: {

    index: true,

    follow: true,

    googleBot: {

      index: true,

      follow: true,

      'max-video-preview': -1,

      'max-image-preview': 'large',

      'max-snippet': -1,

    },

  },

  verification: {

    google: 'your-google-verification-code',

  },

};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <OrganizationStructuredData
          name="Syntax Software Solutions"
          url="https://syntaxsoftwaresolution.com"
          logo="https://syntaxsoftwaresolution.com/logo.png"
          description="Full-stack software company delivering websites, mobile apps, gaming platforms, enterprise systems, and AI-powered bots. Based in Addis Ababa, Ethiopia."
          address={{
            streetAddress: "Bole Dembel, Amir Commercial Complex",
            addressLocality: "Addis Ababa",
            addressRegion: "Addis Ababa",
            postalCode: "1000",
            addressCountry: "ET",
          }}
          contactPoint={{
            telephone: "+251 945 455 141",
            email: "syntaxsoftwaresolution@gmail.com",
            contactType: "customer service",
          }}
          sameAs={[
            "https://github.com/SYTAXSOFTWARESOLUTIONS",
            "https://linkedin.com/company/syntax-software-solutions",
            "https://instagram.com/syntax.software.solution",
          ]}
        />
        <WebSiteStructuredData
          name="Syntax Software Solutions"
          url="https://syntaxsoftwaresolution.com"
          description="Full-stack software company delivering websites, mobile apps, gaming platforms, enterprise systems, and AI-powered bots. Based in Addis Ababa, Ethiopia."
          potentialAction={{
            target: "https://syntaxsoftwaresolution.com/search?q={search_term_string}",
            queryInput: "required name=search_term_string",
          }}
        />
        <ThemeProvider defaultTheme="system" storageKey="syntax-theme">
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

