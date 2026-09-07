"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Home, Building2, Info } from "lucide-react";

interface PropertyType {
  value: string;
  label: string;
  description: string;
  count: number;
}

interface Props {
  types: PropertyType[];
  canManage: boolean;
}

const inputCls = "w-full px-3 py-2.5 bg-linen border border-ink/[0.1] text-ink text-[13px] font-body placeholder-stone-400 focus:outline-none focus:border-brass transition-colors";
const labelCls = "block text-[10px] font-body font-bold uppercase tracking-[0.14em] text-stone-400 mb-1.5";

export function AdminPropertyTypesClient({ types, canManage }: Props) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="p-5 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-body font-bold text-ink">Property Types</h2>
          <p className="text-[12px] font-body text-stone-400">{types.length} types configured</p>
        </div>
        <button
          onClick={() => setShowInfo(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate/10 text-slate text-[13px] font-body font-bold rounded-full hover:bg-slate/20 transition-colors"
        >
          <Info className="w-4 h-4" strokeWidth={2} /> How to Add Types
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.8} />
          <div>
            <p className="text-[13px] font-body font-semibold text-amber-900 mb-1">
              Property Types Configuration
            </p>
            <p className="text-[12.5px] font-body text-amber-800 leading-relaxed">
              Property types are currently managed via database enums for data integrity. 
              To add new types (e.g., "Villa", "Land", "Warehouse"), you'll need to update the database schema.
              See the guide below for instructions.
            </p>
          </div>
        </div>
      </div>

      {/* Current Types Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {types.map((type) => {
          const Icon = type.value === "commercial" ? Building2 : Home;
          return (
            <div key={type.value} className="bg-white border border-ink/[0.07] overflow-hidden hover:border-ink/20 transition-colors">
              {/* Header */}
              <div className="p-5 flex items-center gap-4 border-b border-ink/[0.05]">
                <div className="w-12 h-12 rounded-lg bg-brass/10 text-brass flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-body font-bold text-ink">{type.label}</p>
                  <p className="text-[11.5px] font-body text-stone-400 truncate">{type.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-body font-bold uppercase tracking-[0.12em] text-stone-400">
                    Active Listings
                  </span>
                  <span className="text-2xl font-body font-bold text-ink tabular-nums">{type.count}</span>
                </div>
              </div>

              {/* Technical Info */}
              <div className="px-5 pb-5 pt-2 border-t border-ink/[0.05]">
                <p className="text-[11px] font-body text-stone-400">
                  <span className="font-mono text-brass">{type.value}</span> · Database enum value
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions Card */}
      <div className="bg-white border border-ink/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-ink/[0.05] bg-linen/50">
          <h3 className="text-[14px] font-body font-bold text-ink">Adding New Property Types</h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Step 1 */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-6 h-6 rounded-full bg-brass text-ink text-[11px] font-body font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] font-body font-semibold text-ink mb-2">Update Database Schema</p>
                <p className="text-[12.5px] font-body text-graphite mb-3">
                  Edit <code className="px-1.5 py-0.5 bg-linen text-brass font-mono text-[11px]">src/db/schema.ts</code> and add your new type to the enum:
                </p>
                <div className="bg-ink text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-[11.5px] font-mono leading-relaxed">
{`export const propertyTypeEnum = pgEnum("property_type", [
  "apartment",
  "commercial",
  "villa",        // ← Add new type
  "land",         // ← Add new type
  "warehouse",    // ← Add new type
]);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-6 h-6 rounded-full bg-brass text-ink text-[11px] font-body font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] font-body font-semibold text-ink mb-2">Create Database Migration</p>
                <p className="text-[12.5px] font-body text-graphite mb-3">
                  Run the following command to generate a migration:
                </p>
                <div className="bg-ink text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-[11.5px] font-mono">
{`pnpm drizzle-kit generate:pg`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-6 h-6 rounded-full bg-brass text-ink text-[11px] font-body font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] font-body font-semibold text-ink mb-2">Apply Migration to Database</p>
                <p className="text-[12.5px] font-body text-graphite mb-3">
                  Manually run the ALTER TYPE SQL command in your database:
                </p>
                <div className="bg-ink text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-[11.5px] font-mono leading-relaxed">
{`ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'villa';
ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'land';
ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'warehouse';`}
                  </pre>
                </div>
                <p className="text-[11.5px] font-body text-stone-400 mt-2">
                  ⚠️ Run this in your Supabase SQL Editor or via psql
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-6 h-6 rounded-full bg-brass text-ink text-[11px] font-body font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] font-body font-semibold text-ink mb-2">Update Property Form</p>
                <p className="text-[12.5px] font-body text-graphite mb-3">
                  Edit <code className="px-1.5 py-0.5 bg-linen text-brass font-mono text-[11px]">src/components/admin/AdminPropertiesClient.tsx</code> to add the new types to the dropdown:
                </p>
                <div className="bg-ink text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-[11.5px] font-mono leading-relaxed">
{`<select name="propertyType" ...>
  <option value="apartment">Apartment</option>
  <option value="commercial">Commercial</option>
  <option value="villa">Villa</option>
  <option value="land">Land</option>
  <option value="warehouse">Warehouse</option>
</select>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brass text-ink text-[11px] font-body font-bold flex items-center justify-center shrink-0">
                5
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] font-body font-semibold text-ink mb-2">Update Helper Functions</p>
                <p className="text-[12.5px] font-body text-graphite mb-3">
                  Add labels for new types in <code className="px-1.5 py-0.5 bg-linen text-brass font-mono text-[11px]">src/lib/utils.ts</code>:
                </p>
                <div className="bg-ink text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-[11.5px] font-mono leading-relaxed">
{`export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: "Apartment",
    commercial: "Commercial",
    villa: "Villa",
    land: "Land",
    warehouse: "Warehouse",
  };
  return labels[type] || type;
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-slate/5 border border-slate/20 rounded-lg">
            <p className="text-[12px] font-body text-slate font-semibold mb-1">💡 Why enums?</p>
            <p className="text-[11.5px] font-body text-graphite leading-relaxed">
              PostgreSQL enums ensure data integrity and prevent typos. While they require migrations to update,
              they're more reliable than free-text fields and provide better performance for filtering and indexing.
            </p>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="fixed inset-x-0 top-0 bottom-0 z-50 m-auto w-full max-w-lg h-fit bg-white"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink/[0.08]">
                <h3 className="text-[15px] font-body font-bold text-ink">About Property Types</h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-9 h-9 rounded-lg border border-ink/10 flex items-center justify-center hover:bg-linen transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={1.8} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-[13px] font-body text-graphite leading-relaxed">
                  Property types are stored as PostgreSQL enums in the database. This approach ensures:
                </p>
                <ul className="space-y-2 text-[12.5px] font-body text-graphite">
                  <li className="flex items-start gap-2">
                    <span className="text-brass mt-0.5">✓</span>
                    <span>Data integrity - no typos or inconsistent values</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brass mt-0.5">✓</span>
                    <span>Better performance for filtering and queries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brass mt-0.5">✓</span>
                    <span>Type safety in TypeScript code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brass mt-0.5">✓</span>
                    <span>Automatic validation at database level</span>
                  </li>
                </ul>
                <p className="text-[12.5px] font-body text-graphite leading-relaxed">
                  Follow the steps above to add new property types. The process involves a one-time schema update
                  and is worth it for the long-term reliability and performance benefits.
                </p>
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full py-3 bg-ink text-white text-[13px] font-body font-bold rounded-full hover:bg-graphite transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
