  
# Fix for Streaks Table 406 Error  
  
## Problem  
The streaks table is either missing or has incorrect RLS policies.  
  
## Solution  
  
### Step 1: Open Supabase SQL Editor  
Go to: https://supabase.com/dashboard/project/vylvkjfejsxjervfxzsm/sql  
  
### Step 2: Run the Fix Script  
Copy and paste the ENTIRE contents of `fix-streaks-table.sql` into the SQL editor and click Run.  
  
This script will:  
- Create the streaks table if it doesn't exist  
- Set up correct RLS policies that allow all users to view streaks (for leaderboard)  
- Keep INSERT/UPDATE restricted to user's own records  
  
### Step 3: Restart Your Dev Server  
npm run dev  
  
The 406 error should now be fixed. 
