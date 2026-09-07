# 🔧 Fix Image Errors & Display Property Type Images

## Problems Being Fixed

1. ❌ **400 errors** for `/images/*.jpg` files (old deleted placeholders still in database)
2. ❌ **Property type images** uploaded in admin but not showing on public website

---

## ✅ Solution Overview

### What Changed

1. **Property type images now display on public site**
   - Filter sidebar shows property type thumbnail images
   - Property types fetched from `property_types` table
   - Dynamic based on what you configure in admin

2. **Old broken image references cleaned up**
   - Script removes `/images/*` references from database
   - Fallback Pexels images used until you upload new ones
   - No more 400/422 errors

---

## 🚀 Quick Fix (2 Steps)

### Step 1: Clean Up Old Image References

Run this command to remove broken `/images/*` references:

```bash
pnpm db:cleanup-images
```

This will:
- Find all properties with `/images/*` in media array
- Find all neighborhoods with `/images/*` in imageUrl  
- Remove those broken references
- Set to `null` so fallback images are used

### Step 2: Restart Dev Server

```bash
pnpm dev
```

**Done!** ✅ No more 400 errors, and property type images will now display on the public website.

---

## 🎨 What You'll See

### Before
```
Filter sidebar:
☐ apartment  (6)
☐ commercial (2)
```

### After
```
Filter sidebar:
☐ [🏢 image] Apartment  (6)
☐ [🏪 image] Commercial (2)
```

Property type images you upload in **Admin → Property Types** will automatically appear in:
- ✅ Properties page filter sidebar
- ✅ Property type labels
- ✅ Any property type selectors

---

## 📊 Technical Details

### Files Modified

**Public website integration:**
- `/src/components/public/properties/PropertiesClient.tsx` - Now accepts `propertyTypes` prop
- `/src/app/(public)/properties/page.tsx` - Fetches property types from DB

**Database cleanup:**
- `/scripts/cleanup-images.ts` - Removes old `/images/*` references
- `/package.json` - Added `db:cleanup-images` command

### Database Schema

**Already exists** (created earlier):
```sql
-- property_types table with image support
CREATE TABLE property_types (
  id SERIAL PRIMARY KEY,
  value VARCHAR(50) UNIQUE NOT NULL,
  label VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  image_url TEXT,
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔍 Verify Everything Works

1. **Check no 400 errors:**
   - Open browser console
   - Navigate to properties page
   - Should see no `/images/*` errors

2. **Check property type images display:**
   - Go to **Properties** page
   - Open filter sidebar
   - Property types should show with thumbnail images

3. **Upload new property type image:**
   - Go to **Admin → Property Types**
   - Edit a type and upload image
   - Refresh properties page
   - Image should appear immediately

---

## 🎯 Next Steps

### Replace All Placeholder Images

Now that old references are cleaned:

1. **Property images:**
   - Edit each property in admin
   - Upload real images via drag & drop
   - Delete will replace Pexels fallbacks

2. **Neighborhood images:**
   - Go to **Admin → Neighborhoods**
   - Upload image for each neighborhood
   - Shows on featured sections

3. **Property type images:**
   - Go to **Admin → Property Types**
   - Upload representative image for each type
   - Shows in filters and listings

---

## 🆘 Troubleshooting

**Still seeing 400 errors?**
```bash
# Double-check cleanup ran
pnpm db:cleanup-images

# Verify in database
pnpm db:studio
# Check properties.media and neighborhoods.image_url columns
```

**Property type images not showing?**
```bash
# Verify property types exist in DB
pnpm db:studio
# Check property_types table has records

# Check types are active
# is_active should be TRUE
```

**Can't upload images in admin?**
- Check Supabase Storage is configured
- Verify bucket permissions (see SUPABASE_STORAGE_SETUP.md)
- Check `.env.local` has SUPABASE credentials

---

**Ready!** Run `pnpm db:cleanup-images` then restart your dev server. 🚀
