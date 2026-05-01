'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SettingPage() {
  const [data, setData] = useState({
    public_key: '',
    offer_key: '',
    site_name: '',
    site_description: '',
    domain: ''
  })
  const [stats, setStats] = useState({ hits: 0, date: '' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function loadData() {
      const { data: settings } = await supabase.from('settings').select('*').single()
      if (settings) {
        setData({
          public_key: settings.public_key || '',
          offer_key: settings.offer_key || '',
          site_name: settings.site_name || '',
          site_description: settings.site_description || '',
          domain: settings.domain || ''
        })
        setStats({ hits: settings.hit_count, date: settings.created_at })
      }
    }
    loadData()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setStatus('Saving...')
    const { error } = await supabase.from('settings').upsert({ id: 1, ...data })
    if (error) setStatus('Error: ' + error.message)
    else setStatus('Settings updated!')
  }

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', background: '#1e293b', borderRadius: '10px', marginTop: '50px' }}>
      <h2>System Dashboard</h2>
      <p style={{ fontSize: '14px', color: '#94a3b8' }}>Created at: {new Date(stats.date).toLocaleString()}</p>
      <div style={{ background: '#334155', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
        <strong>Total Hits: {stats.hits}</strong>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Site Name" value={data.site_name} onChange={e => setData({...data, site_name: e.target.value})} style={inputStyle} />
        <input type="text" placeholder="Site Description" value={data.site_description} onChange={e => setData({...data, site_description: e.target.value})} style={inputStyle} />
        <input type="text" placeholder="Domain (example.com)" value={data.domain} onChange={e => setData({...data, domain: e.target.value})} style={inputStyle} />
        <hr style={{ border: '0.5px solid #334155' }} />
        <input type="text" placeholder="Public API Key" value={data.public_key} onChange={e => setData({...data, public_key: e.target.value})} style={inputStyle} />
        <input type="text" placeholder="Offer API Key" value={data.offer_key} onChange={e => setData({...data, offer_key: e.target.value})} style={inputStyle} />
        <button type="submit" style={{ padding: '12px', background: '#38bdf8', color: 'black', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Save All Configuration</button>
      </form>
      {status && <p style={{ marginTop: '15px' }}>{status}</p>}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#0f172a', color: 'white' };
