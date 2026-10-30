(()=>{
'use strict';
const U='https://ajqwpbpaozlurqoxysjt.supabase.co',K='sb_publishable_-XnVkQ5Jgi0ji47eizdS9g_XOY2Ao48',H={apikey:K,Authorization:'Bearer '+K,'Content-Type':'application/json'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>'<i class="fa-solid fa-'+n+'" aria-hidden="true"></i>';
function addReadingExtras(a,content){
 const cover=document.querySelector('#article > img.cover');
 if(cover){const figure=document.createElement('figure');figure.className='article-cover-figure';cover.before(figure);figure.append(cover);const caption=document.createElement('figcaption');caption.textContent=a.title;figure.append(caption);}
 // Older imported HTML sometimes includes the following paragraph inside a heading.
 content.querySelectorAll('h2,h3').forEach(h=>{
  const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){const index=node.textContent.indexOf('\n');if(index<0)continue;
   const range=document.createRange();range.setStart(node,index+1);range.setEnd(h,h.childNodes.length);const fragment=range.extractContents();node.textContent=node.textContent.trimEnd();
   if(fragment.textContent.trim()){const lines=fragment.textContent.trim().split('\n');if(lines.every(line=>/^[-*]\s+/.test(line.trim()))){const ul=document.createElement('ul');lines.forEach(line=>{const li=document.createElement('li');li.textContent=line.trim().replace(/^[-*]\s+/,'');ul.append(li);});h.after(ul);}else{const p=document.createElement('p');p.append(fragment);h.after(p);}}break;
  }
 });
 let headings=[...content.querySelectorAll('h2,h3')];
 if(!headings.length){const h=document.createElement('h2');h.textContent='Isi artikel';content.prepend(h);headings=[h];}
 const toc=document.createElement('details');toc.className='article-toc';toc.open=false;toc.innerHTML='<summary>'+icon('list-ul')+' Daftar isi artikel '+icon('chevron-down')+'</summary><nav aria-label="Daftar isi"><ol></ol></nav>';
 headings.forEach((h,i)=>{h.id='bagian-artikel-'+(i+1);h.classList.add('article-anchor');const li=document.createElement('li');if(h.tagName==='H3')li.className='toc-sub';const link=document.createElement('a');link.href='#'+h.id;link.textContent=h.textContent;li.append(link);toc.querySelector('ol').append(li);});content.before(toc);
 const related=document.createElement('aside');related.className='article-related';related.setAttribute('aria-labelledby','relatedHeading');related.innerHTML='<h2 id="relatedHeading">'+icon('book-open')+' Baca juga:</h2><ol id="relatedArticles"><li>Memuat artikel terkait…</li></ol>';content.after(related);
 const recommendation=document.createElement('section');recommendation.className='article-recommendations';recommendation.setAttribute('aria-labelledby','recommendationHeading');recommendation.innerHTML='<div class="recommendation-heading"><div><small>PILIHAN UNTUK ANDA</small><h2 id="recommendationHeading">Rekomendasi berita</h2></div><span>'+icon('hand-pointer')+' Geser</span></div><div class="recommendation-track" id="recommendationTrack" tabindex="0" aria-label="Geser rekomendasi berita"></div>';
 const comments=document.getElementById('commentsPanel');(comments||related).after(recommendation);
 const quote=document.createElement('section');quote.className='article-quote';quote.setAttribute('aria-label','Kutipan inspirasi');quote.innerHTML=icon('quote-left')+'<small>JEDA SEJENAK</small><blockquote id="readerQuote"></blockquote><p>Catatan Redaksi TAWON</p><div><span id="quoteTime"></span><button type="button" id="nextQuote" aria-label="Tampilkan kutipan berikutnya">'+icon('arrows-rotate')+'</button></div>';recommendation.after(quote);
 const quotes=['Berita membantu kita mengetahui; berpikir jernih membantu kita memahami.','Luangkan waktu untuk membaca, lalu beri ruang untuk mempertimbangkan.','Rasa ingin tahu adalah langkah pertama menuju pemahaman.','Satu pertanyaan yang baik dapat membuka banyak sudut pandang.','Perubahan besar sering dimulai dari kebiasaan kecil yang dijaga.','Periksa sumbernya, pahami konteksnya, lalu tentukan sikap.','Di tengah informasi yang cepat, ketelitian tetap berharga.','Mendengarkan sudut pandang lain memperluas cara kita melihat dunia.'];let last=-1;
 function rotate(){let n;do{n=Math.floor(Math.random()*quotes.length)}while(n===last);last=n;document.getElementById('readerQuote').textContent=quotes[n];document.getElementById('quoteTime').textContent='Diperbarui '+new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date())+' WIB · berganti setiap 30 detik';}
 rotate();quote.querySelector('button').onclick=rotate;setInterval(()=>{if(!document.hidden)rotate();},30000);
 async function loadRecommendations(){try{const r=await fetch(U+'/rest/v1/articles?select=id,title,slug,thumbnail_url,published_at,categories(name,slug)&status=eq.published&id=neq.'+encodeURIComponent(a.id)+'&published_at=not.is.null&published_at=lte.'+encodeURIComponent(new Date().toISOString())+'&order=published_at.desc&limit=50',{headers:H});if(!r.ok)throw Error('recommendations');const rows=await r.json();const sorted=[...rows].sort((x,y)=>Number(y.categories?.slug===a.categories?.slug)-Number(x.categories?.slug===a.categories?.slug));const relevant=sorted.slice(0,5);
 related.querySelector('ol').innerHTML=relevant.length?relevant.map(x=>'<li><a href="/artikel.html?slug='+encodeURIComponent(x.slug)+'">'+esc(x.title)+'</a><span>'+esc(x.categories?.name||'Berita')+'</span></li>').join(''):'<li>Artikel terkait belum tersedia.</li>';
 const suggestions=[...rows.filter(x=>!relevant.some(y=>y.id===x.id)),...relevant].slice(0,5);
 recommendation.querySelector('.recommendation-track').innerHTML=suggestions.length?suggestions.map(x=>'<article class="recommendation-card"><a href="/artikel.html?slug='+encodeURIComponent(x.slug)+'"><div class="recommendation-image">'+(x.thumbnail_url?'<img loading="lazy" src="'+esc(x.thumbnail_url)+'" alt="'+esc(x.title)+'">':icon('newspaper'))+'</div><div class="recommendation-copy"><small>'+esc(x.categories?.name||'Berita')+'</small><h3>'+esc(x.title)+'</h3><time datetime="'+esc(x.published_at)+'">'+new Date(x.published_at).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})+'</time></div></a></article>').join(''):'<p>Rekomendasi belum tersedia.</p>';
 }catch(e){related.querySelector('ol').innerHTML='<li>Artikel terkait belum dapat dimuat. Silakan muat ulang halaman.</li>';recommendation.querySelector('.recommendation-track').textContent='Rekomendasi belum dapat dimuat.';}}
 loadRecommendations();
}

