// app/api/track/route.ts
// Receives analytics events from the client and writes them to Supabase.
// Always returns 200 — errors are logged server-side but never surface to the client.

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_name, page_path, session_id, metadata } = body

    // Basic shape validation
    if (
      typeof event_name !== 'string' || !event_name ||
      typeof page_path !== 'string' || !page_path.startsWith('/') ||
      typeof session_id !== 'string' || !session_id
    ) {
      return NextResponse.json({ ok: false }, {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    const { error } = await supabaseAdmin.from('page_events').insert({
      event_name,
      page_path,
      session_id,
      metadata: metadata ?? {},
    })

    if (error) {
      console.error('[analytics/track] Supabase insert error:', error.message)
    }
  } catch (err) {
    console.error('[analytics/track] Unexpected error:', err)
  }

  return NextResponse.json({ ok: true }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
