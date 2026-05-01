import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request, { params }) {
  const { id } = await params
  const lockerId = id
  
  // Mengambil IP asli pengunjung blog
  const userIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
  
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single()
  const { data: locker } = await supabase.from('lockers').select('*').eq('id', lockerId).single()
  
  if (!settings || !locker) return NextResponse.json({ error: 'Data not found' }, { status: 404 })

  supabase.rpc('increment_hits', { row_id: lockerId }).then()

  // settings.public_key digunakan untuk menyimpan user_id
  const apiUrl = `https://de6jvomfbmOaf.cloudfront.net/public/offers/feed.php?user_id=${settings.public_key}&api_key=${settings.offer_key}&ip=${userIp}`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    return NextResponse.json({
      site_name: settings.site_name,
      title: locker.title,
      offers: data // API ini mereturn array of offers secara langsung
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch offers from network' }, { status: 500 })
  }
}
