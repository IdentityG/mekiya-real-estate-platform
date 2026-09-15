import { NextResponse } from "next/server";
import { db } from "@/db";
import { savedSearches, properties, users } from "@/db/schema";
import { eq, and, gte, lte, inArray, sql } from "drizzle-orm";

// This endpoint should be called by a cron job to check for new properties
// matching saved searches and send email alerts
export async function POST() {
  try {
    // Verify this is called by authorized source (cron job)
    const authHeader = process.env.CRON_SECRET;
    if (!authHeader) {
      return NextResponse.json(
        { error: "Cron secret not configured" },
        { status: 500 }
      );
    }

    // Get all saved searches with email alerts enabled
    const searches = await db
      .select({
        id: savedSearches.id,
        userId: savedSearches.userId,
        name: savedSearches.name,
        searchCriteria: savedSearches.searchCriteria,
        alertFrequency: savedSearches.alertFrequency,
        lastAlertSent: savedSearches.lastAlertSent,
        userEmail: users.email,
        userName: users.name,
      })
      .from(savedSearches)
      .innerJoin(users, eq(savedSearches.userId, users.id))
      .where(eq(savedSearches.emailAlerts, true));

    const now = new Date();
    const alertsToSend: Array<{
      searchId: number;
      userId: number;
      userName: string;
      userEmail: string;
      searchName: string;
      properties: any[];
    }> = [];

    for (const search of searches) {
      // Check if alert should be sent based on frequency
      const shouldSendAlert = checkAlertFrequency(
        search.alertFrequency || "daily",
        search.lastAlertSent
      );

      if (!shouldSendAlert) continue;

      // Build query based on search criteria
      const criteria = search.searchCriteria as any;
      const matchingProperties = await findMatchingProperties(
        criteria,
        search.lastAlertSent || new Date(0)
      );

      if (matchingProperties.length > 0) {
        alertsToSend.push({
          searchId: search.id,
          userId: search.userId,
          userName: search.userName || "User",
          userEmail: search.userEmail,
          searchName: search.name,
          properties: matchingProperties,
        });

        // Update last alert sent timestamp
        await db
          .update(savedSearches)
          .set({ lastAlertSent: now })
          .where(eq(savedSearches.id, search.id));
      }
    }

    // Send emails (you would integrate with an email service here)
    // For now, we'll just log the alerts
    if (alertsToSend.length > 0) {
      console.log(`📧 Sending ${alertsToSend.length} email alerts...`);
      for (const alert of alertsToSend) {
        console.log(
          `  → ${alert.userEmail}: ${alert.properties.length} new properties for "${alert.searchName}"`
        );
        // TODO: Send actual email via SendGrid, AWS SES, or similar
        // await sendEmail({
        //   to: alert.userEmail,
        //   subject: `New properties match your saved search: ${alert.searchName}`,
        //   html: generateEmailHtml(alert),
        // });
      }
    }

    return NextResponse.json({
      success: true,
      alertsSent: alertsToSend.length,
      summary: alertsToSend.map((a) => ({
        email: a.userEmail,
        searchName: a.searchName,
        propertyCount: a.properties.length,
      })),
    });
  } catch (error) {
    console.error("Check alerts error:", error);
    return NextResponse.json(
      { error: "Failed to check alerts" },
      { status: 500 }
    );
  }
}

function checkAlertFrequency(
  frequency: string,
  lastSent: Date | null
): boolean {
  if (!lastSent) return true;

  const now = new Date();
  const timeSinceLastAlert = now.getTime() - lastSent.getTime();

  switch (frequency) {
    case "instant":
      return timeSinceLastAlert > 1000 * 60 * 15; // 15 minutes
    case "daily":
      return timeSinceLastAlert > 1000 * 60 * 60 * 24; // 24 hours
    case "weekly":
      return timeSinceLastAlert > 1000 * 60 * 60 * 24 * 7; // 7 days
    default:
      return false;
  }
}

async function findMatchingProperties(
  criteria: any,
  sinceDate: Date
): Promise<any[]> {
  // Build where conditions based on search criteria
  const whereConditions = [
    eq(properties.status, "published"),
    gte(properties.createdAt, sinceDate),
  ];

  if (criteria.propertyTypes && criteria.propertyTypes.length > 0) {
    whereConditions.push(inArray(properties.propertyType, criteria.propertyTypes));
  }

  if (criteria.listingType) {
    whereConditions.push(eq(properties.listingType, criteria.listingType));
  }

  if (criteria.minPrice) {
    whereConditions.push(gte(properties.price, criteria.minPrice));
  }

  if (criteria.maxPrice) {
    whereConditions.push(lte(properties.price, criteria.maxPrice));
  }

  if (criteria.minSize) {
    whereConditions.push(sql`${properties.size} >= ${criteria.minSize}`);
  }

  if (criteria.maxSize) {
    whereConditions.push(sql`${properties.size} <= ${criteria.maxSize}`);
  }

  if (criteria.bedrooms) {
    whereConditions.push(sql`${properties.bedrooms} >= ${criteria.bedrooms}`);
  }

  if (criteria.bathrooms) {
    whereConditions.push(sql`${properties.bathrooms} >= ${criteria.bathrooms}`);
  }

  if (criteria.neighborhoods && criteria.neighborhoods.length > 0) {
    whereConditions.push(
      inArray(properties.neighborhood, criteria.neighborhoods)
    );
  }

  if (criteria.furnished) {
    whereConditions.push(eq(properties.furnished, true));
  }

  if (criteria.verified) {
    whereConditions.push(eq(properties.verified, true));
  }

  const results = await db
    .select({
      id: properties.id,
      title: properties.title,
      slug: properties.slug,
      price: properties.price,
      currency: properties.currency,
      propertyType: properties.propertyType,
      listingType: properties.listingType,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      size: properties.size,
      neighborhood: properties.neighborhood,
      media: properties.media,
      createdAt: properties.createdAt,
    })
    .from(properties)
    .where(and(...whereConditions))
    .limit(20);

  return results;
}
