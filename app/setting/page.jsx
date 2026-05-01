'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SettingPage() {
  const [settings, setSettings] = useState({ public_key: '', offer_key: '', site_name: '', domain: '' })
  const [settingsStatus, setSettingsStatus] = useState('')
  
  const [lockerData, setLockerData] = useState({ title: '', custom_code: '' })
  const [lockerStatus, setLockerStatus] = useState('')
  const [generatedCode, setGeneratedCode] = useState(null)

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single()
      if (data) {
        setSettings({
          public_key: data.public_key || '',
          offer_key: data.offer_key || '',
          site_name: data.site_name || '',
          domain: data.domain || ''
        })
      }
    }
    loadSettings()
  }, [])

  const saveSettings = async (e) => {
    e.preventDefault()
    setSettingsStatus('Saving...')
    const { error } = await supabase.from('settings').upsert({ id: 1, ...settings })
    if (error) setSettingsStatus('Error: ' + error.message)
    else setSettingsStatus('Global settings saved!')
  }

  const generateLocker = async (e) => {
    e.preventDefault()
    setLockerStatus('Generating...')
    const uniqueId = Math.random().toString(36).substring(2, 8)
    const { error } = await supabase.from('lockers').insert({ id: uniqueId, ...lockerData })
    
    if (error) {
      setLockerStatus('Error: ' + error.message)
    } else {
      setLockerStatus('Locker created!')
      const scriptUrl = `https://${window.location.host}/s/${uniqueId}.js`
      setGeneratedCode({
        script: `<script src="${scriptUrl}"></script>`,
        button: `<button onclick="tampilkanLocker()">Buka Konten</button>`
      })
      setLockerData({ title: '', custom_code: '' })
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h2>Global Configuration</h2>
        <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Site Name" value={settings.site_name} onChange={e => setSettings({...settings, site_name: e.target.value})} style={inputStyle} required />
          <input type="text" placeholder="Domain (example.com)" value={settings.domain} onChange={e => setSettings({...settings, domain: e.target.value})} style={inputStyle} required />
          <input type="text" placeholder="Public API Key" value={settings.public_key} onChange={e => setSettings({...settings, public_key: e.target.value})} style={inputStyle} required />
          <input type="text" placeholder="Offer API Key" value={settings.offer_key} onChange={e => setSettings({...settings, offer_key: e.target.value})} style={inputStyle} required />
          <button type="submit" style={btnStyle}>Save Settings</button>
        </form>
        {settingsStatus && <p style={{ color: '#10b981', marginTop: '10px' }}>{settingsStatus}</p>}
      </div>

      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px' }}>
        <h2>Locker Generator</h2>
        <form onSubmit={generateLocker} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Locker Title" value={lockerData.title} onChange={e => setLockerData({...lockerData, title: e.target.value})} style={inputStyle} required />
          <textarea placeholder="Custom Code (Optional)" value={lockerData.custom_code} onChange={e => setLockerData({...lockerData, custom_code: e.target.value})} style={{...inputStyle, minHeight: '80px'}} />
          <button type="submit" style={btnStyle}>Generate Locker</button>
        </form>
        {lockerStatus && <p style={{ color: '#10b981', marginTop: '10px' }}>{lockerStatus}</p>}

        {generatedCode && (
          <div style={{ marginTop: '20px', background: '#0f172a', padding: '15px', borderRadius: '5px', border: '1px solid #38bdf8' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Generated Code:</h4>
            
            <div style={codeBox}>
              <code style={{ wordBreak: 'break-all' }}>{generatedCode.script}</code>
              <button onClick={() => copyToClipboard(generatedCode.script)} style={copyBtn}>Copy</button>
            </div>
            
            <div style={codeBox}>
              <code style={{ wordBreak: 'break-all' }}>{generatedCode.button}</code>
              <button onClick={() => copyToClipboard(generatedCode.button)} style={copyBtn}>Copy</button>
            </div>
            
          </div>
        )}
      </div>

    </div>
  )
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' }
const btnStyle = { padding: '12px', background: '#38bdf8', color: 'black', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }
const codeBox = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', padding: '10px', margin: '10px 0', borderRadius: '4px', gap: '10px' }
const copyBtn = { background: '#334155', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '3px', cursor: 'pointer', flexShrink: 0 }
