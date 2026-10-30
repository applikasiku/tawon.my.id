const DATABASE='https://ajqwpbpaozlurqoxysjt.supabase.co';
const SITE='https://tawon.my.id';
const escHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=value=>String(value??'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/\s+/g,' ').trim();
const absoluteImage=value=>{try{const u=new URL(value,SITE);return u.protocol==='https:'?u.href:'';}catch{return '';}};
async function publishedArticle(slug){
 const q=new URL(DATABASE+'/rest/v1/articles');
 q.searchParams.set('select','id,title,slug,excerpt,content,thumbnail_url,published_at,updated_at,meta_title,meta_description,categories(name)');
 q.searchParams.set('slug','eq.'+slug);q.searchParams.set('status','eq.published');q.searchParams.set('published_at','lte.'+new Date().toISOString());q.searchParams.set('limit','1');
 const r=await fetch(q,{headers:{apikey:PUBLIC_KEY,Authorization:'Bearer '+PUBLIC_KEY},signal:AbortSignal.timeout(10000)});
 if(!r.ok)throw Error('article_lookup_'+r.status);const rows=await r.json();return rows[0]||null;
}
function metaTag(name,content,property=false){return '<meta '+(property?'property':'name')+'="'+name+'" content="'+escHtml(content)+'">';}
async function articleHtml(request,env){
 const asset=await env.ASSETS.fetch(request);if(!asset.ok)return asset;
 const url=new URL(request.url),slug=url.searchParams.get('slug');if(!slug||!/^[a-z0-9-]{1,180}$/.test(slug))return asset;
 let article;try{article=await publishedArticle(slug);}catch(error){console.warn('seo_article_lookup_failed',error.message);return new Response('Artikel sementara tidak dapat dimuat.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8','X-Robots-Tag':'noindex','Retry-After':'60','Cache-Control':'no-store'}});}if(!article)return new Response('<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Artikel tidak ditemukan | TAWON.MY.ID</title></head><body><main><h1>Artikel tidak ditemukan</h1><p>Artikel mungkin telah dihapus atau belum dipublikasikan.</p><a href="/">Kembali ke beranda</a></main></body></html>',{status:404,headers:{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, follow','Cache-Control':'no-store'}});
 const title=String(article.meta_title||article.title||'TAWON.MY.ID').slice(0,180);
 const description=plain(article.meta_description||article.excerpt||article.content).slice(0,300)||title;
 const image=absoluteImage(article.thumbnail_url)||SITE+'/assets/icon-512-v6.png';
 const canonical=SITE+'/artikel.html?slug='+encodeURIComponent(article.slug),category=article.categories?.name||'Berita';
 let html=await asset.text();
 const bodyText=plain(article.content||'');
 const excerpt=plain(article.excerpt||article.meta_description||'');
 const bodyHtml=bodyText?'<div class="content"><p>'+escHtml(bodyText)+'</p></div>':'';
 const coverHtml=absoluteImage(article.thumbnail_url)?'<img class="cover" src="'+escHtml(absoluteImage(article.thumbnail_url))+'" alt="'+escHtml(title)+'" width="1200" height="675">':'';
 const serverArticle='<article class="seo-server-article"><div class="category">'+escHtml(category)+'</div><h1 class="title">'+escHtml(title)+'</h1><p class="muted">TAWON.MY.ID · '+escHtml(article.published_at||'')+'</p>'+coverHtml+(excerpt?'<p class="lead">'+escHtml(excerpt)+'</p>':'')+bodyHtml+'</article>';
 html=html.replace('<main id="article"><div class="status">Memuat artikel…</div></main>','<main id="article">'+serverArticle+'</main>');
 html=html.replace(/<title>[\s\S]*?<\/title>/i,'');
 html=html.replace(/<meta\s+(?:name|property)=["'](?:description|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi,'');
 html=html.replace(/<link\s+rel=["']canonical["'][^>]*>/gi,'');
 const tags=['<title>'+escHtml(title)+' | TAWON.MY.ID</title>',metaTag('description',description),metaTag('robots','index,follow,max-image-preview:large'),'<link rel="canonical" href="'+escHtml(canonical)+'">',metaTag('og:site_name','TAWON.MY.ID',true),metaTag('og:type','article',true),metaTag('og:locale','id_ID',true),metaTag('og:title',title,true),metaTag('og:description',description,true),metaTag('og:url',canonical,true),metaTag('og:image',image,true),metaTag('og:image:secure_url',image,true),metaTag('og:image:width','1200',true),metaTag('og:image:height','630',true),metaTag('og:image:alt',title,true),metaTag('twitter:card','summary_large_image'),metaTag('twitter:title',title),metaTag('twitter:description',description),metaTag('twitter:image',image),metaTag('article:published_time',article.published_at||'',true),metaTag('article:modified_time',article.updated_at||article.published_at||'',true),'<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@type':'NewsArticle','mainEntityOfPage':{'@type':'WebPage','@id':canonical},headline:title,description,image:[image],datePublished:article.published_at,dateModified:article.updated_at||article.published_at,articleSection:category,inLanguage:'id-ID',author:{'@type':'Organization',name:'TAWON.MY.ID'},publisher:{'@type':'Organization',name:'TAWON.MY.ID',logo:{'@type':'ImageObject',url:SITE+'/assets/icon-512-v6.png'}}})+'</script>'].join('');
 html=html.replace(/<head[^>]*>/i,match=>match+tags);
 const headers=new Headers(asset.headers);headers.set('Content-Type','text/html; charset=utf-8');headers.set('Cache-Control','public, max-age=300, s-maxage=900');headers.set('X-Robots-Tag','index,follow');
 return new Response(html,{status:asset.status,headers});
}
async function sitemapResponse(){
 const now=new Date().toISOString(),all=[];let offset=0;
 while(offset<5000){const q=new URL(DATABASE+'/rest/v1/articles');q.searchParams.set('select','slug,published_at,updated_at,thumbnail_url');q.searchParams.set('status','eq.published');q.searchParams.set('published_at','lte.'+now);q.searchParams.set('order','published_at.desc');q.searchParams.set('limit','500');q.searchParams.set('offset',String(offset));
 const r=await fetch(q,{headers:{apikey:PUBLIC_KEY,Authorization:'Bearer '+PUBLIC_KEY},signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('sitemap_query_'+r.status);
 const rows=await r.json();all.push(...rows);if(rows.length<500)break;offset+=rows.length;}
 const urls=[{loc:SITE+'/',lastmod:new Date().toISOString().slice(0,10)},...all.map(a=>({loc:SITE+'/artikel.html?slug='+encodeURIComponent(a.slug),lastmod:(a.updated_at||a.published_at||'').slice(0,10),image:absoluteImage(a.thumbnail_url)}))];
 const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'+urls.map(x=>'  <url><loc>'+escHtml(x.loc)+'</loc>'+(x.lastmod?'<lastmod>'+x.lastmod+'</lastmod>':'')+(x.image?'<image:image><image:loc>'+escHtml(x.image)+'</image:loc></image:image>':'')+'</url>').join('\n')+'\n</urlset>';
 return new Response(xml,{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=300, s-maxage=900','X-Content-Type-Options':'nosniff'}});
}
const PUBLIC_KEY='sb_publishable_-XnVkQ5Jgi0ji47eizdS9g_XOY2Ao48';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export function speechText(article){
 const source=String(article.content||'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'');
 return (article.title+'. '+source.replace(/<\/(?:p|h[1-6]|li)>/gi,'. ').replace(/<[^>]+>/g,' ').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/^#{1,6}\s+/gm,'').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ')).trim();
}
async function readBounded(response,max){
 if(!response.body)throw Error('empty_body');const reader=response.body.getReader();let bytes=0;const chunks=[];
 try{while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>max){await reader.cancel();throw Error('body_too_large');}chunks.push(value);}}finally{reader.releaseLock();}
 const result=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}return new TextDecoder().decode(result);
}
export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url);
  if(url.pathname==='/artikel.html'&&request.method==='GET')return articleHtml(request,env);
  if(url.pathname==='/sitemap.xml'&&request.method==='GET'){try{return await sitemapResponse();}catch(error){console.warn('sitemap_generation_failed',error.message);return new Response('Sitemap sementara tidak tersedia.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});}}
  if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(request);
  if(url.pathname!=='/api/audio')return json({message:'Layanan tidak ditemukan.'},404);
  if(request.method!=='POST')return json({message:'Gunakan tombol Putar pada artikel.'},405);
  const origin=request.headers.get('Origin');if(!origin||origin!==url.origin)return json({message:'Permintaan audio harus berasal dari TAWON.'},403);
  if(!env.ELEVENLABS_API_KEY||!env.ELEVENLABS_VOICE_ID)return json({code:'audio_not_configured',message:'Audio ElevenLabs belum diaktifkan oleh redaksi.'},503);
  const limiter=env.AUDIO_RATE_LIMIT;if(!limiter)return json({message:'Audio belum siap.'},503);
  if(!(await limiter.limit({key:'audio:'+request.headers.get('CF-Connecting-IP')})).success)return json({message:'Terlalu banyak permintaan audio. Coba lagi sebentar.'},429);
  try{
   let input;try{input=JSON.parse(await readBounded(request,2048));}catch{return json({message:'Permintaan audio tidak valid.'},400);}
   if(typeof input.slug!=='string'||!/^[a-z0-9-]{1,180}$/.test(input.slug))return json({message:'Artikel tidak valid.'},400);
   const query=new URL(DATABASE+'/rest/v1/articles');query.searchParams.set('select','title,content,updated_at');query.searchParams.set('slug','eq.'+input.slug);query.searchParams.set('status','eq.published');query.searchParams.set('published_at','lte.'+new Date().toISOString());query.searchParams.set('limit','1');
   const articleResponse=await fetch(query,{headers:{apikey:PUBLIC_KEY,Authorization:'Bearer '+PUBLIC_KEY},signal:AbortSignal.timeout(10000)});
   if(!articleResponse.ok)return json({message:'Artikel belum dapat dimuat.'},502);
   const rows=JSON.parse(await readBounded(articleResponse,300000));if(!rows.length)return json({message:'Artikel tidak ditemukan.'},404);
   const text=speechText(rows[0]);if(text.length>35000)return json({message:'Artikel ini memerlukan pemrosesan audio terpisah.'},422);
   const voice=env.ELEVENLABS_VOICE_ID;if(!/^[a-zA-Z0-9_-]{8,120}$/.test(voice))return json({message:'Konfigurasi suara belum valid.'},503);
   const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(voice+'|flash25|'+text)))).map(b=>b.toString(16).padStart(2,'0')).join('');
   const cacheKey=new Request(url.origin+'/__audio-cache/'+hash);
   const cached=await caches.default.match(cacheKey);if(cached)return cached;
   if(!(await limiter.limit({key:'generation-budget'})).success)return json({message:'Pembuatan audio sedang penuh. Silakan coba lagi.'},429);
   const upstream=await fetch('https://api.elevenlabs.io/v1/text-to-speech/'+encodeURIComponent(voice)+'?output_format=mp3_44100_128',{method:'POST',headers:{'xi-api-key':env.ELEVENLABS_API_KEY,'Content-Type':'application/json',Accept:'audio/mpeg'},body:JSON.stringify({text,model_id:'eleven_flash_v2_5',language_code:'id',voice_settings:{stability:0.65,similarity_boost:0.75,style:0,use_speaker_boost:true,speed:0.94}}),signal:AbortSignal.timeout(90000)});
   if(!upstream.ok){console.warn(JSON.stringify({event:'elevenlabs_error',status:upstream.status}));await upstream.body?.cancel();return json({message:upstream.status===401?'Layanan audio belum dapat diakses.':'Audio belum dapat dibuat. Silakan coba lagi nanti.'},502);}
   const type=upstream.headers.get('Content-Type')||'';if(!type.startsWith('audio/')){await upstream.body?.cancel();return json({message:'Format audio belum tersedia.'},502);}
   const response=new Response(upstream.body,{headers:{'Content-Type':'audio/mpeg','Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff','X-Audio-Provider':'ElevenLabs'}});
   ctx.waitUntil(caches.default.put(cacheKey,response.clone()).catch(()=>{}));return response;
  }catch(error){console.warn(JSON.stringify({event:'article_audio_failed',type:error.name}));return json({message:'Audio belum dapat dimuat. Silakan coba lagi.'},502);}
 }
};
