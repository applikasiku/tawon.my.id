const DATABASE='https://ajqwpbpaozlurqoxysjt.supabase.co';
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
