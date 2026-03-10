import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

function createNoopClient() {
  const result = { data: null, error: null }
  const handler: ProxyHandler<object> = {
    get: () => new Proxy(() => result, handler),
    apply: () => new Proxy(result, handler),
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Proxy({}, handler) as any
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createNoopClient()
