import Image from "next/image";
import Link from "next/link";

interface Props {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  image?: string;
  breadcrumb?: string;
}

export function PageHero({ eyebrow, title, accent, description, image, breadcrumb }: Props) {
  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-ink overflow-hidden">
      {image ? (
        <div className="absolute inset-0 opacity-30">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/75 to-ink" />
        </div>
      ) : (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 45%, rgba(196,169,107,0.28), transparent 45%), radial-gradient(circle at 85% 25%, rgba(44,108,143,0.3), transparent 45%)",
          }}
        />
      )}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {breadcrumb && (
          <nav className="flex items-center gap-2 text-[11px] font-body uppercase tracking-[0.12em] text-white/35 mb-6">
            <Link href="/" className="hover:text-brass transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brass">{breadcrumb}</span>
          </nav>
        )}
        <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-5">{eyebrow}</p>
        <h1 className="font-display text-white text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[0.95] tracking-[-0.025em] max-w-3xl">
          {title}
          {accent && <> <span className="italic text-brass">{accent}</span></>}
        </h1>
        {description && (
          <p className="text-white/50 text-lg font-body leading-relaxed max-w-xl mt-6">{description}</p>
        )}
      </div>
    </section>
  );
}
