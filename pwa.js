(()=>{
'use strict';

const year=document.getElementById('footerYear');if(year)year.textContent=new Date().getFullYear();
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
setTimeout(()=>{document.getElementById('tawonSplash')?.remove();document.documentElement.classList.remove('tawon-launch');},1500);
const offline=document.createElement('div');offline.className='tawon-offline';offline.setAttribute('role','status');offline.textContent='Anda sedang offline. Berita terbaru memerlukan koneksi internet.';document.body.append(offline);const sync=()=>offline.hidden=navigator.onLine;sync();addEventListener('online',sync);addEventListener('offline',sync);
// Authenticated pages are never cached by the worker.
if('serviceWorker' in navigator&&window.isSecureContext){navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).then(reg=>reg.update()).catch(e=>console.warn('PWA belum dapat diaktifkan:',e.message));}
if(standalone())return;
let pending=null;
const button=document.createElement('button');button.type='button';button.className='tawon-install';button.innerHTML='<i class="fa-solid fa-mobile-screen-button" aria-hidden="true"></i> Pasang aplikasi TAWON';(document.querySelector('.footer-install-slot')||document.body).append(button);
const dialog=document.createElement('dialog');dialog.className='tawon-dialog';dialog.setAttribute('aria-labelledby','pwaInstallTitle');dialog.innerHTML='<img src="/assets/icon-192-v6.png" width="48" height="48" alt=""><h2 id="pwaInstallTitle">Pasang TAWON</h2><p id="pwaInstallHelp"></p><p class="muted">Aplikasi membuka berita langsung dari situs. Koneksi internet diperlukan untuk memuat berita terbaru.</p><button type="button">Mengerti</button>';document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();
addEventListener('beforeinstallprompt',e=>{e.preventDefault();pending=e;button.hidden=false;});
button.onclick=async()=>{if(pending){const event=pending;pending=null;try{await event.prompt();const choice=await event.userChoice;if(choice.outcome==='accepted')button.hidden=true;}catch(e){console.warn('Pemasangan dibatalkan.');}return;}const apple=/iPad|iPhone|iPod/.test(navigator.userAgent);dialog.querySelector('#pwaInstallHelp').textContent=apple?'Di Safari, tekan Bagikan lalu pilih Tambahkan ke Layar Utama.':'Buka situs ini di Chrome atau Edge. Tekan menu ⋮ lalu pilih Instal aplikasi atau Tambahkan ke layar utama. Opsi muncul saat browser mendukung pemasangan.';dialog.showModal();};
addEventListener('appinstalled',()=>{button.hidden=true;pending=null;dialog.close();});
})();
