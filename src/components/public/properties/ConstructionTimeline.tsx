"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ConstructionTimelinePhase,
  calculateConstructionProgress,
  getLatestPhase,
  formatCompletionDate,
} from "@/types/virtual-tours";

interface ConstructionTimelineProps {
  timeline: ConstructionTimelinePhase[];
  completionDate?: Date | string | null;
  propertyTitle: string;
  className?: string;
}

export function ConstructionTimeline({
  timeline,
  completionDate,
  propertyTitle,
  className = "",
}: ConstructionTimelineProps) {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  if (!timeline || timeline.length === 0) {
    return null;
  }

  const overallProgress = calculateConstructionProgress(timeline);
  const latestPhase = getLatestPhase(timeline);
  const completionText = completionDate ? formatCompletionDate(completionDate) : null;

  // Sort timeline by date
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      year: "numeric" 
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={className}
    >
      <div className="mb-8">
        <p className="text-brass text-[11px] font-body font-bold uppercase tracking-[0.2em] mb-4">
          Construction Progress
        </p>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h3 className="font-display text-ink text-2xl tracking-tight mb-2">
              Building Timeline
            </h3>
            <p className="text-graphite/75 font-body text-sm">
              Track the construction progress of this property
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-brass text-3xl tracking-tight">
              {overallProgress}%
            </p>
            <p className="text-graphite/60 text-xs font-body mt-1">
              Complete
            </p>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="h-3 bg-cream border border-ink/[0.08] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${overallProgress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brass to-brass/80"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-body">
          <span className="text-graphite/60">Started</span>
          {completionDate && (
            <span className="text-brass font-semibold">{completionText}</span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {sortedTimeline.map((phase, index) => {
          const isLatest = latestPhase?.date === phase.date && latestPhase?.phase === phase.phase;
          const isSelected = selectedPhase === index;

          return (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < sortedTimeline.length - 1 && (
                <div className="absolute left-[19px] top-12 bottom-0 w-px bg-gradient-to-b from-brass/30 to-transparent" />
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative pl-14 pb-6 border-l-2 ${
                  isLatest ? "border-brass" : "border-ink/[0.08]"
                }`}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${
                    isLatest
                      ? "bg-brass border-brass animate-pulse"
                      : phase.progress
                      ? "bg-brass border-brass"
                      : "bg-cream border-ink/20"
                  }`}
                />

                {/* Phase Card */}
                <div
                  className={`bg-cream border transition-colors cursor-pointer ${
                    isSelected
                      ? "border-brass"
                      : "border-ink/[0.06] hover:border-brass/40"
                  }`}
                  onClick={() => setSelectedPhase(isSelected ? null : index)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-display text-ink text-lg tracking-tight">
                            {phase.phase}
                          </h4>
                          {isLatest && (
                            <span className="px-2 py-0.5 bg-brass text-ink text-[9px] font-body font-bold uppercase tracking-wider">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-graphite/70 text-sm font-body">
                          {phase.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-brass text-xs font-body font-semibold">
                          {formatDate(phase.date)}
                        </p>
                        {typeof phase.progress === "number" && (
                          <p className="text-graphite/60 text-xs font-body mt-1">
                            {phase.progress}% done
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phase Progress Bar */}
                    {typeof phase.progress === "number" && (
                      <div className="mt-4">
                        <div className="h-1.5 bg-white border border-ink/[0.06] overflow-hidden">
                          <div
                            className="h-full bg-brass transition-all duration-500"
                            style={{ width: `${phase.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Expand/Collapse Indicator */}
                    {phase.images && phase.images.length > 0 && (
                      <button
                        className="mt-4 text-xs font-body text-brass hover:text-ink transition-colors flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhase(isSelected ? null : index);
                        }}
                      >
                        {isSelected ? "Hide" : "View"} progress photos ({phase.images.length})
                        <svg
                          className={`w-3 h-3 transition-transform ${
                            isSelected ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Phase Images (Expandable) */}
                  <AnimatePresence>
                    {isSelected && phase.images && phase.images.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-ink/[0.06] overflow-hidden"
                      >
                        <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                          {phase.images.map((image, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative aspect-video bg-graphite border border-ink/[0.06] overflow-hidden group"
                            >
                              <Image
                                src={image}
                                alt={`${phase.phase} progress ${imgIndex + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Completion Notice */}
      {completionDate && completionText && (
        <div className="mt-8 p-5 bg-brass/10 border border-brass/20">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-brass shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-display text-ink text-sm mb-1">
                Expected Completion
              </p>
              <p className="text-graphite/75 font-body text-sm">
                {propertyTitle} is scheduled for completion{" "}
                <span className="text-brass font-semibold">
                  {completionText.toLowerCase()}
                </span>
                . The timeline may be subject to change based on construction progress.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
