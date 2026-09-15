import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads, properties, propertyRecommendations, leadActivities } from "@/db/schema";
import { eq, and, inArray, sql, desc } from "drizzle-orm";

// Generate property recommendations for a lead based on their behavior
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID required" },
        { status: 400 }
      );
    }

    // Get lead details
    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    // Get lead's activity history
    const activities = await db
      .select()
      .from(leadActivities)
      .where(eq(leadActivities.leadId, leadId))
      .orderBy(desc(leadActivities.createdAt))
      .limit(50);

    // Extract viewed property IDs
    const viewedPropertyIds = activities
      .filter((a) => a.propertyId && a.activityType === "property_view")
      .map((a) => a.propertyId as number);

    if (viewedPropertyIds.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [],
        message: "No activity history to base recommendations on",
      });
    }

    // Get viewed properties to understand preferences
    const viewedProperties = await db
      .select()
      .from(properties)
      .where(inArray(properties.id, viewedPropertyIds));

    // Extract preferences
    const propertyTypes = [...new Set(viewedProperties.map((p) => p.propertyType))];
    const neighborhoods = [
      ...new Set(
        viewedProperties.map((p) => p.neighborhood).filter(Boolean) as string[]
      ),
    ];
    const avgPrice =
      viewedProperties.reduce((sum, p) => sum + p.price, 0) /
      viewedProperties.length;

    // Budget range (±30% of average)
    const minPrice = avgPrice * 0.7;
    const maxPrice = avgPrice * 1.3;

    // Build where conditions
    const whereConditions = [
      eq(properties.status, "published"),
      sql`${properties.id} NOT IN (${sql.join(viewedPropertyIds, sql`, `)})`,
    ];

    // Add budget conditions
    if (lead.budgetMin || lead.budgetMax) {
      if (lead.budgetMin) {
        whereConditions.push(sql`${properties.price} >= ${lead.budgetMin}`);
      }
      if (lead.budgetMax) {
        whereConditions.push(sql`${properties.price} <= ${lead.budgetMax}`);
      }
    } else {
      // Use calculated budget
      whereConditions.push(sql`${properties.price} >= ${minPrice}`);
      whereConditions.push(sql`${properties.price} <= ${maxPrice}`);
    }

    // Find similar properties that match preferences
    const candidateProperties = await db
      .select()
      .from(properties)
      .where(and(...whereConditions))
      .limit(20);

    // Score each property
    const scoredProperties = candidateProperties.map((property) => {
      let score = 50; // Base score

      // Property type match
      if (propertyTypes.includes(property.propertyType)) {
        score += 20;
      }

      // Neighborhood match
      if (property.neighborhood && neighborhoods.includes(property.neighborhood)) {
        score += 25;
      }

      // Price similarity
      const priceDiff = Math.abs(property.price - avgPrice) / avgPrice;
      if (priceDiff < 0.1) score += 15;
      else if (priceDiff < 0.2) score += 10;
      else if (priceDiff < 0.3) score += 5;

      // Featured properties get bonus
      if (property.featured) {
        score += 10;
      }

      // Recently added properties get slight bonus
      const daysSinceCreated =
        (Date.now() - new Date(property.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSinceCreated < 7) {
        score += 5;
      }

      return {
        property,
        score: Math.min(100, score),
      };
    });

    // Sort by score and take top 5
    const topRecommendations = scoredProperties
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Clear old recommendations
    await db
      .delete(propertyRecommendations)
      .where(eq(propertyRecommendations.leadId, leadId));

    // Save new recommendations
    if (topRecommendations.length > 0) {
      await db.insert(propertyRecommendations).values(
        topRecommendations.map((rec) => ({
          leadId,
          propertyId: rec.property.id,
          score: rec.score,
          reason: `Based on your interest in ${propertyTypes.join(", ")} properties${
            neighborhoods.length > 0 ? ` in ${neighborhoods.join(", ")}` : ""
          }`,
        }))
      );
    }

    return NextResponse.json({
      success: true,
      recommendations: topRecommendations.map((rec) => ({
        ...rec.property,
        recommendationScore: rec.score,
      })),
      preferences: {
        propertyTypes,
        neighborhoods,
        avgPrice,
        priceRange: { min: minPrice, max: maxPrice },
      },
    });
  } catch (error) {
    console.error("Generate recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

// Get existing recommendations for a lead
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID required" },
        { status: 400 }
      );
    }

    const recommendations = await db
      .select({
        id: propertyRecommendations.id,
        score: propertyRecommendations.score,
        reason: propertyRecommendations.reason,
        createdAt: propertyRecommendations.createdAt,
        property: properties,
      })
      .from(propertyRecommendations)
      .innerJoin(
        properties,
        eq(propertyRecommendations.propertyId, properties.id)
      )
      .where(eq(propertyRecommendations.leadId, parseInt(leadId)))
      .orderBy(desc(propertyRecommendations.score));

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
