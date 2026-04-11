import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gnqivgmgpetrboyzsswv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducWl2Z21ncGV0cmJveXpzc3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTI5NTUsImV4cCI6MjA5MDI4ODk1NX0.0K62Lctya602wTBC3q9Em4EE9lqysTPQqm4C0liNYUE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
