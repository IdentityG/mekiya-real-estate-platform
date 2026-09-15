import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Mekiya Real Estate",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-graphite to-ink flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="font-display text-[12rem] sm:text-[16rem] leading-none text-brass opacity-20 select-none">
            404
          </h1>
        </div>

        {/* Content */}
        <div className="bg-linen border border-ink/10 rounded-2xl p-8 sm:p-12 shadow-2xl -mt-32">
          <h2 className="font-display text-3xl sm:text-4xl text-ink mb-3">
            Page not found
          </h2>
          <p className="text-graphite/70 font-body text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { href: "/properties", label: "Browse Properties" },
              { href: "/neighborhoods", label: "Neighborhoods" },
              { href: "/contact", label: "Contact Us" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 px-4 border border-ink/10 text-ink text-sm font-body font-semibold rounded-lg hover:bg-cream hover:border-brass transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Primary CTA */}
          <Link
            href="/"
            className="inline-block py-3.5 px-10 bg-ink text-white text-sm font-body font-bold uppercase tracking-wider rounded-full hover:bg-brass hover:text-ink transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
