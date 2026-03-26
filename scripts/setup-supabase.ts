// scripts/setup-supabase.ts
// Verifies Supabase connectivity and prints table setup SQL if needed.
// Run with: npx ts-node --project tsconfig.node.json scripts/setup-supabase.ts

import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local before anything else
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false } })

const CREATE_TABLE_SQL = `
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard/project/_/sql

CREATE TABLE IF NOT EXISTS page_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name   TEXT        NOT NULL,
  page_path    TEXT        NOT NULL,
  session_id   TEXT        NOT NULL,
  metadata     JSONB       NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_events_created_at  ON page_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_events_event_name  ON page_events (event_name);
CREATE INDEX IF NOT EXISTS idx_page_events_session_id  ON page_events (session_id);

CREATE TABLE IF NOT EXISTS ai_insights_cache (
  id           SERIAL      PRIMARY KEY,
  content      TEXT        NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`

async function main() {
  console.log('🔗  Connecting to Supabase...')

  // Test connectivity by querying page_events
  const { data, error } = await supabase
    .from('page_events')
    .select('id', { count: 'exact', head: true })

  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
      console.log('\n⚠️   Table `page_events` does not exist yet.')
      console.log('\nPlease run the following SQL in your Supabase SQL editor:')
      console.log('   https://supabase.com/dashboard/project/_/sql\n')
      console.log('─'.repeat(60))
      console.log(CREATE_TABLE_SQL.trim())
      console.log('─'.repeat(60))
      console.log('\nThen re-run this script to verify setup.')
      process.exit(0)
    } else {
      console.error('\n❌  Supabase error:', error.message)
      console.error('   Code:', error.code)
      console.log('\nTroubleshooting:')
      console.log('  1. Check SUPABASE_URL in .env.local')
      console.log('  2. Check SUPABASE_SERVICE_ROLE_KEY in .env.local')
      console.log('  3. Verify your Supabase project is running')
      process.exit(1)
    }
  }

  const { count } = await supabase
    .from('page_events')
    .select('*', { count: 'exact', head: true })

  console.log('\n✅  Supabase connected successfully!')
  console.log(`   Table: page_events — ${count ?? 0} rows`)

  // Check for ai_insights_cache
  const { error: cacheError } = await supabase
    .from('ai_insights_cache')
    .select('id', { count: 'exact', head: true })

  if (cacheError) {
    console.log('\n⚠️   Table `ai_insights_cache` does not exist.')
    console.log('   Run this in Supabase SQL editor:')
    console.log('\n   CREATE TABLE IF NOT EXISTS ai_insights_cache (')
    console.log('     id           SERIAL      PRIMARY KEY,')
    console.log('     content      TEXT        NOT NULL,')
    console.log('     generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()')
    console.log('   );\n')
  } else {
    console.log('   Table: ai_insights_cache — ready')
  }

  console.log('\n🎉  All systems go! Your analytics pipeline is ready.')
  void data
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
