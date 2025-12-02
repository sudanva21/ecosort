# 🔧 QUICK FIX: 406 Error on Streaks Table

## ❌ Current Problem
```
GET https://vylvkjfejsxjervfxzsm.supabase.co/rest/v1/streaks 406 (Not Acceptable)
```

**Cause**: The `streaks` table doesn't exist in your Supabase database or RLS policies are misconfigured.

---

## ✅ Solution (Copy-Paste Ready)

### 1️⃣ Open Supabase SQL Editor
👉 **URL**: https://supabase.com/dashboard/project/vylvkjfejsxjervfxzsm/sql

### 2️⃣ Copy & Run This SQL Script
Open `fix-streaks-table.sql` in your project root, copy all the SQL, paste in Supabase SQL Editor, and click **Run**.

**Or copy this directly:**

```sql
-- Create streaks table
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  last_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON public.streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_count ON public.streaks(count DESC);

-- Enable RLS
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view all streaks" ON public.streaks;
DROP POLICY IF EXISTS "Users can insert own streak" ON public.streaks;
DROP POLICY IF EXISTS "Users can update own streak" ON public.streaks;

CREATE POLICY "Users can view all streaks" 
  ON public.streaks FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own streak" 
  ON public.streaks FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak" 
  ON public.streaks FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_streaks_updated_at ON public.streaks;
CREATE TRIGGER update_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.streaks TO authenticated;
```

### 3️⃣ Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 4️⃣ Verify Fix
- Open browser console (F12)
- Navigate through your app
- **406 errors should be GONE** ✅

---

## 📊 What Gets Fixed

| Feature | What Works Now |
|---------|---------------|
| **User Streaks** | Track consecutive days of sustainable actions |
| **Leaderboard** | Display top users by streak count |
| **Gamification** | Badges and achievements based on streaks |
| **Profile Stats** | Show personal streak progress |

---

## 🔍 How to Verify It Worked

### In Supabase Dashboard:
1. Go to: https://supabase.com/dashboard/project/vylvkjfejsxjervfxzsm/editor
2. You should see **`streaks`** table in the left sidebar
3. Click on it → Check schema matches above

### In Your App:
1. Open browser DevTools (F12) → Console tab
2. Look for the previous error message
3. If gone → **SUCCESS** 🎉

---

## ⚡ Emergency: If Still Getting 406 Errors

### Check Authentication:
```javascript
// In browser console:
console.log('User:', supabase.auth.getUser())
```
If null → You need to **log in to the app first**

### Check Table Exists:
1. Supabase Dashboard → Table Editor
2. Look for `streaks` table
3. If missing → Re-run the SQL script

### Check RLS Policies:
1. Click `streaks` table → **Policies** tab
2. Should show 3 enabled policies
3. If missing → Re-run the SQL script

---

## 📁 Related Files

| File | Purpose |
|------|---------|
| `fix-streaks-table.sql` | Complete SQL fix script |
| `supabase-schema.sql` | Full database schema (reference) |
| `src/utils/api.js` | Streak API functions (lines 121-209) |
| `FIX_406_ERROR.md` | Detailed troubleshooting guide |

---

## 🎯 Next Steps After Fix

1. ✅ Run the SQL script in Supabase
2. ✅ Restart your dev server
3. ✅ Test the app - errors should be gone
4. 📊 Check leaderboard functionality
5. 🎮 Test gamification features

---

**Need More Help?** Check `FIX_406_ERROR.md` for detailed troubleshooting.
