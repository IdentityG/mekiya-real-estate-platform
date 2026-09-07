# 🔄 Property Types Dynamic Management - Migration Guide

## What Changed?

Property types are now fully dynamic! You can add, edit, and delete them directly from the admin dashboard with custom images.

---

## 🚀 Quick Setup (2 steps)

### Step 1: Run the Migration SQL

Go to your **Supabase SQL Editor** and run this:

```sql
-- Create property_types table for dynamic management
CREATE TABLE IF NOT EXISTS "property_types" (
  "id" serial PRIMARY KEY NOT NULL,
  "value" varchar(50) NOT NULL UNIQUE,
  "label" varchar(100) NOT NULL,
  "description" text,
  "icon" varchar(50) DEFAULT 'Building2',
  "image_url" text,
  "color" varchar(20) DEFAULT '#C4A96B',
  "is_active" boolean DEFAULT true,
  "sort_order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Insert default property types (migrating from enum)
INSERT INTO "property_types" ("value", "label", "description", "icon", "sort_order", "is_active") VALUES
  ('apartment', 'Apartment', 'Residential apartments and condominiums', 'Home', 0, true),
  ('commercial', 'Commercial', 'Office spaces, retail, and business properties', 'Building2', 1, true)
ON CONFLICT (value) DO NOTHING;

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS "property_types_value_idx" ON "property_types" ("value");
CREATE INDEX IF NOT EXISTS "property_types_is_active_idx" ON "property_types" ("is_active");
```

### Step 2: Restart Your Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
pnpm dev
```

That's it! 🎉

---

## ✨ New Features

### From Admin Dashboard

**Add New Property Type:**
1. Go to **Admin → Property Types**
2. Click **"Add Property Type"**
3. Fill in:
   - **Value**: Database key (e.g., `villa`, `land`, `warehouse`)
   - **Label**: Display name (e.g., "Villa", "Land", "Warehouse")
   - **Description**: Brief description
   - **Icon**: Choose from 6 icons
   - **Color**: Pick custom color
   - **Image**: Upload representative image (optional)
4. Click **"Create Property Type"**

**Edit Existing Type:**
1. Find the property type card
2. Click **"Edit"** button
3. Update any fields
4. Upload/change image
5. Click **"Save Changes"**

**Delete Type:**
1. Click the **trash icon** on any type card
2. Confirm deletion
3. ⚠️ Warning: Properties using this type may be affected

---

## 🎨 Customization Options

### Visual Settings

**Icon Options:**
- Home (residential)
- Building (general properties)
- Office (commercial spaces)
- Warehouse (industrial)
- Villa/Land (estates)
- Map (land plots)

**Color:**
- Pick any hex color
- Default: #C4A96B (brass)
- Used for icon background and accents

**Image:**
- Upload custom image for each type
- Displayed on property type cards
- Optional - falls back to icon if not provided

### Organization

**Sort Order:**
- Control display order (0 = first)
- Lower numbers appear first
- Update anytime

**Active/Inactive:**
- Toggle visibility
- Inactive types hidden from property forms
- Doesn't affect existing properties

---

## 📊 Database Schema

```typescript
property_types {
  id: number              // Auto-increment primary key
  value: string           // Database key (unique, lowercase)
  label: string           // Display name
  description: string     // Optional description
  icon: string            // Icon name (Home, Building2, etc.)
  imageUrl: string        // Uploaded image URL
  color: string           // Hex color code
  isActive: boolean       // Visibility toggle
  sortOrder: number       // Display order
  createdAt: timestamp    // Creation date
  updatedAt: timestamp    // Last update
}
```

---

## 🔄 Migration Notes

### Before (Enum-based)
- ❌ Required database migrations to add types
- ❌ Code changes needed
- ❌ No images or customization
- ❌ Fixed set of types

### After (Table-based)
- ✅ Add types from admin dashboard
- ✅ No code changes needed
- ✅ Full customization (images, colors, icons)
- ✅ Dynamic and flexible

---

## 🎯 Usage in Code

Property types are automatically loaded everywhere. The system seamlessly integrates with:

- **Property Forms**: Dropdown auto-populated
- **Property Cards**: Types displayed with custom colors
- **Filters**: Type filters auto-generated
- **Labels**: Helper functions work automatically

No code changes needed! Everything updates dynamically.

---

## ⚠️ Important Notes

1. **Don't Delete Active Types**: Check property count before deleting
2. **Value is Permanent**: Can't change value after creation (only label)
3. **Existing Properties**: Will continue to work with their current types
4. **Enum Still Exists**: The old enum is still in the schema but not used

---

## 🐛 Troubleshooting

### Migration fails
- Check Supabase connection
- Verify you have admin permissions
- Run SQL manually in Supabase dashboard

### Types don't appear in forms
- Restart dev server
- Check `isActive` is true
- Verify database has records

### Images not uploading
- Check Supabase storage bucket exists
- Verify image size < 5MB
- Check file type (JPEG, PNG, WebP only)

---

## 📈 Future Enhancements

Planned features:
- [ ] Bulk import/export property types
- [ ] Type categories/groups
- [ ] Usage analytics per type
- [ ] Type-specific custom fields
- [ ] Type templates for quick setup

---

**Questions?** Check the admin UI - it's intuitive and self-explanatory!
