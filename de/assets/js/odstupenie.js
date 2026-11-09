/* Jarvis · odstúpenie od zmluvy (3.144, § 20a zákona č. 108/2024 Z. z.): formulár „odstúpiť od zmluvy tu“ pošle oznámenie
   cez Jarvis Bránu a čas odoslania určí server. Potvrdenie o doručení príde e-mailom, na stránke sa dá uložiť aj vytlačiť.
   Keď Brána neodpovedá, ostáva e-mail predávajúcemu (odstúpenie e-mailom platí rovnako). */
(function () {
  'use strict';
  var D = window.JARVIS_DATA, form = document.querySelector('[data-withdraw-form]'); if (!form) return;
  var API = String(D.nastavenia.obchodApi || '').replace(/\/$/, ''), s = D.predajca;
  var lang = (document.documentElement.lang || 'sk').slice(0, 2);
  var err = document.querySelector('[data-withdraw-error]'), done = document.querySelector('[data-withdraw-done]'), btn = form.querySelector('[data-withdraw-submit]');
  var EMAIL = /^[^\s@<>,;"]{1,64}@[^\s@<>,;"]{1,190}\.[^\s@<>,;"]{2,24}$/;
  var LOCALES = { sk: 'sk-SK', cs: 'cs-CZ', en: 'en-GB', de: 'de-DE', pl: 'pl-PL', hu: 'hu-HU', it: 'it-IT' };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var when = function (iso) {
    try { return new Intl.DateTimeFormat(LOCALES[lang] || LOCALES.sk, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bratislava', timeZoneName: 'short' }).format(new Date(iso)); }
    catch (e) { return String(iso); }
  };
  var show = function (text) { err.innerHTML = text ? '<div class="error-box" role="alert">' + esc(text) + '</div>' : ''; };
  var last = null;
  // z odkazu v e-maile s objednávkou: ?c=<číslo objednávky>
  var q = new URLSearchParams(location.search);
  if (q.get('c')) form.kod.value = q.get('c').slice(0, 60);

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = { meno: form.meno.value.trim(), kod: form.kod.value.trim(), email: form.email.value.trim(), poznamka: form.poznamka.value.trim(), pozdrav: form.pozdrav.value, jazyk: lang };
    if (v.meno.length < 2 || !v.kod || !EMAIL.test(v.email)) { show('Bitte geben Sie Vor- und Nachnamen, die Bestellnummer und Ihre E-Mail an.'); return; }
    show(''); btn.disabled = true;
    fetch(API + '/v1/verejne/obchod/odstupenie', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || !j.id) throw new Error(j.error || 'Das Senden ist fehlgeschlagen.'); return j; }); })
      .then(function (j) { last = j; render(j); })
      .catch(function (e) {
        btn.disabled = false;
        show((e && e.message ? e.message + ' ' : '') + 'Wenn es auch gleich nicht klappt, senden Sie dasselbe per E-Mail an ' + s.email + ' – ein Widerruf per E-Mail gilt genauso.');
      });
  });

  function rows(j) {
    return [['Meno a priezvisko', j.meno], ['Bestellnummer', j.kod], ['E-Mail', j.email]]
      .concat(j.poznamka ? [['Was Sie widerrufen', j.poznamka]] : [])
      .concat([['Gesendet', when(j.odoslane)], ['Nummer der Erklärung', j.id]]);
  }
  function render(j) {
    form.hidden = true; done.hidden = false;
    done.querySelector('[data-withdraw-summary]').innerHTML = rows(j).map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
    done.focus();
  }
  document.querySelector('[data-withdraw-save]').addEventListener('click', function () {
    if (!last) return;
    var text = ['Widerrufserklärung', ''].concat(rows(last).map(function (r) { return r[0] + ': ' + r[1]; }))
      .concat(['', 'Verkäufer: ' + s.meno + ', ' + s.email, location.origin + location.pathname]).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/plain;charset=utf-8' }));
    a.download = 'odstupenie-' + last.id + '.txt';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });
  document.querySelector('[data-withdraw-print]').addEventListener('click', function () { window.print(); });
})();
