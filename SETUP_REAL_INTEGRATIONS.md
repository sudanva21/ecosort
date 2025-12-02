# Setup Guide: Remove Mock Data & Enable Real Integrations

All mock data and localStorage fallbacks have been removed. Follow these steps to enable real backend integrations.

## Step 1: Fix Supabase Streaks Table

### Run the SQL Script

1. Go to your Supabase Dashboard SQL Editor:
   ```
   https://supabase.com/dashboard/project/vylvkjfejsxjervfxzsm/sql
   ```

2. Copy the contents of `fix-streaks-table-final.sql`

3. Paste it into the SQL Editor and click **Run**

4. You should see: `Streaks table created successfully!`

### What This Does

- Creates the `streaks` table with correct schema:
  - `current_streak` - Current consecutive days
  - `longest_streak` - All-time best streak
  - `last_date` - Last activity date
- Sets up Row Level Security (RLS) policies:
  - All authenticated users can view streaks (for leaderboard)
  - Users can only insert/update their own streaks
- Creates indexes for performance
- Adds automatic `updated_at` timestamp trigger

## Step 2: Verify N8N Webhooks

### Current Webhook URLs (from .env):
```
VITE_N8N_CLASSIFY_WEBHOOK=https://n8n-0lhx.onrender.com/webhook/classify-waste
VITE_N8N_GUIDE_WEBHOOK=https://n8n-0lhx.onrender.com/webhook/disposal-guide
```

### Test Classification Webhook

Open terminal and test:
```bash
curl -X POST https://n8n-0lhx.onrender.com/webhook/classify-waste \
  -F "image=@path/to/test-image.jpg"
```

**Expected Response:**
```json
{
  "category": "Recyclable",
  "confidence": 85,
  "description": "Plastic bottle",
  "disposal_method": "Place in blue recycling bin"
}
```

### Test Disposal Guide Webhook

```bash
curl -X POST https://n8n-0lhx.onrender.com/webhook/disposal-guide \
  -H "Content-Type: application/json" \
  -d "{\"category\": \"Recyclable\"}"
```

**Expected Response:**
```json
{
  "category": "Recyclable",
  "steps": ["Clean the item", "Remove labels", "Place in blue bin"],
  "tips": ["Ensure items are dry", "No food residue"],
  "locations": ["Recycling centers nearby"]
}
```

### If Webhooks Fail

1. **Check N8N Server Status**: Visit https://n8n-0lhx.onrender.com/healthz
2. **Verify Workflow is Active**: Log into N8N dashboard and ensure workflows are running
3. **Check Webhook URLs**: Ensure they match exactly in `.env`
4. **Render.com Free Tier**: If on free tier, server may sleep after inactivity. First request might timeout.

## Step 3: Verify Supabase Tables

### Check Required Tables Exist

Go to Table Editor: https://supabase.com/dashboard/project/vylvkjfejsxjervfxzsm/editor

Ensure these tables exist:
- ✅ `streaks` - Just created
- ✅ `profiles` - User profiles (needed for leaderboard)
- ✅ `classifications` - Waste classification history

### If Tables Are Missing

Run the complete schema from `supabase-schema.sql`:
```bash
# In Supabase SQL Editor
cat supabase-schema.sql
# Copy and paste into SQL Editor, then Run
```

## Step 4: Test the Application

### Start Dev Server

```bash
npm run dev
```

### Test Classify Waste Feature

1. Navigate to `/classify`
2. Upload an image of waste item
3. **Expected**: Real classification from N8N webhook
4. **If Error**: Check browser console for specific error message
   - `N8N webhook URL not configured` → Check `.env` file
   - `N8N Classification failed (500)` → N8N workflow issue
   - `Invalid JSON response` → N8N returning wrong format

### Test Disposal Guide

1. After classification, click "View Disposal Guide"
2. **Expected**: Real disposal instructions from N8N webhook
3. **If Error**: Check webhook URL and N8N workflow status

### Test Streaks & Leaderboard

1. Navigate to `/gamification`
2. Perform a classification (this triggers streak update)
3. **Expected**: Streak count increases
4. **If Error**: 
   - `Error fetching streak` → Check streaks table exists
   - `406 Not Acceptable` → RLS policies not set correctly

## Step 5: Error Handling

### All Errors Now Throw (No More Mock Data)

When integration fails, you'll see:
- Browser console error with specific message
- Error toast/notification in UI
- Network tab shows failed request

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `N8N webhook returned empty response` | N8N workflow not returning data | Check N8N workflow output node |
| `Error fetching streak: 406` | Streaks table missing or RLS issue | Run `fix-streaks-table-final.sql` |
| `PGRST116` error | Table doesn't exist | Create missing table in Supabase |
| `Invalid JSON response from N8N` | N8N returning HTML/text | Fix N8N workflow response format |

## Changes Made

### Removed from `api.js`:

1. ❌ `checkStreaksTable()` - No more table detection
2. ❌ `getLocalStreak()` - No localStorage fallback
3. ❌ `saveLocalStreak()` - No localStorage fallback  
4. ❌ `updateLocalStreak()` - No localStorage fallback
5. ❌ All `mockResult` objects in `classifyImage()`
6. ❌ `fallbackData` array in `getLeaderboardData()`
7. ❌ Console error suppression
8. ❌ Offline mode messages

### Now All Functions:

✅ Make real API calls to Supabase/N8N
✅ Throw errors when requests fail
✅ Return only real data from backend
✅ No silent failures or fallbacks

## Verification Checklist

- [ ] SQL script run successfully in Supabase
- [ ] `streaks` table visible in Supabase Table Editor
- [ ] N8N classify webhook returns valid JSON
- [ ] N8N disposal guide webhook returns valid JSON
- [ ] Classification feature works without errors
- [ ] Disposal guide displays real data
- [ ] Streak counter increments correctly
- [ ] Leaderboard shows real user data
- [ ] No mock data appears anywhere in the app
- [ ] Console shows real errors (not suppressed)

## Next Steps

Once all integrations are working:

1. **Monitor**: Check console for any errors
2. **Test Edge Cases**: Try invalid images, offline mode, etc.
3. **Performance**: Monitor N8N response times (Render free tier can be slow)
4. **Security**: Verify RLS policies prevent unauthorized access
5. **Backup**: Export Supabase data regularly

## Need Help?

If you encounter issues:
1. Check browser console for specific error messages
2. Verify all webhook URLs are correct in `.env`
3. Test webhooks directly with `curl` commands above
4. Check Supabase SQL logs for query errors
5. Verify N8N workflows are active and deployed
