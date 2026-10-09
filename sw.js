/* Service Worker — GH Performance */
const CACHE = 'gh-performance-v35';
const ASSETS = [
  './', './index.html', './manifest.json',
  './icons/icon.svg', './icons/icon-maskable.svg'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  /* O PROPRIO HTML vai REDE-PRIMEIRO. Com cache-first, quem ja tem o app instalado
     continuava recebendo o index.html velho e um link novo (#av=/#a=) nao abria a
     tela certa. O cache fica apenas como reserva para uso offline. */
  const html = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') >= 0;
  if (html){
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html').then(hit => hit || caches.match('./')))
    );
    return;
  }

  /* Demais arquivos: cache primeiro (rapido e funciona offline). */
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    return res;
  }).catch(() => caches.match('./index.html'))));
});
