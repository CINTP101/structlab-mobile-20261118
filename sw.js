const scope=new URL(self.registration.scope);
const prefix="structlab-mobile-"+scope.pathname+"-";
const cacheName=prefix+"6b65dbcece579a73";
const shell=new URL("./",scope).href, course=new URL("./lesson-6b65dbcece579a73.bin",scope).href;
self.addEventListener("install",e=>e.waitUntil((async()=>{
  const cache=await caches.open(cacheName);
  await cache.addAll([new Request(shell,{cache:"reload"}),new Request(course)]);
  await self.skipWaiting();
})()));
self.addEventListener("activate",e=>e.waitUntil((async()=>{
  for(const name of await caches.keys())if(name.startsWith(prefix)&&name!==cacheName)await caches.delete(name);
  await self.clients.claim();
})()));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.origin!==scope.origin)return;
  if(u.href===course){e.respondWith(caches.open(cacheName).then(async c=>await c.match(course)||fetch(e.request)));return}
  if(e.request.mode==="navigate"&&(u.pathname===scope.pathname||u.pathname===scope.pathname+"index.html")){
    e.respondWith((async()=>{try {const r=await fetch(e.request);if(r.ok)return r}catch{}return await (await caches.open(cacheName)).match(shell)||Response.error()})())
  }
});