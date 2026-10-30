'use strict';
const CACHE_NAME='tawon-pwa-v17';
const SHELL=['/site-ui.css?v=13','/site-header.js?v=16','/article-detail.js?v=15','/article-detail.css?v=15','/assets/redaksi-author.jpg','/offline.html','/manifest.webmanifest','/pwa.css?v=9','/pwa.js?v=9','/assets/tawon-logo-transparent.png','/assets/icon-192-v6.png','/assets/icon-512-v6.png','/assets/apple-touch-icon-v6.png','/assets/favicon-v6.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('tawon-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(['/admin','/admin.html','/akun','/akun.html'].includes(url.pathname)){event.respondWith(fetch(req).catch(()=>caches.match('/offline.html')));return;}
 if(req.mode==='navigate'){event.respondWith(fetch(req).catch(()=>caches.match('/offline.html')));return;}
 // Only explicitly listed, non-sensitive app assets enter the cache.
 const key=url.pathname+url.search;
 if(!SHELL.includes(key))return;
 event.respondWith(caches.open(CACHE_NAME).then(async cache=>{const saved=await cache.match(req);if(saved)return saved;const res=await fetch(req);if(res.ok)await cache.put(req,res.clone());return res;}));
});
