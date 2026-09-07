import Link from "next/link";
import { NewsletterForm } from "@/components/public/NewsletterForm";

const columns = [
  {
    title: "Explore",
    links: [
      ["All Properties", "/properties"],
      ["CMC & Surroundings", "/neighborhoods"],
      ["Apartments", "/properties?type=apartment"],
      ["Commercial", "/properties?type=commercial"],
      ["For Sale", "/properties?listing=sale"],
      ["For Rent", "/properties?listing=rent"],
    ],
  },
  {
    title: "Services",
    links: [
      ["Buying a Home", "/services"],
      ["Sell Your Property", "/sell"],
      ["Renting & Leasing", "/services"],
      ["Mortgage & Financing", "/financing"],
      ["Investment Advisory", "/services"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Mekiya", "/about"],
      ["Our Agents", "/agents"],

      ["Contact Us", "/contact"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["FAQ", "/faq"],
      ["Financing Guide", "/financing"],
      ["Privacy Policy", "/privacy"],
      ["Terms of Service", "/terms"],
    ],
  },
];

const socials = [
  { label: "Facebook", href: "https://facebook.com", d: "M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0022 12z" },
  { label: "Instagram", href: "https://instagram.com", d: "M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.25.06-1.64.07-4.85.07s-3.6 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85C2.42 3.92 3.93 2.38 7.15 2.23 8.4 2.21 8.8 2.2 12 2.2zm0 4.8a5 5 0 100 10 5 5 0 000-10zm6.4-.6a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0zM12 9a3 3 0 110 6 3 3 0 010-6z" },
  { label: "LinkedIn", href: "https://linkedin.com", d: "M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12H3v-12zM10 8.98h3.83v1.64h.05c.53-1 1.84-2.06 3.78-2.06 4.04 0 4.79 2.66 4.79 6.12v6.3h-4v-5.59c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.69h-4v-12z" },
  { label: "WhatsApp", href: "https://wa.me/251911234567", d: "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.42 1.31-1.95 1.35-.5.04-.98.22-3.3-.69-2.79-1.1-4.55-3.96-4.69-4.15-.14-.19-1.12-1.49-1.12-2.84s.71-2.02.96-2.29c.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17.01.4-.07.62.48.24.57.8 1.97.87 2.11.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.23 2.23 1.37.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.65.78 1.93.92.28.14.47.21.54.33.07.11.07.66-.17 1.34z" },
];

export function Footer() {
  return (
    <footer className="relative bg-ink text-white overflow-hidden">
      {/* Newsletter band */}
      <div className="border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-3">Property Alerts</p>
              <h3 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1] tracking-[-0.02em]">
                New listings, before<br /><span className="italic text-brass">anyone else.</span>
              </h3>
              <p className="text-white/45 font-body text-sm mt-4 max-w-md">
                One email a week. Only properties matching your criteria. Unsubscribe anytime.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Link grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand block */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <span className="w-9 h-9 rounded-full bg-brass flex items-center justify-center font-display text-ink text-lg leading-none">M</span>
              <span>
                <span className="block font-display text-2xl tracking-tight leading-none">Mekiya</span>
                <span className="block text-[9px] font-body uppercase tracking-[0.22em] text-white/35 mt-0.5">Real Estate</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm font-body leading-relaxed max-w-xs">
              Ethiopia&apos;s premier property platform. Title-verified listings, licensed agents,
              and a process built on transparency since 2015.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-2.5 text-sm font-body">
              <a href="tel:+251911234567" className="flex items-center gap-2.5 text-white/55 hover:text-brass transition-colors">
                <svg className="w-4 h-4 text-brass shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                +251 911 234 567
              </a>
              <a href="mailto:info@mekiya.com" className="flex items-center gap-2.5 text-white/55 hover:text-brass transition-colors">
                <svg className="w-4 h-4 text-brass shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                info@mekiya.com
              </a>
              <p className="flex items-start gap-2.5 text-white/55">
                <svg className="w-4 h-4 text-brass shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                Bole Road, Addis Ababa, Ethiopia
              </p>
            </div>

            {/* Socials */}
            <div className="flex gap-2 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/12 flex items-center justify-center text-white/50 hover:text-ink hover:bg-brass hover:border-brass transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-body font-bold uppercase tracking-[0.2em] text-brass mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-white/45 text-sm font-body hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Oversized watermark */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pointer-events-none select-none" aria-hidden="true">
        <p className="font-display text-white/[0.035] leading-none tracking-[-0.04em] text-[clamp(4rem,17vw,15rem)] text-center">
          MEKIYA
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-body">
            © {new Date().getFullYear()} Mekiya Real Estate PLC. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[["Privacy", "/privacy"], ["Terms", "/terms"], ["FAQ", "/faq"], ["Careers", "/careers"]].map(([l, h]) => (
              <Link key={l} href={h} className="text-white/25 text-xs font-body hover:text-brass transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
