import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/public/PageHero";
import { IMG } from "@/lib/images";

export const metadata = { title: "Careers — Mekiya Real Estate" };

const roles = [
  { title: "Senior Property Agent", dept: "Sales", type: "Full-time", loc: "CMC, Addis Ababa", desc: "Own a portfolio of apartment and commercial listings across CMC and surrounding blocks. Requires 3+ years in Ethiopian real estate and a proven closing record." },
  { title: "Commercial Leasing Specialist", dept: "Commercial", type: "Full-time", loc: "CMC, Addis Ababa", desc: "Manage office, retail, and showroom leasing on Bole Road and CMC Plaza. Experience with multi-year commercial contracts essential." },
  { title: "Property Photographer", dept: "Marketing", type: "Contract", loc: "Addis Ababa", desc: "Shoot and edit listing photography and video walkthroughs for our apartment and commercial portfolio. Portfolio of architectural or interior work required." },
  { title: "Client Relations Officer", dept: "Operations", type: "Full-time", loc: "CMC, Addis Ababa", desc: "First point of contact for enquiries. Coordinate viewings, follow up leads, and keep our CRM immaculate." },
  { title: "Legal & Title Officer", dept: "Legal", type: "Full-time", loc: "CMC, Addis Ababa", desc: "Verify title deeds, manage transfers, and liaise with land administration offices. LLB and 2+ years property law required." },
];

const perks = [
  { title: "Uncapped commission", desc: "Our top agents earn multiples of base. No ceiling, no politics." },
  { title: "Warm leads provided", desc: "You're not cold-calling. Our platform generates qualified enquiries daily." },
  { title: "Marketing handled", desc: "Photography, listings, and campaigns are done for you — you focus on clients." },
  { title: "Licensing support", desc: "We cover certification costs and sponsor continuing education." },
  { title: "Modern tooling", desc: "Full CRM, mobile access, and analytics on every listing you manage." },
  { title: "Genuine progression", desc: "Agent → Senior Agent → Sales Manager. Promotion from within, always." },
];

export default function CareersPage() {
  return (
    <div className="bg-linen min-h-screen">
      <PageHero
        breadcrumb="Careers"
        eyebrow="Join Us"
        title="Build a career, not"
        accent="just a commission."
        description="We're hiring licensed agents and specialists who care about doing property properly in Ethiopia."
        image={IMG.aboutOffice}
      />

      {/* Culture */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative h-80 lg:h-[420px] border border-ink/[0.08] overflow-hidden">
            <Image src="/images/about-office.jpg" alt="Mekiya office" fill sizes="50vw" className="object-cover" />
          </div>
          <div>
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Our Culture</p>
            <h2 className="font-display text-ink text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] tracking-[-0.02em] mb-5">
              Straight dealing,<br /><span className="italic text-brass">properly rewarded.</span>
            </h2>
            <p className="text-graphite/70 font-body leading-relaxed mb-4">
              Ethiopian real estate has a trust problem. We built Mekiya to be the exception —
              every listing verified, every fee disclosed, every client told the truth even when
              it costs us the sale.
            </p>
            <p className="text-graphite/70 font-body leading-relaxed">
              If that&apos;s how you already work, you&apos;ll do well here. We give you warm leads,
              professional marketing, and an uncapped commission structure, then stay out of your way.
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="bg-cream border-y border-ink/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">What we offer</p>
          <h2 className="font-display text-ink text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] tracking-[-0.02em] mb-10">
            The support behind the title.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
            {perks.map((p) => (
              <div key={p.title} className="bg-linen p-7">
                <p className="font-body font-semibold text-ink flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brass" />{p.title}
                </p>
                <p className="text-graphite/60 text-sm font-body mt-2 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Open Positions</p>
            <h2 className="font-display text-ink text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] tracking-[-0.02em]">
              {roles.length} roles open right now
            </h2>
          </div>
          <p className="text-stone-400 text-sm font-body">Don&apos;t see your role? Send an open application.</p>
        </div>

        <div className="border-t border-ink/[0.1]">
          {roles.map((r) => (
            <div key={r.title} className="group border-b border-ink/[0.1] py-7 grid md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-4">
                <h3 className="font-display text-ink text-2xl tracking-tight group-hover:text-brass transition-colors">{r.title}</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[r.dept, r.type, r.loc].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-cream border border-ink/[0.08] text-graphite/70 text-[11px] font-body">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="md:col-span-6 text-graphite/65 font-body text-sm leading-relaxed">{r.desc}</p>
              <div className="md:col-span-2 md:text-right">
                <Link
                  href={`/contact?role=${encodeURIComponent(r.title)}`}
                  className="inline-block px-6 py-3 bg-ink text-white font-body font-bold text-[11px] uppercase tracking-[0.12em] rounded-full hover:bg-brass hover:text-ink transition-colors whitespace-nowrap"
                >
                  Apply
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-ink text-white p-10 lg:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl tracking-tight">Open application</h3>
            <p className="text-white/50 font-body mt-2">Tell us what you do and why Mekiya. We read every one.</p>
          </div>
          <Link href="/contact" className="px-8 py-4 bg-brass text-ink font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-white transition-colors shrink-0">
            Send Application
          </Link>
        </div>
      </section>
    </div>
  );
}
