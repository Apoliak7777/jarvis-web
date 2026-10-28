/* Jarvis · potvrdenie objednávky: údaje na platbu s QR kódom PAY by square a odoslanie objednávky predajcovi e-mailom
   (kým nie je objednávkový server – nastavenia.objednavkyUrl). Objednávka je uložená v tomto prehliadači. */
(function () {
  'use strict';
  var D = window.JARVIS_DATA, s = D.predajca;
  var code = new URLSearchParams(location.search).get('c') || '';
  var all = []; try { all = JSON.parse(localStorage.getItem('jarvis-objednavky-v1') || '[]'); } catch (e) {}
  var o = all.filter(function (x) { return x.kod === code; })[0] || (code ? null : all[0]);
  if (!o) { document.querySelector('[data-order-missing]').hidden = false; return; }
  document.querySelector('[data-order]').hidden = false;

  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var eur = function (n) { var v = Math.round(n * 100) / 100, p = v.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (p[1] === '00' ? '' : ',' + p[1]) + ' €'; };
  var skDay = function (iso) { var p = String(iso).slice(0, 10).split('-'); return +p[2] + '. ' + +p[1] + '. ' + p[0]; };
  var z = o.zakaznik, sprava = 'Jarvis order ' + o.kod;
  var set = function (k, v) { document.querySelectorAll('[data-o="' + k + '"]').forEach(function (el) { el.textContent = v; }); };
  set('oslovenie', z.meno.split(' ')[0] || z.meno);
  set('kod', o.kod); set('suma', eur(o.spolu)); set('iban', s.iban); set('bic', s.bic); set('prijemca', s.meno);
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
  var epc = function () { return ['BCD', '002', '1', 'SCT', s.bic || '', String(s.meno).slice(0, 70), String(s.iban).replace(/\s+/g, ''), 'EUR' + (Math.round(o.spolu * 100) / 100).toFixed(2), '', '', ('VS ' + o.vs + ' ' + (sprava || '')).trim().slice(0, 140)].join('\n'); };
  var qrBox = document.querySelector('[data-qr]'), qrCap = document.querySelector('[data-qr-cap]');
  if (lang !== 'sk' && qrCap) qrCap.textContent = 'SEPA (EPC) QR payment – scan it in your bank’s app';
  try {
    var payload = lang === 'sk' ? window.JarvisQR.payBySquare({ amount: o.spolu, iban: s.iban, bic: s.bic, variableSymbol: o.vs, note: sprava, dueDate: o.splatnost, beneficiaryName: s.meno }) : epc();
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
  if (o.odoslana) { document.querySelector('[data-send-text]').textContent = 'I’ve already received your order. I’ll confirm it by e-mail and we’ll agree an installation date.'; mailBtn.classList.remove('btn-primary'); mailBtn.lastChild.textContent = 'Also send by e-mail'; }

  var copy = function (value, label) {
    var done = function () { window.JarvisShop && window.JarvisShop.toast(label + ' – copied'); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(value).then(done, function () { fallback(); });
    else fallback();
    function fallback() { var t = document.createElement('textarea'); t.value = value; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) {} t.remove(); }
  };
  document.querySelector('[data-copy-order]').addEventListener('click', function () { copy(text + '\n\nPlease send to: ' + s.email, 'Order text'); status.innerHTML = '<div class="info-box">The text is on your clipboard – paste it into an e-mail to <b>' + esc(s.email) + '</b>.</div>'; });
  document.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-copy'); copy(k === 'iban' ? s.iban.replace(/\s/g, '') : o.vs, k === 'iban' ? 'IBAN' : 'Variable symbol'); }); });
})();
