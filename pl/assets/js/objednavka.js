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
      $('[data-missing-title]').textContent = st.stav === 'zaplatena' ? 'Płatność otrzymana' : 'Zamówienie czeka na płatność';
      $('[data-missing-text]').textContent = st.stav === 'zaplatena' ? 'Zamówienie ' + st.kod + ' jest opłacone. Klucz licencyjny przyjdzie e-mailem.' : 'Zamówienie ' + st.kod + ' nie jest jeszcze opłacone – proszę otworzyć je w przeglądarce, w której składali Państwo zamówienie.';
    });
    return;
  }
  document.querySelector('[data-order]').hidden = false;
  var save = function () { all = all.map(function (x) { return x.kod === o.kod ? o : x; }); try { localStorage.setItem(ORDERS, JSON.stringify(all)); } catch (e) {} };
  if (token && !o.token) { o.token = token; save(); }

  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var eur = function (n) { var v = Math.round(n * 100) / 100, p = v.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (p[1] === '00' ? '' : ',' + p[1]) + ' €'; };
  var skDay = function (iso) { var p = String(iso).slice(0, 10).split('-'); return +p[2] + '. ' + +p[1] + '. ' + p[0]; };
  var z = o.zakaznik, sprava = 'Jarvis zamowienie ' + o.kod;
  var set = function (k, v) { document.querySelectorAll('[data-o="' + k + '"]').forEach(function (el) { el.textContent = v; }); };
  set('oslovenie', z.meno.split(' ')[0] || z.meno);
  set('kod', o.kod); set('suma', eur(o.spolu)); set('iban', s.iban); set('bic', s.bic); set('prijemca', s.prijemca || s.meno);
  set('vs', o.vs); set('sprava', sprava); set('splatnost', skDay(o.splatnost));
  set('zaciatok', o.suhlasZaciatok === false && o.zaciatokOd ? 'Z instalacją rozpocznę po upływie terminu na odstąpienie od umowy, najwcześniej ' + skDay(o.zaciatokOd) + '.' : o.suhlasZaciatok ? 'Zażądali Państwo rozpoczęcia przed upływem terminu na odstąpienie od umowy – termin instalacji uzgodnimy zaraz po płatności.' : 'Termin instalacji uzgodnimy zaraz po płatności.');

  document.querySelector('[data-order-lines]').innerHTML = o.polozky.map(function (l) {
    return '<tr><td><b>' + esc(l.nazov) + '</b>' + (l.qty > 1 ? ' × ' + l.qty : '') + (l.detail ? '<br><span class="muted" style="font-size:13.5px">' + esc(l.detail) + '</span>' : '') + '</td><td>' + (l.spolu ? eur(l.spolu) : 'w cenie') + '</td></tr>';
  }).join('') + '<tr class="total"><td>Razem do zapłaty</td><td>' + eur(o.spolu) + '</td></tr>';

  var cust = [['Imię i nazwisko', z.meno], ['Firma', z.firma], ['REGON / KRS', z.ico], ['NIP', z.dic], ['NIP UE', z.icdph], ['Adres', [z.ulica, (z.psc + ' ' + z.mesto).trim(), z.krajina].filter(Boolean).join(', ')], ['E-mail', z.email], ['Telefon', z.telefon], ['Licencja', o.licencia], ['Uwagi', o.poznamka]].filter(function (r) { return r[1]; });
  document.querySelector('[data-order-customer]').innerHTML = cust.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');

  // QR PAY by square (slovenské banky); 3.105: web v inom jazyku – európsky QR na platbu (EPC069-12, SEPA), ktorý čítajú
  // bankové appky v eurozóne
  var lang = (document.documentElement.lang || 'sk').slice(0, 2);
  var epc = function () { return ['BCD', '002', '1', 'SCT', s.bic || '', String(s.prijemca || s.meno).slice(0, 70), String(s.iban).replace(/\s+/g, ''), 'EUR' + (Math.round(o.spolu * 100) / 100).toFixed(2), '', '', ('VS ' + o.vs + ' ' + (sprava || '')).trim().slice(0, 140)].join('\n'); };
  var qrBox = document.querySelector('[data-qr]'), qrCap = document.querySelector('[data-qr-cap]');
  if (lang !== 'sk' && qrCap) qrCap.textContent = 'Płatność QR SEPA (EPC) – do zeskanowania w aplikacji bankowej';
  try {
    var payload = lang === 'sk' ? window.JarvisQR.payBySquare({ amount: o.spolu, iban: s.iban, bic: s.bic, variableSymbol: o.vs, note: sprava, dueDate: o.splatnost, beneficiaryName: s.prijemca || s.meno }) : epc();
    qrBox.innerHTML = window.JarvisQR.qrSvg(payload, { ecc: 'M', margin: 2, title: 'Płatność QR ' + eur(o.spolu) });
  } catch (e) { qrBox.parentNode.innerHTML = '<div class="info-box">Nie udało się utworzyć kodu QR – proszę zapłacić według danych obok.</div>'; }

  // text objednávky (do e-mailu predajcovi a na skopírovanie)
  var text = ['Dzień dobry,', '', 'zamawiam Jarvisa:', ''].concat(o.polozky.map(function (l) { return '- ' + l.nazov + (l.qty > 1 ? ' × ' + l.qty : '') + (l.detail ? ' (' + l.detail + ')' : '') + ': ' + (l.spolu ? eur(l.spolu) : 'w cenie'); }))
    .concat(['', 'Razem do zapłaty: ' + eur(o.spolu), 'Numer zamówienia / symbol zmienny (numer referencyjny): ' + o.vs, 'Płatność: przelewem, termin płatności ' + skDay(o.splatnost), ''])
    .concat(['Zamawiający:'], cust.map(function (r) { return r[0] + ': ' + r[1]; }))
    .concat(['', 'Akceptuję regulamin (w brzmieniu od ' + D.nastavenia.podmienkyOd + ').'])
    .concat(o.suhlasZaciatok === true ? ['Żądam rozpoczęcia świadczenia usługi i dostarczania treści cyfrowych przed upływem terminu na odstąpienie od umowy i przyjmuję do wiadomości, że po pełnym wykonaniu usługi i rozpoczęciu dostarczania treści cyfrowych tracę prawo do odstąpienia od umowy.'] : [])
    .concat(['', 'Z poważaniem', z.meno]).join('\n');
  var mailto = 'mailto:' + s.email + '?subject=' + encodeURIComponent('Zamówienie Jarvis nr ' + o.vs + (z.firma ? ' – ' + z.firma : ' – ' + z.meno)) + '&body=' + encodeURIComponent(text);
  var mailBtn = document.querySelector('[data-mailto]');
  mailBtn.href = mailto;
  var status = document.querySelector('[data-send-status]');
  if (o.odoslana) { document.querySelector('[data-send-title]').textContent = 'Zamówienie zostało wysłane'; document.querySelector('[data-send-text]').textContent = 'Zamówienie już otrzymałem. Potwierdzę je e-mailem.'; mailBtn.classList.remove('btn-primary'); mailBtn.lastChild.textContent = 'Wyślij także e-mailem'; }

  var copy = function (value, label) {
    var done = function () { window.JarvisShop && window.JarvisShop.toast(label + ' – skopiowano'); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(value).then(done, function () { fallback(); });
    else fallback();
    function fallback() { var t = document.createElement('textarea'); t.value = value; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) {} t.remove(); }
  };
  document.querySelector('[data-copy-order]').addEventListener('click', function () { copy(text + '\n\nProszę wysłać na adres: ' + s.email, 'Treść zamówienia'); status.innerHTML = '<div class="info-box">Tekst jest w schowku – proszę wkleić go do e-maila na adres <b>' + esc(s.email) + '</b>.</div>'; });
  document.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-copy'); copy(k === 'iban' ? s.iban.replace(/\s/g, '') : o.vs, k === 'iban' ? 'IBAN' : 'Symbol zmienny (numer referencyjny)'); }); });

  // ---------- 3.121 platba kartou (Stripe cez Jarvis Bránu): po návrate zo Stripe sa overí, či prišla; inak sa dá zaplatiť znova
  // kartou alebo prevodom podľa údajov vyššie
  if (!API || !token || !(o.platba === 'karta' || q.get('zaplatene') || q.get('zrusene'))) return;
  var cardPanel = $('[data-card-panel]'), cardTitle = $('[data-card-title]'), cardText = $('[data-card-text]'), cardActions = $('[data-card-actions]'), payBtn = $('[data-card-pay]'), cardError = $('[data-card-error]');
  var transfer = $('[data-transfer-panel]');
  $('[data-send-panel]').hidden = true; cardPanel.hidden = false;
  document.querySelectorAll('[data-num]').forEach(function (el) { el.hidden = true; });
  $('[data-lead]').innerHTML = 'Zamówienie <b class="num">' + esc(o.kod) + '</b> zostało przyjęte.';
  $('[data-key-text]').textContent = 'Klucz licencyjny przyjdzie e-mailem zaraz po zapłacie – w Jarvisie wkleją go Państwo przyciskiem Wstaw klucz. Plan i rozszerzenia będą potem pobierane z karty automatycznie, a licencja będzie się przedłużać sama; subskrypcję mogą Państwo anulować w każdej chwili w Jarvisie (Moja subskrypcja).';
  var paid = function () {
    cardActions.hidden = true; transfer.hidden = true; cardError.innerHTML = '';
    cardTitle.textContent = 'Opłacono kartą';
    cardText.textContent = 'Dziękuję, płatność dotarła. Klucz licencyjny przyjdzie e-mailem w ciągu kilku minut.';
    if (!o.zaplatena) { o.zaplatena = true; save(); }
  };
  var unpaid = function (failed) {
    cardActions.hidden = false; transfer.hidden = false;
    cardTitle.textContent = failed ? 'Płatność kartą nie powiodła się' : 'Płatność kartą nie została jeszcze zakończona';
    cardText.textContent = 'Proszę zapłacić kartą ponownie lub przelewem według danych poniżej.';
    $('[data-transfer-title]').textContent = 'Albo proszę zapłacić przelewem';
  };
  if (o.zaplatena) paid();
  else {
    transfer.hidden = true;
    cardTitle.textContent = 'Czekam na potwierdzenie płatności…'; cardText.textContent = 'Chwileczkę, bank potwierdza płatność.';
    var tries = q.get('zaplatene') ? 15 : 1;
    (function poll() {
      orderState().then(function (st) {
        if (st && st.stav === 'zaplatena') return paid();
        if (st && st.stav === 'zlyhala') return unpaid(true);
        if (--tries > 0) { setTimeout(poll, 3000); return; }
        if (q.get('zaplatene')) { cardTitle.textContent = 'Płatność jest przetwarzana'; cardText.textContent = 'Bank wciąż potwierdza płatność. Gdy tylko to zrobi, klucz licencyjny przyjdzie e-mailem – mogą Państwo zamknąć tę stronę.'; return; }
        unpaid(false);
      });
    })();
  }
  payBtn.addEventListener('click', function () {
    payBtn.disabled = true; cardError.innerHTML = '';
    var fail = function () { payBtn.disabled = false; cardError.innerHTML = '<div class="error-box">Płatność kartą jest teraz niedostępna – proszę spróbować za chwilę lub zapłacić przelewem.</div>'; };
    fetch(API + '/v1/verejne/obchod/objednavka/' + encodeURIComponent(o.kod) + '/platba', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ t: token }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) { if (res.ok && res.j.url) location.href = res.j.url; else if (res.ok && res.j.stav === 'zaplatena') paid(); else fail(); }, fail);
  });
})();
