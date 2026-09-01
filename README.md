# Mekiya Real Estate Platform

A modern, full-stack real estate platform built with Next.js 15, PostgreSQL (Supabase), Drizzle ORM, and TypeScript. Features property listings, agent management, lead tracking, and a comprehensive admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-green)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-purple)

## ✨ Features

### Public Features
- 🏢 Property listings (sale & rent)
- 🔍 Advanced search and filtering
- 🗺️ Neighborhood exploration
- 📅 Visit request scheduling
- 💬 Testimonials and reviews
- 📱 Fully responsive design

### Admin Dashboard
- 👥 User & agent management
- 🏠 Property CRUD operations
- 📊 Analytics and reporting
- 🎯 Lead management pipeline
- 📅 Visit scheduling system
- 💰 Transaction tracking
- ⚙️ Site settings management

### Technical Features
- 🔐 Row Level Security (RLS) policies
- 🗄️ Database migrations with Drizzle
- 📦 Supabase Storage integration
- 🎨 Modern UI with Tailwind CSS
- 🎭 Framer Motion animations
- 🔒 JWT-based authentication
- 📈 Role-based access control

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- A Supabase account ([Sign up free](https://supabase.com))

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd mekiya-real-estate-platform
pnpm install
```

### 2. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: Mekiya Real Estate
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Wait for project to be provisioned (~2 minutes)

### 3. Get Database Credentials

**In Supabase Dashboard:**

1. Go to **Settings** → **Database**
2. Scroll to **Connection String**
3. Copy both:
   - **Connection pooling** (port 6543) - for DATABASE_URL
   - **Direct connection** (port 5432) - for DIRECT_URL

**Get API Keys:**

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** - for NEXT_PUBLIC_SUPABASE_URL
   - **anon public** - for NEXT_PUBLIC_SUPABASE_ANON_KEY
   - **service_role** (secret) - for SUPABASE_SERVICE_ROLE_KEY

### 4. Configure Environment

Open `.env.local` and replace placeholders with your actual credentials:

```bash
# Database URLs from Supabase > Settings > Database
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

# API Keys from Supabase > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Generate a secure random string (https://generate-secret.vercel.app/)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

NODE_ENV=development
```

### 5. Setup Database (One Command!)

```bash
pnpm db:setup
```

This single command will:
1. ✅ Push schema to database
2. ✅ Apply Row Level Security policies
3. ✅ Seed with sample data

**OR** run steps manually:

```bash
pnpm db:push          # Push schema
pnpm db:apply-rls     # Apply security policies
pnpm db:seed          # Add sample data
```

### 6. Verify Setup

```bash
pnpm db:check
```

You should see:
- ✅ Database connection successful
- ✅ All tables created
- ✅ Environment variables set

### 7. Start Development Server

```bash
pnpm dev
```

Visit: http://localhost:3000

## 🔐 Login Credentials

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | admin@mekiya.com | admin123 |
| **Sales Manager** | sarah@mekiya.com | agent123 |
| **Agent** | michael@mekiya.com | agent123 |
| **Agent** | amira@mekiya.com | agent123 |
| **Agent** | david@mekiya.com | agent123 |

Access admin panel: http://localhost:3000/admin/login

## 📦 Database Scripts

| Command | Description |
|---------|-------------|
| `pnpm db:setup` | Complete setup (push + RLS + seed) |
| `pnpm db:push` | Push schema to database |
| `pnpm db:apply-rls` | Apply security policies |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:reset` | Drop all tables (destructive!) |
| `pnpm db:check` | Verify database connection |
| `pnpm db:studio` | Open Drizzle Studio GUI |
| `pnpm db:generate` | Generate new migration |

## 🗄️ Database Schema

### Tables

- **users** - User accounts with role-based access
- **properties** - Property listings (apartments & commercial)
- **visit_requests** - Property visit scheduling
- **leads** - Lead management with pipeline stages
- **transactions** - Payment and transaction records
- **testimonials** - Customer reviews
- **neighborhoods** - Area information and stats
- **site_settings** - Configurable site settings

### User Roles

- `public` - Regular users (can view listings)
- `agent` - Real estate agents (manage own properties)
- `sales_manager` - Sales managers (manage all properties)
- `super_admin` - Platform administrators (full access)

## 🔐 Security Features

### Row Level Security (RLS)

All tables are protected with RLS policies:

- ✅ Public can view published properties
- ✅ Agents can only manage their own properties
- ✅ Managers can access all properties
- ✅ Users can only update their own profiles
- ✅ Role changes require super_admin

### Helper Functions

- `get_user_role()` - Returns current user's role
- `get_user_id()` - Returns current user's ID
- `is_staff()` - Checks if user is staff member

### Best Practices

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Connection pooling for performance
- Prepared statements prevent SQL injection
- HTTPS enforced in production

## 📦 Supabase Storage Setup

### Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create these buckets:

**property-images** (Public)
- Size limit: 5 MB
- MIME types: image/jpeg, image/png, image/webp

**avatars** (Public)
- Size limit: 2 MB
- MIME types: image/jpeg, image/png, image/webp

For detailed setup instructions, see: [docs/SUPABASE_STORAGE_SETUP.md](./docs/SUPABASE_STORAGE_SETUP.md)

## 🎨 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Backend
- **PostgreSQL** - Relational database (via Supabase)
- **Drizzle ORM** - Type-safe database queries
- **Supabase** - Database hosting + Storage + Auth
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

### Developer Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **tsx** - TypeScript execution
- **Drizzle Kit** - Database migrations

## 📁 Project Structure

```
mekiya-real-estate-platform/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── (public)/          # Public pages
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── properties/    # Property listings
│   │   │   ├── agents/        # Agent directory
│   │   │   └── ...
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── (dashboard)/   # Dashboard pages
│   │   │   └── login/         # Admin login
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── db/                    # Database
│   │   ├── index.ts          # Database connection
│   │   └── schema.ts         # Drizzle schema
│   └── lib/                   # Utilities
│       ├── supabase.ts       # Supabase client
│       └── auth.ts           # Auth helpers
├── drizzle/                   # Database migrations
│   ├── 0000_initial_schema.sql
│   └── 0001_rls_policies.sql
├── scripts/                   # Database scripts
│   ├── seed.ts               # Seed data
│   ├── reset.ts              # Reset database
│   ├── apply-rls.ts          # Apply RLS
│   └── check-connection.ts   # Connection test
├── docs/                      # Documentation
│   └── SUPABASE_STORAGE_SETUP.md
├── .env.local                 # Environment variables (gitignored)
├── .env.example              # Environment template
├── drizzle.config.json       # Drizzle configuration
└── package.json              # Dependencies and scripts
```

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in Vercel:

```
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET
NODE_ENV=production
```

### Production Checklist

- [ ] Change all default passwords
- [ ] Generate secure JWT_SECRET
- [ ] Enable Supabase SSL in production
- [ ] Set up custom domain
- [ ] Configure CORS policies
- [ ] Enable Supabase database backups
- [ ] Set up monitoring and alerts
- [ ] Add rate limiting to API routes

## 🛠️ Development

### Code Quality

```bash
pnpm lint          # Run ESLint
pnpm typecheck     # Check TypeScript types
```

### Database Development

```bash
# Make schema changes in src/db/schema.ts, then:
pnpm db:generate   # Generate migration
pnpm db:push       # Apply to database
```

### Debugging

```bash
pnpm db:check      # Check connection
pnpm db:studio     # Visual database browser
```

## 📝 Common Issues

### "DATABASE_URL is required"

- Verify `.env.local` exists and has DATABASE_URL
- Restart dev server after adding env vars

### Connection Timeout

- Check Supabase project is active
- Verify connection string format
- Ensure password doesn't have special characters (or URL encode it)

### RLS Policies Blocking Queries

- Run `pnpm db:apply-rls` to apply policies
- Check if user has correct role in database
- Review helper functions in RLS file

### Can't Login to Admin

- Verify database is seeded: `pnpm db:seed`
- Check password is exactly: `admin123`
- Clear browser cookies and try again

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Supabase](https://supabase.com)
- ORM by [Drizzle](https://orm.drizzle.team/)
- UI inspired by modern real estate platforms

---

**Need Help?** Check out the [docs](./docs/) folder or open an issue!

**Happy Coding! 🚀**
