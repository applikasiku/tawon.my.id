/* Public presentation settings only. Credentials and private settings never belong here. */
(async()=>{
const base='https://ajqwpbpaozlurqoxysjt.supabase.co',key='sb_publishable_-XnVkQ5Jgi0ji47eizdS9g_XOY2Ao48';
const safeUrl=v=>{try{const u=new URL(v);return u.protocol==='https:'?u.href:null;}catch{return null;}};
try{
const r=await fetch(base+'/rest/v1/site_settings?select=value&key=eq.frontend_config',{headers:{apikey:key},cache:'no-store'});if(!r.ok)return;const rows=await r.json(),c=rows[0]?.value;if(!c||typeof c!=='object')return;
if(/^#[0-9a-f]{6}$/i.test(c.color||''))document.documentElement.style.setProperty('--yellow',c.color);
if(c.name){document.querySelectorAll('.brand,.drawer-brand').forEach(el=>el.textContent=c.name);if(location.pathname==='/'||location.pathname.endsWith('/index.html'))document.title=c.name+' — '+(c.tagline||'Berita terkini');}
if(c.tagline){const p=document.querySelector('.footer p');if(p)p.textContent=c.tagline;}
if(c.logo&&safeUrl(c.logo))document.querySelectorAll('.brand-logo,.trending-logo,.drawer-head img').forEach(el=>el.src=safeUrl(c.logo));
if(c.description&&(location.pathname==='/'||location.pathname.endsWith('/index.html'))){for(const sel of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]']){const el=document.querySelector(sel);if(el)el.content=c.description;}}
if(c.popular===false){const list=document.getElementById('popularList');if(list)list.closest('.sidebar-box').hidden=true;}
const trending=document.querySelector('.trending');if(trending)trending.hidden=c.trending_visible===false;
const track=document.getElementById('trendingKeywords');if(track&&c.trending){track.replaceChildren(...c.trending.split(',').map(s=>s.trim()).filter(Boolean).slice(0,20).map(word=>{const a=document.createElement('a');a.href='#';a.dataset.keyword=word;a.textContent=word;return a;}));}
if(c.breaking){const text=document.getElementById('breakingText');if(text){const apply=()=>{if(text.textContent!==c.breaking)text.textContent=c.breaking;};new MutationObserver(apply).observe(text,{childList:true});apply();}}
const ad=c.ad;if(ad?.enabled&&safeUrl(ad.image)&&safeUrl(ad.link)&&document.querySelector('.hero-grid')){const box=document.createElement('aside');box.className='wrap';box.style.cssText='margin:20px auto';const label=document.createElement('div');label.textContent='IKLAN';label.style.cssText='font-size:10px;letter-spacing:2px;color:#777;margin-bottom:5px';const a=document.createElement('a');a.href=safeUrl(ad.link);a.target='_blank';a.rel='sponsored noopener noreferrer';const img=document.createElement('img');img.src=safeUrl(ad.image);img.alt=ad.title||'Iklan';img.style.cssText='width:100%;max-height:230px;object-fit:contain;border-radius:10px';a.append(img);box.append(label,a);document.querySelector('main').before(box);}
}catch(e){console.warn('Pengaturan tampilan belum dapat dimuat.');}
})();
