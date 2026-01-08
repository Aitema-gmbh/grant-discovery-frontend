# Authentication Setup Guide - Grants Bridge Ukraine

**Status:** ⚠️ Authentication system configured but database migrations need to be run

**Live Frontend:** https://edf5b48b.grant-discovery-frontend.pages.dev
**Supabase Instance:** https://adpddtbsstunjotxaldb.supabase.co
**Supabase Dashboard:** https://supabase.com/dashboard/project/adpddtbsstunjotxaldb

---

## 🚀 Quick Start - 3 Steps to Enable Authentication

**Everything is ready - just run these migrations!**

### Super Quick (Automated Helper):
```bash
cd "/Users/winzendwyers/Desktop/UA 5/supabase-migrations"
bash copy-migration.sh
# → Opens browser, copies SQL to clipboard
# → Just login, click "New Query", paste (Cmd+V), Run!
```

### Manual Steps:
1. **Open Supabase Dashboard:** https://supabase.com/dashboard/project/adpddtbsstunjotxaldb
2. **Go to SQL Editor:** Click "SQL Editor" in the left sidebar → "New Query"
3. **Run Migration:** Copy `/Users/winzendwyers/Desktop/UA 5/supabase-migrations/COMBINED_MIGRATION.sql` and paste → Run

✅ Done! Authentication will work immediately.

---

## ✅ Completed Setup Steps

- [x] Frontend authentication UI designed (Login, Register, Callback pages)
- [x] Supabase client configured with cloud instance
- [x] Auth store (Pinia) with email/password and Google OAuth
- [x] Protected routes with navigation guards
- [x] SQL migrations prepared (user_profiles, cso_profiles, team_members)
- [x] Combined migration file created for easy execution
- [x] Frontend built and deployed to Cloudflare Pages

## ⚠️ Required: You Must Run Database Migrations

**The authentication will NOT work until you run the SQL migrations in Supabase Studio.**

---

## 🔴 Critical: Run Database Migrations

The authentication will NOT work until these SQL migrations are executed in Supabase.

### Option 1: Via Supabase Dashboard (Easiest - One File!)

1. **Login to Supabase:**
   - Go to https://supabase.com/dashboard
   - Sign in with your Supabase account

2. **Navigate to SQL Editor:**
   - Select project: `adpddtbsstunjotxaldb`
   - Click **SQL Editor** in left sidebar
   - Click **New Query**

3. **Run Combined Migration (All-in-One):**

   **Open this file:**
   ```bash
   /Users/winzendwyers/Desktop/UA 5/supabase-migrations/COMBINED_MIGRATION.sql
   ```

   - Copy the ENTIRE contents (275 lines)
   - Paste into Supabase SQL Editor
   - Click **Run** (or Cmd+Enter)
   - Wait for "Success" message
   - ✅ Done! All 3 migrations executed in one go

   **Alternative: Run Individual Migrations**

   If you prefer to run migrations separately:
   1. `001_user_profiles.sql` - User profiles table
   2. `002_cso_profiles.sql` - CSO organization profiles
   3. `003_cso_team_members.sql` - Team collaboration

4. **Verify Migrations:**
   ```sql
   -- Run this to confirm tables exist:
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
     AND table_name IN ('user_profiles', 'cso_profiles', 'cso_team_members');

   -- Expected result: 3 rows showing all three tables
   ```

### Option 2: Via Supabase CLI (If you have access token)

```bash
# Login to Supabase CLI
supabase login

# Link to project
cd "/Users/winzendwyers/Desktop/grant-discovery-frontend"
supabase link --project-ref adpddtbsstunjotxaldb

# Run migrations
supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.adpddtbsstunjotxaldb.supabase.co:5432/postgres"
```

---

## 🔧 Configure Authentication Settings

After running migrations, configure auth providers:

### 1. Email/Password Authentication

**Already Enabled** - No action needed if already configured

### 2. Google OAuth Setup

1. **Get Google OAuth Credentials:**
   - Go to https://console.cloud.google.com
   - Create OAuth 2.0 Client ID (if not exists)
   - **Authorized JavaScript origins:**
     - `https://adpddtbsstunjotxaldb.supabase.co`
   - **Authorized redirect URIs:**
     - `https://adpddtbsstunjotxaldb.supabase.co/auth/v1/callback`

