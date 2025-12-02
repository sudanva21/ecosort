# Troubleshooting Guide

## Current Errors

### 1. N8N Webhook - Empty JSON Response ✅ FIXED

**Error**: `SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input`

**Status**: Fixed with better error handling

**What was done**:
- Added validation for empty webhook responses
- Improved error messages with status codes
- Added logging for debugging

**Next Steps**:
1. Check your n8n workflows at `https://n8n-0lhx.onrender.com`
2. Ensure both workflows are **activated** (toggle switch ON)
3. Test the webhooks:
   - `/webhook/classify-waste`
   - `/webhook/disposal-guide`

---

### 2. Supabase Streaks Table - 406 Error ⚠️ NEEDS ATTENTION

**Error**: `Failed to load resource: the server responded with a status of 406 ()`  
**URL**: `vylvkjfejsxjervfxzsm.supabase.co/rest/v1/streaks`

**What is a 406 Error?**
- HTTP 406 = "Not Acceptable"
- The server cannot produce a response matching the request's Accept headers
- In Supabase context: Usually means table doesn't exist or RLS is blocking

---

## Fix 1: Verify Streaks Table Exists

### Check in Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: `vylvkjfejsxjervfxzsm`
3. Navigate to **Table Editor**
4. Look for a table named `streaks`

### Create Streaks Table (if missing)

Run this SQL in Supabase SQL Editor:

```sql
-- Create streaks table
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  last_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on user_id
CREATE UNIQUE INDEX IF NOT EXISTS streaks_user_id_idx ON public.streaks(user_id);

-- Enable Row Level Security
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own streaks"
  ON public.streaks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks"
  ON public.streaks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON public.streaks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own streaks"
  ON public.streaks
  FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Fix 2: Check RLS Policies

If the table exists but you're still getting 406:

### Temporarily Disable RLS (for testing only)

```sql
-- WARNING: Only for testing! Re-enable after fixing
ALTER TABLE public.streaks DISABLE ROW LEVEL SECURITY;
```

### Re-enable RLS with proper policies

```sql
-- Enable RLS
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own streaks" ON public.streaks;
DROP POLICY IF EXISTS "Users can insert their own streaks" ON public.streaks;
DROP POLICY IF EXISTS "Users can update their own streaks" ON public.streaks;
DROP POLICY IF EXISTS "Users can delete their own streaks" ON public.streaks;

-- Recreate policies
CREATE POLICY "Enable read access for users" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users" ON public.streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users" ON public.streaks
  FOR DELETE USING (auth.uid() = user_id);
```

---

## Fix 3: N8N Webhook Configuration

### Check Webhook Status

1. Log into n8n: https://n8n-0lhx.onrender.com
2. Go to **Workflows**
3. Find workflows:
   - "Waste Classification"
   - "Disposal Guide"

### Verify Workflow is Activated

- Each workflow should have a **green toggle** indicating "Active"
- If red/gray, click to activate

### Test Webhooks Directly

#### Test Classify Webhook

```bash
curl -X POST https://n8n-0lhx.onrender.com/webhook/classify-waste \
  -F "image=@/path/to/test/image.jpg"
```

**Expected Response**:
```json
{
  "category": "Recyclable",
  "confidence": 92,
  "description": "Plastic bottle detected"
}
```

#### Test Guide Webhook

```bash
curl -X POST https://n8n-0lhx.onrender.com/webhook/disposal-guide \
  -H "Content-Type: application/json" \
  -d '{"category":"Recyclable"}'
```

**Expected Response**:
```json
{
  "category": "Recyclable",
  "description": "Items that can be processed and reused",
  "icon": "recycle",
  "color": "#2ECC71",
  "tips": ["Clean items before recycling", "Remove labels"],
  "examples": ["Plastic bottles", "Glass containers"]
}
```

### Common n8n Issues

| Issue | Solution |
|-------|----------|
| **Empty Response** | Workflow not activated |
| **404 Not Found** | Wrong webhook URL |
| **500 Error** | Workflow has execution error |
| **Timeout** | Render free tier sleeping (wait 30s and retry) |

---

## Fix 4: Check Environment Variables

Verify your `.env` file has correct values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://vylvkjfejsxjervfxzsm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# N8N Webhooks
VITE_N8N_CLASSIFY_WEBHOOK=https://n8n-0lhx.onrender.com/webhook/classify-waste
VITE_N8N_GUIDE_WEBHOOK=https://n8n-0lhx.onrender.com/webhook/disposal-guide
```

**After changing `.env`**:
```bash
# Restart dev server
npm run dev
```

---

## Debugging Steps

### 1. Check Browser Console

Open DevTools (F12) and look for:
- Network tab: Failed requests
- Console tab: Error messages
- Look for status codes: 406, 404, 500

### 2. Check n8n Execution Logs

1. Go to n8n dashboard
2. Click **Executions**
3. Look for failed executions
4. Click to view error details

### 3. Test Supabase Connection

Add this to your browser console:
```javascript
// Test Supabase connection
const { data, error } = await supabase.from('streaks').select('*').limit(1);
console.log('Supabase Test:', { data, error });
```

### 4. Check Supabase Logs

1. Go to Supabase Dashboard
2. Select your project
3. Click **Logs**
4. Look for API errors
5. Filter by "API" and check for 406 errors

---

## Quick Fixes Checklist

- [ ] Verify `streaks` table exists in Supabase
- [ ] Check RLS policies on `streaks` table
- [ ] Confirm n8n workflows are activated
- [ ] Test n8n webhooks directly with curl
- [ ] Verify `.env` file has correct webhook URLs
- [ ] Restart development server after .env changes
- [ ] Check Render dashboard for n8n service status
- [ ] Wait 30s if Render free tier is sleeping

---

## Still Having Issues?

### Get More Detailed Errors

The app now logs detailed error information. Check browser console for:
- `N8N Response Error:` - Shows status code and response
- `N8N webhook returned empty response` - Workflow not returning data
- `Classification error:` - Full error stack trace

### Contact Support

If issues persist, provide:
1. Screenshot of browser console errors
2. Screenshot of n8n execution logs
3. Output of `SELECT * FROM pg_tables WHERE tablename = 'streaks';` in Supabase SQL Editor
4. Curl test results for webhooks
