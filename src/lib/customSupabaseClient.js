import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hspdmfwrsequuuhuxkge.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzcGRtZndyc2VxdXV1aHV4a2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzEzOTgsImV4cCI6MjA2OTMwNzM5OH0.-QgDM1IW8eVlV5MaLB5xP7k8dtp6lUIMP2CDYr-KGks';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);