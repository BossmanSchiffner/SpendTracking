const CACHE='money-until-payday-v1-15';
const SHELL=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;const request=event.request,url=new URL(request.url);event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{if(!response.ok||!url.pathname.includes('/icons/badge-'))return response;return caches.open(CACHE).then(cache=>cache.put(request,response.clone()).then(()=>response))}))) });
