import { supabase } from '../lib/supabase';

export async function checkSupabaseConnection() {
  const results = {
    configCheck: false,
    connectionCheck: false,
    authCheck: false,
    databaseCheck: false,
    errors: []
  };

  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      results.errors.push('Missing environment variables');
      return results;
    }
    results.configCheck = true;

    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error && error.code !== 'PGRST116') {
        results.errors.push(`Database error: ${error.message}`);
      } else {
        results.databaseCheck = true;
        results.connectionCheck = true;
      }
    } catch (err) {
      results.errors.push(`Connection failed: ${err.message}`);
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        if (error.status === 401) {
          results.errors.push('Invalid API key - 401 Unauthorized');
        } else {
          results.errors.push(`Auth error: ${error.message}`);
        }
      } else {
        results.authCheck = true;
      }
    } catch (err) {
      results.errors.push(`Auth check failed: ${err.message}`);
    }

  } catch (err) {
    results.errors.push(`General error: ${err.message}`);
  }

  return results;
}

export function logSupabaseStatus() {
  checkSupabaseConnection().then(results => {
    console.log('=== Supabase Connection Status ===');
    console.log('✅ Config:', results.configCheck ? 'OK' : 'FAILED');
    console.log('✅ Connection:', results.connectionCheck ? 'OK' : 'FAILED');
    console.log('✅ Auth:', results.authCheck ? 'OK' : 'FAILED');
    console.log('✅ Database:', results.databaseCheck ? 'OK' : 'FAILED');
    
    if (results.errors.length > 0) {
      console.error('❌ Errors:', results.errors);
      console.error('\n📋 Fix Steps:');
      console.error('1. Go to: https://app.supabase.com');
      console.error('2. Select project: vylvkjfejsxjervfxzsm');
      console.error('3. Settings → API → Copy the anon/public key');
      console.error('4. Update your .env file with the correct key');
      console.error('5. Authentication → Providers → Disable "Confirm email"');
      console.error('6. Restart dev server: npm run dev');
    }
    console.log('================================');
  });
}
