"use client";

import { useState, useEffect } from "react";

export function PropertyActions({ propertyId, title }: { propertyId: number; title: string }) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const favs: number[] = JSON.parse(localStorage.getItem("mekiya_favs") || "[]");
    setSaved(favs.includes(propertyId));
  }, [propertyId]);

  function toggleSave() {
    const favs: number[] = JSON.parse(localStorage.getItem("mekiya_favs") || "[]");
    const next = favs.includes(propertyId) ? favs.filter((f) => f !== propertyId) : [...favs, propertyId];
    localStorage.setItem("mekiya_favs", JSON.stringify(next));
    setSaved(next.includes(propertyId));
  }

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch { /* cancelled */ }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSave}
        aria-label={saved ? "Remove from saved" : "Save property"}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[12px] font-body font-semibold transition-colors ${
          saved ? "bg-brass text-ink border-brass" : "border-ink/15 text-graphite hover:border-brass hover:text-brass"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
        {saved ? "Saved" : "Save"}
      </button>
      <button
        onClick={handleShare}
        aria-label="Share property"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-ink/15 text-[12px] font-body font-semibold text-graphite hover:border-brass hover:text-brass transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
        {shared ? "Copied!" : "Share"}
      </button>
    </div>
  );
}
