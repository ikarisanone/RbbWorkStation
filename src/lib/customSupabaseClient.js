import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnfdeapwclgzlqxuondl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZmRlYXB3Y2xnemxxeHVvbmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzUwOTEsImV4cCI6MjA2OTAxMTA5MX0.7LCwVERP2Fi_UGsa0XvvnDZc0_hCHzeAsQ0g5N_511Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);