# 🔧 Troubleshooting Guide

## Issue 1: Missing Images (404 Errors)

### Problem
```
GET /images/hero-main.jpg 404
GET /images/prop-apartment.jpg 404
...
```

### Solution

**Quick Fix - Create empty files:**
```powershell
cd public\images
New-Item -ItemType File -Force hero-main.jpg, prop-apartment.jpg, prop-villa.jpg, prop-penthouse.jpg, prop-commercial.jpg, prop-office.jpg, about-office.jpg, neighborhood-bole.jpg
```

**Better Solution - Add real images:**
1. Download free images from [Unsplash](https://unsplash.com/)
2. Save them to `public/images/` folder
3. See [docs/IMAGES_SETUP.md](./docs/IMAGES_SETUP.md) for details

---

## Issue 2: Admin Route Not Found

### Problem
```
GET /admin/dashboard 404
```

### Solution

The correct routes are:

✅ **Login**: http://localhost:3000/admin/login
✅ **Dashboard**: http://localhost:3000/admin (NOT /admin/dashboard)

### Steps to Access Admin:

1. **Go to Login Page:**
   ```
   http://localhost:3000/admin/login
   ```

2. **Use These Credentials:**
   - Email: `admin@mekiya.com`
   - Password: `admin123`

3. **After Login, You'll Be Redirected to:**
   ```
   http://localhost:3000/admin
   ```

### Admin Routes:

| URL | Page |
|-----|------|
| `/admin/login` | Login page |
| `/admin` | Dashboard (requires auth) |
| `/admin/properties` | Properties management |
| `/admin/leads` | Leads management |
| `/admin/visits` | Visit requests |
| `/admin/agents` | Agent management |
| `/admin/analytics` | Analytics |
| `/admin/transactions` | Transactions |
| `/admin/settings` | Settings |

---

## Issue 3: Hydration Mismatch Warning

### Problem
```
A tree hydrated but some attributes of the server rendered HTML didn't match...
```

### Cause
This is usually caused by:
- Browser extensions (like Grammarly, password managers)
- The `sapling-aidetect-installed="true"` attribute added by AI detection extensions

### Solution
This warning doesn't break functionality. To fix:
1. Disable browser extensions temporarily
2. Or ignore it - it's cosmetic

---

## Common Commands

```bash
# Check database connection
pnpm db:check

# Re-seed database
pnpm db:seed

# Reset database (⚠️ destructive!)
pnpm db:reset

# View database in browser
pnpm db:studio

# Start dev server
pnpm dev
```

---

## Need More Help?

- **Database issues**: See [README.md](./README.md)
- **Image setup**: See [docs/IMAGES_SETUP.md](./docs/IMAGES_SETUP.md)
- **Supabase Storage**: See [docs/SUPABASE_STORAGE_SETUP.md](./docs/SUPABASE_STORAGE_SETUP.md)
- **Quick start**: See [QUICK_START.md](./QUICK_START.md)
