/**
 * WhatsApp & Telegram Integration Utilities
 * Generates click-to-chat links with pre-filled messages
 */

export interface ContactOptions {
  phone: string;
  message?: string;
  propertyTitle?: string;
  propertyUrl?: string;
  agentName?: string;
  language?: "en" | "am" | "om"; // English, Amharic, Oromo
}

/**
 * Generate WhatsApp click-to-chat link
 * @param options Contact options including phone and message
 * @returns WhatsApp URL
 */
export function generateWhatsAppLink(options: ContactOptions): string {
  const { phone, message, propertyTitle, propertyUrl, agentName, language = "en" } = options;
  
  // Remove non-numeric characters from phone
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  
  // Generate message based on language
  let defaultMessage = "";
  
  if (propertyTitle) {
    const messages = {
      en: `Hello${agentName ? ` ${agentName}` : ""}, I'm interested in "${propertyTitle}".${propertyUrl ? ` ${propertyUrl}` : ""} Can you provide more details?`,
      am: `ሰላም${agentName ? ` ${agentName}` : ""}፣ በ"${propertyTitle}" ላይ ፍላጎት አለኝ።${propertyUrl ? ` ${propertyUrl}` : ""} ተጨማሪ መረጃ ማግኘት እፈልጋለሁ።`,
      om: `Akkam${agentName ? ` ${agentName}` : ""}? Ani waa'ee "${propertyTitle}" beekuu barbaada.${propertyUrl ? ` ${propertyUrl}` : ""} Odeeffannoo dabalataa naaf kennuu dandeessaa?`,
    };
    defaultMessage = messages[language];
  } else {
    const generalMessages = {
      en: `Hello${agentName ? ` ${agentName}` : ""}, I'm interested in learning more about your real estate listings. Can we discuss?`,
      am: `ሰላም${agentName ? ` ${agentName}` : ""}፣ ስለ ሪል እስቴት ዝርዝሮችዎ የበለጠ ለመረዳት ፍላጎት አለኝ። መወያየት እንችላለን?`,
      om: `Akkam${agentName ? ` ${agentName}` : ""}? Ani waa'ee qabeenya keessan dabalataa beekuu barbaada. Marii gochuun ni danda'amaa?`,
    };
    defaultMessage = generalMessages[language];
  }
  
  const finalMessage = message || defaultMessage;
  const encodedMessage = encodeURIComponent(finalMessage);
  
  // WhatsApp Web URL format
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate Telegram chat link
 * @param username Telegram username (without @)
 * @param message Optional pre-filled message
 * @returns Telegram URL
 */
export function generateTelegramLink(username: string, message?: string): string {
  const cleanUsername = username.replace(/^@/, "");
  
  if (message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://t.me/${cleanUsername}?text=${encodedMessage}`;
  }
  
  return `https://t.me/${cleanUsername}`;
}

/**
 * Format phone number for display (Ethiopian format)
 * @param phone Phone number
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  
  // Ethiopian format: +251 91 234 5678
  if (cleaned.startsWith("+251")) {
    const digits = cleaned.substring(4);
    if (digits.length === 9) {
      return `+251 ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
    }
  }
  
  return phone;
}

/**
 * Validate phone number (Ethiopian)
 * @param phone Phone number
 * @returns boolean
 */
export function isValidEthiopianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[^\d+]/g, "");
  
  // Ethiopian numbers start with +251 or 0 and have 9 digits after
  const ethiopianRegex = /^(\+251|0)[79]\d{8}$/;
  
  return ethiopianRegex.test(cleaned);
}

/**
 * Get multilingual contact messages
 */
export const contactMessages = {
  whatsapp: {
    en: "Chat on WhatsApp",
    am: "በዋትስአፕ ይወያዩ",
    om: "WhatsApp irratti haasa'aa",
  },
  phone: {
    en: "Call Now",
    am: "አሁን ይደውሉ",
    om: "Amma bilbilaa",
  },
  email: {
    en: "Send Email",
    am: "ኢሜል ይላኩ",
    om: "Email ergaa",
  },
  telegram: {
    en: "Chat on Telegram",
    am: "በቴሌግራም ይወያዩ",
    om: "Telegram irratti haasa'aa",
  },
  visitRequest: {
    en: "Schedule Visit",
    am: "ጉብኝት ያስይዙ",
    om: "Daawwannaa saganteeffadhaa",
  },
} as const;
