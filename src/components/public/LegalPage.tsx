import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";

export interface LegalSection {
  heading: string;
  body: string[];
}

interface Props {
  eyebrow: string;
  title: string;
  accent: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  breadcrumb: string;
}

export function LegalPage({ eyebrow, title, accent, updated, intro, sections, breadcrumb }: Props) {
  return (
    <div className="bg-linen min-h-screen">
      <PageHero breadcrumb={breadcrumb} eyebrow={eyebrow} title={title} accent={accent} description={intro} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Sticky index */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-body font-bold uppercase tracking-[0.18em] text-stone-400 mb-4">Contents</p>
              <nav className="space-y-2 border-l border-ink/10 pl-4">
                {sections.map((s, i) => (
                  <a
                    key={s.heading}
                    href={`#section-${i}`}
                    className="block text-sm font-body text-graphite/60 hover:text-brass transition-colors"
                  >
                    {s.heading}
                  </a>
                ))}
              </nav>
              <p className="text-stone-400 text-xs font-body mt-6 pt-6 border-t border-ink/10">
                Last updated<br />
                <span className="text-ink font-semibold">{updated}</span>
              </p>
            </div>
          </aside>

          {/* Body */}
          <article className="lg:col-span-9 max-w-3xl">
            {sections.map((s, i) => (
              <section key={s.heading} id={`section-${i}`} className="mb-12 scroll-mt-28">
                <h2 className="font-display text-ink text-2xl sm:text-3xl tracking-tight mb-4">
                  {s.heading}
                </h2>
                <div className="space-y-4">
                  {s.body.map((p, pi) => (
                    <p key={pi} className="text-graphite/70 font-body leading-[1.85]">{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-16 p-8 bg-cream border border-ink/[0.08]">
              <h3 className="font-display text-ink text-xl tracking-tight mb-2">Questions about this policy?</h3>
              <p className="text-graphite/65 font-body text-sm mb-5">
                Write to us at <a href="mailto:legal@mekiya.com" className="text-brass font-semibold hover:underline">legal@mekiya.com</a> or reach our office directly.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-ink text-white font-body font-bold text-[11px] uppercase tracking-[0.12em] rounded-full hover:bg-graphite transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
