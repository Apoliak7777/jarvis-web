/* Jarvis · AI asistent na web (3.120): <script src="https://jarvis.apoliak.online/asistent.js" data-id="w_…" async></script>
   A chat bubble for the firm's own web: the visitor's question goes over the Jarvis Brána to the firm's Jarvis, its AI answers
   from what the owner gave it; with the firm's PC off, a contact form. Its look lives in a shadow root – the web's styles do
   not reach it. Every text goes in as text. */
(() => {
  'use strict';
  const script = document.currentScript, id = script?.dataset?.id || '';
  if (!/^w_[\w-]{6,30}$/.test(id) || window.__jarvisAssistant) return;
  window.__jarvisAssistant = true;
  const origin = (() => { try { return new URL(script.src).origin; } catch { return 'https://jarvis.apoliak.online'; } })();
  const API = origin === 'https://jarvis.apoliak.online' ? 'https://stiahnut.apoliak.online/brana' : origin + '/brana';
  const T = {
    sk: { open: 'Napíšte nám', ask: 'Napíšte otázku…', send: 'Odoslať', wait: 'Píšem odpoveď…', offline: 'Teraz neodpovedám hneď – nechajte nám kontakt a ozveme sa.', name: 'Meno', email: 'E-mail', phone: 'Telefón', text: 'S čím vám pomôžeme?', consent: 'Súhlasím so spracovaním údajov na odpoveď.', leave: 'Nechať kontakt', thanks: 'Ďakujeme, ozveme sa vám čo najskôr.', fail: 'Nepodarilo sa – skúste to o chvíľu.', need: 'Nechajte e-mail alebo telefón.', close: 'Zavrieť', by: 'cez Jarvis', hi: 'Dobrý deň! S čím vám pomôžem?' },
    cs: { open: 'Napište nám', ask: 'Napište dotaz…', send: 'Odeslat', wait: 'Píšu odpověď…', offline: 'Teď neodpovídám hned – nechte nám kontakt a ozveme se.', name: 'Jméno', email: 'E-mail', phone: 'Telefon', text: 'S čím vám pomůžeme?', consent: 'Souhlasím se zpracováním údajů pro odpověď.', leave: 'Nechat kontakt', thanks: 'Děkujeme, ozveme se vám co nejdříve.', fail: 'Nepovedlo se – zkuste to za chvíli.', need: 'Nechte e-mail nebo telefon.', close: 'Zavřít', by: 'přes Jarvis', hi: 'Dobrý den! S čím vám pomohu?' },
    en: { open: 'Message us', ask: 'Type your question…', send: 'Send', wait: 'Writing an answer…', offline: 'We cannot answer right now – leave us your contact and we will get back to you.', name: 'Name', email: 'E-mail', phone: 'Phone', text: 'How can we help?', consent: 'I agree to the processing of my details for the reply.', leave: 'Leave a contact', thanks: 'Thank you, we will get back to you soon.', fail: 'Something went wrong – please try again shortly.', need: 'Please leave an e-mail or a phone.', close: 'Close', by: 'via Jarvis', hi: 'Hello! How can I help?' },
    de: { open: 'Schreiben Sie uns', ask: 'Ihre Frage…', send: 'Senden', wait: 'Ich schreibe eine Antwort…', offline: 'Gerade können wir nicht sofort antworten – hinterlassen Sie uns Ihren Kontakt, wir melden uns.', name: 'Name', email: 'E-Mail', phone: 'Telefon', text: 'Wobei können wir helfen?', consent: 'Ich stimme der Verarbeitung meiner Daten für die Antwort zu.', leave: 'Kontakt hinterlassen', thanks: 'Danke, wir melden uns so bald wie möglich.', fail: 'Das hat nicht geklappt – bitte gleich noch einmal versuchen.', need: 'Bitte E-Mail oder Telefon angeben.', close: 'Schließen', by: 'über Jarvis', hi: 'Guten Tag! Wie kann ich helfen?' },
    pl: { open: 'Napisz do nas', ask: 'Wpisz pytanie…', send: 'Wyślij', wait: 'Piszę odpowiedź…', offline: 'Teraz nie odpowiemy od razu – prosimy zostawić kontakt, odezwiemy się.', name: 'Imię', email: 'E-mail', phone: 'Telefon', text: 'W czym możemy pomóc?', consent: 'Wyrażam zgodę na przetwarzanie danych w celu odpowiedzi.', leave: 'Zostaw kontakt', thanks: 'Dziękujemy, odezwiemy się jak najszybciej.', fail: 'Nie udało się – prosimy spróbować za chwilę.', need: 'Prosimy podać e-mail lub telefon.', close: 'Zamknij', by: 'przez Jarvis', hi: 'Dzień dobry! W czym mogę pomóc?' },
    hu: { open: 'Írjon nekünk', ask: 'Írja be a kérdését…', send: 'Küldés', wait: 'Válaszon dolgozom…', offline: 'Most nem tudunk azonnal válaszolni – hagyja meg elérhetőségét, és jelentkezünk.', name: 'Név', email: 'E-mail', phone: 'Telefon', text: 'Miben segíthetünk?', consent: 'Hozzájárulok adataim kezeléséhez a válaszadás céljából.', leave: 'Elérhetőség megadása', thanks: 'Köszönjük, hamarosan jelentkezünk.', fail: 'Nem sikerült – kérjük, próbálja újra kicsit később.', need: 'Adjon meg e-mailt vagy telefonszámot.', close: 'Bezárás', by: 'Jarvis', hi: 'Jó napot! Miben segíthetek?' },
    it: { open: 'Scrivici', ask: 'Scriva la domanda…', send: 'Invia', wait: 'Sto scrivendo la risposta…', offline: 'Ora non possiamo rispondere subito – ci lasci un contatto e La ricontatteremo.', name: 'Nome', email: 'E-mail', phone: 'Telefono', text: 'Come possiamo aiutarLa?', consent: 'Acconsento al trattamento dei dati per la risposta.', leave: 'Lascia un contatto', thanks: 'Grazie, La ricontatteremo al più presto.', fail: 'Non è riuscito – riprovi tra poco.', need: 'Lasci un’e-mail o un telefono.', close: 'Chiudi', by: 'tramite Jarvis', hi: 'Buongiorno! Come posso aiutarLa?' },
  };
  const el = (tag, attrs = {}, ...kids) => { const n = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (k === 'class') n.className = v; else if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else if (v !== null && v !== undefined && v !== false) n.setAttribute(k, v === true ? '' : v); } for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) n.append(kid instanceof Node ? kid : document.createTextNode(String(kid))); return n; };
  const post = (path, body) => fetch(`${API}/v1/verejne/asistent/${id}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(async r => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'fail'); return j; });
  const conv = (() => { try { return sessionStorage.getItem('jarvis-asistent-conv') || (sessionStorage.setItem('jarvis-asistent-conv', 'c' + Math.random().toString(36).slice(2, 12)), sessionStorage.getItem('jarvis-asistent-conv')); } catch { return 'c' + Math.random().toString(36).slice(2, 12); } })();

  fetch(`${API}/v1/verejne/asistent/${id}`).then(r => r.ok ? r.json() : null).then(cfg => { if (cfg) mount(cfg); }).catch(() => {});

  function mount(cfg) {
    const lang = T[cfg.lang] ? cfg.lang : 'sk', t = T[lang], color = /^#[0-9a-f]{6}$/i.test(cfg.color || '') ? cfg.color : '#2f6fed';
    const host = el('div'); host.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:2147483000';
    const shadow = host.attachShadow({ mode: 'closed' });
    shadow.append(el('style', {}, `
      * { box-sizing: border-box; font-family: "Segoe UI", system-ui, -apple-system, Arial, sans-serif; }
      .bubble { width: 58px; height: 58px; border-radius: 50%; border: 0; background: ${color}; color: #fff; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,.25); display: grid; place-items: center; }
      .bubble svg { width: 28px; height: 28px; }
      .panel { position: absolute; right: 0; bottom: 72px; width: min(370px, calc(100vw - 36px)); height: min(540px, calc(100vh - 110px)); background: #fff; color: #17202a; border-radius: 16px; box-shadow: 0 18px 60px rgba(0,0,0,.28); display: none; flex-direction: column; overflow: hidden; }
      .panel.on { display: flex; }
      .top { background: ${color}; color: #fff; padding: 14px 16px; display: flex; align-items: center; gap: 10px; } .top b { flex: 1; font-size: 15px; } .top button { background: transparent; border: 0; color: #fff; font-size: 22px; cursor: pointer; line-height: 1; }
      .msgs { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 8px; background: #f6f8fa; }
      .m { max-width: 85%; padding: 9px 12px; border-radius: 14px; font-size: 14px; line-height: 1.45; white-space: pre-wrap; overflow-wrap: anywhere; }
      .m.bot { background: #fff; border: 1px solid #e3e7ec; align-self: flex-start; border-bottom-left-radius: 4px; } .m.me { background: ${color}; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
      .m.wait { color: #5d6874; font-style: italic; }
      form.ask { display: flex; gap: 8px; padding: 10px; border-top: 1px solid #e3e7ec; } form.ask input { flex: 1; }
      input, textarea { font-size: 14px; padding: 9px 11px; border: 1px solid #cfd6de; border-radius: 9px; width: 100%; background: #fff; color: #17202a; } textarea { min-height: 70px; resize: vertical; }
      button.send { border: 0; border-radius: 9px; background: ${color}; color: #fff; padding: 9px 14px; font-weight: 600; cursor: pointer; } button:disabled { opacity: .6; }
      form.contact { display: grid; gap: 8px; padding: 12px 14px; border-top: 1px solid #e3e7ec; background: #fff; }
      .check { display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; color: #5d6874; } .check input { width: auto; margin-top: 2px; }
      .err { color: #c0392b; font-size: 12.5px; min-height: 1em; } .foot { text-align: center; font-size: 11px; color: #8a949e; padding: 4px 0 8px; background: #fff; }
      .privacy { font-size: 11.5px; color: #8a949e; white-space: pre-wrap; }
    `));
    const icon = () => { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '1.8'); const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', 'M20 11.5a8 8 0 0 1-8 8H5l-3 2v-9a9 9 0 0 1 18-.5Z'); svg.append(p); return svg; };
    const msgs = el('div', { class: 'msgs' }), history = [];
    const say = (text, who = 'bot', extra = '') => { const n = el('div', { class: `m ${who}${extra ? ' ' + extra : ''}` }, text); msgs.append(n); msgs.scrollTop = msgs.scrollHeight; return n; };
    const input = el('input', { placeholder: t.ask, maxlength: 1000, 'aria-label': t.ask }), sendBtn = el('button', { class: 'send', type: 'submit' }, t.send);
    let contactShown = false;
    const contactForm = () => {
      if (contactShown) return; contactShown = true;
      const name = el('input', { placeholder: t.name, maxlength: 120 }), email = el('input', { type: 'email', placeholder: t.email, maxlength: 200 }), phone = el('input', { type: 'tel', placeholder: t.phone, maxlength: 40 }), text = el('textarea', { placeholder: t.text, maxlength: 2000 }), agree = el('input', { type: 'checkbox' }), err = el('div', { class: 'err' }), btn = el('button', { class: 'send', type: 'submit' }, t.leave);
      const f = el('form', { class: 'contact', onsubmit: async e => {
        e.preventDefault(); err.textContent = '';
        if (!email.value && !phone.value) { err.textContent = t.need; return; }
        btn.disabled = true;
        try { await post('/kontakt', { name: name.value, email: email.value, phone: phone.value, text: text.value || history.map(h => h.text).join('\n'), consent: agree.checked, page: location.href }); f.replaceWith(el('div', { class: 'm bot', style: 'margin:12px' }, t.thanks)); }
        catch (x) { err.textContent = x.message === 'fail' ? t.fail : x.message; btn.disabled = false; }
      } }, name, email, phone, text, el('label', { class: 'check' }, agree, t.consent), cfg.privacy ? el('div', { class: 'privacy' }, cfg.privacy) : null, err, btn);
      askForm.replaceWith(f);
    };
    const askForm = el('form', { class: 'ask', onsubmit: async e => {
      e.preventDefault(); const text = input.value.trim(); if (!text) return;
      input.value = ''; say(text, 'me'); sendBtn.disabled = true; const waiting = say(t.wait, 'bot', 'wait');
      try {
        let out = await post('/otazka', { text, conv, history: history.slice(-6), lang, page: location.href });
        for (let i = 0; out.pending && i < 24; i++) { await new Promise(r => setTimeout(r, 2500)); out = await fetch(`${API}/v1/verejne/asistent/${id}/odpoved?q=${encodeURIComponent(out.id)}`).then(r => r.json()); }
        waiting.remove();
        if (out.answer) { say(out.answer); history.push({ role: 'user', text }, { role: 'assistant', text: out.answer }); }
        else { say(t.offline); contactForm(); }
      } catch { waiting.remove(); say(t.fail); }
      sendBtn.disabled = false; input.focus();
    } }, input, sendBtn);
    const panel = el('div', { class: 'panel', role: 'dialog', 'aria-label': cfg.title || t.open },
      el('div', { class: 'top' }, el('b', {}, cfg.title || t.open), el('button', { type: 'button', 'aria-label': t.close, onclick: () => panel.classList.remove('on') }, '×')),
      msgs, askForm, el('div', { class: 'foot' }, t.by));
    say(cfg.greeting || t.hi);
    if (!cfg.ai || !cfg.online) { say(t.offline); contactForm(); }
    const bubble = el('button', { class: 'bubble', type: 'button', 'aria-label': t.open, title: t.open, onclick: () => { panel.classList.toggle('on'); if (panel.classList.contains('on')) setTimeout(() => input.focus(), 50); } }, icon());
    shadow.append(panel, bubble);
    (document.body || document.documentElement).append(host);
  }
})();
