# 🚀 Quick Start Guide

## Get Your Mekiya Platform Running in 5 Minutes!

### Step 1: Create Supabase Project (2 min)

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in:
   - Name: `Mekiya Real Estate`
   - Password: (save this!)
   - Region: Choose closest to you
4. Wait for setup (~2 min)

### Step 2: Get Your Credentials (1 min)

**Database URLs:**
1. Go to **Settings** → **Database**
2. Copy **Connection pooling** URL (port 6543)
3. Copy **Direct connection** URL (port 5432)

**API Keys:**
1. Go to **Settings** → **API**
2. Copy:
   - Project URL
   - anon public key
   - service_role key

### Step 3: Configure `.env.local` (1 min)

Replace ALL placeholders with your actual values:

```bash
DATABASE_URL=postgresql://postgres.xxxxx:yourpassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxxxx:yourpassword@aws-0-us-east-1.pooler.supabase.com:5432/postgres

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

JWT_SECRET=change-this-to-something-random-and-secure

NODE_ENV=development
```

### Step 4: Setup Database (1 min)

```bash
pnpm db:setup
```

Wait for it to complete. You should see:
- ✅ Schema pushed
- ✅ RLS policies applied
- ✅ Sample data seeded

### Step 5: Start the App!

```bash
pnpm dev
```

Visit: http://localhost:3000

### 🔐 Login to Admin

URL: http://localhost:3000/admin/login

**Credentials:**
- Email: `admin@mekiya.com`
- Password: `admin123`

---

## ✅ What You Get

- 🏢 **8 Sample Properties** (apartments & commercial)
- 👥 **5 Users** (1 admin, 1 manager, 3 agents)
- 🏘️ **5 Neighborhoods** in Addis Ababa
- 💬 **4 Testimonials**
- 🔐 **Full Security** (RLS policies enabled)

---

## 🆘 Something Wrong?

### Check Database Connection
```bash
pnpm db:check
```

Should show:
- ✅ DATABASE_URL set
- ✅ Connection successful
- ✅ Tables created

### Reset and Try Again
```bash
pnpm db:reset   # ⚠️ Deletes everything!
pnpm db:setup   # Setup from scratch
```

---

## 📚 Next Steps

1. ✅ Explore the admin dashboard
2. ✅ View public property listings
3. ✅ Check the full [README.md](./README.md)
4. ✅ Set up [Supabase Storage](./docs/SUPABASE_STORAGE_SETUP.md) for images
5. ✅ Customize and build your features!

---

**Need Help?** Open the full [README.md](./README.md) for detailed documentation.
