# 🏘️ Neighborhoods Management System

## Overview

Full admin interface to manage featured neighborhoods with images, descriptions, and pricing information.

---

## 🚀 Quick Setup

### Run SQL Migration in Supabase

```sql
-- Add featured and metadata fields to neighborhoods
ALTER TABLE "neighborhoods" 
ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL,
ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS "neighborhoods_featured_idx" ON "neighborhoods" ("featured");
CREATE INDEX IF NOT EXISTS "neighborhoods_sort_order_idx" ON "neighborhoods" ("sort_order");
```

Then restart your dev server: `pnpm dev`

---

## ✨ Features

### From Admin Dashboard

**Add Neighborhood:**
1. Go to **Admin → Neighborhoods**
2. Click **"Add Neighborhood"**
3. Fill in:
   - Name (required)
   - Description
   - CMC Block
   - Average price
   - Location coordinates (lat/lng)
   - Upload image
   - Mark as featured
   - Set sort order
4. Click **"Create Neighborhood"**

**Edit Neighborhood:**
1. Find the neighborhood card
2. Click **"Edit"** button
3. Update any fields
4. Upload/change image
5. Toggle featured status
6. Click **"Save Changes"**

**Delete Neighborhood:**
1. Click trash icon on neighborhood card
2. Confirm deletion
3. ⚠️ Cannot delete if properties are using it

---

## 🎨 Features

### Visual Cards
- Image or map pin icon
- Featured star badge
- Property count
- Average price
- CMC block info
- Location coordinates

### Featured Section
- Separate section for featured neighborhoods
- Shows on public website
- Can have multiple featured

### Validation
- Prevents duplicate names
- Prevents deletion if in use
- Auto-generates slug from name

---

## 📊 Fields

| Field | Type | Description |
|-------|------|-------------|
| Name | Required | Neighborhood name |
| Description | Optional | About the neighborhood |
| CMC Block | Optional | CMC identifier |
| Avg. Price | Optional | Average property price |
| Latitude | Optional | GPS coordinate |
| Longitude | Optional | GPS coordinate |
| Image | Optional | Neighborhood photo |
| Featured | Boolean | Show in featured section |
| Sort Order | Number | Display order (0 = first) |

---

## 🌐 Public Website Integration

Featured neighborhoods automatically appear on:
- Homepage featured section
- Neighborhoods page
- Property filters
- Property detail pages

---

## 🎯 Best Practices

1. **Images**: Use high-quality landscape photos
2. **Featured**: Keep 3-6 neighborhoods featured
3. **Pricing**: Update average prices quarterly
4. **Descriptions**: Keep under 200 characters
5. **Sort Order**: Use increments of 10 (0, 10, 20...)

---

**Ready to use!** Just run the SQL migration and start managing neighborhoods. 🚀
