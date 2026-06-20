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
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuth() {
  console.log('Testing auth...')
  const mockProfile = { name: 'Test Player', email: 'test.player@smashnroast.com', role: 'player' }
  
  let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: mockProfile.email,
    password: 'password123'
  })

  console.log('Sign in result:', { user: signInData?.user?.id, error: signInError?.message })

  if (signInError && (signInError.message.includes('Invalid login credentials') || signInError.message.includes('Email not confirmed'))) {
    console.log('Attempting sign up...')
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: mockProfile.email,
      password: 'password123'
    })
    console.log('Sign up result:', { user: signUpData?.user?.id, error: signUpError?.message })
  }
}

testAuth()
