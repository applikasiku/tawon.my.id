(()=>{
'use strict';
const fa=n=>'<i class="fa-solid fa-'+n+'" aria-hidden="true"></i>';
const services=[
['cloud-sun','Cuaca','https://www.bmkg.go.id/','Prakiraan BMKG'],
['coins','Emas','https://www.logammulia.com/id/harga-emas-hari-ini','Harga dari sumber resmi'],
['bolt','Baca cepat','/#latest','Berita terbaru'],
['heart-pulse','Kesehatan','/#kategori-gaya-hidup','Panduan hidup sehat'],
['wallet','Atur keuangan','budget','Simulasi anggaran'],
['trophy','Olahraga','https://www.fifa.com/','Jelajahi olahraga'],
['mosque','Jadwal salat','https://bimasislam.kemenag.go.id/jadwalshalat','Jadwal dari Kemenag'],
['headphones','Audio berita','audio','Dengarkan artikel'],
['bookmark','Bacaan tersimpan','/akun.html','Koleksi Anda'],
['comment-dots','Beri masukan','mailto:service@tawon.my.id','Hubungi kami'],
['sliders','Atur minat','interest','Rubrik favorit'],
['map-location-dot','Peta publik','https://www.openstreetmap.org/','Jelajahi lokasi']];
document.querySelector('header.brandbar')?.classList.add('legacy-header');
document.querySelectorAll('body > .top,body > .wrap > a.brand').forEach(e=>e.classList.add('legacy-header'));
const shell=document.createElement('section');shell.className='tawon-masthead';
shell.innerHTML='<header class="masthead-row"><a class="masthead-brand" href="/"><img src="/assets/icon-192-v6.png" width="46" height="46" alt=""><span>TAWON<span class="domain">.MY.ID</span><small>Berita Terkini, Terpercaya</small></span></a><nav class="masthead-actions" aria-label="Layanan utama">'+[['bag-shopping','Belanja dan kerja sama','shop'],['headphones','Audio berita','audio'],['bars','Menu dan pencarian','menu']].map(s=>'<button data-service="'+s[2]+'" aria-label="'+s[1]+'" title="'+s[1]+'">'+fa(s[0])+'</button>').join('')+'</nav></header><div class="assistance"><div class="assistance-heading"><h2>Living Assistance</h2><div><button data-slide="-1" aria-label="Geser ke kiri">'+fa('chevron-left')+'</button><button data-slide="1" aria-label="Geser ke kanan">'+fa('chevron-right')+'</button><button data-service="all" aria-label="Semua layanan" aria-haspopup="dialog">'+fa('ellipsis-vertical')+'</button></div></div><div class="assistance-track" tabindex="0" aria-label="Geser untuk melihat layanan">'+services.slice(0,8).map((s,i)=>'<button class="assistance-card" data-item="'+i+'">'+fa(s[0])+'<span><strong>'+s[1]+'</strong><small>'+s[3]+'</small></span>'+fa('chevron-right')+'</button>').join('')+'</div></div>';
document.body.insertBefore(shell,document.querySelector('body > .top')||document.querySelector('body > .wrap')||document.body.firstChild);
const assistance=shell.querySelector('.assistance');const trending=document.querySelector('.trending');
if(trending)trending.after(assistance);
assistance.querySelector('.assistance-heading>div').remove();
const more=document.createElement('button');more.className='assistance-card assistance-more';more.dataset.service='all';more.setAttribute('aria-label','Semua layanan Living Assistance');more.setAttribute('aria-haspopup','dialog');more.innerHTML=fa('ellipsis')+'<span><strong>Layanan lainnya</strong></span>';assistance.querySelector('.assistance-track').append(more);


if(!document.getElementById('siteDrawer')){
 const holder=document.createElement('div');holder.innerHTML="<div class=\"drawer-backdrop\" id=\"drawerBackdrop\"></div><aside class=\"drawer\" id=\"siteDrawer\" aria-hidden=\"true\" aria-label=\"Menu utama\"><div class=\"drawer-head\"><img src=\"/assets/icon-192-v6.png\" alt=\"\"><div class=\"drawer-brand\">Tawon<span style=\"color:#b88900\">.my.id</span></div><button class=\"drawer-close\" id=\"menuClose\" aria-label=\"Tutup menu\" type=\"button\"><i class=\"fa-solid fa-xmark\" aria-hidden=\"true\"></i></button></div><div class=\"drawer-section\">CARI BERITA</div><form class=\"search\" id=\"searchForm\"><input id=\"searchInput\" type=\"search\" placeholder=\"Cari berita...\" aria-label=\"Cari berita\"><button type=\"submit\" aria-label=\"Cari berita\"><i class=\"fa-solid fa-magnifying-glass\" aria-hidden=\"true\"></i><span>Cari</span></button></form><div class=\"drawer-section\">KATEGORI</div><nav class=\"drawer-links\" id=\"drawerCategories\"><a href=\"/\"><i class=\"fa-solid fa-house\"></i>Beranda</a></nav><div class=\"drawer-section\">HALAMAN INFORMASI</div><div class=\"drawer-links\"><a href=\"/info.html?page=tentang\"><i class=\"fa-solid fa-circle-info\"></i>Tentang Kami</a><a href=\"/info.html?page=redaksi\"><i class=\"fa-solid fa-users\"></i>Redaksi</a><a href=\"/info.html?page=pedoman\"><i class=\"fa-solid fa-book-open\"></i>Pedoman Media Siber</a><a href=\"/info.html?page=koreksi\"><i class=\"fa-solid fa-pen-to-square\"></i>Koreksi & Hak Jawab</a><a href=\"/info.html?page=kontak\"><i class=\"fa-solid fa-envelope\"></i>Kontak Redaksi</a><a href=\"/info.html?page=privasi\"><i class=\"fa-solid fa-shield-halved\"></i>Kebijakan Privasi</a><a href=\"/info.html?page=syarat\"><i class=\"fa-solid fa-file-lines\"></i>Syarat & Ketentuan</a><a href=\"/info.html?page=iklan\"><i class=\"fa-solid fa-bullhorn\"></i>Iklan & Kerja Sama</a></div><div class=\"drawer-section\">BAGIKAN TAWON.MY.ID</div><div class=\"drawer-social\"><a href=\"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ftawon.my.id%2F\" target=\"_blank\" rel=\"noopener\">Facebook</a><a href=\"https://api.whatsapp.com/send?text=https%3A%2F%2Ftawon.my.id%2F\" target=\"_blank\" rel=\"noopener\">WhatsApp</a><a href=\"https://twitter.com/intent/tweet?url=https%3A%2F%2Ftawon.my.id%2F\" target=\"_blank\" rel=\"noopener\">X</a><a href=\"https://t.me/share/url?url=https%3A%2F%2Ftawon.my.id%2F\" target=\"_blank\" rel=\"noopener\">Telegram</a></div><p class=\"drawer-note\">Informasi redaksi, kebijakan, dan kontak ditampilkan untuk mendukung transparansi penerbit.</p></aside>";document.body.append(...holder.childNodes);
 const categories=document.getElementById('drawerCategories');
 for(const [name,slug] of [['Nasional','nasional'],['Daerah','daerah'],['Desa','desa'],['Ekonomi','ekonomi'],['Teknologi','teknologi'],['Pendidikan','pendidikan'],['Gaya hidup','gaya-hidup'],['Lingkungan','lingkungan']]){const a=document.createElement('a');a.href='/#kategori-'+slug;a.innerHTML=fa('folder');a.append(document.createTextNode(name));categories.append(a);}
 document.getElementById('menuClose').onclick=closeDrawer;document.getElementById('drawerBackdrop').onclick=closeDrawer;
 document.getElementById('searchForm').addEventListener('submit',e=>{e.preventDefault();location.href='/?q='+encodeURIComponent(document.getElementById('searchInput').value.trim());});
}
function closeDrawer(){document.getElementById('siteDrawer').classList.remove('open');document.getElementById('drawerBackdrop').classList.remove('open');document.getElementById('siteDrawer').setAttribute('aria-hidden','true');document.body.style.overflow='';shell.querySelector('[data-service="menu"]').setAttribute('aria-expanded','false');}
function openDrawer(){document.getElementById('siteDrawer').classList.add('open');document.getElementById('drawerBackdrop').classList.add('open');document.getElementById('siteDrawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';shell.querySelector('[data-service="menu"]').setAttribute('aria-expanded','true');document.getElementById('menuClose').focus();}
shell.querySelector('[data-service="menu"]').setAttribute('aria-expanded','false');
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer();});

const d=document.createElement('dialog');d.className='assistance-modal';d.setAttribute('aria-labelledby','assistanceTitle');d.innerHTML='<div class="assistance-modal-head"><h2 id="assistanceTitle"></h2><button aria-label="Tutup popup">'+fa('xmark')+'</button></div><div class="assistance-modal-body"></div>';document.body.append(d);
try{const choices=JSON.parse(localStorage.getItem('tawon-interests')||'[]');if(Array.isArray(choices)&&choices.length){const nav=document.createElement('nav');nav.className='interest-shortcuts';nav.setAttribute('aria-label','Rubrik pilihan Anda');nav.textContent='Pilihan Anda: ';for(const x of choices){if(typeof x!=='string')continue;const link=document.createElement('a');link.textContent=x;link.href='/#kategori-'+x.toLowerCase().replaceAll(' ','-');nav.append(link);}shell.append(nav);}}catch(e){}
let opener;
function show(title,html){opener=document.activeElement;d.querySelector('h2').textContent=title;d.querySelector('.assistance-modal-body').innerHTML=html;if(!d.open)d.showModal();}
d.querySelector('button').onclick=()=>d.close();d.onclick=e=>{if(e.target===d)d.close();};d.addEventListener('close',()=>opener?.focus());
function run(a){
if(a==='all')show('Living Assistance','<div class="assistance-grid">'+services.map((s,i)=>'<button data-item="'+i+'">'+fa(s[0])+'<span>'+s[1]+'</span></button>').join('')+'</div>');
else if(a==='audio')show('Audio berita','<p>Dengarkan artikel yang sedang dibuka dengan suara dari perangkat Anda.</p><p id="audioStatus" role="status"></p><div class="service-controls">'+[['play','Putar'],['pause','Jeda / lanjut'],['stop','Hentikan']].map(s=>'<button data-audio="'+s[0]+'">'+fa(s[0])+' '+s[1]+'</button>').join('')+'</div><p class="service-note">Ketersediaan suara bahasa Indonesia bergantung pada perangkat. <a href="/">Pilih artikel di beranda</a>.</p>');
else if(a==='menu')openDrawer();
else if(a==='shop')show('Belanja & kerja sama','<div class="service-feature">'+fa('bag-shopping')+'<h3>Ruang mitra TAWON</h3><p>Katalog belanja belum tersedia. Hubungi tim kami untuk penawaran produk, iklan, dan kerja sama.</p><a href="/info.html?page=iklan">Informasi iklan & kerja sama '+fa('arrow-right')+'</a><p><a href="mailto:iklan@tawon.my.id">iklan@tawon.my.id</a></p></div>');
else if(a==='budget')show('Atur keuangan','<form id="budgetForm" class="service-search"><label for="monthlyIncome">Pendapatan bulanan (Rp)</label><input id="monthlyIncome" type="number" min="1" max="1000000000000" placeholder="Contoh: 5000000" required><button>Hitung anggaran</button></form><div id="budgetResult" role="status"></div><p class="service-note">Simulasi 50% kebutuhan, 30% keinginan, 20% tabungan. Sesuaikan dengan kondisi pribadi. Angka tidak dikirim ke server.</p>');
else if(a==='interest'){let saved=[];try{saved=JSON.parse(localStorage.getItem('tawon-interests')||'[]')}catch(e){}show('Atur minat','<p>Pilih rubrik favorit untuk pintasan di perangkat ini.</p><form id="interestForm" class="interest-form">'+['Nasional','Daerah','Desa','Ekonomi','Teknologi','Pendidikan','Gaya Hidup','Lingkungan'].map(x=>'<label><input type="checkbox" value="'+x+'" '+(saved.includes(x)?'checked':'')+'>'+x+'</label>').join('')+'<button>Simpan minat</button><p role="status" id="interestStatus"></p></form>');}
else if(a.startsWith('https:'))window.open(a,'_blank','noopener,noreferrer');
else {d.close();if(a==='/#latest' && document.getElementById('latest'))document.getElementById('latest').scrollIntoView({behavior:'smooth'});else location.href=a;}
}
document.addEventListener('click',e=>{
const item=e.target.closest('[data-item]');if(item){run(services[+item.dataset.item][2]);return;}
const service=e.target.closest('[data-service]');if(service){run(service.dataset.service);return;}
const slide=e.target.closest('[data-slide]');if(slide)shell.querySelector('.assistance-track').scrollBy({left:+slide.dataset.slide*300,behavior:'smooth'});
const a=e.target.closest('[data-audio]');if(!a)return;const status=document.getElementById('audioStatus');
if(!('speechSynthesis'in window)){status.textContent='Peramban ini belum mendukung pembaca suara.';return;}
if(a.dataset.audio==='stop'){speechSynthesis.cancel();status.textContent='Audio dihentikan.';return;}
if(a.dataset.audio==='pause'){speechSynthesis.paused?speechSynthesis.resume():speechSynthesis.pause();return;}
const article=document.querySelector('#article .content');if(!article){status.textContent='Buka sebuah artikel terlebih dahulu.';return;}
speechSynthesis.cancel();const text=(document.querySelector('#article h1')?.textContent||'')+'. '+article.innerText;
const chunks=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text];for(const chunk of chunks){const u=new SpeechSynthesisUtterance(chunk);u.lang='id-ID';speechSynthesis.speak(u);}status.textContent='Sedang membacakan artikel.';
});
document.addEventListener('submit',e=>{
if(e.target.id==='budgetForm'){e.preventDefault();const n=+document.getElementById('monthlyIncome').value;const rp=x=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(x);document.getElementById('budgetResult').innerHTML='<p>Kebutuhan: <strong>'+rp(n*.5)+'</strong></p><p>Keinginan: <strong>'+rp(n*.3)+'</strong></p><p>Tabungan: <strong>'+rp(n*.2)+'</strong></p>';}
if(e.target.id==='interestForm'){e.preventDefault();try{localStorage.setItem('tawon-interests',JSON.stringify([...e.target.querySelectorAll('input:checked')].map(x=>x.value)));document.getElementById('interestStatus').textContent='Minat tersimpan di perangkat ini.';}catch(err){document.getElementById('interestStatus').textContent='Penyimpanan perangkat tidak tersedia.';}}
});
})();
