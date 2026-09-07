/**
 * Clean up old /images/* references in database
 * Replaces them with null so fallback images are used
 */

import "dotenv/config";
import { db } from "../src/db";
import { properties, neighborhoods } from "../src/db/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🧹 Cleaning up old image references...\n");

  // Clean properties media array - remove /images/* entries
  const allProps = await db.select().from(properties);
  
  let cleanedProps = 0;
  for (const prop of allProps) {
    if (Array.isArray(prop.media) && prop.media.length > 0) {
      const cleaned = prop.media.filter(url => !url.startsWith('/images/'));
      
      if (cleaned.length !== prop.media.length) {
        await db
          .update(properties)
          .set({ 
            media: cleaned.length > 0 ? cleaned : null,
            updatedAt: new Date()
          })
          .where(sql`id = ${prop.id}`);
        
        cleanedProps++;
        console.log(`✓ Cleaned property #${prop.id} "${prop.title}"`);
        console.log(`  Removed: ${prop.media.filter(u => u.startsWith('/images/')).join(', ')}`);
      }
    }
  }

  // Clean neighborhoods imageUrl
  const allHoods = await db.select().from(neighborhoods);
  
  let cleanedHoods = 0;
  for (const hood of allHoods) {
    if (hood.imageUrl && hood.imageUrl.startsWith('/images/')) {
      await db
        .update(neighborhoods)
        .set({ 
          imageUrl: null,
          updatedAt: new Date()
        })
        .where(sql`id = ${hood.id}`);
      
      cleanedHoods++;
      console.log(`✓ Cleaned neighborhood "${hood.name}"`);
      console.log(`  Removed: ${hood.imageUrl}`);
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Properties cleaned: ${cleanedProps}`);
  console.log(`   Neighborhoods cleaned: ${cleanedHoods}`);
  console.log(`\n💡 Old /images/* references removed. Fallback images will be used.`);
  
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
