/* Jarvis · košík a objednávka. Pravidlá: k plánu patrí inštalácia (okrem zákazníka, ktorý Jarvisa už má, a balíka),
   doplnky v cene plánu sa neúčtujú, doplnky bez plánu len pre existujúceho zákazníka. Ceny vždy z data.js. */
(function () {
  'use strict';
  var D = window.JARVIS_DATA, S = window.JarvisShop;
  var form = document.querySelector('[data-cart-form]'); if (!form || !S) return;
  var K = D.nastavenia.rocneZaMesiacov, ORDERS = 'jarvis-objednavky-v1';
  // web v inom jazyku: krajina vopred podľa jazyka stránky (čeština Česko, ostatné Iná krajina EÚ), číslo firmy aj s písmenami
  var lang = (document.documentElement.lang || 'sk').slice(0, 2);
  if (lang !== 'sk' && form.elements.krajina) form.elements.krajina.selectedIndex = lang === 'cs' ? 1 : 2;
  if (lang !== 'sk' && lang !== 'cs' && form.elements.ico) form.elements.ico.removeAttribute('inputmode');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var eur = function (n) { var v = Math.round(n * 100) / 100, p = v.toFixed(2).split('.'); return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (p[1] === '00' ? '' : ',' + p[1]) + ' €'; };
  var planOf = function (id) { return D.plany.filter(function (p) { return p.id === id; })[0]; };
  var ICON = { cart: '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/>', plan: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', install: '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 18v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1"/>', pack: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>' };
  var svg = function (name) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[name] || ICON.cart) + '</svg>'; };

  /** Ktorý plán objednávka obsahuje (plán, balík alebo predĺženie). */
  function cartPlan(c) {
    for (var i = 0; i < c.items.length; i++) {
      var it = c.items[i], p = S.product(it.id); if (!p) continue;
      if (p.plan) return p.plan; if (p.balik) return p.balik.plan; if (it.id === 'predlzenie') return it.plan || 'biznis';
    }
    return null;
  }
  /** Riadok košíka: názov, popis, cena za kus, množstvo, spolu. */
  function line(it, c) {
    var p = S.product(it.id), qty = p.mnozstvo ? Math.max(1, Math.min(20, it.qty || 1)) : 1, plan = cartPlan(c), out = { id: it.id, nazov: p.nazov, detail: '', cena: p.cena || 0, qty: qty };
    if (p.plan || it.id === 'predlzenie') {
      var pl = planOf(p.plan || it.plan || 'biznis'), r = it.variant === 'rok';
      // predĺženie platí aj za moduly z licencie (Tím za každého človeka)
      var mods = it.id === 'predlzenie' ? (it.moduly || []).map(function (x) { var mp = D.produkty.filter(function (q) { return q.modul === x.id; })[0]; return mp ? { nazov: mp.nazov, count: Math.max(1, x.count || 1), mesacne: mp.mesacne } : null; }).filter(Boolean) : [];
      var monthly = pl.mesacne + mods.reduce(function (s, x) { return s + x.mesacne * x.count; }, 0);
      out.cena = r ? monthly * K : monthly; out.mesacne = monthly;
      out.detail = r ? '12 mesiacov vopred (za cenu ' + K + ')' : '1 mesiac vopred';
      if (it.id === 'predlzenie') { out.nazov = 'Predĺženie licencie – plán ' + pl.nazov; if (mods.length) out.detail += ' · ' + mods.map(function (x) { return x.nazov + (x.count > 1 ? ' (' + x.count + ')' : ''); }).join(', '); if (it.licencia) out.detail += ' · licencia ' + it.licencia; }
      out.variant = r ? 'rok' : 'mesiac';
    }
    // rozšírenie (modul) sa platí za to isté obdobie ako plán; pri balíku na 12 mesiacov, bez plánu si obdobie vyberie zákazník
    if (p.modul) {
      var planItem = c.items.filter(function (x) { var q = S.product(x.id); return q && (q.plan || x.id === 'predlzenie'); })[0];
      var bundle = c.items.some(function (x) { var q = S.product(x.id); return q && q.balik; });
      var yr = planItem ? planItem.variant === 'rok' : bundle ? true : it.variant === 'rok';
      out.cena = yr ? p.mesacne * K : p.mesacne; out.mesacne = p.mesacne; out.variant = yr ? 'rok' : 'mesiac';
      out.detail = (yr ? '12 mesiacov vopred (za cenu ' + K + ')' : '1 mesiac vopred') + (planItem || bundle ? ' · spolu s plánom' : '');
      out.ownVariant = !planItem && !bundle;
    }
    if (p.vCene && plan && p.vCene.indexOf(plan) >= 0) { out.cena = 0; out.detail = 'v cene plánu ' + planOf(plan).nazov; }
    if (p.balik) out.detail = p.vBaliku.join(' · ');
    out.spolu = out.cena * qty;
    return out;
  }

  /** Doplní alebo odoberie inštaláciu podľa pravidiel. */
  function normalize(c) {
    var hasPlan = c.items.some(function (it) { var p = S.product(it.id); return p && p.plan; });
    var hasBundle = c.items.some(function (it) { var p = S.product(it.id); return p && p.balik; });
    var hasInst = c.items.some(function (it) { return it.id === 'instalacia'; });
    c.items = c.items.filter(function (it) { var p = S.product(it.id); return p && !p.pripravujeme; });
    if ((hasBundle || c.mamLicenciu) && hasInst) c.items = c.items.filter(function (it) { return it.id !== 'instalacia'; });
    else if (hasPlan && !hasInst && !c.mamLicenciu && !hasBundle) c.items.unshift({ id: 'instalacia', qty: 1, auto: true });
    return c;
  }

  var listEl = form.querySelector('[data-cart-items]'), notesEl = form.querySelector('[data-cart-notes]'), sumEl = form.querySelector('[data-cart-summary]');
  var haveEl = form.querySelector('[data-have-license]'), licField = form.querySelector('[data-license-field]');

  function problems(c) {
    var out = [], ids = c.items.map(function (it) { return it.id; });
    var plan = cartPlan(c), inst = ids.indexOf('instalacia') >= 0;
    if (inst && !plan) out.push({ t: 'K inštalácii si vyberte mesačný alebo ročný plán.', plans: true });
    if (!plan && !inst && !c.mamLicenciu && c.items.length) out.push({ t: 'Doplnky a služby sú pre zákazníkov, ktorí Jarvisa už majú. Pridajte plán alebo zaškrtnite, že Jarvisa už máte.', plans: true });
    return out;
  }

  function render() {
    var c = normalize(S.read()); S.write(c);
    document.querySelector('[data-cart-empty]').hidden = c.items.length > 0;
    form.hidden = !c.items.length;
    if (!c.items.length) return;
    haveEl.checked = !!c.mamLicenciu; licField.hidden = !c.mamLicenciu;
    if (c.licencia && !form.elements.licencia.value) form.elements.licencia.value = c.licencia;
    var total = 0;
    listEl.innerHTML = c.items.map(function (it, i) {
      var p = S.product(it.id), l = line(it, c); total += l.spolu;
      var ctrl = '';
      if (p.plan || it.id === 'predlzenie' || l.ownVariant) ctrl += '<select data-variant-of="' + i + '" aria-label="Obdobie"><option value="mesiac"' + (l.variant !== 'rok' ? ' selected' : '') + '>Mesačne</option><option value="rok"' + (l.variant === 'rok' ? ' selected' : '') + '>Ročne (12 za cenu ' + K + ')</option></select>';
      if (p.mnozstvo) ctrl += '<span class="qty"><button type="button" data-qty="' + i + '" data-d="-1" aria-label="Menej">−</button><output>' + l.qty + '</output><button type="button" data-qty="' + i + '" data-d="1" aria-label="Viac">+</button></span>';
      ctrl += it.id === 'instalacia' && !c.mamLicenciu && cartPlan(c) ? '<span class="locked">Povinná pri prvej objednávke</span>' : '<button type="button" class="link-btn" data-remove="' + i + '">Odstrániť</button>';
      var ic = p.balik ? 'pack' : it.id === 'instalacia' ? 'install' : p.plan || it.id === 'predlzenie' ? 'plan' : 'cart';
      var perUnit = p.mnozstvo && l.qty > 1 ? '<small>' + l.qty + ' × ' + eur(l.cena) + '</small>' : (p.plan || p.modul || it.id === 'predlzenie') ? '<small>' + (l.variant === 'rok' ? 'ročne' : 'mesačne') + '</small>' : '';
      return '<div class="cart-item"><span class="icon">' + svg(ic) + '</span><div><h3>' + esc(l.nazov) + '</h3>' + (l.detail ? '<div class="sub">' + esc(l.detail) + '</div>' : '') + '<div class="controls">' + ctrl + '</div></div><div class="item-price">' + (l.spolu === 0 && p.vCene ? '<span class="badge blue">v cene</span>' : eur(l.spolu)) + perUnit + '</div></div>';
    }).join('');
    var probs = problems(c);
    notesEl.innerHTML = probs.map(function (pr) {
      return '<div class="info-box" style="margin-top:16px">' + esc(pr.t) + (pr.plans ? '<div class="actions" style="margin-top:12px">' + D.plany.map(function (p) { return '<button type="button" class="btn btn-small" data-add="plan-' + p.id + '" data-variant="mesiac">+ ' + esc(p.nazov) + ' ' + eur(p.mesacne) + '/mes.</button>'; }).join('') + '</div>' : '') + '</div>';
    }).join('');
    var monthly = c.items.filter(function (it) { var p = S.product(it.id); return p && (p.plan || it.id === 'predlzenie') && it.variant !== 'rok'; })[0];
    sumEl.innerHTML = c.items.map(function (it) { var l = line(it, c); return '<div class="sum-row"><span>' + esc(l.nazov) + (l.qty > 1 ? ' × ' + l.qty : '') + '</span><b>' + (l.spolu || !S.product(it.id).vCene ? eur(l.spolu) : 'v cene') + '</b></div>'; }).join('') +
      '<div class="sum-total"><span>Spolu k úhrade</span><b>' + eur(total) + '</b></div>' +
      '<p class="hint" style="margin:6px 0 0;font-size:13px;color:var(--muted)">' + (D.predajca.platitelDph ? 'Ceny s DPH.' : 'Konečná cena, predávajúci nie je platiteľ DPH.') + (monthly ? ' Ďalšie mesiace: ' + eur(line(monthly, c).mesacne + c.items.filter(function (it) { var p = S.product(it.id); return p && p.modul; }).reduce(function (sum, it) { return sum + line(it, c).mesacne; }, 0)) + ' mesačne vopred.' : '') + '</p>';
    consentRow();
  }

  // ovládanie položiek
  form.addEventListener('click', function (e) {
    var t = e.target.closest('[data-remove],[data-qty]'); if (!t) return;
    var c = S.read();
    if (t.hasAttribute('data-remove')) c.items.splice(+t.getAttribute('data-remove'), 1);
    else { var it = c.items[+t.getAttribute('data-qty')]; if (it) it.qty = Math.max(1, Math.min(20, (it.qty || 1) + (+t.getAttribute('data-d')))); }
    S.write(c); render();
  });
  form.addEventListener('change', function (e) {
    var t = e.target, c = S.read();
    if (t.hasAttribute('data-variant-of')) { var it = c.items[+t.getAttribute('data-variant-of')]; if (it) it.variant = t.value; S.write(c); render(); }
    else if (t === haveEl) { c.mamLicenciu = haveEl.checked; S.write(c); render(); }
    else if (t.name === 'typ') consentRow();
  });
  document.addEventListener('click', function (e) { if (e.target.closest('[data-add]')) setTimeout(render, 0); });

  function consentRow() {
    var osoba = form.elements.typ.value === 'osoba';
    form.querySelector('[data-firm-fields]').hidden = osoba;
    form.querySelector('[data-consent-row]').hidden = !osoba;
    form.querySelector('[data-consent-hint]').hidden = !osoba;
  }

  // odoslanie objednávky
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var c = normalize(S.read()), f = form.elements, err = form.querySelector('[data-cart-error]'), bad = [];
    var osoba = f.typ.value === 'osoba';
    // IČO zo Slovenska a Česka má 6 až 8 číslic; firma z inej krajiny EÚ zadá svoje číslo (NIP, adószám, P. IVA, HRB …)
    var domaca = f.krajina.selectedIndex < 2;
    var need =['meno', 'email', 'telefon', 'ulica', 'mesto', 'psc'].concat(osoba ? [] : ['firma', 'ico']);
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    need.forEach(function (n) {
      var v = f[n].value.trim(), ok = !!v;
      if (n === 'email') ok = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v);
      if (n === 'telefon') ok = v.replace(/\D/g, '').length >= 9;
      if (n === 'ico') ok = domaca ? /^\d{6,8}$/.test(v.replace(/\s/g, '')) : /\d/.test(v);
      if (!ok) { f[n].setAttribute('aria-invalid', 'true'); bad.push(n); }
    });
    var lic = f.licencia.value.trim();
    if (c.mamLicenciu && !/^(JRV-[0-9A-Z]{4}-[0-9A-Z]{4}|JARVIS-[\w.-]+)$/i.test(lic.replace(/\s+/g, ''))) { f.licencia.setAttribute('aria-invalid', 'true'); bad.push('licencia'); }
    var msgs = [];
    if (bad.length) msgs.push('Skontrolujte zvýraznené polia' + (bad.indexOf('ico') >= 0 && domaca ? ' (IČO má 6 až 8 číslic)' : '') + (bad.indexOf('licencia') >= 0 ? ' (licencia: JRV-XXXX-XXXX alebo celý kľúč)' : '') + '.');
    if (problems(c).length) msgs.push(problems(c)[0].t);
    if (!f.vop.checked) msgs.push('Potvrďte súhlas s obchodnými podmienkami.');
    err.innerHTML = msgs.length ? '<div class="error-box">' + msgs.map(esc).join('<br>') + '</div>' : '';
    if (msgs.length) { var first = form.querySelector('[aria-invalid="true"]'); if (first) first.focus(); return; }

    var lines = c.items.map(function (it) { return line(it, c); });
    var total = lines.reduce(function (n, l) { return n + l.spolu; }, 0);
    var now = new Date(), pad = function (n) { return String(n).padStart(2, '0'); };
    var vs = String(now.getFullYear()).slice(2) + pad(now.getMonth() + 1) + pad(now.getDate()) + String(Math.floor(1000 + Math.random() * 9000));
    var due = new Date(now.getTime() + D.nastavenia.splatnostDni * 864e5);
    var start = osoba && !f.zaciatok.checked ? new Date(now.getTime() + 15 * 864e5) : null;
    var order = {
      kod: vs, vs: vs, vytvorena: now.toISOString(), splatnost: due.getFullYear() + '-' + pad(due.getMonth() + 1) + '-' + pad(due.getDate()),
      polozky: lines, spolu: Math.round(total * 100) / 100, plan: cartPlan(c),
      zakaznik: { typ: osoba ? 'osoba' : 'firma', meno: f.meno.value.trim(), firma: osoba ? '' : f.firma.value.trim(), ico: osoba ? '' : f.ico.value.replace(/\s/g, ''), dic: osoba ? '' : f.dic.value.trim(), icdph: osoba ? '' : f.icdph.value.trim(), email: f.email.value.trim(), telefon: f.telefon.value.trim(), ulica: f.ulica.value.trim(), mesto: f.mesto.value.trim(), psc: f.psc.value.trim(), krajina: f.krajina.value },
      licencia: c.mamLicenciu ? lic : '', poznamka: f.poznamka.value.trim(), platba: (form.querySelector('input[name="platba"]:checked') || {}).value || 'prevod',
      suhlasZaciatok: osoba ? !!f.zaciatok.checked : null, zaciatokOd: start ? start.getFullYear() + '-' + pad(start.getMonth() + 1) + '-' + pad(start.getDate()) : null, odoslana: false
    };
    var all = []; try { all = JSON.parse(localStorage.getItem(ORDERS) || '[]'); } catch (x) {}
    all.unshift(order); try { localStorage.setItem(ORDERS, JSON.stringify(all.slice(0, 20))); } catch (x) {}
    var go = function () { S.write({ items: [], mamLicenciu: false, licencia: '' }); location.href = 'objednavka.html?c=' + encodeURIComponent(vs); };
    if (D.nastavenia.objednavkyUrl) {
      fetch(D.nastavenia.objednavkyUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) })
        .then(function (r) { if (r.ok) { order.odoslana = true; all[0] = order; try { localStorage.setItem(ORDERS, JSON.stringify(all.slice(0, 20))); } catch (x) {} } })
        .catch(function () {}).then(go);
    } else go();
  });

  render();
})();
