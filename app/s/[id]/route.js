import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { id } = await params
  const lockerId = id.replace('.js', '')

  const jsCode = `
const styles = \`
.v1-locker-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; }
.v1-locker-content { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 15px; padding: 25px; max-width: 450px; width: 90%; color: white; box-shadow: 0 8px 32px 0 rgba(0,0,0,0.37); }
.v1-btn-offer { display: block; width: 100%; text-align: left; margin-bottom: 10px; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white; text-decoration: none; transition: 0.3s; position: relative; }
.v1-btn-offer:hover { background: rgba(255,255,255,0.2); text-decoration: none; color: white; }
.v1-payout { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: #10b981; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
\`;

function tampilkanLocker() {
    if (!document.getElementById('v1-bs-css')) {
        const link = document.createElement('link');
        link.id = 'v1-bs-css';
        link.rel = 'stylesheet';
        link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';
        document.head.appendChild(link);
    }

    if (!document.getElementById('v1-locker-style')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'v1-locker-style';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    let overlay = document.getElementById('v1-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'v1-locker-overlay';
        overlay.id = 'v1-overlay';
        document.body.appendChild(overlay);
    }
    
    overlay.innerHTML = \`
        <div class="v1-locker-content text-center">
            <h3 style="margin-top:0" id="v1-title">Content Locked</h3>
            <p>Please complete an offer below to continue.</p>
            <div id="v1-offers-list" style="margin-top:20px"><p>Loading offers...</p></div>
        </div>
    \`;
    overlay.style.display = 'flex';

    const host = new URL(document.currentScript.src).origin;
    
    fetch(host + '/api/offers/${lockerId}', { cache: 'no-store' })
        .then(res => res.text())
        .then(text => {
            const list = document.getElementById('v1-offers-list');
            list.innerHTML = '';
            
            let data;
            try {
                data = JSON.parse(text);
            } catch(e) {
                list.innerHTML = '<p style="color:#fbbf24;">Response Error:<br>' + text.substring(0, 100) + '</p>';
                return;
            }
            
            if (data.error) {
                list.innerHTML = '<p style="color:#fbbf24;">API Error:<br>' + data.error + '</p>';
                return;
            }

            if(data.title) {
                document.getElementById('v1-title').innerText = data.title;
            }

            if(data.offers && Array.isArray(data.offers) && data.offers.length > 0) {
                const topOffers = data.offers.slice(0, 5);
                topOffers.forEach(off => {
                    const a = document.createElement('a');
                    a.className = 'v1-btn-offer';
                    a.href = off.url;
                    a.target = '_blank';
                    a.innerHTML = \`<strong>\${off.anchor}</strong><span class="v1-payout">\${off.conversion || ''}</span>\`;
                    list.appendChild(a);
                });
            } else {
                list.innerHTML = '<p style="color:#fbbf24;">Tidak ada offer tersedia untuk negaramu saat ini.</p>';
            }
        })
        .catch(err => {
            const list = document.getElementById('v1-offers-list');
            if(list) list.innerHTML = '<p style="color:#fbbf24;">Gagal menghubungi server.</p>';
        });
}
  `;

  return new NextResponse(jsCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store'
    }
  })
}
