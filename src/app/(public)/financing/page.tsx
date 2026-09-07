import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { PaymentCalculator } from "@/components/public/properties/PaymentCalculator";
import { IMG } from "@/lib/images";

export const metadata = { title: "Mortgage & Financing — Mekiya Real Estate" };

const banks = [
  { name: "Commercial Bank of Ethiopia", rate: "11.5 – 13%", term: "Up to 20 years", down: "From 20%" },
  { name: "Awash Bank", rate: "12 – 14%", term: "Up to 15 years", down: "From 25%" },
  { name: "Dashen Bank", rate: "12.5 – 14.5%", term: "Up to 15 years", down: "From 25%" },
  { name: "Bank of Abyssinia", rate: "12 – 15%", term: "Up to 18 years", down: "From 20%" },
];

const requirements = [
  { title: "Proof of income", desc: "Six months of payslips, or two years of audited accounts if self-employed." },
  { title: "Bank statements", desc: "Twelve months from your primary account showing consistent inflows." },
  { title: "Identification", desc: "Valid passport or kebele ID, plus TIN certificate." },
  { title: "Property documents", desc: "Title deed and valuation report — we supply these for Mekiya listings." },
  { title: "Employment letter", desc: "Confirming position, tenure, and gross salary." },
  { title: "Down payment proof", desc: "Evidence that your deposit is available and lawfully sourced." },
];

const steps = [
  { title: "Pre-qualify", desc: "Share your income and deposit. We estimate your realistic budget in 24 hours — before you fall in love with a property." },
  { title: "Choose a lender", desc: "We introduce you to two or three banks whose terms suit your profile, and compare offers side by side." },
  { title: "Submit application", desc: "We assemble the file, chase the valuation, and follow up with the credit committee on your behalf." },
  { title: "Approval & transfer", desc: "On approval, funds go to the seller, title transfers to you, and we hand over the keys." },
];

export default function FinancingPage() {
  return (
    <div className="bg-linen min-h-screen">
      <PageHero
        breadcrumb="Financing"
        eyebrow="Mortgage & Financing"
        title="Know what you can afford,"
        accent="before you look."
        description="We work with Ethiopia's major lenders to turn a deposit into a set of keys — with terms explained in plain language."
        image={IMG.apartment}
      />

      {/* Calculator + intro */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Estimate</p>
            <h2 className="font-display text-ink text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] tracking-[-0.02em] mb-5">
              Run the numbers first.
            </h2>
            <p className="text-graphite/70 font-body leading-relaxed mb-6">
              Move the sliders to see how deposit size, interest rate, and term change your
              monthly commitment. These are indicative figures — your bank&apos;s formal offer
              may differ, and we&apos;ll help you compare when it arrives.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "No cost, no credit check, no obligation",
                "Compare offers from up to four banks",
                "We handle the paperwork and follow-ups",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm font-body text-graphite">
                  <span className="w-1.5 h-1.5 rounded-full bg-brass mt-1.5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="inline-block px-8 py-3.5 bg-ink text-white font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-graphite transition-colors">
              Speak to an Advisor
            </Link>
          </div>

          <PaymentCalculator price={8000000} />
        </div>
      </section>

      {/* Lender comparison */}
      <section className="bg-cream border-y border-ink/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Partner Lenders</p>
          <h2 className="font-display text-ink text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] tracking-[-0.02em] mb-10">
            Indicative terms, updated quarterly.
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border border-ink/[0.1]">
              <thead>
                <tr className="bg-ink text-white text-left">
                  {["Lender", "Interest Rate", "Maximum Term", "Minimum Down"].map((h) => (
                    <th key={h} className="px-6 py-4 text-[10px] font-body font-bold uppercase tracking-[0.16em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {banks.map((b, i) => (
                  <tr key={b.name} className={i % 2 ? "bg-linen" : "bg-white"}>
                    <td className="px-6 py-5 font-body font-semibold text-ink text-sm border-t border-ink/[0.07]">{b.name}</td>
                    <td className="px-6 py-5 font-body text-brass font-semibold text-sm border-t border-ink/[0.07]">{b.rate}</td>
                    <td className="px-6 py-5 font-body text-graphite/70 text-sm border-t border-ink/[0.07]">{b.term}</td>
                    <td className="px-6 py-5 font-body text-graphite/70 text-sm border-t border-ink/[0.07]">{b.down}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-stone-400 text-xs font-body mt-4">
            Rates shown are indicative ranges for residential mortgages and vary by applicant profile. Confirm current terms with the lender.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">The Process</p>
            <h2 className="font-display text-ink text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] tracking-[-0.02em]">
              Four stages,<br /><span className="italic text-brass">fully guided.</span>
            </h2>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
            {steps.map((s, i) => (
              <div key={s.title} className="bg-cream p-8">
                <span className="font-display text-brass text-3xl italic">{i + 1}</span>
                <h3 className="font-body font-semibold text-ink mt-3 mb-2">{s.title}</h3>
                <p className="text-graphite/60 text-sm font-body leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">Checklist</p>
          <h2 className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] tracking-[-0.02em] mb-10">
            What lenders will ask for.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.08] border border-white/[0.08]">
            {requirements.map((r) => (
              <div key={r.title} className="bg-ink p-7">
                <p className="font-body font-semibold text-white flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brass" />{r.title}
                </p>
                <p className="text-white/45 text-sm font-body mt-2 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            <Link href="/properties" className="px-8 py-3.5 bg-brass text-ink font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:bg-white transition-colors text-center">
              Browse Properties
            </Link>
            <Link href="/contact" className="px-8 py-3.5 border border-white/25 text-white font-body font-bold text-sm uppercase tracking-[0.1em] rounded-full hover:border-brass hover:text-brass transition-colors text-center">
              Get Pre-qualified
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
