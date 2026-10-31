/* Jarvis v mobile cez Bránu (3.121, Alex 31. 10. 2026: „tretie tiež pridaj“) – the service worker of jarvis.apoliak.online/m/.
   Every request of the phone app (/m/app/…) is sealed here with the key from the QR code (AES-256-GCM, WebCrypto) and goes
   through the Jarvis Brána to the PC, which answers sealed the same way – the Brána and the web never see what passes. The
   device cookie of the pairing is kept here (not as a cookie of this web). Notifications (Web Push) come straight from the PC. */
'use strict';
const API = 'https://stiahnut.apoliak.online/brana';
// the page that pairs and its files come from the web itself; everything else of the app from the PC
const OWN = new Set(['/m/', '/m/index.html', '/m/sw.js', '/m/icon-192.png', '/m/icon-512.png', '/m/icon-maskable.png', '/m/apple-touch-icon.png']);
const SHELL = 'jarvis-tunel-1';
const TEXT = { // i18n:off – already in its language
  sk: ['Jarvis na počítači je teraz nedostupný. Je PC zapnuté a beží na ňom Jarvis?', 'Skúsiť znova'],
  en: ['Jarvis on your PC is not reachable right now. Is the PC on with Jarvis running?', 'Try again'],
  cs: ['Jarvis na počítači je teď nedostupný. Je PC zapnuté a běží na něm Jarvis?', 'Zkusit znovu'],
  de: ['Jarvis auf deinem PC ist gerade nicht erreichbar. Ist der PC an und läuft Jarvis?', 'Erneut versuchen'],
  pl: ['Jarvis na komputerze jest teraz niedostępny. Czy komputer jest włączony i działa na nim Jarvis?', 'Spróbuj ponownie'],
  hu: ['A gépeden futó Jarvis most nem érhető el. Be van kapcsolva a gép, és fut rajta a Jarvis?', 'Újra'],
  it: ['Jarvis sul PC non è raggiungibile ora. Il PC è acceso e Jarvis è in esecuzione?', 'Riprova'],
}; // i18n:on
const PHONE = String(self.navigator?.language || 'sk').slice(0, 2).toLowerCase(), LANG = Object.hasOwn(TEXT, PHONE) ? PHONE : 'en';

// ---------- the store of this web (the same as the page that pairs): the channel, the key, the device cookie
const db = () => new Promise((resolve, reject) => { const r = indexedDB.open('jarvis-tunel', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
const get = async key => { const d = await db(); return new Promise(resolve => { const r = d.transaction('kv').objectStore('kv').get(key); r.onsuccess = () => resolve(r.result ?? null); r.onerror = () => resolve(null); }); };
const put = async (key, value) => { const d = await db(); return new Promise(resolve => { const t = d.transaction('kv', 'readwrite'); value === null ? t.objectStore('kv').delete(key) : t.objectStore('kv').put(value, key); t.oncomplete = () => resolve(); t.onerror = () => resolve(); }); };

// ---------- AES-256-GCM: base64url(iv 12 B | ciphertext | tag 16 B), the channel and the direction as additional data
const enc = text => new TextEncoder().encode(text);
const b64 = bytes => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); };
const unb64 = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
const url64 = bytes => b64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unurl64 = text => unb64(String(text).replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((String(text).length + 3) % 4));
let link = null;
async function connection() {
  if (link) return link;
  const c = await get('spojenie'); if (!c?.ch || !c?.key) return null;
  link = { ch: c.ch, key: await crypto.subtle.importKey('raw', unurl64(c.key), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']) };
  return link;
}
async function seal(key, value, aad) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const body = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: enc(aad) }, key, enc(JSON.stringify(value))));
  const out = new Uint8Array(12 + body.length); out.set(iv); out.set(body, 12);
  return url64(out);
}
async function open(key, sealed, aad) {
  const raw = unurl64(sealed);
  return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.subarray(0, 12), additionalData: enc(aad) }, key, raw.subarray(12))));
}

const here = target => new URL(target, self.location.origin).href;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => { if (event.data?.type === 'spojenie') link = null; });

self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (url.origin !== self.location.origin || OWN.has(url.pathname)) return;
  // a page of this web outside the app is never touched
  if (request.mode === 'navigate' && !url.pathname.startsWith('/m/app')) return;
  event.respondWith(tunnel(request, url));
});

