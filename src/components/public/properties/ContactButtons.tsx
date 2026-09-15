"use client";

import { useState } from "react";
import { MessageCircle, Phone, Mail, Send } from "lucide-react";
import { generateWhatsAppLink, generateTelegramLink, formatPhoneNumber, contactMessages } from "@/lib/whatsapp";
import { useLeadTracking } from "@/lib/hooks/useLeadTracking";
import { toast } from "sonner";

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  whatsappPhone?: string | null;
  telegramUsername?: string | null;
}

interface ContactButtonsProps {
  agent: Agent;
  propertyId: number;
  propertyTitle: string;
  propertyUrl?: string;
  language?: "en" | "am" | "om";
  leadId?: number;
}

export function ContactButtons({
  agent,
  propertyId,
  propertyTitle,
  propertyUrl,
  language = "en",
  leadId,
}: ContactButtonsProps) {
  const { trackContact } = useLeadTracking();
  const [isTracking, setIsTracking] = useState(false);

  const whatsappPhone = agent.whatsappPhone || agent.phone;
  const canWhatsApp = !!whatsappPhone;
  const canTelegram = !!agent.telegramUsername;
  const canCall = !!agent.phone;

  const handleContact = async (contactType: "whatsapp" | "phone" | "email" | "telegram", url: string) => {
    setIsTracking(true);

    try {
      // Track the contact attempt
      await trackContact({
        leadId,
        propertyId,
        contactType,
        leadData: leadId ? undefined : {
          name: "Anonymous Visitor",
          phone: contactType === "phone" ? agent.phone || undefined : undefined,
          email: contactType === "email" ? agent.email : undefined,
        },
      });

      // Open the contact URL
      window.open(url, "_blank", "noopener,noreferrer");

      toast.success(
        contactType === "whatsapp"
          ? "Opening WhatsApp..."
          : contactType === "telegram"
          ? "Opening Telegram..."
          : contactType === "phone"
          ? "Opening phone dialer..."
          : "Opening email client..."
      );
    } catch (error) {
      console.error("Contact tracking error:", error);
      // Still open the contact URL even if tracking fails
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setIsTracking(false);
    }
  };

  const whatsappUrl = canWhatsApp
    ? generateWhatsAppLink({
        phone: whatsappPhone!,
        propertyTitle,
        propertyUrl: propertyUrl || `https://mekiya.com/properties/${propertyId}`,
        agentName: agent.name,
        language,
      })
    : "";

  const telegramUrl = canTelegram
    ? generateTelegramLink(
        agent.telegramUsername!,
        `Hello ${agent.name}, I'm interested in "${propertyTitle}". Can you provide more details?`
      )
    : "";

  return (
    <div className="space-y-2">
      {/* WhatsApp - Primary CTA */}
      {canWhatsApp && (
        <button
          onClick={() => handleContact("whatsapp", whatsappUrl)}
          disabled={isTracking}
          className="w-full flex items-center justify-center gap-2.5 py-3 bg-[#25D366] text-white font-body font-semibold text-sm hover:bg-[#1da851] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>{contactMessages.whatsapp[language]}</span>
        </button>
      )}

      {/* Grid for Phone, Email, Telegram */}
      <div className={`grid ${canTelegram ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
        {/* Phone */}
        {canCall && (
          <button
            onClick={() => handleContact("phone", `tel:${agent.phone}`)}
            disabled={isTracking}
            className="flex flex-col items-center justify-center gap-1.5 py-3 bg-ink text-white hover:bg-graphite transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            title={formatPhoneNumber(agent.phone!)}
          >
            <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-body font-semibold uppercase tracking-wider">
              {contactMessages.phone[language]}
            </span>
          </button>
        )}

        {/* Email */}
        <button
          onClick={() => handleContact("email", `mailto:${agent.email}`)}
          disabled={isTracking}
          className="flex flex-col items-center justify-center gap-1.5 py-3 border border-ink/15 text-ink hover:border-brass hover:bg-brass/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-body font-semibold uppercase tracking-wider">
            {contactMessages.email[language]}
          </span>
        </button>

        {/* Telegram */}
        {canTelegram && (
          <button
            onClick={() => handleContact("telegram", telegramUrl)}
            disabled={isTracking}
            className="flex flex-col items-center justify-center gap-1.5 py-3 bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 hover:bg-[#0088cc]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-body font-semibold uppercase tracking-wider">
              {contactMessages.telegram[language]}
            </span>
          </button>
        )}
      </div>

      {/* Agent Response Time Indicator */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-stone-400 text-[11px] font-body">
          {language === "en" && "Typically replies in under 2 hours"}
          {language === "am" && "በተለምዶ በ2 ሰዓት ውስጥ ምላሽ ይሰጣል"}
          {language === "om" && "Akka idilee sa'aatii 2 keessatti deebii kenna"}
        </span>
      </div>
    </div>
  );
}
