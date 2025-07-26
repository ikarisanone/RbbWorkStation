import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://avygqkwcovsftojbljsc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2eWdxa3djb3ZzZnRvamJsanNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4ODczNTQsImV4cCI6MjAzMjQ2MzM1NH0.QdD_N5t55eTieE6tr63g9n830GzMFFZjpJInl65S0Z4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)