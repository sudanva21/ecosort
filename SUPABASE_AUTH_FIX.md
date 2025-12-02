# Fixing Supabase 401 Authentication Errors

## Problem
You're getting **401 Unauthorized** errors when trying to sign up or access Supabase data.

## Root Causes
1. Email confirmation is required by default in Supabase
2. Authentication providers may not be enabled
3. Database schema may not be set up
4. Anon key might not have proper permissions

---

## Solution Steps

### Step 1: Disable Email Confirmation (For Development)

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: **vylvkjfejsxjervfxzsm**
3. Navigate to **Authentication** → **Providers** → **Email**
4. **Disable** "Confirm email" toggle
5. Click **Save**

**Why?** By default, Supabase requires users to confirm their email before they can sign in. Disabling this allows immediate signup during development.

---

### Step 2: Verify Email Provider is Enabled

1. Still in **Authentication** → **Providers**
2. Ensure **Email** provider is **enabled** (toggle should be green/on)
3. If disabled, enable it and click **Save**

---

### Step 3: Run the Database Schema

1. Navigate to **SQL Editor** in your Supabase dashboard
2. Click **+ New Query**
3. Copy the entire contents of `supabase-schema.sql` from your project
4. Paste into the query editor
5. Click **Run** (or press `Ctrl+Enter`)
6. Verify tables were created:
   - Go to **Table Editor**
   - You should see: `profiles`, `classifications`, `streaks`, `leaderboard`

---

### Step 4: Verify Anon Key

1. Go to **Settings** → **API**
2. Copy your **anon/public key** (under "Project API keys")
3. Compare it with the value in your `.env` file (`VITE_SUPABASE_ANON_KEY`)
4. If different, update your `.env` file with the correct key
5. **Restart your dev server** after updating:
   ```bash
   npm run dev
   ```

---

### Step 5: Test Authentication

1. Open your app at http://localhost:5173
2. Click **Register** or **Sign Up**
3. Create a test account:
   - Email: test@example.com
   - Password: Test123!
   - Username: testuser
4. You should be redirected and logged in immediately

---

## Verification Checklist

✅ Email confirmation is **disabled** (Auth → Providers → Email)  
✅ Email provider is **enabled**  
✅ Database schema is **created** (check Table Editor)  
✅ Anon key in `.env` matches Supabase dashboard  
✅ Dev server was **restarted** after .env changes  

---

## Common Issues

### Still Getting 401?
- **Clear browser cache** and try again
- Check browser console for the exact error message
- Verify your Supabase project URL: `https://vylvkjfejsxjervfxzsm.supabase.co`

### Email Already Exists Error?
- Go to **Authentication** → **Users**
- Delete test users
- Try signing up again

### Database Errors?
- Ensure RLS (Row Level Security) policies were created with the schema
- Check **Authentication** → **Policies** to verify policies exist

---

## Production Configuration (Later)

Once you're ready for production:

1. **Re-enable email confirmation**
2. Configure a custom SMTP server (Auth → Email Settings)
3. Customize email templates
4. Enable rate limiting
5. Add stronger password requirements

---

## Need Help?

If errors persist:
1. Take a screenshot of the browser console errors
2. Check Supabase dashboard **Logs** section
3. Verify your project is not paused (free tier limitation)
