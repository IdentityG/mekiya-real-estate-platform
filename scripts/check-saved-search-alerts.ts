#!/usr/bin/env tsx
/**
 * Check Saved Search Alerts
 * 
 * This script checks all saved searches with email alerts enabled
 * and sends notifications about new matching properties.
 * 
 * Usage:
 *   pnpm tsx scripts/check-saved-search-alerts.ts
 * 
 * Can be run as a cron job (every 6 hours):
 *   0 asterisk-slash-6 asterisk asterisk asterisk cd /path/to/project && pnpm tsx scripts/check-saved-search-alerts.ts
 */

async function checkAlerts() {
  try {
    console.log("🔍 Checking saved search alerts...\n");

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/saved-searches/check-alerts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to check alerts");
    }

    const data = await response.json();

    console.log(`✅ Check complete!`);
    console.log(`📧 Alerts sent: ${data.alertsSent}`);
    
    if (data.summary && data.summary.length > 0) {
      console.log("\nSummary:");
      data.summary.forEach((item: any) => {
        console.log(
          `  → ${item.email}: ${item.propertyCount} new properties for "${item.searchName}"`
        );
      });
    } else {
      console.log("  No new matches found");
    }
  } catch (error) {
    console.error("❌ Error checking alerts:", error);
    process.exit(1);
  }
}

checkAlerts();
