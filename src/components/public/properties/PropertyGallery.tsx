"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  images: string[];
  video: string;
  title: string;
}

type Tab = "photos" | "video";

export function PropertyGallery({ images, video, title }: Props) {
  const [tab, setTab] = useState<Tab>("photos");
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const nextImg = useCallback(() => setActiveImg((p) => (p + 1) % images.length), [images.length]);
  const prevImg = useCallback(() => setActiveImg((p) => (p - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, nextImg, prevImg]);

  return (
    <section className="relative bg-ink overflow-hidden">
      {/* Tabs */}
      <div className="absolute top-6 left-6 z-20 flex gap-1 p-1 bg-ink/70 backdrop-blur-md rounded-full border border-white/10">
        {([
          { id: "photos" as Tab, label: `Photos (${images.length})` },
          { id: "video" as Tab, label: "Video Tour" },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-body font-bold uppercase tracking-[0.12em] transition-all ${
              tab === t.id ? "bg-brass text-ink" : "text-white/55 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative h-[60vh] sm:h-[65vh] lg:h-[72vh]">
        {/* Signature: vertical brass rail + rotated label */}
        <div className="absolute left-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brass/30 to-transparent z-20 pointer-events-none hidden lg:block" />
        <div className="absolute left-[15%] top-20 z-20 hidden lg:block pointer-events-none">
          <span className="text-brass/70 text-[10px] font-body font-bold uppercase tracking-[0.25em] rotate-[-90deg] origin-left block whitespace-nowrap">
            Property Gallery
          </span>
        </div>

        <AnimatePresence initial={false}>
          {tab === "photos" ? (
            <motion.div
              key="photos"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {/* Offset image — the signature overlap */}
              <div className="absolute inset-0 top-12">
                <Image
                  src={images[activeImg]}
                  alt={`${title} — photo ${activeImg + 1}`}
                  fill priority sizes="100vw"
                  className="object-cover cursor-zoom-in"
                  onClick={() => setLightbox(true)}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/25 pointer-events-none" />

              {/* Prev / next */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImg} aria-label="Previous photo"
                    className="absolute left-4 lg:left-auto lg:right-20 bottom-6 lg:top-1/2 w-11 h-11 rounded-full bg-ink/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-brass hover:text-ink transition-colors z-20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={nextImg} aria-label="Next photo"
                    className="absolute left-20 lg:left-auto lg:right-6 bottom-6 lg:top-1/2 w-11 h-11 rounded-full bg-ink/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-brass hover:text-ink transition-colors z-20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}

              {/* Expand hint */}
              <button
                onClick={() => setLightbox(true)}
                className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-ink/60 backdrop-blur-md border border-white/15 text-white text-[11px] font-body font-semibold hover:bg-brass hover:text-ink transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                Expand
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <video src={video} autoPlay muted loop controls playsInline poster={images[0]} className="w-full h-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thumbnails */}
        {tab === "photos" && images.length > 1 && (
          <div className="absolute bottom-6 right-6 z-20 hidden sm:flex gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                aria-label={`View photo ${idx + 1}`}
                className={`relative w-16 h-11 overflow-hidden border-2 transition-all duration-300 ${
                  activeImg === idx ? "border-brass scale-105" : "border-white/25 opacity-55 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/97 flex items-center justify-center p-4 sm:p-10"
          >
            <button onClick={() => setLightbox(false)} aria-label="Close gallery"
              className="absolute top-5 right-5 w-11 h-11 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-brass transition-colors">✕</button>
            <button onClick={prevImg} aria-label="Previous photo"
              className="absolute left-4 sm:left-8 w-11 h-11 rounded-full border border-white/20 text-white/70 hover:text-brass hover:border-brass transition-colors flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextImg} aria-label="Next photo"
              className="absolute right-4 sm:right-8 w-11 h-11 rounded-full border border-white/20 text-white/70 hover:text-brass hover:border-brass transition-colors flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="relative w-full max-w-6xl h-[78vh]">
              <Image src={images[activeImg]} alt={title} fill className="object-contain" />
            </div>
            <p className="absolute bottom-6 text-white/40 text-xs font-body">{activeImg + 1} / {images.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
