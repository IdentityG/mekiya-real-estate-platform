"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  propertyId: number;
  variant?: "icon" | "button";
  className?: string;
}

const COMPARE_STORAGE_KEY = "mekiya_compare_properties";
const MAX_COMPARE = 3;

export function CompareButton({ propertyId, variant = "button", className = "" }: Props) {
  const router = useRouter();
  const [compareList, setCompareList] = useState<number[]>([]);
  const [isInCompare, setIsInCompare] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompareList(parsed);
        setIsInCompare(parsed.includes(propertyId));
      } catch {
        localStorage.removeItem(COMPARE_STORAGE_KEY);
      }
    }
  }, [propertyId]);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let updated: number[];

    if (isInCompare) {
      // Remove from compare
      updated = compareList.filter(id => id !== propertyId);
    } else {
      // Add to compare
      if (compareList.length >= MAX_COMPARE) {
        alert(`You can only compare up to ${MAX_COMPARE} properties at once. Please remove one first.`);
        return;
      }
      updated = [...compareList, propertyId];
    }

    setCompareList(updated);
    setIsInCompare(!isInCompare);
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent("compareListUpdated", { detail: updated }));
  };

  if (variant === "icon") {
    return (
      <button
        onClick={toggleCompare}
        className={`p-2 bg-white border border-ink/[0.12] hover:border-brass transition-colors ${className}`}
        title={isInCompare ? "Remove from comparison" : "Add to comparison"}
      >
        <svg
          className={`w-4.5 h-4.5 ${isInCompare ? "text-brass" : "text-graphite"}`}
          fill={isInCompare ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggleCompare}
      className={`flex items-center gap-2 px-4 py-2 border transition-colors ${
        isInCompare
          ? "bg-brass text-ink border-brass"
          : "bg-white text-graphite border-ink/[0.12] hover:border-brass"
      } ${className}`}
    >
      <svg
        className="w-4 h-4"
        fill={isInCompare ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
      <span className="text-sm font-body font-medium">
        {isInCompare ? "In Compare" : "Compare"}
      </span>
    </button>
  );
}

// Floating compare bar component
export function CompareFloatingBar() {
  const router = useRouter();
  const [compareList, setCompareList] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const loadCompareList = () => {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCompareList(parsed);
          setIsVisible(parsed.length > 0);
        } catch {
          localStorage.removeItem(COMPARE_STORAGE_KEY);
        }
      }
    };

    loadCompareList();

    // Listen for updates
    const handleUpdate = (e: CustomEvent) => {
      setCompareList(e.detail);
      setIsVisible(e.detail.length > 0);
    };

    window.addEventListener("compareListUpdated", handleUpdate as EventListener);
    return () => {
      window.removeEventListener("compareListUpdated", handleUpdate as EventListener);
    };
  }, []);

  const clearAll = () => {
    setCompareList([]);
    setIsVisible(false);
    localStorage.removeItem(COMPARE_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("compareListUpdated", { detail: [] }));
  };

  const goToCompare = () => {
    const ids = compareList.join(",");
    router.push(`/compare?ids=${ids}`);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      <div className="bg-ink text-white shadow-2xl border border-brass/30 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-brass"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <div>
            <p className="text-sm font-body font-semibold">
              {compareList.length} {compareList.length === 1 ? "property" : "properties"} selected
            </p>
            <p className="text-xs font-body text-white/60">
              {MAX_COMPARE - compareList.length} {MAX_COMPARE - compareList.length === 1 ? "slot" : "slots"} remaining
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={clearAll}
            className="px-4 py-2 text-sm font-body font-medium text-white/70 hover:text-white transition-colors"
          >
            Clear
          </button>
          <button
            onClick={goToCompare}
            disabled={compareList.length < 2}
            className="px-6 py-2 bg-brass text-ink text-sm font-body font-bold uppercase tracking-wider hover:bg-brass/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compare Now
          </button>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 text-white/50 hover:text-white"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