2. **Configure in Supabase:**
   - Supabase Dashboard → Authentication → Providers
   - Enable **Google**
   - Paste Client ID and Client Secret
   - Save

### 3. Configure Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://e09af482.grant-discovery-frontend.pages.dev
```

**Redirect URLs (add all):**
```
https://e09af482.grant-discovery-frontend.pages.dev/auth/callback
https://e09af482.grant-discovery-frontend.pages.dev/*
http://localhost:5173/auth/callback
http://localhost:5173/*
```

---

## ✅ Test Authentication

### Test Email Signup

1. Go to https://e09af482.grant-discovery-frontend.pages.dev
2. Click **Create free account**
3. Fill in:
   - Full name: Test User
   - Email: test@example.com
   - Password: TestPass123!
   - Accept terms
4. Click **Create your account**
5. **Expected:** Success message + email confirmation

### Test Email Login

1. Check email for confirmation link (if email confirmation enabled)
2. Click confirmation link
3. Go to https://e09af482.grant-discovery-frontend.pages.dev/auth/login
4. Enter email and password
5. Click **Sign in to Dashboard**
6. **Expected:** Redirect to dashboard with user stats

### Test Google OAuth

1. Go to https://e09af482.grant-discovery-frontend.pages.dev/auth/login
2. Click **Sign in with Google**
3. **Expected:** Redirect to Google auth, then back to dashboard

---

## 🐛 Troubleshooting

### Issue: "Invalid credentials" when signing up

**Cause:** Database migrations not run

**Fix:** Run all 3 SQL migrations in Supabase Studio (see above)

### Issue: "Failed to create user profile"

**Cause:** Trigger `on_auth_user_created` not installed

**Fix:** Re-run migration `001_user_profiles.sql`

**Verify:**
```sql
SELECT trigger_name FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND event_object_schema = 'auth';
-- Should show: on_auth_user_created
```

### Issue: Google OAuth doesn't work

**Cause:** OAuth not configured or wrong redirect URL

**Fix:**
1. Check Google Cloud Console has correct redirect URI
2. Check Supabase has Google provider enabled
3. Verify redirect URLs include `/auth/callback`

### Issue: User gets stuck on callback page

**Cause:** Frontend can't retrieve session

**Check:**
1. Browser console for errors (F12 → Console)
2. Network tab for failed requests
3. Supabase logs in dashboard

---

## 📊 Verify Database Schema

After running migrations, your Supabase database should have:

**Tables:**
```
auth.users                    (Supabase managed)
public.user_profiles         (Extended user data)
public.cso_profiles          (Organization profiles)
public.cso_team_members      (Multi-user teams)
```

**Functions:**
```
public.handle_new_user()              (Auto-create profile on signup)
public.update_updated_at_column()     (Update timestamps)
public.validate_cso_budget_range()    (Budget validation)
public.prevent_duplicate_membership() (No duplicate members)
public.set_joined_at()                (Auto-timestamp joins)
```

**Views:**
```
public.cso_team_members_with_users    (Team members with user details)
```

---

## 🚀 Next Steps After Auth is Working

1. **Test full registration flow:**
   - Signup → Email confirmation → Login → Dashboard

2. **Create CSO profile:**
   - Dashboard → Create CSO Profile button
   - Fill in organization details
   - Verify profile saved in database

3. **Test grant matching:**
   - Browse grants → Filter for Ukrainian organizations
   - View matched grants in dashboard

4. **Invite team members:**
   - CSO Profile → Team → Invite member
   - Test multi-user collaboration

---

## 📁 Migration Files Location

All SQL migrations are in:
```
/Users/winzendwyers/Desktop/UA 5/supabase-migrations/
├── 001_user_profiles.sql
├── 002_cso_profiles.sql
├── 003_cso_team_members.sql
└── README.md
```

---

## 🔐 Security Notes

- **Row Level Security (RLS)** is enabled on all tables
- Users can only view/edit their own profiles
- CSO owners can manage their organizations
- Team members have role-based permissions
- All auth tokens are JWT-based and auto-expire

---

**Last Updated:** January 6, 2026
**Frontend:** https://e09af482.grant-discovery-frontend.pages.dev
**Supabase:** https://adpddtbsstunjotxaldb.supabase.co