let currentId;
async function start(a){
 if(currentId===a.id)return;currentId=a.id;
 const content=document.querySelector('#article .content');if(!content)return;
 const author=document.getElementById('articleAuthor');const heading=document.querySelector('#article h1');

 heading.after(author);author.classList.add('article-byline');
 // Keep the published date with the byline instead of a second author row.
 const oldMeta=document.querySelector('#article > p.muted');
 if(oldMeta){const time=oldMeta.querySelector('time');if(time){time.className='article-published';author.querySelector('.author-info').append(time);}oldMeta.remove();}
 const first=content.querySelector('p');
 if(first){
  const text=first.textContent.trim();
  const cityMatch=text.match(/^(Jakarta|Bandung|Surabaya|Semarang|Yogyakarta|Banyumas|Purwokerto|Medan|Makassar|Denpasar|Bogor|Depok|Bekasi|Tangerang|Solo|Surakarta|Palembang|Malang|Bali|Indonesia)\s*[,–—:-]\s*/i);
  const existing=text.match(/^([\p{L} .-]{2,45}?)\s*[,–—:]?\s*TAWON\.MY\.ID\s*[,–—:-]?\s*/iu);
  const prefix=existing||cityMatch;
  const city=prefix?prefix[1].toLocaleLowerCase('id-ID').replace(/(^|\s)\p{L}/gu,c=>c.toLocaleUpperCase('id-ID')):'Indonesia';
  // Remove only the matching text prefix; preserve links and formatting in the lead.
  if(prefix){let remaining=prefix[0].length;const walker=document.createTreeWalker(first,NodeFilter.SHOW_TEXT);let node;while(remaining>0&&(node=walker.nextNode())){const n=Math.min(remaining,node.textContent.length);node.textContent=node.textContent.slice(n);remaining-=n;}}
  const dateline=document.createElement('strong');dateline.className='article-dateline';dateline.textContent=city+', Tawon.my.id — ';first.prepend(dateline);
 }

 const stats=document.createElement('div');stats.className='reader-stats';stats.innerHTML='<span title="Jumlah pembacaan, bukan pengunjung unik">'+icon('eye')+' <span id="articleViews">—</span> pembacaan</span><a href="#articleRating">'+icon('star')+' <span id="articleRatingSummary">Belum ada rating</span></a><button type="button" class="audio-icon-button" data-service="audio" aria-label="Dengarkan artikel" title="Dengarkan artikel">'+icon('headphones')+'</button><span class="audio-error" id="audioError" role="status" aria-live="polite" hidden></span>';author.after(stats);
 const audioButton=stats.querySelector('[data-service="audio"]');let audioElement=null,audioUrl=null,audioBusy=false;
 audioButton.addEventListener('click',async()=>{
  const errorBox=stats.querySelector('#audioError');errorBox.hidden=true;errorBox.textContent='';
  if(audioElement&&!audioElement.paused){audioElement.pause();audioButton.innerHTML=icon('headphones');audioButton.title='Lanjutkan audio';audioButton.setAttribute('aria-label','Lanjutkan audio');return;}
  if(audioElement&&audioElement.paused&&audioUrl){try{await audioElement.play();audioButton.innerHTML=icon('pause');audioButton.title='Jeda audio';audioButton.setAttribute('aria-label','Jeda audio');return;}catch(e){}}
  if(audioBusy)return;audioBusy=true;audioButton.disabled=true;audioButton.innerHTML=icon('spinner fa-spin');audioButton.title='Menyiapkan audio';
  try{
   const response=await fetch('/api/audio',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:a.slug})});
   if(!response.ok){let message='Audio belum dapat diputar. Silakan coba lagi.';try{const data=await response.json();if(data?.message)message=data.message;}catch(e){}throw Error(message);}
   const blob=await response.blob();if(!blob.type.startsWith('audio/'))throw Error('Format audio tidak dikenali.');
   if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(blob);audioElement=new Audio(audioUrl);
   audioElement.addEventListener('ended',()=>{audioButton.innerHTML=icon('headphones');audioButton.title='Putar ulang audio';audioButton.setAttribute('aria-label','Putar ulang audio');});
   audioElement.addEventListener('error',()=>{errorBox.textContent='Audio gagal diputar. Silakan muat ulang halaman.';errorBox.hidden=false;audioButton.innerHTML=icon('headphones');});
   await audioElement.play();audioButton.innerHTML=icon('pause');audioButton.title='Jeda audio';audioButton.setAttribute('aria-label','Jeda audio');
  }catch(error){errorBox.textContent=error.message||'Audio gagal dimuat. Silakan coba lagi.';errorBox.hidden=false;audioButton.innerHTML=icon('headphones');audioButton.title='Coba putar audio lagi';audioButton.setAttribute('aria-label','Coba putar audio lagi');}
  finally{audioBusy=false;audioButton.disabled=false;}
 });
 const taxonomy=document.createElement('nav');taxonomy.className='article-taxonomy';taxonomy.setAttribute('aria-label','Kategori dan hashtag artikel');
 taxonomy.innerHTML='<a class="article-category-link" href="/#kategori-'+encodeURIComponent(a.categories?.slug||'nasional')+'">'+icon('folder-open')+' '+esc(a.categories?.name||'Berita')+'</a>'+(a.article_tags?.length?a.article_tags:[{tags:{name:a.categories?.name||'Berita'}}]).filter(t=>t.tags?.name).map(t=>'<a href="/?q='+encodeURIComponent(t.tags.name)+'">#'+esc(t.tags.name.replace(/^#/,''))+'</a>').join('');content.after(taxonomy);
 const rating=document.createElement('section');rating.id='articleRating';rating.className='article-rating';rating.innerHTML='<div><small>PENDAPAT PEMBACA</small><h2>Bagaimana artikel ini?</h2><p id="ratingAggregate">Memuat penilaian pembaca…</p></div><div class="rating-stars" role="group" aria-label="Beri rating satu sampai lima bintang">'+[1,2,3,4,5].map(n=>'<button type="button" data-rating="'+n+'" aria-label="Beri '+n+' bintang" aria-pressed="false"><i class="fa-regular fa-star" aria-hidden="true"></i></button>').join('')+'</div><p id="ratingStatus" role="status">Masuk untuk memberi rating. Satu penilaian per akun, dapat diperbarui.</p><a href="/akun.html">Masuk / daftar akun</a>';taxonomy.after(rating);
 addReadingExtras(a,content);
 const bottomActions=document.querySelector('#article > .action-bar');
 if(bottomActions){
  bottomActions.setAttribute('aria-label','Interaksi setelah artikel');
  const topActions=bottomActions.cloneNode(true);topActions.classList.add('article-top-actions');topActions.setAttribute('aria-label','Interaksi di bawah penulis');
  // Proxy to the original handlers so both rows share reaction and bookmark state.
  topActions.querySelectorAll('[id]').forEach(el=>{el.dataset.originalId=el.id;el.removeAttribute('id');});
  topActions.querySelector('.reaction-menu')?.remove();
  topActions.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
   const original=document.getElementById(button.dataset.originalId);if(!original)return;
   if(button.dataset.originalId==='articleReaction'){bottomActions.scrollIntoView({behavior:'smooth',block:'center'});}
   original.click();
  }));
  const sync=()=>topActions.querySelectorAll('[data-original-id]').forEach(el=>{const original=document.getElementById(el.dataset.originalId);if(!original)return;if(el.tagName==='BUTTON'){el.className=original.className;for(const attr of ['aria-pressed','aria-expanded'])if(original.hasAttribute(attr))el.setAttribute(attr,original.getAttribute(attr));}else el.textContent=original.textContent;});
  new MutationObserver(sync).observe(bottomActions,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','aria-pressed','aria-expanded']});
  stats.after(topActions);
 }

 let db=window.supabase?.createClient(U,K),user=null;
 if(db){const session=await db.auth.getSession();user=session.data.session?.user;if(user){const {data}=await db.from('article_ratings').select('rating').eq('article_id',a.id).eq('user_id',user.id).maybeSingle();if(data)stars(data.rating);}}
 function stars(n){rating.querySelectorAll('[data-rating]').forEach(b=>{const active=+b.dataset.rating<=n;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(+b.dataset.rating===n));b.querySelector('i').className=(active?'fa-solid':'fa-regular')+' fa-star';});}
 async function refresh(){const r=await fetch(U+'/rest/v1/rpc/article_reader_metadata',{method:'POST',headers:H,body:JSON.stringify({p_article_id:a.id})});if(!r.ok)throw Error('Statistik belum tersedia');const m=await r.json();if(!m)return;const p=m.author||{},name=/redaksi/i.test(p.display_name||'')?'Redaksi':p.display_name||'Redaksi';const label=p.role==='admin'?'Admin terverifikasi':(['author','editor'].includes(p.role)?'Penulis / editor terverifikasi':'Pengguna terverifikasi');const color=p.role==='admin'?'blue':(['author','editor'].includes(p.role)?'green':'gray');document.getElementById('authorDisplay').innerHTML=esc(name)+(p.verified?'<span class="identity-badge '+color+'" title="'+label+'" aria-label="'+label+'">'+icon('check')+'</span>':'');author.querySelector('.author-sub').textContent=p.role==='admin'?'Redaksi TAWON':p.role==='editor'?'Editor TAWON':p.role==='author'?'Penulis TAWON':'Kontributor TAWON';if(p.avatar_url){try{const url=new URL(p.avatar_url);if(url.protocol==='https:')author.querySelector('img').src=url.href;}catch(e){}}author.querySelector('img').alt='Foto '+name;document.getElementById('articleViews').textContent=Number(m.views||0).toLocaleString('id-ID');const n=Number(m.rating_count||0),avg=Number(m.rating_average||0).toLocaleString('id-ID');document.getElementById('articleRatingSummary').textContent=n?avg+'/5 · '+n+' rating':'0 rating';document.getElementById('ratingAggregate').textContent=n?avg+' dari 5 · '+n+' penilaian pembaca':'Belum ada rating. Jadilah yang pertama memberi penilaian.';}
 rating.addEventListener('click',async e=>{const b=e.target.closest('[data-rating]');if(!b)return;const status=document.getElementById('ratingStatus');if(!user||!db){status.textContent='Silakan masuk melalui halaman Akun untuk memberi rating.';return;}rating.querySelectorAll('button').forEach(x=>x.disabled=true);try{const {error}=await db.from('article_ratings').upsert({article_id:a.id,user_id:user.id,rating:+b.dataset.rating},{onConflict:'article_id,user_id'});if(error)throw error;stars(+b.dataset.rating);status.textContent='Terima kasih! Rating Anda sudah tersimpan.';await refresh();}catch(err){status.textContent='Rating belum tersimpan. Silakan coba lagi.';}finally{rating.querySelectorAll('button').forEach(x=>x.disabled=false);}});
 try{let seen=false;try{seen=!!sessionStorage.getItem('tawon-read:'+a.id)}catch(e){}if(!seen){const r=await fetch(U+'/rest/v1/article_views',{method:'POST',headers:{...H,Prefer:'return=minimal'},body:JSON.stringify({article_id:a.id})});if(r.ok){try{sessionStorage.setItem('tawon-read:'+a.id,'1')}catch(e){}}}await refresh();}catch(e){document.getElementById('ratingAggregate').textContent='Statistik belum dapat dimuat. Muat ulang untuk mencoba lagi.';}
}
window.addEventListener('tawon:article-ready',e=>start(e.detail));if(window.tawonCurrentArticle)start(window.tawonCurrentArticle);
})();
