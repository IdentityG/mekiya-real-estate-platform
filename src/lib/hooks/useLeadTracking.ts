"use client";

import { useState, useCallback } from "react";

interface TrackContactOptions {
  leadId?: number;
  propertyId?: number;
  contactType: "whatsapp" | "phone" | "email" | "telegram";
  leadData?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

interface TrackActivityOptions {
  leadId: number;
  activityType:
    | "property_view"
    | "property_favorite"
    | "search"
    | "compare_properties";
  propertyId?: number;
  metadata?: Record<string, any>;
}

export function useLeadTracking() {
  const [isTracking, setIsTracking] = useState(false);

  const trackContact = useCallback(async (options: TrackContactOptions) => {
    try {
      setIsTracking(true);
      const response = await fetch("/api/leads/track-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to track contact");
      }

      return data;
    } catch (error) {
      console.error("Track contact error:", error);
      return null;
    } finally {
      setIsTracking(false);
    }
  }, []);

  const trackActivity = useCallback(async (options: TrackActivityOptions) => {
    try {
      const response = await fetch("/api/leads/track-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to track activity");
      }

      return data;
    } catch (error) {
      console.error("Track activity error:", error);
      return null;
    }
  }, []);

  return {
    trackContact,
    trackActivity,
    isTracking,
  };
}
