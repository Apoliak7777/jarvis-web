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
      $('[data-missing-title]').textContent = st.stav === 'zaplatena' ? 'Pago recibido' : 'Pedido pendiente de pago';
      $('[data-missing-text]').textContent = st.stav === 'zaplatena' ? 'El pedido ' + st.kod + ' está pagado. La clave de licencia le llegará por correo.' : 'El pedido ' + st.kod + ' aún no está pagado: ábralo en el navegador en el que hizo el pedido.';
    });
    return;
  }
  document.querySelector('[data-order]').hidden = false;
  var save = function () { all = all.map(function (x) { return x.kod === o.kod ? o : x; }); try { localStorage.setItem(ORDERS, JSON.stringify(all)); } catch (e) {} };
  if (token && !o.token) { o.token = token; save(); }

  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var eur = function (n) { var v = Math.round(n * 100) / 100, p = v.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (p[1] === '00' ? '' : ',' + p[1]) + ' €'; };
  var skDay = function (iso) { var p = String(iso).slice(0, 10).split('-'); return +p[2] + '. ' + +p[1] + '. ' + p[0]; };
  var z = o.zakaznik, sprava = 'Pedido Jarvis ' + o.kod;
  var set = function (k, v) { document.querySelectorAll('[data-o="' + k + '"]').forEach(function (el) { el.textContent = v; }); };
  set('oslovenie', z.meno.split(' ')[0] || z.meno);
  set('kod', o.kod); set('suma', eur(o.spolu)); set('iban', s.iban); set('bic', s.bic); set('prijemca', s.prijemca || s.meno);
  set('vs', o.vs); set('sprava', sprava); set('splatnost', skDay(o.splatnost));
  set('zaciatok', o.suhlasZaciatok === false && o.zaciatokOd ? 'Empezaré la instalación cuando venza el plazo de desistimiento, como pronto el ' + skDay(o.zaciatokOd) + '.' : o.suhlasZaciatok ? 'Ha solicitado que empecemos antes de que venza el plazo de desistimiento: acordaremos la fecha de instalación justo después del pago.' : 'Acordaremos la fecha de instalación justo después del pago.');

  document.querySelector('[data-order-lines]').innerHTML = o.polozky.map(function (l) {
    return '<tr><td><b>' + esc(l.nazov) + '</b>' + (l.qty > 1 ? ' × ' + l.qty : '') + (l.detail ? '<br><span class="muted" style="font-size:13.5px">' + esc(l.detail) + '</span>' : '') + '</td><td>' + (l.spolu ? eur(l.spolu) : 'incluido') + '</td></tr>';
  }).join('') + '<tr class="total"><td>Total a pagar</td><td>' + eur(o.spolu) + '</td></tr>';

  var cust = [['Nombre', z.meno], ['Empresa', z.firma], ['N.º de identificación (IČO)', z.ico], ['NIF (DIČ)', z.dic], ['NIF-IVA (IČ DPH)', z.icdph], ['Dirección', [z.ulica, (z.psc + ' ' + z.mesto).trim(), z.krajina].filter(Boolean).join(', ')], ['Correo electrónico', z.email], ['Teléfono', z.telefon], ['Licencia', o.licencia], ['Nota', o.poznamka]].filter(function (r) { return r[1]; });
  document.querySelector('[data-order-customer]').innerHTML = cust.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');

  // QR PAY by square (slovenské banky); 3.105: web v inom jazyku – európsky QR na platbu (EPC069-12, SEPA), ktorý čítajú
  // bankové appky v eurozóne
  var lang = (document.documentElement.lang || 'sk').slice(0, 2);
  var epc = function () { return ['BCD', '002', '1', 'SCT', s.bic || '', String(s.prijemca || s.meno).slice(0, 70), String(s.iban).replace(/\s+/g, ''), 'EUR' + (Math.round(o.spolu * 100) / 100).toFixed(2), '', '', ('VS ' + o.vs + ' ' + (sprava || '')).trim().slice(0, 140)].join('\n'); };
  var qrBox = document.querySelector('[data-qr]'), qrCap = document.querySelector('[data-qr-cap]');
  if (lang !== 'sk' && qrCap) qrCap.textContent = 'Pago QR SEPA (EPC): escanéelo en la aplicación de su banco';
  try {
    var payload = lang === 'sk' ? window.JarvisQR.payBySquare({ amount: o.spolu, iban: s.iban, bic: s.bic, variableSymbol: o.vs, note: sprava, dueDate: o.splatnost, beneficiaryName: s.prijemca || s.meno }) : epc();
    qrBox.innerHTML = window.JarvisQR.qrSvg(payload, { ecc: 'M', margin: 2, title: 'Pago QR ' + eur(o.spolu) });
  } catch (e) { qrBox.parentNode.innerHTML = '<div class="info-box">No se ha podido crear el código QR: pague con los datos de al lado.</div>'; }

  // text objednávky (do e-mailu predajcovi a na skopírovanie)
  var text = ['Buenos días,', '', 'quiero pedir Jarvis:', ''].concat(o.polozky.map(function (l) { return '- ' + l.nazov + (l.qty > 1 ? ' × ' + l.qty : '') + (l.detail ? ' (' + l.detail + ')' : '') + ': ' + (l.spolu ? eur(l.spolu) : 'incluido'); }))
    .concat(['', 'Total a pagar: ' + eur(o.spolu), 'Número de pedido / símbolo variable: ' + o.vs, 'Pago: por transferencia, vencimiento ' + skDay(o.splatnost), ''])
    .concat(['Cliente:'], cust.map(function (r) { return r[0] + ': ' + r[1]; }))
    .concat(['', 'Acepto las condiciones generales (versión de ' + D.nastavenia.podmienkyOd + ').'])
    .concat(o.suhlasZaciatok === true ? ['Solicito que la prestación del servicio y el suministro del contenido digital comiencen antes de que venza el plazo de desistimiento y reconozco que, una vez prestado por completo el servicio e iniciado el suministro del contenido digital, pierdo el derecho de desistimiento del contrato.'] : [])
    .concat(['', 'Saludos cordiales', z.meno]).join('\n');
  var mailto = 'mailto:' + s.email + '?subject=' + encodeURIComponent('Pedido Jarvis n.º ' + o.vs + (z.firma ? ' – ' + z.firma : ' – ' + z.meno)) + '&body=' + encodeURIComponent(text);
  var mailBtn = document.querySelector('[data-mailto]');
  mailBtn.href = mailto;
  var status = document.querySelector('[data-send-status]');
  if (o.odoslana) { document.querySelector('[data-send-title]').textContent = 'El pedido se ha enviado'; document.querySelector('[data-send-text]').textContent = 'Ya he recibido su pedido. Se lo confirmaré por correo.'; mailBtn.classList.remove('btn-primary'); mailBtn.lastChild.textContent = 'Enviar también por correo'; }

  var copy = function (value, label) {
    var done = function () { window.JarvisShop && window.JarvisShop.toast(label + ' – copiado'); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(value).then(done, function () { fallback(); });
    else fallback();
    function fallback() { var t = document.createElement('textarea'); t.value = value; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) {} t.remove(); }
  };
  document.querySelector('[data-copy-order]').addEventListener('click', function () { copy(text + '\n\nEnvíelo a: ' + s.email, 'Texto del pedido'); status.innerHTML = '<div class="info-box">El texto está en el portapapeles: péguelo en un correo a <b>' + esc(s.email) + '</b>.</div>'; });
  document.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-copy'); copy(k === 'iban' ? s.iban.replace(/\s/g, '') : o.vs, k === 'iban' ? 'IBAN' : 'Símbolo variable'); }); });

  // ---------- 3.121 platba kartou (Stripe cez Jarvis Bránu): po návrate zo Stripe sa overí, či prišla; inak sa dá zaplatiť znova
  // kartou alebo prevodom podľa údajov vyššie
  if (!API || !token || !(o.platba === 'karta' || q.get('zaplatene') || q.get('zrusene'))) return;
  var cardPanel = $('[data-card-panel]'), cardTitle = $('[data-card-title]'), cardText = $('[data-card-text]'), cardActions = $('[data-card-actions]'), payBtn = $('[data-card-pay]'), cardError = $('[data-card-error]');
  var transfer = $('[data-transfer-panel]');
  $('[data-send-panel]').hidden = true; cardPanel.hidden = false;
  document.querySelectorAll('[data-num]').forEach(function (el) { el.hidden = true; });
  $('[data-lead]').innerHTML = 'El pedido <b class="num">' + esc(o.kod) + '</b> se ha recibido.';
  $('[data-key-text]').textContent = 'La clave de licencia le llegará por correo justo después del pago; en Jarvis la introduce con el botón Introducir la clave. Después, el plan y las extensiones se cobran solos en la tarjeta y la licencia se prolonga sola; puede cancelar la suscripción en cualquier momento en Jarvis (Mis suscripciones).';
  var paid = function () {
    cardActions.hidden = true; transfer.hidden = true; cardError.innerHTML = '';
    cardTitle.textContent = 'Pagado con tarjeta';
    cardText.textContent = 'Gracias, el pago ha llegado. La clave de licencia le llegará por correo en unos minutos.';
    if (!o.zaplatena) { o.zaplatena = true; save(); }
  };
  var unpaid = function (failed) {
    cardActions.hidden = false; transfer.hidden = false;
    cardTitle.textContent = failed ? 'El pago con tarjeta no se ha completado' : 'El pago con tarjeta aún no se ha completado';
    cardText.textContent = 'Pague de nuevo con tarjeta o por transferencia con los datos de abajo.';
    $('[data-transfer-title]').textContent = 'O pague por transferencia';
  };
  if (o.zaplatena) paid();
  else {
    transfer.hidden = true;
    cardTitle.textContent = 'Esperando la confirmación del pago…'; cardText.textContent = 'Un momento, el banco está confirmando el pago.';
    var tries = q.get('zaplatene') ? 15 : 1;
    (function poll() {
      orderState().then(function (st) {
        if (st && st.stav === 'zaplatena') return paid();
        if (st && st.stav === 'zlyhala') return unpaid(true);
        if (--tries > 0) { setTimeout(poll, 3000); return; }
        if (q.get('zaplatene')) { cardTitle.textContent = 'El pago se está procesando'; cardText.textContent = 'El banco aún está confirmando el pago. En cuanto lo confirme, le llegará la clave de licencia por correo; puede cerrar la página.'; return; }
        unpaid(false);
      });
    })();
  }
  payBtn.addEventListener('click', function () {
    payBtn.disabled = true; cardError.innerHTML = '';
    var fail = function () { payBtn.disabled = false; cardError.innerHTML = '<div class="error-box">El pago con tarjeta no está disponible ahora: inténtelo dentro de un momento o pague por transferencia.</div>'; };
    fetch(API + '/v1/verejne/obchod/objednavka/' + encodeURIComponent(o.kod) + '/platba', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: token }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) { if (res.ok && res.j.url) location.href = res.j.url; else if (res.ok && res.j.stav === 'zaplatena') paid(); else fail(); }, fail);
  });
})();
