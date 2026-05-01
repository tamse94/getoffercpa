const styles = `
.v1-locker-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; }
.v1-locker-content { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 15px; padding: 25px; max-width: 450px; width: 90%; color: white; box-shadow: 0 8px 32px 0 rgba(0,0,0,0.37); }
.v1-btn-offer { display: block; width: 100%; text-align: left; margin-bottom: 10px; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white; text-decoration: none; transition: 0.3s; }
.v1-btn-offer:hover { background: rgba(255,255,255,0.2); text-decoration: none; color: white; }
`;

function tampilkanLocker() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';
    document.head.appendChild(link);

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const overlay = document.createElement('div');
    overlay.className = 'v1-locker-overlay';
    overlay.innerHTML = `
        <div class="v1-locker-content text-center">
            <h3 style="margin-top:0">Content Locked</h3>
            <p>Please complete one of the offers below to continue.</p>
            <div id="v1-offers-list" style="margin-top:20px">
                <p>Loading offers...</p>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    fetch('https://DOMAIN-KAMU-DI-VERCEL.vercel.app/api/offers')
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
                    a.innerHTML = `<strong>${off.name}</strong><br><small>${off.description}</small>`;
                    list.appendChild(a);
                });
            } else {
                list.innerHTML = '<p>No offers available for your country.</p>';
            }
        });
}
