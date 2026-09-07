# 🎯 Admin Features Update - Agents & Property Types

## Overview

This update adds comprehensive management features to the admin dashboard:
1. **Full Agent Editing** - Edit all agent details including avatar, bio, specialty
2. **Property Types Management** - View and manage property types with detailed instructions

---

## ✨ What's New

### 1. Enhanced Agent Management

#### **Before:**
- ❌ Could only change agent role
- ❌ No way to edit agent details after creation
- ❌ No avatar upload
- ❌ No bio editing
- ❌ Limited creation form

#### **After:**
- ✅ Full edit modal for all agent details
- ✅ Avatar upload with image uploader
- ✅ Edit name, email, phone, specialty, bio
- ✅ Role management (Agent → Manager)
- ✅ Visual agent cards with stats
- ✅ Comprehensive creation form

### 2. Property Types Management

#### New Features:
- ✅ View all property types with counts
- ✅ See how many properties use each type
- ✅ Step-by-step guide to add new types
- ✅ Technical documentation for database updates
- ✅ Code examples for all required changes

---

## 📋 Features Breakdown

### Agent Management (`/admin/agents`)

#### View Agent Cards
- **Avatar Display**: Shows agent initials or uploaded photo
- **Role Badges**: Visual distinction between Agents, Managers, Super Admins
- **Stats Display**:
  - Listings count
  - Leads count
  - Leads per listing ratio
- **Quick Info**: Specialty and phone number

#### Edit Agent Details
Click "Edit Details" button on any agent card to open full edit modal:

**Basic Information:**
- Full name
- Email address
- Password (add only, not edit)
- Role (Agent / Sales Manager)
- Phone number

**Professional Details:**
- Specialty (e.g., "Commercial Properties")
- Bio (detailed description of experience)

**Profile Photo:**
- Upload avatar using drag-and-drop
- Single image (square format recommended)
- Stored in Supabase Storage
- Automatically displayed on public website

#### Add New Team Member
- Create new agent or manager accounts
- Set temporary password
- Upload profile photo during creation
- All fields available at creation time

### Property Types Management (`/admin/property-types`)

#### View Current Types
- **Type Cards**: Visual display of each property type
- **Usage Stats**: See how many properties use each type
- **Technical Info**: Shows database enum value

#### Current Property Types
1. **Apartment**
   - Residential apartments and condominiums
   - Icon: Home
   
2. **Commercial**
   - Office spaces, retail, and business properties
   - Icon: Building

#### Add New Types
Comprehensive guide with 5 steps:

1. **Update Database Schema**
   - Edit `src/db/schema.ts`
   - Add new enum values

2. **Create Migration**
   - Run `pnpm drizzle-kit generate:pg`

3. **Apply to Database**
   - Run ALTER TYPE SQL commands
   - Done via Supabase SQL Editor

4. **Update Property Form**
   - Add options to dropdown in admin

5. **Update Helper Functions**
   - Add labels in `src/lib/utils.ts`

---

## 🗂️ Files Modified

### Components

#### `/src/components/admin/AdminAgentsClient.tsx`
**Major Changes:**
- ✅ Added `useEffect` for modal state management
- ✅ Added `uploadedAvatar` state for image handling
- ✅ Replaced "Add" button with "Add/Edit" modal system
- ✅ Added "Edit Details" button to each card
- ✅ Added `ImageUploader` component integration
- ✅ Unified `saveForm` function for both add and edit
- ✅ Enhanced form with bio, avatar, and all fields
- ✅ Modal now scrollable with fixed header/footer

**Modal Features:**
- Full-screen on mobile, modal on desktop
- Scrollable content area
- Fixed header with title
- Fixed footer with action buttons
- Organized sections: Basic Info, Professional Details, Avatar

### API Routes

#### `/src/app/api/admin/users/route.ts`
**Changes to PUT:**
- ✅ Added `email` update support
- ✅ Added `avatarUrl` update support
- ✅ Already had `bio` support

**Changes to POST:**
- ✅ Added `avatarUrl` field to creation

### Pages

#### `/src/app/admin/(dashboard)/agents/page.tsx`
**Changes:**
- ✅ Added `avatarUrl` to select query
- ✅ Passes avatar to client component

