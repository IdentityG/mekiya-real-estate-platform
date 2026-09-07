# 📸 Image Uploader Setup & Usage Guide

This guide explains how to use the new multiple image uploader feature in the admin panel.

## ✨ What's New

The admin panel now has a **drag-and-drop multiple image uploader** instead of a text field for image URLs. You can:

- ✅ Upload multiple images at once
- ✅ Drag and drop images directly
- ✅ See image previews before saving
- ✅ Remove individual images
- ✅ Automatically stores images in Supabase Storage
- ✅ Images appear immediately on the public website

## 🚀 Setup Requirements

### 1. Supabase Storage Bucket

First, create the `property-images` bucket in Supabase:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Storage** → **Create bucket**
4. Create a new bucket with these settings:
   - **Name**: `property-images`
   - **Public**: ✅ Yes (checked)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`

### 2. Storage Policies

Apply these security policies via **SQL Editor** in Supabase:

```sql
-- Allow public read access (anyone can view images)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update
CREATE POLICY "Users can update property images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Users can delete property images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images'
  AND auth.role() = 'authenticated'
);
```

### 3. Environment Variables

Make sure your `.env.local` file has these Supabase variables:

```bash
# Supabase API (for Storage)
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Get these from: [Supabase Dashboard → Settings → API](https://app.supabase.com/project/_/settings/api)

## 📝 How to Use

### Adding Images to a New Property

1. Go to **Admin Dashboard** → **Properties**
2. Click **"New Listing"**
3. Fill in the basic property details
4. Scroll to the **"Media"** section
5. **Drag and drop** images, or click to browse
6. Upload multiple images at once
7. The **first image** will be the cover/hero image
8. Click **"Create Listing"**

### Editing Images on Existing Properties

1. Go to **Admin Dashboard** → **Properties**
2. Find the property and click the **Edit** button
3. Scroll to the **"Media"** section
4. You'll see existing images (if any)
5. **Add more images**: Drag & drop or click to browse
6. **Remove images**: Hover over an image and click the **X** button
7. **Reorder**: The first image is always the cover (manual reordering not yet implemented)
8. Click **"Save Changes"**

## 🎨 Features

### Drag and Drop
- Drag one or multiple images directly into the upload zone
- Visual feedback when dragging over the zone

### Multiple Upload
- Select and upload multiple images simultaneously
- Progress indicator shows when uploading

### Image Preview
- See thumbnails of all uploaded images
- First image marked as "COVER"
- Hover to see remove button

### Validation
- **Accepted formats**: JPEG, PNG, WebP
- **Max file size**: 5MB per image
- **Automatic validation**: Invalid files are rejected with an error message

### Storage Organization
- Images stored in Supabase Storage bucket `property-images`
- Organized by property: `/propertyId/timestamp.jpg`
- New properties store in `/temp/` until property is created

## 🌐 How Images Appear on Website

### Automatic Display

Once you upload images in the admin panel and save the property:

1. **Property Detail Page** (`/properties/[slug]`)
   - Shows all uploaded images in the gallery
   - First image is the hero/cover image
   - Click to view in lightbox/fullscreen
   - Navigate between images with arrows

2. **Property Listings Page** (`/properties`)
   - Shows first 2 images in each card
   - Hover effect alternates between images
   - First image is the main thumbnail

3. **Similar Properties**
   - Uses same logic as property cards

### Fallback Behavior

If no images are uploaded, the system falls back to:
- Hardcoded placeholder images based on property type
- Located in `/public/images/prop-*.jpg`

## 🔧 Technical Details

### API Endpoint

**POST `/api/admin/upload`**
- Uploads a single file to Supabase Storage
- Returns public URL

**DELETE `/api/admin/upload?fileName=path/to/file.jpg`**
- Deletes a file from Supabase Storage

### Components

- **ImageUploader** (`/src/components/admin/ImageUploader.tsx`)
  - Reusable drag-and-drop uploader component
  - Handles multiple file uploads
  - Preview and remove functionality

- **AdminPropertiesClient** (`/src/components/admin/AdminPropertiesClient.tsx`)
  - Integrated ImageUploader in the property form
  - Manages uploaded images state

### Database

Images are stored as an array of URLs in the `media` column:

```typescript
media: string[] | null  // ["url1", "url2", "url3"]
```

## 🐛 Troubleshooting

### Upload fails with "Failed to upload file"

**Solution:**
1. Check Supabase bucket exists and is named `property-images`
2. Verify bucket is set to **Public**
3. Check that storage policies are applied correctly
4. Verify environment variables in `.env.local`

### Images don't appear on website

**Solution:**
1. Make sure the property status is **"published"**
2. Check browser console for 404 errors
3. Verify image URLs in database are accessible
4. Clear browser cache and refresh

### "Invalid file type" error

**Solution:**
- Only JPEG, PNG, and WebP are supported
- Convert images to supported format
- Check file extension matches actual format

### "File too large" error

**Solution:**
- Max file size is 5MB per image
- Compress or resize images before uploading
- Use tools like TinyPNG or ImageOptim

### Images upload but don't save to property

**Solution:**
1. Make sure to click **"Save Changes"** or **"Create Listing"**
2. Check browser console for API errors
3. Verify database connection

## 📊 Storage Limits

| Plan | Storage | Bandwidth | Monthly |
|------|---------|-----------|---------|
| **Free** | 1 GB | 2 GB | $0 |
| **Pro** | 100 GB | 200 GB | $25 |

For production, consider the **Pro** plan for adequate storage and bandwidth.

## 🎯 Best Practices

1. **Image Quality**
   - Use high-quality images (1920x1080 or higher)
   - Compress images before uploading to save storage
   - Use JPG for photos, PNG for graphics with transparency

2. **Cover Image**
   - Upload the best photo first (it becomes the cover)
   - Use a wide-angle shot showing the full property

3. **Image Count**
   - Upload 5-10 images per property
   - Show different rooms and angles
   - Include exterior and interior shots

4. **File Naming**
   - Original filename doesn't matter (automatically renamed)
   - System uses timestamp-based names

5. **Organization**
   - Edit properties to update images anytime
   - Remove old/outdated images regularly

## 🔐 Security

- ✅ Only authenticated admin users can upload
- ✅ File type validation (client and server)
- ✅ File size limits enforced
- ✅ Images stored in isolated bucket
- ✅ Public read-only access for website visitors
- ✅ Automatic URL generation (no manual entry)

## 🚀 Next Steps

1. ✅ Set up Supabase bucket and policies (see above)
2. ✅ Verify environment variables
3. ✅ Test uploading images to a property
4. ✅ Check property page on public website
5. ✅ Train other admins on the new system

## 💡 Tips

- **Batch Upload**: Select multiple images at once to save time
- **Preview Before Save**: Review all images before clicking save
- **Mobile Friendly**: Upload zone works on tablets and mobile devices
- **Quick Remove**: Hover and click X to remove unwanted images
- **No Internet Needed for Previews**: Previews work offline before upload

---

**Need help?** Contact the development team or check the [Supabase Storage Documentation](https://supabase.com/docs/guides/storage).
