"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sparkles, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prefetch main routes so clicks feel instant
  useEffect(() => {
    navLinks.forEach((link) => {
      try {
        router.prefetch(link.href);
      } catch {
        /* ignore */
      }
    });
    try {
      router.prefetch("/admin/dashboard");
    } catch {
      /* ignore */
    }
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const linkClass = (href: string) => {
    const active = pathname === href;
    return `relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 ${
      active
        ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
    }`;
  };

  return (
    <nav
      className={`sticky top-0 z-[200] transition-[background-color,box-shadow,border-color] duration-200 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-200/50 dark:border-gray-800/50"
          : "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100/50 dark:border-gray-800/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" prefetch className="flex items-center gap-3 group relative z-[201]">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/40">
              <span className="text-white font-black text-lg leading-none">S</span>
            </div>
            <div className="leading-tight">
              <div className="font-black text-gray-900 dark:text-white text-base tracking-tight">
                Syntax Software
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-bold -mt-0.5 tracking-wide">
                Solutions
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 relative z-[201]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className={linkClass(link.href)}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                )}
              </Link>
            ))}

            <Link
              href="/contact"
              prefetch
              className="ml-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow"
            >
              Get Started
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 ml-4 relative z-[201]">
            <ThemeToggle />
            <Link
              href="/admin/dashboard"
              prefetch
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-semibold text-sm transition-colors border border-blue-500/20"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:hidden relative z-[201]">
            <ThemeToggle />
            <Link
              href="/admin/dashboard"
              prefetch
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
              aria-label="Admin dashboard"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              type="button"
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden relative z-[201] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              onClick={() => setMobileOpen(false)}
              className={`block w-full text-left px-5 py-3 rounded-xl text-base font-semibold transition-colors ${
                pathname === link.href
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            prefetch
            onClick={() => setMobileOpen(false)}
            className="btn-primary w-full justify-center text-base h-12 mt-2 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
