import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

// Supabase configuration with fallback values for production builds
// In production, Constants.expoConfig?.extra may be undefined, so we use direct fallbacks
const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  'https://jdirkfwwgsiktmluutxr.supabase.co'

const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabasePublishableKey ||
  'sb_publishable_oLpjcNrAQ35o4XmBgeuGMw_zV341rcT'

console.log('Supabase Config Check:', {
  url: supabaseUrl ? 'Present' : 'Missing',
  key: supabaseAnonKey ? 'Present' : 'Missing',
  urlValue: supabaseUrl,
  keyLength: supabaseAnonKey?.length,
  source: Constants.expoConfig?.extra ? 'expo-config' : 'hardcoded-fallback'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.')
  throw new Error(`supabaseUrl is required.`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

