import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request, { params }) {
  const { id } = await params
  const lockerId = id
  
  const userIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
  
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single()
  const { data: locker } = await supabase.from('lockers').select('*').eq('id', lockerId).single()
  
  if (!settings || !locker) {
    return NextResponse.json({ error: 'Database record missing' }, { status: 404 })
  }

  supabase.rpc('increment_hits', { row_id: lockerId }).then()

  const apiUrl = `https://de6jvomfbmOaf.cloudfront.net/public/offers/feed.php?user_id=${settings.public_key}&api_key=${settings.offer_key}&ip=${userIp}`

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' })
    const textData = await response.text()

    try {
      const jsonData = JSON.parse(textData)
      return NextResponse.json({
        site_name: settings.site_name,
        title: locker.title,
        offers: jsonData
      })
    } catch (parseError) {
      return NextResponse.json({ error: textData.substring(0, 100) }, { status: 500 })
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
