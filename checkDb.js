import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envFile = fs.readFileSync('.env', 'utf8')
const env = {}
envFile.split('\n').forEach(line => {
  const parts = line.split('=')
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim()
  }
})

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl)
console.log('Key length:', supabaseAnonKey ? supabaseAnonKey.length : 0)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  try {
    const testId = '00000000-0000-0000-0000-000000000001'
    const { data: insData, error: insError } = await supabase.from('profiles').insert({
      id: testId,
      full_name: 'Test Player',
      email: 'test@gmail.com',
      role: 'player'
    }).select()
    console.log('Insert Profile Result:', insData, 'Error:', insError)

    const { data: profiles, error: pError } = await supabase.from('profiles').select('*')
    console.log('Profiles:', profiles, 'Error:', pError)

    const { data: bookings, error: bError } = await supabase.from('bookings').select('*')
    console.log('Bookings:', bookings, 'Error:', bError)
  } catch (e) {
    console.error('Error running check:', e)
  }
}

check()
