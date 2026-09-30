import { createClient } from '@supabase/supabase-js';

const url = 'https://njohagoufirymxfrptoq.supabase.co';
const key = 'sb_publishable_7_BFifG4_tOf2pmAwoFOWQ_LUc3zChb';

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
