# Fix 406 Not Acceptable Error - Streaks Table

## Problem
Your application is getting **HTTP 406 (Not Acceptable)** errors when trying to access the `streaks` table:
```
GET https://vylvkjfejsxjervfxzsm.supabase.co/rest/v1/streaks 406 (Not Acceptable)
```

This means the `streaks` table either doesn't exist or has incorrect RLS (Row Level Security) policies.

---

## Solution (3 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/vylvkjfejsxjervfxzsm/sql
2. Log in with your Supabase credentials

### Step 2: Run the Fix Script
1. Open the file: `fix-streaks-table.sql` (in your project root)
2. **Copy the entire SQL script**
3. **Paste it into the Supabase SQL Editor**
4. **Click "Run"** (or press Ctrl+Enter)

### Step 3: Verify Success
You should see a message: `streaks table created successfully!`

### Step 4: Restart Your Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test the Application
1. Open your app in the browser
2. Check the browser console (F12)
3. The 406 errors should be gone ✅

---

## What This Script Does

1. **Creates `streaks` table** with proper schema:
   - `id`: Unique identifier
   - `user_id`: References auth users
   - `count`: Number of consecutive days
   - `last_date`: Last activity date
   - Timestamps for tracking

2. **Adds indexes** for fast queries (especially leaderboard)

3. **Configures RLS policies**:
   - All users can view streaks (for leaderboard)
   - Users can only insert/update their own streaks

4. **Sets up auto-update trigger** for `updated_at` field

---

## Troubleshooting

### If you still get 406 errors after running the script:

**Check if table exists:**
1. Go to: https://supabase.com/dashboard/project/vylvkjfejsxjervfxzsm/editor
2. Look for `streaks` table in the left sidebar
3. If missing, re-run the SQL script

**Check RLS policies:**
1. Click on the `streaks` table
2. Go to "Policies" tab
3. You should see 3 policies enabled:
   - "Users can view all streaks"
   - "Users can insert own streak"
   - "Users can update own streak"

**Check authentication:**
- Make sure you're logged in to the application
- Unauthenticated requests will be blocked by RLS

---

## Related Files
- **SQL Script**: `fix-streaks-table.sql`
- **API Usage**: `src/utils/api.js` (lines 124, 143, 169, 196-209)
- **Full Schema**: `supabase-schema.sql` (complete database setup)