#### `/src/app/admin/(dashboard)/property-types/page.tsx`
**New File:**
- Server component
- Fetches property type counts
- Provides hardcoded type definitions
- Passes data to client

### New Components

#### `/src/components/admin/AdminPropertyTypesClient.tsx`
**Features:**
- Property type cards with icons
- Usage statistics
- Info banner about database enums
- Detailed 5-step guide
- Code examples with syntax highlighting
- Info modal
- Responsive design

### Navigation

#### `/src/components/admin/AdminSidebar.tsx`
**Changes:**
- ✅ Added new "Configuration" section
- ✅ Added "Property Types" link
- ✅ Icon: Settings
- ✅ Updated navigation structure

---

## 🎨 User Experience

### Agent Cards - Enhanced Visual Design
```
┌─────────────────────────────────────┐
│ [Avatar] Name                [Badge]│
│          email@example.com          │
├─────────┬──────────┬────────────────┤
│ Listings│  Leads   │ Leads/Listing  │
│   12    │    45    │      3.8       │
├─────────────────────────────────────┤
│ Specialty: Commercial Properties    │
│ Phone: +251 912 345678              │
├─────────────────────────────────────┤
│ [Edit Details] [Role Dropdown ▼]    │
└─────────────────────────────────────┘
```

### Edit Modal - Full Form
```
┌────────────────────────────────────┐
│ Edit — Agent Name            [✕]   │
├────────────────────────────────────┤
│                                    │
│ BASIC INFORMATION                  │
│ ┌────────────────────────────────┐ │
│ │ Full name:                     │ │
│ │ [John Smith                  ] │ │
│ │                                │ │
│ │ Email:                         │ │
│ │ [john@mekiya.com            ] │ │
│ │                                │ │
│ │ Role:      Phone:              │ │
│ │ [Agent ▼]  [+251...         ] │ │
│ └────────────────────────────────┘ │
│                                    │
│ PROFESSIONAL DETAILS               │
│ ┌────────────────────────────────┐ │
│ │ Specialty:                     │ │
│ │ [Commercial Properties      ] │ │
│ │                                │ │
│ │ Bio:                           │ │
│ │ [                            ] │ │
│ │ [                            ] │ │
│ └────────────────────────────────┘ │
│                                    │
│ PROFILE PHOTO                      │
│ ┌────────────────────────────────┐ │
│ │  Drop image or click to browse │ │
│ │         [Preview]              │ │
│ └────────────────────────────────┘ │
│                                    │
├────────────────────────────────────┤
│ [   Save Changes   ]  [ Cancel ]   │
└────────────────────────────────────┘
```

### Property Types Page
```
┌──────────────────────────────────────┐
│ Property Types                       │
│ 2 types configured  [How to Add ▼]  │
├──────────────────────────────────────┤
│ ⚠ Property types are managed via DB  │
│   enums for data integrity...        │
├──────────────────────────────────────┤
│                                      │
│ ┌──────────┐  ┌──────────┐          │
│ │ [Icon]   │  │ [Icon]   │          │
│ │ Apartment│  │Commercial│          │
│ │ 15 active│  │ 8 active │          │
│ └──────────┘  └──────────┘          │
│                                      │
├──────────────────────────────────────┤
│ ADDING NEW PROPERTY TYPES            │
│                                      │
│ ① Update Database Schema             │
│   [Code example...]                  │
│                                      │
│ ② Create Migration                   │
│   [Command...]                       │
│                                      │
│ ③ Apply to Database                  │
│   [SQL commands...]                  │
│                                      │
│ ④ Update Property Form               │
│   [Code example...]                  │
│                                      │
│ ⑤ Update Helper Functions            │
│   [Code example...]                  │
└──────────────────────────────────────┘
```

---

## 🚀 Usage Instructions

### For Admins

#### Editing an Existing Agent

1. Go to **Admin Dashboard** → **Team & Agents**
2. Find the agent you want to edit
3. Click **"Edit Details"** button
4. Update any fields:
   - Name, email, phone
   - Specialty and bio
   - Upload new avatar (drag & drop or click)
