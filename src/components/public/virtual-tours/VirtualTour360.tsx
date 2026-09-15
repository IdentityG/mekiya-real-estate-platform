"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface VirtualTour360Props {
  tourUrl: string;
  title?: string;
  autoLoad?: boolean;
  showControls?: boolean;
  initialYaw?: number;
  initialPitch?: number;
  className?: string;
}

export function VirtualTour360({
  tourUrl,
  title = "360° Virtual Tour",
  autoLoad = true,
  showControls = true,
  initialYaw = 0,
  initialPitch = 0,
  className = "",
}: VirtualTour360Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pannellumInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!autoLoad || !viewerRef.current || !tourUrl) return;

    // Dynamically import pannellum
    const loadPannellum = async () => {
      try {
        // @ts-ignore - pannellum doesn't have TypeScript definitions
        const pannellum = (await import("pannellum")).default;

        // Initialize viewer
        pannellumInstanceRef.current = pannellum.viewer(viewerRef.current, {
          type: "equirectangular",
          panorama: tourUrl,
          autoLoad: true,
          showControls: showControls,
          yaw: initialYaw,
          pitch: initialPitch,
          hfov: 110,
          minHfov: 50,
          maxHfov: 120,
          autoRotate: -2,
          autoRotateInactivityDelay: 3000,
          compass: false,
          showFullscreenCtrl: true,
          showZoomCtrl: true,
          mouseZoom: true,
          draggable: true,
          keyboardZoom: true,
          hotSpotDebug: false,
        });

        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to load 360° tour:", err);
        setError("Failed to load virtual tour. Please check the URL.");
      }
    };

    loadPannellum();

    // Cleanup
    return () => {
      if (pannellumInstanceRef.current) {
        try {
          pannellumInstanceRef.current.destroy();
        } catch (e) {
          console.warn("Failed to destroy pannellum instance:", e);
        }
      }
    };
  }, [tourUrl, autoLoad, showControls, initialYaw, initialPitch]);

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!viewerRef.current) return;

    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (error) {
    return (
      <div className={`bg-cream border border-ink/[0.06] p-8 text-center ${className}`}>
        <svg
          className="w-12 h-12 mx-auto mb-4 text-stone-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-sm font-body text-graphite">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative bg-ink overflow-hidden ${className}`}
    >
      {/* Tour Container */}
      <div
        ref={viewerRef}
        className="w-full h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px]"
        style={{ position: "relative" }}
      />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brass border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-body text-sm">Loading 360° tour...</p>
          </div>
        </div>
      )}

      {/* Title Overlay */}
      {title && isLoaded && (
        <div className="absolute top-4 left-4 bg-ink/80 backdrop-blur-sm px-4 py-2 border border-brass/30">
          <h3 className="text-white font-display text-lg">{title}</h3>
        </div>
      )}

      {/* Instructions Overlay */}
      {isLoaded && !isFullscreen && (
        <div className="absolute bottom-4 left-4 bg-ink/80 backdrop-blur-sm px-4 py-2 border border-white/20">
          <p className="text-white/70 font-body text-xs">
            <span className="text-brass font-semibold">Drag</span> to look around •{" "}
            <span className="text-brass font-semibold">Scroll</span> to zoom
          </p>
        </div>
      )}

      {/* Custom Controls */}
      {showControls && isLoaded && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 bg-ink/80 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-brass hover:border-brass transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Pannellum CSS */}
      <style jsx global>{`
        .pnlm-container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        .pnlm-ui {
          position: absolute !important;
        }
        
        .pnlm-controls {
          background-color: rgba(17, 24, 39, 0.8) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        
        .pnlm-controls-container {
          bottom: 16px !important;
          right: 16px !important;
        }
        
        .pnlm-zoom-controls {
          width: 40px !important;
          height: 80px !important;
        }
        
        .pnlm-zoom-in,
        .pnlm-zoom-out {
          width: 40px !important;
          height: 40px !important;
          background-color: transparent !important;
          border: none !important;
        }
        
        .pnlm-zoom-in:hover,
        .pnlm-zoom-out:hover {
          background-color: rgba(196, 169, 107, 0.3) !important;
        }
        
        .pnlm-fullscreen-toggle-button {
          width: 40px !important;
          height: 40px !important;
          background-color: rgba(17, 24, 39, 0.8) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        
        .pnlm-fullscreen-toggle-button:hover {
          background-color: #c4a96b !important;
          border-color: #c4a96b !important;
        }
        
        .pnlm-load-box {
          background-color: rgba(17, 24, 39, 0.9) !important;
          border: 1px solid rgba(196, 169, 107, 0.3) !important;
        }
        
        .pnlm-lbar {
          background-color: #c4a96b !important;
        }
        
        .pnlm-lbar-fill {
          background-color: #fff !important;
        }
        
        .pnlm-lmsg {
          color: #fff !important;
          font-family: 'Space Grotesk', sans-serif !important;
        }
        
        .pnlm-compass {
          display: none !important;
        }
      `}</style>
    </motion.div>
  );
}
