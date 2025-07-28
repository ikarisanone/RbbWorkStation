import { createClient } from '@supabase/supabase-js'

// Ortam deðiþkenlerinden Supabase bilgilerini al
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase istemcisini oluþtur ve dýþarýya aç (export)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)