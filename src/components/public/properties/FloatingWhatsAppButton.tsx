"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { useLeadTracking } from "@/lib/hooks/useLeadTracking";

interface FloatingWhatsAppButtonProps {
  agentPhone?: string;
  agentName?: string;
  propertyTitle?: string;
  propertyId?: number;
  language?: "en" | "am" | "om";
}

export function FloatingWhatsAppButton({
  agentPhone,
  agentName = "Mekiya Real Estate",
  propertyTitle,
  propertyId,
  language = "en",
}: FloatingWhatsAppButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { trackContact } = useLeadTracking();

  // Show button after 3 seconds of page load
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Use default Mekiya WhatsApp if no agent phone
  const whatsappPhone = agentPhone || "+251911234567"; // Replace with actual Mekiya main number

  const handleWhatsAppClick = async () => {
    if (propertyId) {
      await trackContact({
        propertyId,
        contactType: "whatsapp",
        leadData: {
          name: "Anonymous Visitor",
        },
      });
    }

    const url = generateWhatsAppLink({
      phone: whatsappPhone,
      propertyTitle: propertyTitle || "your properties",
      agentName,
      language,
    });

    window.open(url, "_blank", "noopener,noreferrer");
    setIsExpanded(false);
  };

  const messages = {
    en: {
      greeting: "👋 Need help?",
      subtitle: "Chat with us on WhatsApp",
      cta: "Start Chat",
    },
    am: {
      greeting: "👋 እገዛ ይፈልጋሉ?",
      subtitle: "በዋትስአፕ ያነጋግሩን",
      cta: "ውይይት ጀምር",
    },
    om: {
      greeting: "👋 Gargaarsa barbaadduu?",
      subtitle: "WhatsApp irratti nu qunnamaa",
      cta: "Haasawa Jalqabaa",
    },
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.button
              key="button"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsExpanded(true)}
              className="group relative w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
              aria-label="Open WhatsApp chat"
            >
              {/* Pulse animation */}
              <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
              
              <MessageCircle className="relative w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              
              {/* Unread indicator */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                1
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="card"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden w-80"
            >
              {/* Header */}
              <div className="bg-[#25D366] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="text-white font-body font-semibold text-sm">
                      {agentName}
                    </p>
                    <p className="text-white/80 text-xs font-body flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Online now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message */}
              <div className="p-4 space-y-3">
                <div className="bg-cream p-3 rounded-lg rounded-tl-none">
                  <p className="font-body text-sm text-graphite">
                    {messages[language].greeting}
                  </p>
                  <p className="font-body text-xs text-stone-400 mt-1">
                    {messages[language].subtitle}
                  </p>
                </div>

                {propertyTitle && (
                  <div className="bg-brass/10 border border-brass/20 p-2 rounded text-xs font-body text-graphite">
                    <span className="text-brass font-semibold">Property:</span> {propertyTitle}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="p-4 pt-0">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full py-3 bg-[#25D366] text-white font-body font-semibold rounded-full hover:bg-[#1da851] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{messages[language].cta}</span>
                </button>
              </div>

              {/* Footer */}
              <div className="px-4 pb-4">
                <p className="text-center text-[10px] text-stone-400 font-body">
                  {language === "en" && "We typically reply within 2 hours"}
                  {language === "am" && "በተለምዶ በ2 ሰዓት ውስጥ ምላሽ እንሰጣለን"}
                  {language === "om" && "Yeroo idilee sa'aatii 2 keessatti deebii kennina"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
