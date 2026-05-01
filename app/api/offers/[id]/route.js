import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const lockerId = id

    // ✅ Ambil IP yang valid
    const rawIp =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      ''

    const userIp = rawIp.split(',')[0].trim()

    // ✅ Ambil data dari DB
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()

    const { data: locker, error: lockerError } = await supabase
      .from('lockers')
      .select('*')
      .eq('id', lockerId)
      .single()

    if (settingsError || lockerError || !settings || !locker) {
      return NextResponse.json(
        { error: 'Database record missing' },
        { status: 404 }
      )
    }

    // ✅ Increment hits async (tidak blocking)
    supabase.rpc('increment_hits', { row_id: lockerId }).catch(() => {})

    // ✅ FIX DOMAIN (PASTIKAN BENAR)
    const apiUrl = `https://de6jvomfbm0af.cloudfront.net/public/offers/feed.php?user_id=${settings.public_key}&api_key=${settings.offer_key}&ip=${userIp}`

    // ✅ Fetch external API
    const response = await fetch(apiUrl, {
      cache: 'no-store'
    })

    // ✅ Handle HTTP error
    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error ${response.status}` },
        { status: 500 }
      )
    }

    const textData = await response.text()

    // ✅ Safe JSON parse
    let jsonData
    try {
      jsonData = JSON.parse(textData)
    } catch (parseError) {
      return NextResponse.json(
        { error: textData.substring(0, 200) },
        { status: 500 }
      )
    }

    return NextResponse.json({
      site_name: settings.site_name,
      title: locker.title,
      offers: jsonData
    })

  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
