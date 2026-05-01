import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  const country = request.headers.get('x-vercel-ip-country') || 'US'
  
  // Ambil setting sekaligus tambah hit count
  const { data: settings } = await supabase.from('settings').select('*').single()
  
  if (!settings) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  // Update Hit Count secara asynchronous (tidak menunggu hit selesai agar cepat)
  supabase.rpc('increment_hits', { row_id: 1 }).then()

  const apiUrl = `https://publishers.adbluemedia.com/api/v2/offers?public_key=${settings.public_key}&api_key=${settings.offer_key}&country=${country}`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    // Tambahkan data site ke respon agar JS bisa pakai
    return NextResponse.json({
      site_name: settings.site_name,
      site_desc: settings.site_description,
      offers: data.offers
    })
  } catch (err) {
    return NextResponse.json({ error: 'API Error' }, { status: 500 })
  }
}
