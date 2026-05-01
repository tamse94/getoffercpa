import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request, { params }) {
  const lockerId = params.id
  const country = request.headers.get('x-vercel-ip-country') || 'US'
  
  const { data: settings } = await supabase.from('settings').select('*').eq('id', lockerId).single()
  
  if (!settings) return NextResponse.json({ error: 'Locker not found' }, { status: 404 })

  supabase.rpc('increment_hits', { row_id: lockerId }).then()

  const apiUrl = `https://publishers.adbluemedia.com/api/v2/offers?public_key=${settings.public_key}&api_key=${settings.offer_key}&country=${country}`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    return NextResponse.json({
      site_name: settings.site_name,
      offers: data.offers
    })
  } catch (err) {
    return NextResponse.json({ error: 'API Error' }, { status: 500 })
  }
}