5. Click **"Save Changes"**
6. Agent profile is updated immediately

#### Adding a New Team Member

1. Go to **Admin Dashboard** → **Team & Agents**
2. Click **"Add Team Member"** button (top right)
3. Fill in all required fields:
   - Name, email (required)
   - Temporary password (required)
   - Role, specialty, phone (optional)
   - Upload avatar (optional)
4. Click **"Create Account"**
5. New team member can now log in

#### Managing Property Types

1. Go to **Admin Dashboard** → **Property Types**
2. View current types and their usage
3. Click **"How to Add Types"** for instructions
4. Follow the 5-step guide to add new types
5. Each step has code examples and commands

---

## 🔐 Permissions

### Agent Management
- **View**: All staff (agents, managers, admins)
- **Edit**: Super admins only
- **Add**: Super admins only
- **Change Role**: Super admins only

### Property Types
- **View**: All staff
- **Manage**: Requires database access (super admin + developer)

---

## 📊 Technical Details

### Agent Avatar Storage
- **Location**: Supabase Storage
- **Bucket**: `property-images` (shared with property images)
- **Path**: No specific folder (uploaded as single file)
- **Max Size**: 5MB
- **Formats**: JPEG, PNG, WebP

### Data Flow
```
Admin Edit Form
      ↓
  Upload Avatar (if selected)
      ↓
  Supabase Storage
      ↓
  Get Public URL
      ↓
  Save to Database (users.avatarUrl)
      ↓
  Display on Website & Admin
```

### Database Fields Updated
```typescript
interface User {
  name: string;           // ✅ Updated
  email: string;          // ✅ Updated
  phone: string | null;   // ✅ Updated
  specialty: string | null; // ✅ Updated
  bio: string | null;     // ✅ Updated
  avatarUrl: string | null; // ✅ NEW
  role: string;           // ✅ Updated (via separate function)
}
```

---

## 🐛 Troubleshooting

### Agent avatar not uploading
**Solution:**
1. Check Supabase bucket exists (`property-images`)
2. Verify bucket is public
3. Check file size < 5MB
4. Verify allowed file types (JPEG, PNG, WebP)

### Can't edit super admin account
**Expected Behavior:**
- Super admin role is protected
- Only Super admin can edit their own details
- Other admins cannot modify super admin accounts

### Property type not appearing in form
**Solution:**
1. Check you ran database migration
2. Verify enum was updated in Supabase
3. Check you updated the form dropdown
4. Restart development server

### Changes not saving
**Solution:**
1. Check browser console for errors
2. Verify you're logged in as super admin
3. Check API endpoint `/api/admin/users` is working
4. Verify database connection

---

## 🎯 Best Practices

### Agent Profiles
1. **Avatar Photos**:
   - Use square images (1:1 ratio)
   - Minimum 200x200px
   - Professional headshots preferred
   - Compress before uploading

2. **Bio Writing**:
   - 2-3 sentences
   - Mention experience and expertise
   - Include specializations
   - Keep professional tone

3. **Specialty**:
   - Be specific (e.g., "Luxury Apartments in Bole")
   - One primary specialty per agent
   - Can be changed anytime

### Property Types
1. **Naming**:
   - Use lowercase in database enum
   - Use Title Case in display labels
   - Keep names short and clear

2. **Organization**:
   - Group similar types (all residential together)
   - Avoid too many types (5-8 is optimal)
   - Consider merging similar categories

---

## 📈 Future Enhancements

### Planned Features
- [ ] Bulk agent import (CSV)
- [ ] Agent performance dashboard
- [ ] Commission tracking per agent
- [ ] Agent territories/assignments
- [ ] Dynamic property types (no enum needed)
- [ ] Custom property type icons
- [ ] Property type categories
- [ ] Agent availability calendar

---

## 📚 Related Documentation

- [Image Uploader Guide](./IMAGE_UPLOADER_GUIDE.md)
- [Supabase Storage Setup](./SUPABASE_STORAGE_SETUP.md)
- [Admin API Documentation](../src/app/api/admin/users/route.ts)

---

**Need help?** Contact the development team or check the inline code comments.
