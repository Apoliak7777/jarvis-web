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
      $('[data-missing-title]').textContent = st.stav === 'zaplatena' ? 'Payment received' : 'Order awaiting payment';
      $('[data-missing-text]').textContent = st.stav === 'zaplatena' ? 'Order ' + st.kod + ' is paid. The licence key will arrive by e-mail.' : 'Order ' + st.kod + ' is not paid yet – open it in the browser you ordered in.';
    });
    return;
  }
  document.querySelector('[data-order]').hidden = false;
  var save = function () { all = all.map(function (x) { return x.kod === o.kod ? o : x; }); try { localStorage.setItem(ORDERS, JSON.stringify(all)); } catch (e) {} };
  if (token && !o.token) { o.token = token; save(); }

  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var eur = function (n) { var v = Math.round(n * 100) / 100, p = v.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (p[1] === '00' ? '' : ',' + p[1]) + ' €'; };
  var skDay = function (iso) { var p = String(iso).slice(0, 10).split('-'); return +p[2] + '. ' + +p[1] + '. ' + p[0]; };
  var z = o.zakaznik, sprava = 'Jarvis order ' + o.kod;
  var set = function (k, v) { document.querySelectorAll('[data-o="' + k + '"]').forEach(function (el) { el.textContent = v; }); };
  set('oslovenie', z.meno.split(' ')[0] || z.meno);
  set('kod', o.kod); set('suma', eur(o.spolu)); set('iban', s.iban); set('bic', s.bic); set('prijemca', s.prijemca || s.meno);
  set('vs', o.vs); set('sprava', sprava); set('splatnost', skDay(o.splatnost));
  set('zaciatok', o.suhlasZaciatok === false && o.zaciatokOd ? 'I will start the installation once the withdrawal period has expired, at the earliest on ' + skDay(o.zaciatokOd) + '.' : o.suhlasZaciatok ? 'You asked me to start before the withdrawal period expires – we’ll agree the installation date right after payment.' : 'We’ll agree the installation date right after payment.');

  document.querySelector('[data-order-lines]').innerHTML = o.polozky.map(function (l) {
    return '<tr><td><b>' + esc(l.nazov) + '</b>' + (l.qty > 1 ? ' × ' + l.qty : '') + (l.detail ? '<br><span class="muted" style="font-size:13.5px">' + esc(l.detail) + '</span>' : '') + '</td><td>' + (l.spolu ? eur(l.spolu) : 'included') + '</td></tr>';
  }).join('') + '<tr class="total"><td>Total to pay</td><td>' + eur(o.spolu) + '</td></tr>';

  var cust = [['Name', z.meno], ['Company', z.firma], ['Company ID (IČO)', z.ico], ['Tax ID (DIČ)', z.dic], ['VAT ID (IČ DPH)', z.icdph], ['Address', [z.ulica, (z.psc + ' ' + z.mesto).trim(), z.krajina].filter(Boolean).join(', ')], ['E-mail', z.email], ['Phone', z.telefon], ['Licence', o.licencia], ['Note', o.poznamka]].filter(function (r) { return r[1]; });
  document.querySelector('[data-order-customer]').innerHTML = cust.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');

  // QR PAY by square (slovenské banky); 3.105: web v inom jazyku – európsky QR na platbu (EPC069-12, SEPA), ktorý čítajú
  // bankové appky v eurozóne
  var lang = (document.documentElement.lang || 'sk').slice(0, 2);
  var epc = function () { return ['BCD', '002', '1', 'SCT', s.bic || '', String(s.prijemca || s.meno).slice(0, 70), String(s.iban).replace(/\s+/g, ''), 'EUR' + (Math.round(o.spolu * 100) / 100).toFixed(2), '', '', ('VS ' + o.vs + ' ' + (sprava || '')).trim().slice(0, 140)].join('\n'); };
  var qrBox = document.querySelector('[data-qr]'), qrCap = document.querySelector('[data-qr-cap]');
  if (lang !== 'sk' && qrCap) qrCap.textContent = 'SEPA (EPC) QR payment – scan it in your bank’s app';
  try {
    var payload = lang === 'sk' ? window.JarvisQR.payBySquare({ amount: o.spolu, iban: s.iban, bic: s.bic, variableSymbol: o.vs, note: sprava, dueDate: o.splatnost, beneficiaryName: s.prijemca || s.meno }) : epc();
    qrBox.innerHTML = window.JarvisQR.qrSvg(payload, { ecc: 'M', margin: 2, title: 'QR payment ' + eur(o.spolu) });
  } catch (e) { qrBox.parentNode.innerHTML = '<div class="info-box">The QR code could not be created – please pay using the details beside it.</div>'; }

  // text objednávky (do e-mailu predajcovi a na skopírovanie)
  var text = ['Hello,', '', 'I would like to order Jarvis:', ''].concat(o.polozky.map(function (l) { return '- ' + l.nazov + (l.qty > 1 ? ' × ' + l.qty : '') + (l.detail ? ' (' + l.detail + ')' : '') + ': ' + (l.spolu ? eur(l.spolu) : 'included'); }))
    .concat(['', 'Total to pay: ' + eur(o.spolu), 'Order number / variable symbol: ' + o.vs, 'Payment: bank transfer, due date ' + skDay(o.splatnost), ''])
    .concat(['Customer:'], cust.map(function (r) { return r[0] + ': ' + r[1]; }))
    .concat(['', 'I agree to the terms and conditions (version valid from ' + D.nastavenia.podmienkyOd + ').'])
    .concat(o.suhlasZaciatok === true ? ['I request that the provision of the service and the supply of digital content begin before the withdrawal period expires, and I acknowledge that once the service has been fully provided and the supply of digital content has begun, I lose my right to withdraw from the contract.'] : [])
    .concat(['', 'Kind regards', z.meno]).join('\n');
  var mailto = 'mailto:' + s.email + '?subject=' + encodeURIComponent('Jarvis order no. ' + o.vs + (z.firma ? ' – ' + z.firma : ' – ' + z.meno)) + '&body=' + encodeURIComponent(text);
  var mailBtn = document.querySelector('[data-mailto]');
  mailBtn.href = mailto;
  var status = document.querySelector('[data-send-status]');
  if (o.odoslana) { document.querySelector('[data-send-title]').textContent = 'The order has been sent'; document.querySelector('[data-send-text]').textContent = 'I have already received your order. I will confirm it by e-mail.'; mailBtn.classList.remove('btn-primary'); mailBtn.lastChild.textContent = 'Also send by e-mail'; }

  var copy = function (value, label) {
    var done = function () { window.JarvisShop && window.JarvisShop.toast(label + ' – copied'); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(value).then(done, function () { fallback(); });
    else fallback();
    function fallback() { var t = document.createElement('textarea'); t.value = value; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) {} t.remove(); }
  };
  document.querySelector('[data-copy-order]').addEventListener('click', function () { copy(text + '\n\nPlease send to: ' + s.email, 'Order text'); status.innerHTML = '<div class="info-box">The text is on your clipboard – paste it into an e-mail to <b>' + esc(s.email) + '</b>.</div>'; });
  document.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-copy'); copy(k === 'iban' ? s.iban.replace(/\s/g, '') : o.vs, k === 'iban' ? 'IBAN' : 'Variable symbol'); }); });

  // ---------- 3.121 platba kartou (Stripe cez Jarvis Bránu): po návrate zo Stripe sa overí, či prišla; inak sa dá zaplatiť znova
  // kartou alebo prevodom podľa údajov vyššie
  if (!API || !token || !(o.platba === 'karta' || q.get('zaplatene') || q.get('zrusene'))) return;
  var cardPanel = $('[data-card-panel]'), cardTitle = $('[data-card-title]'), cardText = $('[data-card-text]'), cardActions = $('[data-card-actions]'), payBtn = $('[data-card-pay]'), cardError = $('[data-card-error]');
  var transfer = $('[data-transfer-panel]');
  $('[data-send-panel]').hidden = true; cardPanel.hidden = false;
  document.querySelectorAll('[data-num]').forEach(function (el) { el.hidden = true; });
  $('[data-lead]').innerHTML = 'Order <b class="num">' + esc(o.kod) + '</b> has been received.';
  $('[data-key-text]').textContent = 'The licence key arrives by e-mail right after payment – in Jarvis you enter it with the Paste key button. The plan and extensions are then charged to the card automatically and the licence extends itself; you can cancel the subscription at any time in Jarvis (My subscription).';
  var paid = function () {
    cardActions.hidden = true; transfer.hidden = true; cardError.innerHTML = '';
    cardTitle.textContent = 'Paid by card';
    cardText.textContent = 'Thank you, the payment has arrived. The licence key will reach you by e-mail within a few minutes.';
    if (!o.zaplatena) { o.zaplatena = true; save(); }
  };
  var unpaid = function (failed) {
    cardActions.hidden = false; transfer.hidden = false;
    cardTitle.textContent = failed ? 'The card payment did not go through' : 'The card payment is not completed yet';
    cardText.textContent = 'Pay by card again, or by bank transfer using the details below.';
    $('[data-transfer-title]').textContent = 'Or pay by bank transfer';
  };
  if (o.zaplatena) paid();
  else {
    transfer.hidden = true;
    cardTitle.textContent = 'Waiting for the payment confirmation…'; cardText.textContent = 'One moment please, the bank is confirming the payment.';
    var tries = q.get('zaplatene') ? 15 : 1;
    (function poll() {
      orderState().then(function (st) {
        if (st && st.stav === 'zaplatena') return paid();
        if (st && st.stav === 'zlyhala') return unpaid(true);
        if (--tries > 0) { setTimeout(poll, 3000); return; }
        if (q.get('zaplatene')) { cardTitle.textContent = 'The payment is being processed'; cardText.textContent = 'The bank is still confirming the payment. As soon as it does, the licence key will arrive by e-mail – you can close this page.'; return; }
        unpaid(false);
      });
    })();
  }
  payBtn.addEventListener('click', function () {
    payBtn.disabled = true; cardError.innerHTML = '';
    var fail = function () { payBtn.disabled = false; cardError.innerHTML = '<div class="error-box">Card payment is not available right now – please try again shortly or pay by bank transfer.</div>'; };
    fetch(API + '/v1/verejne/obchod/objednavka/' + encodeURIComponent(o.kod) + '/platba', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: token }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) { if (res.ok && res.j.url) location.href = res.j.url; else if (res.ok && res.j.stav === 'zaplatena') paid(); else fail(); }, fail);
  });
})();
