import { createClient } from '@supabase/supabase-js'

// Ortam değişkenlerini burada direkt kullanabilir veya .env dosyasından yükleyebilirsin
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jthswhtksekwpghwzmch.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aHN3aHRrc2Vrd3BnaHd6bWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDQ0NjYsImV4cCI6MjA2OTgyMDQ2Nn0.zij79RdZDvsWKI9ThNxp2yHG74XnuYd9udFePU5H7ao'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    const { data, error } = await supabase.from('Workspace').select('*').limit(1)

    if (error) {
        console.error('❌ Bağlantı Hatası veya Tablo Yok:', error.message)
    } else {
        console.log('✅ Bağlantı Başarılı! Veri:', data)
    }
}

testConnection()
