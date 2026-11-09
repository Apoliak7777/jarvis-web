/* Jarvis · potvrdenie objednávky: údaje na platbu s QR kódom PAY by square. 3.121: objednávka prišla cez Jarvis Bránu rovno
   predajcovi (bez Brány sa pošle e-mailom ako predtým); platba kartou – stav zo servera, po návrate zo Stripe overenie
   platby a „Zaplatiť kartou“ znova. Objednávka je uložená v tomto prehliadači. */
(function () {
  'use strict';
  var D = window.JARVIS_DATA, s = D.predajca, ORDERS = 'jarvis-objednavky-v1';
  var q = new URLSearchParams(location.search), code = q.get('c') || '', API = String(D.nastavenia.obchodApi || '').replace(/\/$/, '');
  var all = []; try { all = JSON.parse(localStorage.getItem(ORDERS) || '[]'); } catch (e) {}
  var o = all.filter(function (x) { return x.kod === code; })[0] || (code ? null : all[0]);
  var token = q.get('t') || (o && o.token) || '';
  var $ = function (sel) { return document.querySelector(sel); };
  var orderState = function () { return fetch(API + '/v1/verejne/obchod/objednavka/' + encodeURIComponent(o ? o.kod : code) + '?t=' + encodeURIComponent(token), { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); };
  if (!o) {
    $('[data-order-missing]').hidden = false;
    // späť zo Stripe v inom prehliadači: aspoň stav zo servera
    if (code && token && API) orderState().then(function (st) {
      if (!st) return;
      $('[data-missing-title]').textContent = st.stav === 'zaplatena' ? 'Platba prijatá' : 'Objednávka čaká na platbu';
      $('[data-missing-text]').textContent = st.stav === 'zaplatena' ? 'Objednávka ' + st.kod + ' je zaplatená. Licenčný kľúč vám príde e-mailom.' : 'Objednávka ' + st.kod + ' ešte nie je zaplatená – otvorte ju v prehliadači, v ktorom ste objednávali.';
    });
    return;
  }
  document.querySelector('[data-order]').hidden = false;
  var save = function () { all = all.map(function (x) { return x.kod === o.kod ? o : x; }); try { localStorage.setItem(ORDERS, JSON.stringify(all)); } catch (e) {} };
  if (token && !o.token) { o.token = token; save(); }

  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var eur = function (n) { var v = Math.round(n * 100) / 100, p = v.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (p[1] === '00' ? '' : ',' + p[1]) + ' €'; };
  var skDay = function (iso) { var p = String(iso).slice(0, 10).split('-'); return +p[2] + '. ' + +p[1] + '. ' + p[0]; };
  var z = o.zakaznik, sprava = 'Jarvis objednavka ' + o.kod;
  var set = function (k, v) { document.querySelectorAll('[data-o="' + k + '"]').forEach(function (el) { el.textContent = v; }); };
  set('oslovenie', z.meno.split(' ')[0] || z.meno);
  set('kod', o.kod); set('suma', eur(o.spolu)); set('iban', s.iban); set('bic', s.bic); set('prijemca', s.prijemca || s.meno);
  set('vs', o.vs); set('sprava', sprava); set('splatnost', skDay(o.splatnost));
  set('zaciatok', o.suhlasZaciatok === false && o.zaciatokOd ? 'S inštaláciou začnem po uplynutí lehoty na odstúpenie, najskôr ' + skDay(o.zaciatokOd) + '.' : o.suhlasZaciatok ? 'Požiadali ste o začatie pred uplynutím lehoty na odstúpenie – termín inštalácie dohodneme hneď po platbe.' : 'Termín inštalácie dohodneme hneď po platbe.');

  document.querySelector('[data-order-lines]').innerHTML = o.polozky.map(function (l) {
    return '<tr><td><b>' + esc(l.nazov) + '</b>' + (l.qty > 1 ? ' × ' + l.qty : '') + (l.detail ? '<br><span class="muted" style="font-size:13.5px">' + esc(l.detail) + '</span>' : '') + '</td><td>' + (l.spolu ? eur(l.spolu) : 'v cene') + '</td></tr>';
  }).join('') + '<tr class="total"><td>Spolu k úhrade</td><td>' + eur(o.spolu) + '</td></tr>';

  var cust = [['Meno', z.meno], ['Firma', z.firma], ['IČO', z.ico], ['DIČ', z.dic], ['IČ DPH', z.icdph], ['Adresa', [z.ulica, (z.psc + ' ' + z.mesto).trim(), z.krajina].filter(Boolean).join(', ')], ['E-mail', z.email], ['Telefón', z.telefon], ['Licencia', o.licencia], ['Poznámka', o.poznamka]].filter(function (r) { return r[1]; });
  document.querySelector('[data-order-customer]').innerHTML = cust.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');

  // QR PAY by square (slovenské banky); 3.105: web v inom jazyku – európsky QR na platbu (EPC069-12, SEPA), ktorý čítajú
  // bankové appky v eurozóne
  var lang = (document.documentElement.lang || 'sk').slice(0, 2);
  var epc = function () { return ['BCD', '002', '1', 'SCT', s.bic || '', String(s.prijemca || s.meno).slice(0, 70), String(s.iban).replace(/\s+/g, ''), 'EUR' + (Math.round(o.spolu * 100) / 100).toFixed(2), '', '', ('VS ' + o.vs + ' ' + (sprava || '')).trim().slice(0, 140)].join('\n'); };
  var qrBox = document.querySelector('[data-qr]'), qrCap = document.querySelector('[data-qr-cap]');
  if (lang !== 'sk' && qrCap) qrCap.textContent = 'QR platba SEPA (EPC) – naskenujte v aplikácii banky';
  try {
    var payload = lang === 'sk' ? window.JarvisQR.payBySquare({ amount: o.spolu, iban: s.iban, bic: s.bic, variableSymbol: o.vs, note: sprava, dueDate: o.splatnost, beneficiaryName: s.prijemca || s.meno }) : epc();
    qrBox.innerHTML = window.JarvisQR.qrSvg(payload, { ecc: 'M', margin: 2, title: 'QR platba ' + eur(o.spolu) });
  } catch (e) { qrBox.parentNode.innerHTML = '<div class="info-box">QR kód sa nepodarilo vytvoriť – zaplaťte podľa údajov vedľa.</div>'; }

  // text objednávky (do e-mailu predajcovi a na skopírovanie)
  var text = ['Dobrý deň,', '', 'objednávam Jarvisa:', ''].concat(o.polozky.map(function (l) { return '- ' + l.nazov + (l.qty > 1 ? ' × ' + l.qty : '') + (l.detail ? ' (' + l.detail + ')' : '') + ': ' + (l.spolu ? eur(l.spolu) : 'v cene'); }))
    .concat(['', 'Spolu k úhrade: ' + eur(o.spolu), 'Číslo objednávky / variabilný symbol: ' + o.vs, 'Platba: prevodom, splatnosť ' + skDay(o.splatnost), ''])
    .concat(['Objednávateľ:'], cust.map(function (r) { return r[0] + ': ' + r[1]; }))
    .concat(['', 'Súhlasím s obchodnými podmienkami (znenie od ' + D.nastavenia.podmienkyOd + ').'])
    .concat(o.suhlasZaciatok === true ? ['Žiadam o začatie poskytovania služby a dodávania digitálneho obsahu pred uplynutím lehoty na odstúpenie a beriem na vedomie, že po úplnom poskytnutí služby a začatí dodávania digitálneho obsahu strácam právo na odstúpenie od zmluvy.'] : [])
    .concat(['', 'S pozdravom', z.meno]).join('\n');
  var mailto = 'mailto:' + s.email + '?subject=' + encodeURIComponent('Objednávka Jarvis č. ' + o.vs + (z.firma ? ' – ' + z.firma : ' – ' + z.meno)) + '&body=' + encodeURIComponent(text);
  var mailBtn = document.querySelector('[data-mailto]');
  mailBtn.href = mailto;
  var status = document.querySelector('[data-send-status]');
  if (o.odoslana) { document.querySelector('[data-send-title]').textContent = 'Objednávka je odoslaná'; document.querySelector('[data-send-text]').textContent = 'Objednávku som už dostal. Potvrdím ju e-mailom.'; mailBtn.classList.remove('btn-primary'); mailBtn.lastChild.textContent = 'Poslať aj e-mailom'; }

  var copy = function (value, label) {
    var done = function () { window.JarvisShop && window.JarvisShop.toast(label + ' – skopírované'); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(value).then(done, function () { fallback(); });
    else fallback();
    function fallback() { var t = document.createElement('textarea'); t.value = value; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) {} t.remove(); }
  };
  document.querySelector('[data-copy-order]').addEventListener('click', function () { copy(text + '\n\nPošlite na: ' + s.email, 'Text objednávky'); status.innerHTML = '<div class="info-box">Text je v schránke – vložte ho do e-mailu na <b>' + esc(s.email) + '</b>.</div>'; });
  document.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-copy'); copy(k === 'iban' ? s.iban.replace(/\s/g, '') : o.vs, k === 'iban' ? 'IBAN' : 'Variabilný symbol'); }); });

  // ---------- 3.121 platba kartou (Stripe cez Jarvis Bránu): po návrate zo Stripe sa overí, či prišla; inak sa dá zaplatiť znova
  // kartou alebo prevodom podľa údajov vyššie
  if (!API || !token || !(o.platba === 'karta' || q.get('zaplatene') || q.get('zrusene'))) return;
  var cardPanel = $('[data-card-panel]'), cardTitle = $('[data-card-title]'), cardText = $('[data-card-text]'), cardActions = $('[data-card-actions]'), payBtn = $('[data-card-pay]'), cardError = $('[data-card-error]');
  var transfer = $('[data-transfer-panel]');
  $('[data-send-panel]').hidden = true; cardPanel.hidden = false;
  document.querySelectorAll('[data-num]').forEach(function (el) { el.hidden = true; });
  $('[data-lead]').innerHTML = 'Objednávka <b class="num">' + esc(o.kod) + '</b> je prijatá.';
  $('[data-key-text]').textContent = 'Licenčný kľúč vám príde e-mailom hneď po zaplatení – v Jarvisovi ho vložíte tlačidlom Vložiť kľúč. Plán a rozšírenia sa potom strhávajú z karty samy a licencia sa predlžuje sama; predplatné zrušíte kedykoľvek v Jarvisovi (Moje predplatné).';
  var paid = function () {
    cardActions.hidden = true; transfer.hidden = true; cardError.innerHTML = '';
    cardTitle.textContent = 'Zaplatené kartou';
    cardText.textContent = 'Ďakujem, platba prišla. Licenčný kľúč vám príde e-mailom o pár minút.';
    if (!o.zaplatena) { o.zaplatena = true; save(); }
  };
  var unpaid = function (failed) {
    cardActions.hidden = false; transfer.hidden = false;
    cardTitle.textContent = failed ? 'Platba kartou neprešla' : 'Platba kartou ešte nie je dokončená';
    cardText.textContent = 'Zaplaťte kartou znova, alebo prevodom na účet podľa údajov nižšie.';
    $('[data-transfer-title]').textContent = 'Alebo zaplaťte prevodom';
  };
  if (o.zaplatena) paid();
  else {
    transfer.hidden = true;
    cardTitle.textContent = 'Čakám na potvrdenie platby…'; cardText.textContent = 'Chvíľu strpenia, banka platbu potvrdzuje.';
    var tries = q.get('zaplatene') ? 15 : 1;
    (function poll() {
      orderState().then(function (st) {
        if (st && st.stav === 'zaplatena') return paid();
        if (st && st.stav === 'zlyhala') return unpaid(true);
        if (--tries > 0) { setTimeout(poll, 3000); return; }
        if (q.get('zaplatene')) { cardTitle.textContent = 'Platba sa spracúva'; cardText.textContent = 'Banka platbu ešte potvrdzuje. Hneď ako ju potvrdí, príde vám licenčný kľúč e-mailom – stránku môžete zavrieť.'; return; }
        unpaid(false);
      });
    })();
  }
  payBtn.addEventListener('click', function () {
    payBtn.disabled = true; cardError.innerHTML = '';
    var fail = function () { payBtn.disabled = false; cardError.innerHTML = '<div class="error-box">Platba kartou teraz nejde – skúste o chvíľu alebo zaplaťte prevodom.</div>'; };
    fetch(API + '/v1/verejne/obchod/objednavka/' + encodeURIComponent(o.kod) + '/platba', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: token }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) { if (res.ok && res.j.url) location.href = res.j.url; else if (res.ok && res.j.stav === 'zaplatena') paid(); else fail(); }, fail);
  });
})();
