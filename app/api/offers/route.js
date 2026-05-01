import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  const country = request.headers.get('x-vercel-ip-country') || 'US'
  
  const { data: settings } = await supabase.from('settings').select('*').single()
  
  if (!settings) return NextResponse.json({ error: 'System not configured' }, { status: 500 })

  const apiUrl = `https://publishers.adbluemedia.com/api/v2/offers?public_key=${settings.public_key}&api_key=${settings.offer_key}&country=${country}`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 })
  }
}
