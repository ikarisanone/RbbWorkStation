import { createClient } from '@supabase/supabase-js'

// Ortam de�i�kenlerinden Supabase bilgilerini al
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase istemcisini olu�tur ve d��ar�ya a� (export)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)