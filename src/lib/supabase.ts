import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase Project URL and Anon Key
// You can obtain these from your Supabase Dashboard -> Settings -> API
export const SUPABASE_URL: string = 'https://llkpdgnxwxzwwgmhexlm.supabase.co';
export const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsa3BkZ254d3h6d3dnbWhleGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNDMzOTYsImV4cCI6MjEwMzgxOTM5Nn0.8iDNPMaJrkJ-j_XBLSyjPdBeQgONw8XU_uh7CN43HiQ';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(SUPABASE_URL) &&
    !SUPABASE_URL.includes('your-project') &&
    SUPABASE_URL.startsWith('https://')
  );
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

