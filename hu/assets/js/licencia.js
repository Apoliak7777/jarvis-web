/* Jarvis · Moja licencia: prečíta licenčný kľúč (formát Jarvisa 3.95: JARVIS-<base64url JSON>.<base64url podpis Ed25519>)
   a overí podpis verejným kľúčom predajcu priamo v prehliadači (Web Crypto). Kľúč sa nikam neposiela. */
(function () {
  'use strict';
  var D = window.JARVIS_DATA, S = window.JarvisShop;
  var form = document.querySelector('[data-license-form]'); if (!form) return;
  var out = document.querySelector('[data-license-out]'), renew = document.querySelector('[data-renew]');
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var skDay = function (d) { var p = d.split('-'); return +p[2] + '. ' + +p[1] + '. ' + p[0]; };
  var b64 = function (s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
  var current = null, currentMods = [];
  var planOf = function (id) { return D.plany.filter(function (p) { return p.id === id; })[0] || null; };
  var modOf = function (id) { return D.produkty.filter(function (p) { return p.modul === id; })[0] || null; };
  /** pole m z kľúča (Jarvis 3.96.3, src/lib/cennik.mjs moduleList): ['faktury', 'tim:3'] → [{id, count}], neznáme preč, každé raz */
  function moduleList(m) {
    var out = [];
    (Array.isArray(m) ? m : []).forEach(function (entry) {
      var parts = String(entry == null ? '' : entry).split(':'), mod = modOf(parts[0]);
      if (!mod || out.some(function (x) { return x.id === parts[0]; })) return;
      out.push({ id: parts[0], count: mod.zaCloveka && /^\d{1,3}$/.test(parts[1] || '') ? Math.max(1, +parts[1]) : 1 });
    });
    return out;
  }
  var people = function (n) { return n + (n === 1 ? ' fő' : n < 5 ? ' fő' : ' fő'); };
  var modName = function (x) { var mod = modOf(x.id); return mod.nazov + (mod.zaCloveka ? ' (' + people(x.count) + ')' : ''); };
  var eur = function (n) { var v = Math.round(n * 100) / 100, p = v.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (p[1] === '00' ? '' : ',' + p[1]) + ' €'; };
  function renewSummary() {
    var box = document.querySelector('[data-renew-sum]'); if (!box || !current) return;
    var pl = planOf(document.querySelector('[data-renew-plan]').value), year = document.querySelector('[data-renew-variant]').value === 'rok';
    var monthly = pl.mesacne + currentMods.reduce(function (s, x) { return s + modOf(x.id).mesacne * x.count; }, 0);
    box.textContent = 'Csomag ' + pl.nazov + (currentMods.length ? ' + ' + currentMods.map(modName).join(', ') : '') + ': ' + eur(monthly) + ' havonta' + (year ? ' · 12 hónapra ' + eur(monthly * D.nastavenia.rocneZaMesiacov) : '');
  }

  function read(key) {
    var text = String(key || '').replace(/\s+/g, '');
    if (!text) throw new Error('Illessze be a licenckulcsot.');
    if (text.toUpperCase().indexOf('JARVIS-') !== 0) throw new Error('Ez nem a Jarvis licenckulcsa (JARVIS- kezdetűnek kell lennie).');
    var parts = text.slice(7).split('.');
    if (parts.length !== 2 || !/^[\w-]+$/.test(parts[0] + parts[1])) throw new Error('A kulcs hiányos – másolja ki teljes egészében.');
    var payload;
    try { payload = JSON.parse(new TextDecoder().decode(b64(parts[0]))); } catch (e) { throw new Error('A kulcs sérült.'); }
    if (!payload || payload.v !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(payload.u || '') || !/^\d{4}-\d{2}-\d{2}$/.test(payload.s || '')) throw new Error('A kulcs sérült.');
    return { body: parts[0], sig: parts[1], payload: payload };
  }
  function verify(r) {
    var pem = D.nastavenia.verejnyKluc;
    if (!pem) return Promise.resolve(null); // overenie podpisu zatiaľ nie je zapnuté
    if (!window.crypto || !crypto.subtle) return Promise.resolve(undefined);
    var der = b64(pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '').replace(/\+/g, '-').replace(/\//g, '_'));
    return crypto.subtle.importKey('spki', der, { name: 'Ed25519' }, false, ['verify'])
      .then(function (k) { return crypto.subtle.verify({ name: 'Ed25519' }, k, b64(r.sig), new TextEncoder().encode(r.body)); })
      .catch(function () { return undefined; });
  }
  function daysLeft(until) {
    var t = new Date(), today = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()), p = until.split('-');
    return Math.round((Date.UTC(+p[0], +p[1] - 1, +p[2]) - today) / 864e5);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var r;
    try { r = read(form.querySelector('textarea').value); } catch (err) { out.innerHTML = '<div class="error-box">' + esc(err.message) + '</div>'; renew.hidden = true; return; }
    verify(r).then(function (signed) {
      var p = r.payload, left = daysLeft(p.u), trial = p.t === 'trial';
      if (signed === false) { out.innerHTML = '<div class="error-box">Az aláírás nem egyezik – ezt a kulcsot nem én állítottam ki, vagy valaki módosította.</div>'; renew.hidden = true; return; }
      var state = left < 0 ? (left >= -14 ? '<span class="state warn">Lejárt ekkor: ' + skDay(p.u) + ' – még ' + (14 + left) + ' nap a megújításra</span>' : '<span class="state bad">Lejárt ekkor: ' + skDay(p.u) + '</span>')
        : left <= 7 ? '<span class="state warn">Érvényes még: ' + left + (left === 1 ? ' nap' : left < 5 ? ' nap' : ' nap') + '</span>' : '<span class="state ok">Érvényes</span>';
      var mods = moduleList(p.m), plan = planOf(p.p);
      var rows = [['Licencszám', p.id], ['Ügyfél', p.c], ['E-mail', p.e], ['Cégjegyzékszám (IČO)', p.i], ['Típus', trial ? 'Próba' : 'Teljes'], ['Csomag', plan ? plan.nazov : ''], ['Bővítmények', mods.map(modName).join(', ')], ['Számítógépek', p.d ? String(p.d) : ''], ['Kiállítva', skDay(p.s)], ['Érvényes eddig', skDay(p.u) + ' (a napot is beleértve)']].filter(function (x) { return x[1]; });
      var note = signed === true ? '<p class="ok-box" style="margin-top:18px">Az aláírás hiteles – a licencet a Jarvis eladója állította ki.</p>'
        : signed === null ? '<p class="hint" style="margin-top:18px;color:var(--muted);font-size:13.5px">Az adatok a kulcsból lettek kiolvasva. Az aláírás ellenőrzése a weben egyelőre nincs bekapcsolva; a Jarvis az Ön számítógépén maga ellenőrzi.</p>'
        : '<p class="hint" style="margin-top:18px;color:var(--muted);font-size:13.5px">Ez a böngésző nem tudja ellenőrizni az Ed25519 aláírást. Az adatok a kulcsból lettek kiolvasva.</p>';
      out.innerHTML = state + '<dl class="kv" style="margin-top:18px">' + rows.map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('') + '</dl>' + note;
      current = p; currentMods = mods; renew.hidden = false;
      if (plan) document.querySelector('[data-renew-plan]').value = plan.id;
      renewSummary();
    });
  });
  ['[data-renew-plan]', '[data-renew-variant]'].forEach(function (sel) { var el = document.querySelector(sel); if (el) el.addEventListener('change', renewSummary); });

  document.querySelector('[data-renew-add]').addEventListener('click', function () {
    if (!current || !S) return;
    var plan = document.querySelector('[data-renew-plan]').value, variant = document.querySelector('[data-renew-variant]').value;
    var msg = S.add('predlzenie', variant, { plan: plan, licencia: current.id, moduly: currentMods });
    S.toast(msg || 'A meghosszabbítás a kosárban van', 'kosik.html');
  });
})();
