'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SettingPage() {
  const [data, setData] = useState({
    public_key: '', offer_key: '', site_name: '', site_description: '', domain: ''
  })
  const [status, setStatus] = useState('')
  const [generatedCode, setGeneratedCode] = useState(null)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setStatus('Generating...')
    
    const uniqueId = Math.random().toString(36).substring(2, 8)
    
    const { error } = await supabase.from('settings').insert({ id: uniqueId, ...data })
    
    if (error) {
      setStatus('Error: ' + error.message)
    } else {
      setStatus('Success!')
      const scriptUrl = `https://${window.location.host}/s/${uniqueId}.js`
      setGeneratedCode({
        script: `<script src="${scriptUrl}"></script>`,
        button: `<button onclick="tampilkanLocker()">Buka Konten</button>`
      })
      setData({ public_key: '', offer_key: '', site_name: '', site_description: '', domain: '' })
    }
  }

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto', background: '#1e293b', borderRadius: '10px', marginTop: '50px' }}>
      <h2>Locker Generator</h2>
      
      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
        <input type="text" placeholder="Site Name" value={data.site_name} onChange={e => setData({...data, site_name: e.target.value})} style={inputStyle} required />
        <input type="text" placeholder="Site Description" value={data.site_description} onChange={e => setData({...data, site_description: e.target.value})} style={inputStyle} />
        <input type="text" placeholder="Domain (example.com)" value={data.domain} onChange={e => setData({...data, domain: e.target.value})} style={inputStyle} required />
        <hr style={{ border: '0.5px solid #334155' }} />
        <input type="text" placeholder="Public API Key" value={data.public_key} onChange={e => setData({...data, public_key: e.target.value})} style={inputStyle} required />
        <input type="text" placeholder="Offer API Key" value={data.offer_key} onChange={e => setData({...data, offer_key: e.target.value})} style={inputStyle} required />
        <button type="submit" style={{ padding: '12px', background: '#38bdf8', color: 'black', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Generate Locker</button>
      </form>

      {status && <p style={{ color: '#38bdf8' }}>{status}</p>}

      {generatedCode && (
        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '5px', border: '1px solid #38bdf8' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>Locker Created! Copy Code Below:</h4>
          <p style={{ margin: '5px 0', color: '#94a3b8' }}>1. Put this script in your blog:</p>
          <code style={{ display: 'block', background: '#000', padding: '10px', color: '#10b981', borderRadius: '4px', wordBreak: 'break-all' }}>
            {generatedCode.script}
          </code>
          <p style={{ margin: '15px 0 5px 0', color: '#94a3b8' }}>2. Use this button to open the locker:</p>
          <code style={{ display: 'block', background: '#000', padding: '10px', color: '#10b981', borderRadius: '4px', wordBreak: 'break-all' }}>
            {generatedCode.button}
          </code>
        </div>
      )}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#0f172a', color: 'white' };