const offline = (request, status = 503, text = TEXT[LANG][0]) => request.mode === 'navigate'
  ? new Response(`<!doctype html><html lang="${LANG}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Jarvis</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#101113;color:#e9eaee;font:16px/1.5 system-ui,sans-serif;text-align:center;padding:24px;box-sizing:border-box}main{max-width:340px}img{border-radius:18px}button{margin-top:18px;border:0;border-radius:12px;padding:12px 22px;font:inherit;font-weight:600;background:#e9eaee;color:#101113}</style></head><body><main><img src="/m/icon-192.png" width="72" height="72" alt=""><p>${text.replace(/[<>&]/g, '')}</p><button onclick="location.reload()">${TEXT[LANG][1]}</button></main></body></html>`, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } })
  : new Response(JSON.stringify({ error: text }), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

async function tunnel(request, url) {
  const c = await connection();
  if (!c) return request.mode === 'navigate' ? Response.redirect(here('/m/'), 302) : new Response(JSON.stringify({ error: 'Mobil nie je spárovaný.', pair: true }), { status: 401, headers: { 'content-type': 'application/json' } });
  const path = (url.pathname.startsWith('/m/app') ? url.pathname.slice(6) || '/' : url.pathname) + url.search;
  const headers = {};
  for (const name of ['content-type', 'accept', 'range', 'if-none-match']) { const v = request.headers.get(name); if (v) headers[name] = v; }
  const cookie = await get('cookie'); if (cookie) headers.cookie = cookie;
  headers['user-agent'] = self.navigator.userAgent;
  const body = request.method === 'GET' || request.method === 'HEAD' ? null : new Uint8Array(await request.arrayBuffer());
  const n = url64(crypto.getRandomValues(new Uint8Array(16)));
  const static_ = request.method === 'GET' && /^\/(m\/[\w.-]+\.(js|css|png)|theme\.css|i18n(-\w+)?\.js)$/.test(url.pathname);
  let answer;
  try {
    const sealed = await seal(c.key, { n, t: Date.now(), m: request.method, p: path, h: headers, b: body ? b64(body) : '' }, c.ch + ':q');
    const res = await fetch(`${API}/v1/verejne/mobil/${c.ch}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ data: sealed }), cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    // the PC switched it off or made a new connection: this phone pairs again
    if (res.status === 404 || res.status === 410) { await put('spojenie', null); await put('cookie', null); link = null; return request.mode === 'navigate' ? Response.redirect(here('/m/'), 302) : new Response(JSON.stringify({ error: json.error || 'Mobil nie je spárovaný.', pair: true }), { status: 401, headers: { 'content-type': 'application/json' } }); }
    if (!res.ok || !json.data) throw Object.assign(new Error(json.error || ''), { status: res.status });
    answer = await open(c.key, json.data, c.ch + ':a');
    if (answer.n !== n) throw new Error('');
  } catch (error) {
    // the files of the app from the last time; otherwise what happened
    if (static_) { const hit = await caches.match(path); if (hit) return hit; }
    return offline(request, error.status && error.status < 500 ? error.status : 503, error.message || TEXT[LANG][0]);
  }
  const out = new Headers();
  for (const [key, value] of Object.entries(answer.h || {})) {
    if (key === 'set-cookie') { for (const line of [].concat(value)) { const m = /^(jarvis_mobil=[^;]*)/.exec(line); if (m) await put('cookie', /max-age=0/i.test(line) || m[1] === 'jarvis_mobil=' ? null : m[1]); } continue; }
    out.set(key, Array.isArray(value) ? value.join(', ') : String(value));
  }
  let bytes = unb64(answer.b || '');
  // the manifest of the app: it lives under /m/app/ here
  if (path === '/manifest.webmanifest' && answer.s === 200) {
    try {
      const m = JSON.parse(new TextDecoder().decode(bytes)), at = u => '/m/app' + (u.startsWith('/') ? u : '/' + u);
      Object.assign(m, { id: '/m/app/', start_url: '/m/app/', scope: '/m/' });
      m.shortcuts = (m.shortcuts || []).map(s => ({ ...s, url: at(s.url || '/') }));
      bytes = enc(JSON.stringify(m)); out.set('content-type', 'application/manifest+json');
    } catch {}
  }
  if (answer.s >= 300 && answer.s < 400 && out.get('location')) {
    const to = out.get('location');
    return Response.redirect(here(to.startsWith('/') ? '/m/app' + to : to), answer.s === 301 ? 301 : 302);
  }
  const response = new Response([101, 204, 205, 304].includes(answer.s) ? null : bytes, { status: answer.s, headers: out });
  if (static_ && answer.s === 200) { const copy = response.clone(); caches.open(SHELL).then(cache => cache.put(path, copy)).catch(() => {}); }
  return response;
}

// ---------- notifications from Jarvis (Web Push from the PC), opened in the app under /m/app/
const inApp = target => { const u = new URL(target || '/', self.location.origin); return '/m/app/' + (u.hash || ''); };
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil((async () => {
    await self.registration.showNotification(data.title || 'Jarvis', { body: data.body || '', tag: data.tag || undefined, renotify: Boolean(data.tag), icon: '/m/icon-192.png', badge: '/m/icon-192.png', lang: LANG, data: { url: inApp(data.url) } });
    for (const client of await self.clients.matchAll({ type: 'window', includeUncontrolled: true })) client.postMessage({ type: 'push', data });
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/m/app/', self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const client of list) if (new URL(client.url).pathname.startsWith('/m/app')) { client.postMessage({ type: 'open', url: target }); return client.focus(); }
    return self.clients.openWindow(target);
  }));
});
