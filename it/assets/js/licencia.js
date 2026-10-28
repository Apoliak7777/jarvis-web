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
  var people = function (n) { return n + (n === 1 ? ' persona' : n < 5 ? ' persone' : ' persone'); };
  var modName = function (x) { var mod = modOf(x.id); return mod.nazov + (mod.zaCloveka ? ' (' + people(x.count) + ')' : ''); };
  var eur = function (n) { var v = Math.round(n * 100) / 100, p = v.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (p[1] === '00' ? '' : ',' + p[1]) + ' €'; };
  function renewSummary() {
    var box = document.querySelector('[data-renew-sum]'); if (!box || !current) return;
    var pl = planOf(document.querySelector('[data-renew-plan]').value), year = document.querySelector('[data-renew-variant]').value === 'rok';
    var monthly = pl.mesacne + currentMods.reduce(function (s, x) { return s + modOf(x.id).mesacne * x.count; }, 0);
    box.textContent = 'Piano ' + pl.nazov + (currentMods.length ? ' + ' + currentMods.map(modName).join(', ') : '') + ': ' + eur(monthly) + ' al mese' + (year ? ' · per 12 mesi ' + eur(monthly * D.nastavenia.rocneZaMesiacov) : '');
  }

  function read(key) {
    var text = String(key || '').replace(/\s+/g, '');
    if (!text) throw new Error('Inserisca la chiave di licenza.');
    if (text.toUpperCase().indexOf('JARVIS-') !== 0) throw new Error('Questa non è una chiave di licenza di Jarvis (inizia con JARVIS-).');
    var parts = text.slice(7).split('.');
    if (parts.length !== 2 || !/^[\w-]+$/.test(parts[0] + parts[1])) throw new Error('La chiave è incompleta: la copi per intero.');
    var payload;
    try { payload = JSON.parse(new TextDecoder().decode(b64(parts[0]))); } catch (e) { throw new Error('La chiave è danneggiata.'); }
    if (!payload || payload.v !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(payload.u || '') || !/^\d{4}-\d{2}-\d{2}$/.test(payload.s || '')) throw new Error('La chiave è danneggiata.');
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
      if (signed === false) { out.innerHTML = '<div class="error-box">La firma non corrisponde: non sono stato io a emettere questa chiave oppure qualcuno l’ha modificata.</div>'; renew.hidden = true; return; }
      var state = left < 0 ? (left >= -14 ? '<span class="state warn">Scaduta il ' + skDay(p.u) + ' – giorni ancora disponibili per il rinnovo: ' + (14 + left) + ' </span>' : '<span class="state bad">Scaduta il ' + skDay(p.u) + '</span>')
        : left <= 7 ? '<span class="state warn">Valida ancora ' + left + (left === 1 ? ' giorno' : left < 5 ? ' giorni' : ' giorni') + '</span>' : '<span class="state ok">Valida</span>';
      var mods = moduleList(p.m), plan = planOf(p.p);
      var rows = [['Numero di licenza', p.id], ['Cliente', p.c], ['E-mail', p.e], ['Partita IVA', p.i], ['Tipo', trial ? 'Di prova' : 'Completa'], ['Piano', plan ? plan.nazov : ''], ['Estensioni', mods.map(modName).join(', ')], ['Computer', p.d ? String(p.d) : ''], ['Emessa', skDay(p.s)], ['Valida fino al', skDay(p.u) + ' incluso']].filter(function (x) { return x[1]; });
      var note = signed === true ? '<p class="ok-box" style="margin-top:18px">La firma è autentica: la licenza è stata emessa dal venditore di Jarvis.</p>'
        : signed === null ? '<p class="hint" style="margin-top:18px;color:var(--muted);font-size:13.5px">I dati sono stati letti dalla chiave. La verifica della firma sul sito non è ancora attiva; Jarvis sul Suo computer la verifica da solo.</p>'
        : '<p class="hint" style="margin-top:18px;color:var(--muted);font-size:13.5px">Questo browser non è in grado di verificare la firma Ed25519. I dati sono stati letti dalla chiave.</p>';
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
    S.toast(msg || 'Il rinnovo è nel carrello', 'kosik.html');
  });
})();
