/* Jarvis · ceny košíka (3.121) – JEDINÝ výpočet ceny objednávky: počíta ho košík v prehliadači a ten istý súbor aj Jarvis
   Brána, keď pred platbou kartou prepočíta objednávku (nástroje Jarvisa brana/obchod.mjs ho nasadia na VPS). Len čisté
   funkcie – dáta (data.js v prehliadači, obchod.json na serveri) prídu zvonka. Pravidlá: inštalácia na želanie, pri
   balíku v cene; rozšírenie sa platí za to isté obdobie ako plán; doplnky v cene plánu sa neúčtujú; ročne = 12 mesiacov
   za cenu nastavenia rocneZaMesiacov. Texty riadkov idú cez t(): v prehliadači ich preloží preklad skriptu, na Bráne slovník
   „texty“ z obchod.json daného jazyka (nastroje/postav.mjs), aby platba kartou a objednávka boli v jazyku zákazníka. */
(function (root) {
  'use strict';
  function create(D) {
    var K = D.nastavenia.rocneZaMesiacov, T = D.texty || {};
    var t = function (s) { return Object.prototype.hasOwnProperty.call(T, s) ? T[s] : s; };
    var product = function (id) { return D.produkty.filter(function (p) { return p.id === id; })[0] || null; };
    var planOf = function (id) { return D.plany.filter(function (p) { return p.id === id; })[0]; };
    var qtyOf = function (p, it) { return p.mnozstvo ? Math.max(1, Math.min(20, Math.floor(it.qty || 1))) : 1; };
    // Jarvis 3.178.39 (Alex 22. 11. 2026: „podľa cenníkov za upgrade aby sa to logicky dopočítavalo ale vždy si vie predĺžiť
    // mesiac“): rozšírenie k licencii, ktorá ešte platí, sa platí pomerne do jej posledného zaplateného dňa. Ten deň
    // (c.licenciaDo) a dnešok (c.dnes) dá do košíka Jarvis Brána z overeného licenčného kľúča – bez nich platí pravidlo
    // celého mesiaca ako doteraz. Pri licencii zaplatenej najviac mesiac dopredu 1/30 mesačnej ceny za každý deň (nikdy viac
    // ako mesiac), dlhšie dopredu (ročne) ročná cena pomerne na dni, najmenej mesiac a najviac celý rok.
    var DEN = 864e5, pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var utc = function (d) { var p = String(d).split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); };
    var iso = function (ms) { var d = new Date(ms); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); };
    var skDen = function (d) { var p = String(d).split('-'); return +p[2] + '. ' + +p[1] + '. ' + p[0]; };
    var DATUM = /^\d{4}-\d{2}-\d{2}$/;
    /** koľko dní ešte platí licencia (aj dnešok), 0 = bez overenej licencie alebo už skončila */
    function zostava(c) { return c && DATUM.test(c.licenciaDo || '') && DATUM.test(c.dnes || '') ? Math.max(0, Math.round((utc(c.licenciaDo) - utc(c.dnes)) / DEN) + 1) : 0; }
    function pomerne(mesacne, dni) {
      var suma = dni <= 31 ? mesacne * Math.min(dni, 30) / 30 : Math.min(mesacne * K, Math.max(mesacne, mesacne * K * dni / 365));
      return Math.round(suma * 100) / 100;
    }
    /** posledný deň obdobia, ktoré nadväzuje na zaplatené (Jarvis src/lib/licencia.mjs periodEnd) */
    function koniecObdobia(posledny, mesiacov) {
      var z = new Date(utc(posledny) + DEN), y = z.getUTCFullYear(), m = z.getUTCMonth() + mesiacov, d = z.getUTCDate();
      var dlzka = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
      return iso(Date.UTC(y, m, Math.min(d, dlzka)) - DEN);
    }

    /** Ktorý plán objednávka obsahuje (plán, balík alebo predĺženie). */
    function cartPlan(c) {
      for (var i = 0; i < c.items.length; i++) {
        var it = c.items[i], p = product(it.id); if (!p) continue;
        if (p.plan) return p.plan; if (p.balik) return p.balik.plan; if (it.id === 'predlzenie') return planOf(it.plan) ? it.plan : 'biznis';
      }
      return null;
    }
    /** Riadok košíka: názov, popis, cena za kus, množstvo, spolu; pri predplatnom aj mesačná suma a obdobie. */
    function line(it, c) {
      var p = product(it.id), qty = qtyOf(p, it), plan = cartPlan(c), out = { id: it.id, nazov: p.nazov, detail: '', cena: p.cena || 0, qty: qty };
      if (p.plan || it.id === 'predlzenie') {
        var pl = planOf(p.plan || (planOf(it.plan) ? it.plan : 'biznis')), r = it.variant === 'rok';
        // predĺženie platí aj za moduly z licencie (Tím za každého človeka)
        var mods = it.id === 'predlzenie' ? (Array.isArray(it.moduly) ? it.moduly : []).slice(0, 30).map(function (x) { var mp = D.produkty.filter(function (q) { return q.modul && q.modul === (x && x.id); })[0]; return mp ? { nazov: mp.nazov, count: Math.max(1, Math.min(50, Math.floor(x.count || 1))), mesacne: mp.mesacne } : null; }).filter(Boolean) : [];
        var monthly = pl.mesacne + mods.reduce(function (s, x) { return s + x.mesacne * x.count; }, 0);
        out.cena = r ? monthly * K : monthly; out.mesacne = monthly;
        out.detail = r ? t('12 Monate im Voraus (zum Preis von ') + K + ')' : t('1 Monat im Voraus');
        if (it.id === 'predlzenie') { out.nazov = t('Lizenzverlängerung – Tarif ') + pl.nazov; if (zostava(c)) out.detail += t(' · gültig bis ') + skDen(koniecObdobia(c.licenciaDo, r ? 12 : 1)); if (mods.length) out.detail += ' · ' + mods.map(function (x) { return x.nazov + (x.count > 1 ? ' (' + x.count + ')' : ''); }).join(', '); if (it.licencia && !zostava(c)) out.detail += t(' · Lizenz ') + String(it.licencia).slice(0, 40); }
        out.variant = r ? 'rok' : 'mesiac'; out.obdobie = r ? 'rok' : 'mesiac'; out.plan = pl.id;
      }
      // rozšírenie (modul) sa platí za to isté obdobie ako plán; pri balíku na 12 mesiacov, bez plánu si obdobie vyberie zákazník
      var dni = p.modul && c.mamLicenciu ? zostava(c) : 0;
      if (dni && !c.items.some(function (x) { var q = product(x.id); return q && (q.plan || q.balik); })) {
        // k licencii, ktorá ešte platí (Brána overila kľúč): pomerne do jej posledného dňa, ďalej spolu s plánom
        out.cena = pomerne(p.mesacne, dni); out.mesacne = p.mesacne * qty; out.variant = 'mesiac'; out.obdobie = 'jednorazovo';
        out.detail = t('anteilig bis zum Ende des bezahlten Zeitraums') + ' (' + skDen(c.licenciaDo) + ')'; out.modul = p.modul; out.pomerne = dni;
      } else if (p.modul) {
        var planItem = c.items.filter(function (x) { var q = product(x.id); return q && (q.plan || x.id === 'predlzenie'); })[0];
        var bundle = c.items.some(function (x) { var q = product(x.id); return q && q.balik; });
        var yr = planItem ? planItem.variant === 'rok' : bundle ? true : it.variant === 'rok';
        out.cena = yr ? p.mesacne * K : p.mesacne; out.mesacne = p.mesacne * qty; out.variant = yr ? 'rok' : 'mesiac'; out.obdobie = bundle && !planItem ? 'jednorazovo' : out.variant;
        out.detail = (yr ? t('12 Monate im Voraus (zum Preis von ') + K + ')' : t('1 Monat im Voraus')) + (planItem || bundle ? t(' · zusammen mit dem Tarif') : '');
        out.ownVariant = !planItem && !bundle; out.modul = p.modul;
      }
      if (p.vCene && plan && p.vCene.indexOf(plan) >= 0) { out.cena = 0; out.detail = t('im Preis des Tarifs ') + planOf(plan).nazov; }
      if (p.balik) { out.detail = (p.vBaliku || []).join(' · '); out.balik = p.balik; }
      out.spolu = Math.round(out.cena * qty * 100) / 100;
      return out;
    }
    /** Inštalácia je na želanie: pri balíku je v cene a inštaláciu, ktorú košík kedysi pridal sám (auto), zmaže. */
    function normalize(c) {
      var hasBundle = c.items.some(function (it) { var p = product(it.id); return p && p.balik; });
      c.items = c.items.filter(function (it) { var p = product(it.id); return p && !p.pripravujeme && !(it.id === 'instalacia' && (it.auto || hasBundle)); });
      return c;
    }
    function lines(c) { return c.items.map(function (it) { return line(it, c); }); }
    function total(c) { return Math.round(lines(c).reduce(function (n, l) { return n + l.spolu; }, 0) * 100) / 100; }
    return { K: K, product: product, planOf: planOf, cartPlan: cartPlan, line: line, normalize: normalize, lines: lines, total: total, zostava: zostava, pomerne: pomerne, koniecObdobia: koniecObdobia };
  }
  root.JarvisCeny = { create: create };
})(typeof window !== 'undefined' ? window : this);
