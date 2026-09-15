import { Suspense } from "react";
import { PropertyComparisonClient } from "@/components/public/compare/PropertyComparisonClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Properties | Mekiya Real Estate",
  description: "Compare up to 3 properties side-by-side to find your perfect match",
};

export default function ComparePropertiesPage() {
  return (
    <div className="min-h-screen bg-linen">
      {/* Header */}
      <div className="relative pt-36 pb-14 bg-ink overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 50%, rgba(196,169,107,0.25), transparent 45%), radial-gradient(circle at 85% 30%, rgba(44,108,143,0.3), transparent 45%)`,
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.22em] mb-4">
            Side by Side
          </p>
          <h1 className="font-display text-white text-[clamp(2.4rem,5vw,4rem)] leading-[0.95] tracking-[-0.02em]">
            Compare Properties
          </h1>
          <p className="text-white/50 font-body mt-4">
            Compare up to 3 properties to make an informed decision
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 bg-cream border border-ink/[0.06] animate-pulse"
                />
              ))}
            </div>
          }
        >
          <PropertyComparisonClient />
        </Suspense>
      </div>
    </div>
  );
}
