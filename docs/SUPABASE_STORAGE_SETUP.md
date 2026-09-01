# Supabase Storage Setup Guide

This guide walks you through setting up Supabase Storage for property images and other media files in the Mekiya Real Estate Platform.

## 📦 Storage Buckets Overview

The platform uses Supabase Storage to handle all media uploads including:
- Property images
- Agent avatars
- Neighborhood images
- Testimonial avatars

## 🚀 Quick Setup

### Step 1: Create Storage Buckets

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Create the following buckets:

#### Create "property-images" bucket
```
Name: property-images
Public: ✅ Yes (public access for property listings)
File size limit: 5 MB
Allowed MIME types: image/jpeg, image/png, image/webp
```

#### Create "avatars" bucket
```
Name: avatars
Public: ✅ Yes (public access for profile pictures)
File size limit: 2 MB
Allowed MIME types: image/jpeg, image/png, image/webp
```

#### Create "documents" bucket (optional)
```
Name: documents
Public: ❌ No (private for contracts, agreements)
File size limit: 10 MB
Allowed MIME types: application/pdf, image/jpeg, image/png
```

### Step 2: Configure Storage Policies

For each bucket, you'll need to set up Storage Policies for security.

#### For "property-images" bucket

**1. Allow public read access (anyone can view images):**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );
```

**2. Allow authenticated users to upload:**
```sql
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);
```

**3. Allow property owners to update their images:**
```sql
CREATE POLICY "Users can update own property images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images'
  AND auth.role() = 'authenticated'
);
```

**4. Allow staff to delete images:**
```sql
CREATE POLICY "Staff can delete property images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images'
  AND auth.role() = 'authenticated'
);
```

#### For "avatars" bucket

**1. Public read access:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );
```

**2. Users can upload/update their own avatar:**
```sql
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Step 3: Apply Policies via SQL Editor

1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste all the policies above
4. Click **Run** to apply them

## 💻 Usage in Code

### Upload Property Image

```typescript
import { supabase } from '@/lib/supabase';

async function uploadPropertyImage(file: File, propertyId: number) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('property-images')
    .getPublicUrl(fileName);
  
  return publicUrl;
}
```

### Upload Avatar

```typescript
async function uploadAvatar(file: File, userId: number) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true // Replace existing avatar
    });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
  
  return publicUrl;
}
```

### Delete Image

```typescript
async function deletePropertyImage(filePath: string) {
  const { error } = await supabase.storage
    .from('property-images')
    .remove([filePath]);
  
  if (error) {
    console.error('Delete error:', error);
    return false;
  }
  
  return true;
}
```

### List Files in a Folder

```typescript
async function listPropertyImages(propertyId: number) {
  const { data, error } = await supabase.storage
    .from('property-images')
    .list(`${propertyId}/`, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });
  
  if (error) {
    console.error('List error:', error);
    return [];
  }
  
  return data;
}
```

## 🔐 Security Best Practices

1. **Always validate file types** on the client and server
2. **Limit file sizes** to prevent abuse
3. **Use meaningful folder structures**: `{entityId}/{timestamp}.{ext}`
4. **Enable RLS policies** for all buckets
5. **Use signed URLs** for private documents
6. **Implement virus scanning** for production (Supabase Pro feature)

## 📊 Storage Limits

| Plan | Storage | Bandwidth |
|------|---------|-----------|
| Free | 1 GB | 2 GB |
| Pro | 100 GB | 200 GB |
| Team | 100 GB | 200 GB |
| Enterprise | Custom | Custom |

## 🛠️ Helper Function

Create a utility file for storage operations:

```typescript
// src/lib/storage.ts
import { supabase } from '@/lib/supabase';

export const storage = {
  // Property images
  async uploadPropertyImage(file: File, propertyId: number): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file);
    
    if (error) return null;
    
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },
  
  // Avatar images
  async uploadAvatar(file: File, userId: number): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });
    
    if (error) return null;
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },
  
  // Delete file
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    return !error;
  }
};
```

## 📝 Next Steps

1. ✅ Create the storage buckets in Supabase Dashboard
2. ✅ Apply the security policies via SQL Editor
3. ✅ Test uploads with the provided code examples
4. ✅ Integrate into your property creation forms
5. ✅ Add image optimization (using Next.js Image component)

## 🆘 Troubleshooting

### Upload fails with "new row violates row-level security policy"
- Check that storage policies are correctly applied
- Verify user is authenticated
- Ensure bucket name matches exactly

### Images not loading
- Verify bucket is set to "Public"
- Check that `publicUrl` is being generated correctly
- Inspect network tab for CORS errors

### File size errors
- Check bucket file size limits
- Validate file size on client before upload
- Consider compressing images before upload

## 📚 References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage Security Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
