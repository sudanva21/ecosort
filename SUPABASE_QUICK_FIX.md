# 🔧 Quick Fix for 401 Supabase Error

## Problem
Getting `401 Unauthorized` error when signing up/logging in.

## Root Cause
Your Supabase anon key is **invalid, expired, or the project configuration is incorrect**.

---

## ✅ Solution (5 minutes)

### Step 1: Get Valid Credentials
1. **Open** https://app.supabase.com
2. **Select** your project: `vylvkjfejsxjervfxzsm`
3. **Go to** `Settings` → `API`
4. **Copy** these two values:
   - **Project URL** (e.g., `https://vylvkjfejsxjervfxzsm.supabase.co`)
   - **anon/public key** (long JWT token starting with `eyJ...`)

### Step 2: Update Your .env File
Open `.env` in your project root and replace with your actual values:

```env
VITE_SUPABASE_URL=https://vylvkjfejsxjervfxzsm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...YOUR_ACTUAL_KEY_HERE
```

### Step 3: Disable Email Confirmation (Development Only)
1. In Supabase Dashboard: `Authentication` → `Providers`
2. Click on **Email** provider
3. **Disable** the "Confirm email" toggle
4. Click **Save**

### Step 4: Enable Email Provider
1. Still in `Authentication` → `Providers`
2. Ensure **Email** provider toggle is **ON** (green)
3. Click **Save** if you made changes

### Step 5: Run Database Schema
1. Go to `SQL Editor` in Supabase
2. Click **+ New Query**
3. Copy all content from `supabase-schema.sql` in your project
4. Paste and click **Run**
5. Verify tables created in `Table Editor`

### Step 6: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🧪 Test the Fix

1. Open http://localhost:5173
2. Click **Register**
3. Fill in test details:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Username: `testuser`
4. Submit - should work now!

---

## 🔍 Diagnostic Info

Open browser console (F12) after restarting the server. You'll see:
- ✅ Supabase connection status
- ❌ Specific errors if any remain
- 📋 Fix suggestions

---

## ⚠️ Still Not Working?

### Check These:
1. **Project Status**: Ensure project isn't paused in Supabase dashboard
2. **Browser Cache**: Clear cache or try incognito mode
3. **Network**: Check browser Network tab for exact error response
4. **Console Logs**: Look for detailed error messages in browser console

### Get the Exact Error:
Open browser console (F12) → Network tab → Try to sign up → Click the failed `signup` request → Check the "Response" tab

---

## 📝 Common Issues

| Error | Fix |
|-------|-----|
| `Invalid API key` | Double-check anon key from Supabase dashboard |
| `Email not confirmed` | Disable email confirmation (Step 3 above) |
| `User already exists` | Delete user in Auth → Users or use different email |
| `PGRST116` | Run database schema (Step 5 above) |

---

**After fixing, the app will automatically log diagnostic info on startup (dev mode only).**
