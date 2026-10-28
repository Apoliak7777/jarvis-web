/* Jarvis · web: menu v mobile, košík (počet v hlavičke, tlačidlá „Do košíka“), prepínač mesačne/ročne, filter obchodu.
   Košík je len v tomto prehliadači (localStorage); ceny sa vždy počítajú z data.js, nie z uloženého košíka. */
(function () {
  'use strict';
  var D = window.JARVIS_DATA;
  var KEY = 'jarvis-kosik-v1';

  function read() {
    try { var c = JSON.parse(localStorage.getItem(KEY) || 'null'); if (c && Array.isArray(c.items)) return c; } catch (e) {}
    return { items: [], mamLicenciu: false, licencia: '' };
  }
  function write(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} badge(); }
  function product(id) { return D.produkty.filter(function (p) { return p.id === id; })[0] || null; }

  /** Pridanie do košíka s pravidlami obchodu: jeden plán, balík obsahuje inštaláciu aj plán. */
  function add(id, variant, extra) {
    var p = product(id); if (!p || p.pripravujeme) return null;
    var c = read(), msg = p.nazov + ' – v košíku';
    var isPlan = function (it) { var x = product(it.id); return x && (x.plan || x.balik || it.id === 'predlzenie'); };
    if (p.plan || p.balik || id === 'predlzenie') {
      var had = c.items.filter(isPlan);
      if (had.length) msg = 'Plán v košíku som nahradil: ' + p.nazov;
      c.items = c.items.filter(function (it) { return !isPlan(it); });
      if (p.balik) c.items = c.items.filter(function (it) { return it.id !== 'instalacia'; });
    }
    var same = c.items.filter(function (it) { return it.id === id; })[0];
    if (same && p.mnozstvo) { same.qty = Math.min(20, (same.qty || 1) + 1); msg = p.nazov + ' – ' + same.qty + '× v košíku'; }
    else if (same) { msg = p.nazov + ' už v košíku je'; }
    else c.items.push(Object.assign({ id: id, qty: 1 }, variant ? { variant: variant } : {}, extra || {}));
    if (id === 'predlzenie') { c.mamLicenciu = true; if (extra && extra.licencia) c.licencia = extra.licencia; }
    write(c);
    return msg;
  }

  function count() {
    return read().items.reduce(function (n, it) { return n + (product(it.id) && product(it.id).mnozstvo ? (it.qty || 1) : 1); }, 0);
  }
  function badge() {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = String(n); el.setAttribute('data-empty', n ? 'false' : 'true'); });
  }

  var toastTimer;
  function toast(text, link) {
    var el = document.querySelector('[data-toast]'); if (!el) return;
    el.innerHTML = '';
    var span = document.createElement('span'); span.textContent = text; el.appendChild(span);
    if (link) { var a = document.createElement('a'); a.className = 'btn btn-small btn-primary'; a.href = link; a.textContent = 'Do košíka'; el.appendChild(a); }
    el.setAttribute('data-show', 'true');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.setAttribute('data-show', 'false'); }, 4200);
  }
  var base = (function () { var s = document.querySelector('script[src$="assets/js/web.js"]'); return s ? s.getAttribute('src').replace('assets/js/web.js', '') : ''; })();

  // „Do košíka“
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]'); if (!b) return;
    e.preventDefault();
    var msg = add(b.getAttribute('data-add'), b.getAttribute('data-variant') || null);
    if (msg) toast(msg, base + 'kosik.html');
  });

  // menu v mobile
  var top = document.querySelector('.top'), mb = document.querySelector('[data-menu]');
  if (top && mb) mb.addEventListener('click', function () { var open = top.getAttribute('data-open') !== 'true'; top.setAttribute('data-open', String(open)); mb.setAttribute('aria-expanded', String(open)); });

  // cenník: mesačne / ročne
  var bill = document.querySelectorAll('[data-billing]');
  bill.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var r = btn.getAttribute('data-billing') === 'rok', k = r ? 'r' : 'm';
      bill.forEach(function (x) { x.setAttribute('aria-pressed', String(x === btn)); });
      document.querySelectorAll('[data-price-m]').forEach(function (el) { el.textContent = el.getAttribute('data-price-' + k); });
      document.querySelectorAll('[data-per-m]').forEach(function (el) { el.textContent = el.getAttribute('data-per-' + k); });
      document.querySelectorAll('[data-sub-m]').forEach(function (el) { el.textContent = el.getAttribute('data-sub-' + k); });
      document.querySelectorAll('[data-plan-btn]').forEach(function (el) { el.setAttribute('data-variant', r ? 'rok' : 'mesiac'); });
    });
  });

  // detail plánu: výber obdobia
  var vs = document.querySelector('[data-variant-select]');
  if (vs) vs.addEventListener('change', function () {
    var r = vs.value === 'rok', price = document.querySelector('[data-detail-price]'), per = document.querySelector('[data-detail-per]');
    var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
    if (price) price.textContent = fmt(vs.getAttribute(r ? 'data-r' : 'data-m'));
    if (per) per.textContent = r ? '€ za 12 mesiacov' : '€ mesačne';
    var b = document.querySelector('.buy [data-add]'); if (b) b.setAttribute('data-variant', vs.value);
  });

  // obchod: filter kategórií (aj z odkazu #doplnky)
  var tabs = document.querySelectorAll('[data-shop-tab]');
  function filter(cat) {
    tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t.getAttribute('data-shop-tab') === cat)); });
    document.querySelectorAll('[data-shop-group]').forEach(function (g) { g.hidden = cat !== 'vsetko' && g.getAttribute('data-shop-group') !== cat; });
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { filter(t.getAttribute('data-shop-tab')); }); });
  if (tabs.length && location.hash && document.querySelector('[data-shop-group="' + location.hash.slice(1) + '"]')) filter(location.hash.slice(1));

  // kontakt: správa do e-mailu
  var cf = document.querySelector('[data-contact-form]');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = cf.elements, err = cf.querySelector('[data-contact-error]'), bad = [];
    ['meno', 'email', 'sprava'].forEach(function (n) { var ok = f[n].value.trim() && (n !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f[n].value.trim())); f[n].setAttribute('aria-invalid', ok ? 'false' : 'true'); if (!ok) bad.push(n); });
    err.innerHTML = bad.length ? '<div class="error-box">Vyplňte meno, platný e-mail a správu.</div>' : '';
    if (bad.length) return;
    var body = f.sprava.value.trim() + '\n\n' + f.meno.value.trim() + '\n' + f.email.value.trim();
    location.href = 'mailto:' + D.predajca.email + '?subject=' + encodeURIComponent('Jarvis – ' + f.tema.value) + '&body=' + encodeURIComponent(body);
  });

  // jemný nábeh sekcií (len ak systém nežiada menej pohybu; obsah je viditeľný aj bez JS)
  if ('IntersectionObserver' in window && window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    setTimeout(function () { document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }); }, 1200);
  }

  badge();
  window.addEventListener('storage', function (e) { if (e.key === KEY) badge(); });
  window.JarvisShop = { read: read, write: write, add: add, product: product, toast: toast, badge: badge, KEY: KEY };
})();
