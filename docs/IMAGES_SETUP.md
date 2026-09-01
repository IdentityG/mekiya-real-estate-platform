# 📸 Images Setup Guide

Your application is looking for images in the `/public/images/` directory. Currently these images are missing, which is why you're seeing 404 errors.

## Quick Fix: Use Placeholder Images

### Option 1: Download from Unsplash (Recommended)

1. Visit https://unsplash.com/
2. Search for:
   - "modern apartment interior" → Save as `prop-apartment.jpg`
   - "luxury penthouse" → Save as `prop-penthouse.jpg`
   - "villa exterior" → Save as `prop-villa.jpg`
   - "office space" or "commercial building" → Save as `prop-commercial.jpg` and `prop-office.jpg`
   - "real estate office" → Save as `about-office.jpg`
   - "city skyline" → Save as `hero-main.jpg`
   - "addis ababa bole" → Save as `neighborhood-bole.jpg`

3. Save all images to: `public/images/`

### Option 2: Use Online Placeholders (Temporary)

Update your image components to use online placeholders. For example, in your components, change:

```tsx
// Instead of:
<img src="/images/prop-apartment.jpg" />

// Use:
<img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop" />
```

### Option 3: Generate Solid Color Placeholders

Create simple colored placeholder images:

#### Windows PowerShell Script

```powershell
# Run this in your project directory
cd public/images

# This creates 1x1 pixel placeholders (browsers will scale them)
# You'll need actual images for production
Write-Host "Creating placeholder files..."
New-Item -ItemType File -Force -Path "hero-main.jpg"
New-Item -ItemType File -Force -Path "prop-apartment.jpg"
New-Item -ItemType File -Force -Path "prop-villa.jpg"
New-Item -ItemType File -Force -Path "prop-penthouse.jpg"
New-Item -ItemType File -Force -Path "prop-commercial.jpg"
New-Item -ItemType File -Force -Path "prop-office.jpg"
New-Item -ItemType File -Force -Path "about-office.jpg"
New-Item -ItemType File -Force -Path "neighborhood-bole.jpg"
Write-Host "✅ Placeholder files created"
```

## Required Images

| Filename | Recommended Size | Usage |
|----------|-----------------|--------|
| `hero-main.jpg` | 1920x1080 | Homepage hero section |
| `prop-apartment.jpg` | 800x600 | Property listings |
| `prop-villa.jpg` | 800x600 | Property listings |
| `prop-penthouse.jpg` | 800x600 | Property listings |
| `prop-commercial.jpg` | 800x600 | Commercial properties |
| `prop-office.jpg` | 800x600 | Office spaces |
| `about-office.jpg` | 1200x800 | About page |
| `neighborhood-bole.jpg` | 600x400 | Neighborhood pages |

## Property-Specific Images

When you create properties in the admin panel, you can upload images to Supabase Storage (see [SUPABASE_STORAGE_SETUP.md](./SUPABASE_STORAGE_SETUP.md)).

The `media` field in properties stores an array of image URLs from Supabase Storage.

## Free Image Resources

- **Unsplash**: https://unsplash.com/ (Free, high-quality)
- **Pexels**: https://www.pexels.com/ (Free, no attribution)
- **Pixabay**: https://pixabay.com/ (Free, diverse collection)
- **Picsum**: https://picsum.photos/ (Placeholder service)

## Next.js Image Optimization

Your project uses Next.js `<Image>` components which provide:
- ✅ Automatic image optimization
- ✅ Lazy loading
- ✅ Responsive images
- ✅ WebP conversion

Make sure images are reasonably sized (< 2MB each) for best performance.
