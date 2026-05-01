import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const fileId = params.id 
  const lockerId = fileId.replace('.js', '')

  const jsCode = `
const styles = \`
.v1-locker-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; }
.v1-locker-content { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 15px; padding: 25px; max-width: 450px; width: 90%; color: white; box-shadow: 0 8px 32px 0 rgba(0,0,0,0.37); }
.v1-btn-offer { display: block; width: 100%; text-align: left; margin-bottom: 10px; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white; text-decoration: none; transition: 0.3s; }
.v1-btn-offer:hover { background: rgba(255,255,255,0.2); text-decoration: none; color: white; }
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

    const overlay = document.createElement('div');
    overlay.className = 'v1-locker-overlay';
    overlay.id = 'v1-overlay';
    overlay.innerHTML = \`
        <div class="v1-locker-content text-center">
            <h3 style="margin-top:0">Content Locked</h3>
            <p>Please complete an offer below.</p>
            <div id="v1-offers-list" style="margin-top:20px"><p>Loading...</p></div>
        </div>
    \`;
    document.body.appendChild(overlay);

    const host = new URL(document.currentScript.src).origin;
    
    fetch(host + '/api/offers/${lockerId}')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('v1-offers-list');
            list.innerHTML = '';
            if(data.offers && data.offers.length > 0) {
                data.offers.forEach(off => {
                    const a = document.createElement('a');
                    a.className = 'v1-btn-offer';
                    a.href = off.url;
                    a.target = '_blank';
                    a.innerHTML = \`<strong>\${off.name}</strong><br><small>\${off.description}</small>\`;
                    list.appendChild(a);
                });
            } else {
                list.innerHTML = '<p>No offers available.</p>';
            }
        });
}
  `;

  return new NextResponse(jsCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
