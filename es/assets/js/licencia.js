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
  var people = function (n) { return n + (n === 1 ? ' persona' : n < 5 ? ' personas' : ' personas'); };
  var modName = function (x) { var mod = modOf(x.id); return mod.nazov + (mod.zaCloveka ? ' (' + people(x.count) + ')' : ''); };
  var eur = function (n) { var v = Math.round(n * 100) / 100, p = v.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (p[1] === '00' ? '' : ',' + p[1]) + ' €'; };
  function renewSummary() {
    var box = document.querySelector('[data-renew-sum]'); if (!box || !current) return;
    var pl = planOf(document.querySelector('[data-renew-plan]').value), year = document.querySelector('[data-renew-variant]').value === 'rok';
    var monthly = pl.mesacne + currentMods.reduce(function (s, x) { return s + modOf(x.id).mesacne * x.count; }, 0);
    box.textContent = 'Plan ' + pl.nazov + (currentMods.length ? ' + ' + currentMods.map(modName).join(', ') : '') + ': ' + eur(monthly) + ' al mes' + (year ? ' · por 12 meses ' + eur(monthly * D.nastavenia.rocneZaMesiacov) : '');
  }

  function read(key) {
    var text = String(key || '').replace(/\s+/g, '');
    if (!text) throw new Error('Introduzca la clave de licencia.');
    if (text.toUpperCase().indexOf('JARVIS-') !== 0) throw new Error('Esto no es una clave de licencia de Jarvis (empieza por JARVIS-).');
    var parts = text.slice(7).split('.');
    if (parts.length !== 2 || !/^[\w-]+$/.test(parts[0] + parts[1])) throw new Error('La clave está incompleta: cópiela entera.');
    var payload;
    try { payload = JSON.parse(new TextDecoder().decode(b64(parts[0]))); } catch (e) { throw new Error('La clave está dañada.'); }
    if (!payload || payload.v !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(payload.u || '') || !/^\d{4}-\d{2}-\d{2}$/.test(payload.s || '')) throw new Error('La clave está dañada.');
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
      if (signed === false) { out.innerHTML = '<div class="error-box">La firma no coincide: no he emitido yo esta clave o alguien la ha modificado.</div>'; renew.hidden = true; return; }
      var state = left < 0 ? (left >= -14 ? '<span class="state warn">Caducó el ' + skDay(p.u) + ' – quedan ' + (14 + left) + ' días para renovarla</span>' : '<span class="state bad">Caducó el ' + skDay(p.u) + '</span>')
        : left <= 7 ? '<span class="state warn">Válida aún ' + left + (left === 1 ? ' día' : left < 5 ? ' días' : ' días') + '</span>' : '<span class="state ok">Válida</span>';
      var mods = moduleList(p.m), plan = planOf(p.p);
      var rows = [['Número de licencia', p.id], ['Cliente', p.c], ['Correo electrónico', p.e], ['N.º de identificación (IČO)', p.i], ['Tipo', trial ? 'De prueba' : 'Completa'], ['Plan', plan ? plan.nazov : ''], ['Extensiones', mods.map(modName).join(', ')], ['Ordenadores', p.d ? String(p.d) : ''], ['Emitida', skDay(p.s)], ['Válida hasta', skDay(p.u) + ' incluido']].filter(function (x) { return x[1]; });
      var note = signed === true ? '<p class="ok-box" style="margin-top:18px">La firma es auténtica: la licencia la ha emitido el vendedor de Jarvis.</p>'
        : signed === null ? '<p class="hint" style="margin-top:18px;color:var(--muted);font-size:13.5px">Los datos se leen de la clave. La comprobación de la firma en la web aún no está activada; Jarvis la comprueba por sí solo en su ordenador.</p>'
        : '<p class="hint" style="margin-top:18px;color:var(--muted);font-size:13.5px">Este navegador no puede comprobar una firma Ed25519. Los datos se leen de la clave.</p>';
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
    S.toast(msg || 'La renovación está en la cesta', 'kosik.html');
  });
})();
