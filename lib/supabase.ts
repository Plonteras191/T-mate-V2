import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

// Supabase configuration - using hardcoded values for production builds
// These values are directly embedded to ensure they're always available
const supabaseUrl = 'https://jdirkfwwgsiktmluutxr.supabase.co'
const supabaseAnonKey = 'sb_publishable_oLpjcNrAQ35o4XmBgeuGMw_zV341rcT'

console.log('Supabase Config Check:', {
  url: supabaseUrl,
  key: supabaseAnonKey,
  urlLength: supabaseUrl?.length,
  keyLength: supabaseAnonKey?.length,
  configExtra: Constants.expoConfig?.extra
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

