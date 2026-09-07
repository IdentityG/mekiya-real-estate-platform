"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IMG } from "@/lib/images";

const propertyTypes = [
  { label: "Apartments", href: "/properties?type=apartment", desc: "Sale and rental across CMC", img: IMG.apartment },
  { label: "Commercial", href: "/properties?type=commercial", desc: "Offices, retail & showrooms", img: IMG.commercial },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties", dropdown: true },
  { href: "/neighborhoods", label: "Neighborhoods" },
  { href: "/services", label: "Services" },
  { href: "/agents", label: "Agents" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`max-w-6xl mx-auto mt-3 sm:mt-4 flex items-center justify-between gap-2 pl-4 pr-2 py-2 rounded-full border transition-all duration-500 ${
            scrolled
              ? "bg-ink/90 backdrop-blur-xl border-white/[0.08] shadow-[0_12px_40px_-12px_rgba(11,13,18,0.6)]"
              : "bg-ink/55 backdrop-blur-lg border-white/[0.1] shadow-[0_8px_30px_-12px_rgba(11,13,18,0.45)]"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="w-8 h-8 rounded-full bg-brass flex items-center justify-center font-display text-ink text-lg leading-none group-hover:rotate-[15deg] transition-transform duration-300">M</span>
            <span className="font-display text-white text-xl tracking-tight hidden sm:block">Mekiya</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              if (link.dropdown) {
                return (
                  <div key={link.href} className="relative" ref={dropRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      onMouseEnter={() => setDropdownOpen(true)}
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-[13px] font-body font-medium transition-colors ${
                        active ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                      <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          onMouseLeave={() => setDropdownOpen(false)}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[560px]"
                        >
                          <div className="bg-linen rounded-2xl shadow-[0_30px_70px_-20px_rgba(11,13,18,0.5)] border border-ink/[0.06] overflow-hidden">
                            <div className="grid grid-cols-2 gap-1 p-3">
                              {propertyTypes.map((pt) => (
                                <Link
                                  key={pt.href}
                                  href={pt.href}
                                  className="group flex items-center gap-3 p-2 rounded-xl hover:bg-cream transition-colors"
                                >
                                  <span className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                                    <Image src={pt.img} alt={pt.label} fill sizes="56px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                  </span>
                                  <span>
                                    <span className="block font-body font-semibold text-ink text-sm">{pt.label}</span>
                                    <span className="block text-stone-400 text-xs">{pt.desc}</span>
                                  </span>
                                </Link>
                              ))}
                            </div>
                            <div className="flex items-center justify-between px-5 py-3 bg-cream border-t border-ink/[0.05]">
                              <span className="text-[11px] font-body uppercase tracking-[0.15em] text-stone-400">500+ verified listings</span>
                              <Link href="/properties" className="text-[12px] font-body font-semibold text-slate hover:text-ink transition-colors">
                                View all →
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-[13px] font-body font-medium transition-colors ${
                    active ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/contact"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-brass text-ink text-[12px] font-body font-bold uppercase tracking-[0.08em] rounded-full hover:bg-white transition-colors duration-300"
            >
              Book a Visit
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-ink lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <span className="font-display text-white text-xl">Mekiya</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="px-6 pb-16">
              <div className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center justify-between py-4 border-b border-white/[0.07] group"
                    >
                      <span className="font-display text-3xl text-white group-hover:text-brass transition-colors">{link.label}</span>
                      <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 group-hover:border-brass group-hover:text-brass transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 space-y-4"
              >
                <Link href="/contact" className="block w-full py-4 bg-brass text-ink text-center font-body font-bold text-sm uppercase tracking-[0.12em] rounded-full">
                  Book a Visit
                </Link>
                <div className="pt-6 border-t border-white/[0.07] text-white/40 text-sm font-body space-y-1">
                  <p>+251 911 234 567</p>
                  <p>info@mekiya.com</p>
                  <p>Bole Road, Addis Ababa</p>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
