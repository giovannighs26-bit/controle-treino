/* GH Desafio — service worker
   Regra: o HTML (navegação) é network-first, para que uma versão nova apareça na
   hora em que o aluno abrir o app. Todo o resto é cache-first, para abrir offline.
   Se a rede falhar, o HTML vem do cache — o app continua funcionando sem sinal. */

const VERSAO = "gh-desafio-v11";

/* Os ícones viajam como base64 em icones.js e são servidos daqui como PNG.
   Assim o repositório fica 100% em texto e o app continua instalável. */
importScripts("icones.js");
const ICONES = {
  "icon-192.png": self.GH_ICONS["192"],
  "icon-512.png": self.GH_ICONS["512"]
};

function pngDaBase64(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Response(bytes, { headers: { "Content-Type": "image/png", "Cache-Control": "max-age=604800" } });
}
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icones.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSAO).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;                 // POST da API passa direto
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;  // não intercepta script.google.com

  const navegacao = req.mode === "navigate" || url.pathname.endsWith("/")
                    || url.pathname.endsWith("index.html");
  if (navegacao) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(VERSAO).then((c) => c.put(req, copia));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  const nomeIcone = url.pathname.split("/").pop();
  if (ICONES[nomeIcone]) {
    e.respondWith(
      caches.match(req).then((hit) => hit || caches.open(VERSAO)
        .then((c) => {
          const r = pngDaBase64(ICONES[nomeIcone]);
          c.put(req, r.clone());
          return r;
        }))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((hit) => {
      const rede = fetch(req).then((res) => {
        if (res && res.ok) {
          const copia = res.clone();
          caches.open(VERSAO).then((c) => c.put(req, copia));
        }
        return res;
      }).catch(() => hit);
      return hit || rede;
    })
  );
});
