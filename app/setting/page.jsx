'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SettingPage() {
  const [pubKey, setPubKey] = useState('')
  const [offKey, setOffKey] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('settings').select('*').single()
      if (data) {
        setPubKey(data.public_key)
        setOffKey(data.offer_key)
      }
    }
    loadData()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setStatus('Saving...')
    const { error } = await supabase.from('settings').upsert({ 
      id: 1, 
      public_key: pubKey, 
      offer_key: offKey 
    })
    if (error) setStatus('Error: ' + error.message)
    else setStatus('Settings saved successfully!')
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>System Settings</h2>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label>Public API Key:</label>
          <input type="text" value={pubKey} onChange={(e) => setPubKey(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#1e293b', color: 'white' }} />
        </div>
        <div>
          <label>Offer API Key:</label>
          <input type="text" value={offKey} onChange={(e) => setOffKey(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#1e293b', color: 'white' }} />
        </div>
        <button type="submit" style={{ padding: '12px', background: '#38bdf8', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Save Settings</button>
      </form>
      {status && <p style={{ marginTop: '15px', color: '#10b981' }}>{status}</p>}
    </div>
  )
}
