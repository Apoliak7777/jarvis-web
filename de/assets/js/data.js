/* Jarvis · web a obchod – JEDINÉ miesto s údajmi predajcu, cenníkom, plánmi, doplnkami, funkciami a otázkami.
   Číta ho prehliadač (košík počíta ceny odtiaľto) aj zostavenie webu (node nastroje/postav.mjs vyrobí stránky).
   Po zmene ceny alebo textu spusti zostavenie znova. Ceny sú v eurách, konečné. */
window.JARVIS_DATA = {
  // i18n:off – údaje predajcu sa neprekladajú (nastroje/preklad.mjs)
  predajca: {
    meno: 'Alex Poliak',
    znacka: 'Apoliak',
    adresa: 'Mierová 24, 900 29 Nová Dedinka',
    krajina: 'Slovenská republika',
    ico: '',            // keď bude živnosť alebo firma, doplň – zobrazí sa v pätičke, podmienkach a objednávke
    dic: '',
    icdph: '',
    platitelDph: false,
    email: 'apoliak@apoliak.online',
    telefon: '0902 464 022',
    web: 'https://apoliak.online',
    iban: 'LT06 3250 0031 5962 5775',
    bic: 'REVOLT21',
    banka: 'Revolut Bank UAB',
    dozor: 'Slovenská obchodná inšpekcia, Inšpektorát SOI pre Bratislavský kraj, Bajkalská 21/A, Bratislava'
  },
  // i18n:on
  nastavenia: {
    mena: '€',
    splatnostDni: 7,
    rocneZaMesiacov: 10,       // ročné predplatné = 12 mesiacov za cenu 10
    objednavkyUrl: '',         // neskôr adresa na VPS (POST JSON); prázdne = objednávka sa pošle e-mailom
    platbaKartou: false,       // Stripe neskôr
    verejnyKluc: '',           // Jarvis → Nastavenia → Generátor licencií → Cenník → Kopírovať verejný kľúč (PEM)
    adresaWebu: 'https://jarvis.apoliak.online', // verejná adresa (náhľad v sieťach, Google, mapa stránok); zverejní nastroje/zverejni.mjs
    podmienkyOd: '28. 10. 2026'
  },

  plany: [
    { id: 'start', nazov: 'Start', mesacne: 15, pc: 1, pre: 'Für eine einzelne Person, die alles in einem Fenster haben möchte.',
      body: ['Alle Funktionen und 70+ Apps', '1 Computer', 'Laufende Updates und neue Funktionen', 'Support per E-Mail innerhalb von 2 Arbeitstagen'] },
    { id: 'biznis', nazov: 'Business', mesacne: 29, pc: 3, odporucany: true, pre: 'Für Selbstständige und kleine Firmen, deren Alltag aus E-Mails und Kunden besteht.',
      body: ['Alles aus Start', 'Bis zu 3 Computer', 'Jarvis auf dem Handy – Einrichtung inklusive', 'Support innerhalb von 1 Arbeitstag', 'Fernhilfe einmal im Monat', 'Überprüfung und Feinabstimmung einmal pro Quartal'] },
    { id: 'pro', nazov: 'Pro', mesacne: 49, pc: 5, pre: 'Für Unternehmen, die Jarvis auf ihre Arbeit zuschneiden möchten.',
      body: ['Alles aus Business', 'Bis zu 5 Computer', 'Eigenes Offline-KI-Modell – Einrichtung inklusive', '1 Stunde Maßarbeit pro Monat', 'Support innerhalb von 4 Stunden an Arbeitstagen, auch telefonisch', 'Neue Funktionen früher als alle anderen'] }
  ],
  porovnanie: [
    ['Alle Funktionen und 70+ Apps', true, true, true],
    ['Anzahl der Computer', '1', '3', '5'],
    ['Updates und neue Funktionen', true, true, true],
    ['Support per E-Mail', 'binnen 2 Arbeitstagen', 'binnen 1 Arbeitstag', 'binnen 4 Stunden'],
    ['Telefonischer Support', false, false, true],
    ['Fernhilfe per Bildschirmfreigabe', false, '1× monatlich', 'bei Bedarf'],
    ['Jarvis auf dem Handy (Einrichtung)', '59 €', 'inklusive', 'inklusive'],
    ['Eigenes Offline-KI-Modell (Einrichtung)', '149 €', '149 €', 'inklusive'],
    ['Überprüfung und Feinabstimmung von Jarvis', false, 'einmal pro Quartal', 'einmal im Monat'],
    ['Maßarbeit', false, false, '1 Stunde pro Monat'],
    ['Neue Funktionen früher (Testversionen)', false, false, true]
  ],
  instalaciaObsahuje: [
    'Installation von Jarvis auf Ihrem Computer – per Fernzugriff, in der Umgebung von Senec und Bratislava auch persönlich vor Ort',
    'Anbindung Ihrer KI-Konten (ChatGPT, Claude, Gemini) oder kostenloser KI-Dienste',
    'Anbindung von E-Mail (alle Ihre Postfächer), Kalender und WhatsApp',
    'Einrichtung passend zu Ihrer Arbeit: Menü, Firmen, Preise, Signatur und Antwortstil',
    'Import der Kontakte aus einer Quelle (Excel, Outlook oder Handy)',
    '60 Minuten Einweisung, bis Sie wissen, wo was ist',
    '14 Tage Vorrang-Support nach der Installation',
    'Lizenz für den ersten Computer'
  ],

  /* Obchod. kategoria: plany | doplnky | sluzby | baliky. cena = jednorazovo; plán má cenu z plany[]. */
  kategorie: [
    { id: 'plany', nazov: 'Installation und Tarife' },
    { id: 'doplnky', nazov: 'Add-ons' },
    { id: 'rozsirenia', nazov: 'Erweiterungen für Unternehmen' },
    { id: 'sluzby', nazov: 'Dienstleistungen' },
    { id: 'baliky', nazov: 'Pakete' }
  ],
  produkty: [
    { id: 'instalacia', kategoria: 'plany', nazov: 'Installation und Einrichtung von Jarvis', cena: 99, povodne: 149, ikona: 'install',
      kratko: 'Jarvis installiert und für Ihre Arbeit eingerichtet. Auf Wunsch – herunterladen und installieren können Sie ihn auch selbst.',
      popis: 'Ich installiere und konfiguriere Jarvis so, dass Sie ihn vom ersten Tag an für echte Arbeit nutzen – nicht zum Ausprobieren. Wir verbinden Ihre KI-Konten, Ihre E-Mails und Ihren Kalender, richten Firmen, Preise und Antwortstil ein, und in einer Stunde zeige ich Ihnen alles Wesentliche.',
      obsahuje: 'instalacia', poznamka: 'Wird nur einmal bezahlt. Zur Installation wählen Sie einen Monats- oder Jahrestarif.' },
    { id: 'plan-start', kategoria: 'plany', plan: 'start', nazov: 'Tarif Start', ikona: 'plan',
      kratko: '1 Computer, alle Funktionen, Updates und E-Mail-Support.',
      popis: 'Der komplette Jarvis mit allen Funktionen für eine Person auf einem Computer. Updates und neue Funktionen kommen von selbst, Fragen beantworte ich per E-Mail innerhalb von 2 Arbeitstagen.' },
    { id: 'plan-biznis', kategoria: 'plany', plan: 'biznis', nazov: 'Tarif Business', ikona: 'plan',
      kratko: 'Bis zu 3 Computer, Jarvis auf dem Handy und schnellerer Support.',
      popis: 'Für Selbstständige oder kleine Firmen: Jarvis auf bis zu drei Computern, auf dem Handy (Einrichtung inklusive), Support innerhalb eines Arbeitstages, einmal im Monat Fernhilfe und einmal pro Quartal eine Kontrolle, ob alles so läuft, wie es soll.' },
    { id: 'plan-pro', kategoria: 'plany', plan: 'pro', nazov: 'Tarif Pro', ikona: 'plan',
      kratko: 'Bis zu 5 Computer, Offline-KI, monatlich 1 Stunde Maßarbeit.',
      popis: 'Jarvis, angepasst an Ihre Firma: bis zu fünf Computer, ein eigenes Offline-KI-Modell mit Einrichtung inklusive, jeden Monat eine Stunde Maßarbeit (neue Funktion, Automatisierung, Anbindung) und Support innerhalb von 4 Stunden an Arbeitstagen, auch telefonisch.' },

    { id: 'dalsi-pc', kategoria: 'doplnky', nazov: 'Jarvis für einen weiteren Computer', cena: 99, ikona: 'pc', mnozstvo: true,
      kratko: 'Installation und Einrichtung auf einem weiteren Computer innerhalb Ihres Tarifs.',
      popis: 'Ich installiere Jarvis auf einem weiteren Computer in Ihrer Firma und verbinde die Konten der jeweiligen Person damit. Die Anzahl der Computer richtet sich nach dem Tarif (Start 1, Business 3, Pro 5); wenn Sie mehr brauchen, genügt ein höherer Tarif.' },
    { id: 'mobil', kategoria: 'doplnky', nazov: 'Jarvis auf dem Handy', cena: 59, ikona: 'phone', vCene: ['biznis', 'pro'],
      kratko: 'Der komplette Jarvis auf dem Handy, über eine private verschlüsselte Verbindung zu Ihrem PC.',
      popis: 'Jarvis auf iPhone und Android: Chat, Post, Aufgaben, Tagesüberblick, Freigabe per Ja/Nein und Benachrichtigungen. Die Verbindung läuft über ein privates verschlüsseltes Netzwerk zwischen Ihrem Handy und Ihrem Computer – aus dem Internet sieht sie niemand. Eine vom Handy aus gestellte Aufgabe läuft auf dem PC bis zum Ende, auch wenn Sie das Handy sperren.',
      poznamka: 'In den Tarifen Business und Pro ist die Einrichtung inklusive. Der Computer muss eingeschaltet sein.' },
    { id: 'offline-ai', kategoria: 'doplnky', nazov: 'Eigenes Offline-KI-Modell', cena: 149, ikona: 'chip', vCene: ['pro'],
      kratko: 'KI, die nur auf Ihrem Computer läuft. Nichts geht ins Internet.',
      popis: 'Ich installiere und optimiere ein Sprachmodell, das direkt auf Ihrer Grafikkarte läuft. Jarvis verwendet es für sensible Dinge (E-Mails, Verträge, Firmenzahlen) und als Reserve, wenn es kein Internet oder kein Abo gibt. Vor der Bestellung prüfe ich für Sie, ob Ihr Computer das schafft.',
      poznamka: 'Empfohlen wird eine NVIDIA-Grafikkarte mit 12 GB Speicher oder 32 GB RAM. Im Tarif Pro inklusive.' },
    { id: 'obchodnik', kategoria: 'doplnky', nazov: 'Händler nach Maß', cena: 149, ikona: 'deal',
      kratko: 'Interessenten aus den Postfächern, Antworten in Ihrem Stil und Zahlungserinnerungen.',
      popis: 'Ich richte den Händler auf Ihr Geschäft ein: was Sie verkaufen, wie Ihre Preise aussehen, wie Sie antworten und was der nächste Schritt ist. Jarvis liest dann alle 15 Minuten die Firmenpostfächer, trägt Interessenten bei den Kunden ein, bereitet eine Antwort zur Freigabe vor und erinnert an Angebote ohne Antwort und an unbezahlte Arbeit.' },
    { id: 'prenos-dat', kategoria: 'doplnky', nazov: 'Übertragung von Kontakten und Daten', cena: 79, ikona: 'import',
      kratko: 'Kontakte und Kunden aus mehreren Quellen – Excel, altes CRM, Outlook, Handy.',
      popis: 'Ich übertrage Ihre Kontakte, Kunden und Notizen aus mehreren Quellen in Jarvis, führe Duplikate zusammen, prüfe E-Mail-Adressen und ergänze bei Firmen Angaben aus dem Register anhand der Firmennummer.' },
    { id: 'hlas', kategoria: 'doplnky', nazov: 'Sprache und Diktieren nach Maß', cena: 49, ikona: 'mic',
      kratko: 'Mikrofon, eigenes Wörterbuch für Namen und Begriffe, Tastenkürzel.',
      popis: 'Ich richte das Diktieren so ein, dass es Ihre Arbeit versteht: ein Wörterbuch mit Namen von Kunden, Produkten und Fachbegriffen, Tasten zum Diktieren in jedes beliebige Fenster und Übersetzung ins Englische. Die Transkription läuft offline auf Ihrem Computer.' },
    { id: 'automatizacia', kategoria: 'doplnky', nazov: 'Automatisierung nach Maß', cena: 149, ikona: 'auto', mnozstvo: true,
      kratko: 'Eine wiederkehrende Aufgabe, die Jarvis selbst erledigt – z. B. Rechnungen aus E-Mails nach Excel.',
      popis: 'Wir wählen eine Aufgabe aus, die Sie ständig wiederholen, und Jarvis erledigt sie zur eingestellten Zeit selbst: Rechnungen aus E-Mails in eine Tabelle, morgendliche Übersicht über E-Mails und Aufgaben, Prüfung von Website und Onlineshop, wöchentliche Umsatzzusammenfassung. Vor dem Versenden oder Bezahlen fragt er immer nach.' },
    { id: 'odoo', kategoria: 'doplnky', nazov: 'Anbindung an Odoo', cena: 290, ikona: 'link',
      kratko: 'Jarvis liest aus Ihrem Odoo und schreibt dorthin – Aufträge, Kontakte, Rechnungen.',
      popis: 'Ich verbinde Jarvis über die API mit Ihrem Odoo: Er sucht einen Auftrag oder eine Rechnung, legt einen neuen Kontakt oder eine Aufgabe an und bereitet eine Übersicht vor. Die Basisanbindung deckt bis zu 5 Arten von Datensätzen ab; einen größeren Umfang vereinbaren wir vorab.' },
    { id: 'prepojenie', kategoria: 'doplnky', nazov: 'Anbindung an Ihr System', cena: 190, ikona: 'link',
      kratko: 'Pohoda, Money S3, SuperFaktúra, Shoptet, WooCommerce, Google Workspace oder Microsoft 365.',
      popis: 'Ich verbinde Jarvis mit einem System, das Sie in der Firma bereits nutzen – Buchhaltungsprogramm (Pohoda, Money S3), Rechnungsstellung (SuperFaktúra), Onlineshop (Shoptet, WooCommerce) oder Google Workspace bzw. Microsoft 365. Jarvis liest daraus und schreibt dorthin. Der Preis gilt für die Basisanbindung eines Systems; einen größeren Umfang vereinbaren wir vorab.' },
    { id: 'postupy', kategoria: 'doplnky', nazov: 'Firmenabläufe', cena: 149, ikona: 'auto',
      kratko: '5 Abläufe nach dem Muster „Wenn eine Reklamation eingeht, tu dies“ – Jarvis hält sich Schritt für Schritt daran.',
      popis: 'Gemeinsam halten wir fünf Dinge schriftlich fest, die in Ihrer Firma immer gleich ablaufen (Reklamation, Neukunde, Materialbestellung, Angebot, Monatsabschluss), und ich richte sie als Abläufe in Jarvis ein. Wenn Sie sagen „Es ist eine Reklamation eingegangen“, geht Jarvis genau nach Ihrem Ablauf vor.' },
    { id: 'vzhlad', kategoria: 'doplnky', nazov: 'Firmendesign', cena: 99, ikona: 'palette',
      kratko: 'Logo, Farben und Name Ihrer Firma in Jarvis.',
      popis: 'Jarvis in den Farben Ihrer Firma, mit Ihrem Logo und Namen („Jarvis · Kaviareň Sova“), einer Begrüßung für Mitarbeiter und der Firmensignatur in den Antworten.' },

    /* Rozšírenia pre firmy: mesačne ku plánu, platia spolu s licenciou (v kľúči pole m). pripravujeme = zatiaľ sa nedá kúpiť. */
    { id: 'modul-reporty', modul: 'reporty', kategoria: 'rozsirenia', nazov: 'Überblick für den Inhaber', mesacne: 5, ikona: 'chart', snimka: 'modul_prehlad',
      kratko: 'Jeden Montag eine Zusammenfassung: Umsatz, Interessenten, offene Zahlungen und überfällige Aufgaben.',
      popis: 'Jeden Montagmorgen erhalten Sie eine Zusammenfassung Ihrer Firma: Umsatz und Ausgaben im Vergleich zur Vorwoche und zum Vormonat, neue Interessenten, laufende Angebote, was auf Zahlung wartet und welche Aufgaben überfällig sind. Am Monatsende ein Abschluss als PDF, den Sie an Ihren Geschäftspartner oder Ihre Buchhalterin senden können.' },
    { id: 'modul-hovory', modul: 'hovory', kategoria: 'rozsirenia', nazov: 'Anrufe und Meetings ins CRM', mesacne: 9, ikona: 'phonecall', snimka: 'modul_hovory_navrh',
      kratko: 'Aufgenommenes Gespräch oder aufgenommene Besprechung → Transkript, Zusammenfassung und Aufgaben direkt beim Kunden.',
      popis: 'Nehmen Sie ein Gespräch mit einem Kunden oder eine Besprechung auf, und Jarvis erstellt daraus ein Transkript mit Angabe, wer was gesagt hat, eine kurze Zusammenfassung und Aufgaben. Alles trägt er beim richtigen Kunden ein, und die Aufgaben legt er auf der Tafel ab. Die Transkription läuft offline auf Ihrem Computer.' },
    { id: 'modul-faktury', modul: 'faktury', kategoria: 'rozsirenia', nazov: 'Rechnungen und Mahnungen', mesacne: 9, ikona: 'invoice', snimka: 'modul_faktury',
      kratko: 'Rechnung mit QR-Code per Klick, E-Rechnung für 2027 und Verfolgung der Zahlungseingänge.',
      popis: 'Eine Rechnung mit QR-Code zur Zahlung stellen Sie direkt aus der Kundenkarte aus – mit Nummerierung, PDF und gleich auch als Peppol-E-Rechnung für die ab 2027 verpflichtende elektronische Rechnungsstellung. Sie schicken sie mit einem Klick per E-Mail, sie wird im Bereich Geschäft erfasst, und Jarvis überwacht die Fälligkeit: 3 und 14 Tage danach bereitet er eine Mahnung vor, die Sie nur noch prüfen und absenden. Funktioniert für Umsatzsteuerzahler und Nicht-Umsatzsteuerzahler.' },
    { id: 'modul-doklady', modul: 'doklady', kategoria: 'rozsirenia', nazov: 'Belege aus der Post', mesacne: 9, ikona: 'mail', snimka: 'modul_doklady',
      kratko: 'Rechnungen und Kassenzettel aus E-Mails und vom Handy in eine Tabelle für die Buchhaltung.',
      popis: 'Jarvis findet einmal täglich in den E-Mails eingegangene Rechnungen und E-Rechnungen, liest auch einen abfotografierten Kassenzettel und listet Lieferant, Betrag, MwSt., Fälligkeit, IBAN und variables Symbol auf. Sie prüfen die Angaben nur und tragen sie mit einem Klick in die Ausgaben ein; was bezahlt werden muss, begleichen Sie per QR-Code auf dem Handy. Am Monatsende bereitet er ein Paket für die Buchhaltung vor – eine Tabelle für Excel und alle Belege in einer ZIP-Datei.' },
    { id: 'modul-znalosti', modul: 'znalosti', kategoria: 'rozsirenia', nazov: 'Firmenwissen', mesacne: 9, ikona: 'book',
      kratko: 'Jarvis lernt Ihre Preislisten, Abläufe und Verträge kennen und antwortet auf dieser Grundlage.',
      popis: 'Sie geben Jarvis Firmendokumente – Preislisten, Abläufe, Verträge, Antworten auf häufige Fragen – und er antwortet daraus, auch mit Verweis auf die Quelle. Ein neuer Mitarbeiter in der Firma fragt Jarvis statt Sie, und die Antworten richten sich immer nach der gültigen Preisliste.' },
    { id: 'modul-sukromie', modul: 'sukromie', kategoria: 'rozsirenia', nazov: 'Privater Modus', mesacne: 9, ikona: 'lock',
      kratko: 'E-Mails und Kunden nur über die Offline-KI, Protokoll und Sicherungen auf das Firmenlaufwerk.',
      popis: 'Für Firmen mit sensiblen Daten: E-Mails, Kunden und Verträge gehen nur an das KI-Modell auf Ihrem Computer, nie in die Cloud. Das Protokoll zeigt, wer was getan hat, und die Daten werden jeden Tag verschlüsselt auf ein Firmenlaufwerk oder NAS gesichert. Erfordert ein Offline-KI-Modell.' },
    { id: 'modul-recenzie', modul: 'recenzie', kategoria: 'rozsirenia', nazov: 'Bewertungen und Reputation', mesacne: 5, ikona: 'star',
      kratko: 'Überwachung von Google-Bewertungen und Antworten in Ihrem Stil, NFC-Karten für neue Bewertungen.',
      popis: 'Jarvis beobachtet neue Bewertungen Ihrer Firma bei Google, meldet sich bei einer schlechten und bereitet eine Antwort in Ihrem Stil vor. Dazu die NFC-Karten ťukni für die Theke – der Kunde hält sein Handy daran und schreibt sofort eine Bewertung.' },
    { id: 'modul-sklad', modul: 'sklad', kategoria: 'rozsirenia', nazov: 'Lager und Bestellungen', mesacne: 9, ikona: 'pack', pripravujeme: true,
      kratko: 'Einfaches Lager, Warnung bei Mindestbeständen und Bestellung per Klick.',
      popis: 'Ein einfaches Lager ohne kompliziertes System: Waren und Material, Mindestbestände und eine Warnung, wenn etwas zur Neige geht. Die Bestellung beim Lieferanten bereitet Jarvis als E-Mail vor, die Sie nur noch absenden.' },
    { id: 'modul-tim', modul: 'tim', kategoria: 'rozsirenia', nazov: 'Team', mesacne: 5, zaCloveka: true, ikona: 'team', pripravujeme: true,
      kratko: 'Gemeinsame Kunden, Aufgaben und Notizen für alle in der Firma.',
      popis: 'Kunden, Aufgaben und Notizen gemeinsam für die ganze Firma: wer welchen Auftrag betreut, was erledigt und was überfällig ist. Eine Änderung auf einem Computer erscheint sofort auf den anderen.' },
    { id: 'modul-rezervacie', modul: 'rezervacie', kategoria: 'rozsirenia', nazov: 'Online-Reservierungen', mesacne: 15, ikona: 'plan', pripravujeme: true,
      kratko: 'Buchungsseite für Ihre Kunden, Termine direkt im Kalender von Jarvis.',
      popis: 'Ihre Kunden reservieren ihren Termin selbst auf Ihrer Seite (Salon, Servicebetrieb, Beratung, Kurse), und der Termin erscheint sofort im Kalender von Jarvis. Die Kunden erhalten vor dem Termin eine Erinnerung, Sie sehen den ganzen Tag an einem Ort.' },

    { id: 'appka', kategoria: 'sluzby', nazov: 'App nach Maß in Jarvis', cena: 490, ikona: 'app',
      kratko: 'Eine kleine App genau für Ihr Geschäft – Verwaltung, Rechner, Formular.',
      popis: 'Ich programmiere die App, die in Ihrem Geschäft fehlt, und füge sie zu Jarvis hinzu: eine Verwaltung (z. B. von Aufträgen, Fahrzeugen, Prüfungen), einen Preisrechner, ein Bestellformular oder eine Übersicht. Der Preis gilt für eine kleine App; eine größere vereinbaren wir vorab.' },
    { id: 'hodina', kategoria: 'sluzby', nazov: 'Stunde Maßarbeit', cena: 45, ikona: 'clock', mnozstvo: true,
      kratko: 'Anpassung, neue Funktion, Anbindung oder Hilfe – Abrechnung nach Stunden.',
      popis: 'Eine Stunde meiner Arbeit an Ihrem Jarvis: Anpassung des Verhaltens, neue Funktion, Anbindung an einen von Ihnen genutzten Dienst oder Hilfe bei allem rund um Jarvis.' },
    { id: 'balik-5h', kategoria: 'sluzby', nazov: 'Paket mit 5 Arbeitsstunden', cena: 199, ikona: 'clock',
      kratko: '5 Stunden Maßarbeit zum Vorteilspreis, 6 Monate gültig.',
      popis: 'Fünf Stunden Maßarbeit, die Sie nach und nach innerhalb von 6 Monaten abrufen. Gegenüber einzelnen Stunden sparen Sie 26 €.' },
    { id: 'skolenie', kategoria: 'sluzby', nazov: 'Online-Schulung für Ihr Team', cena: 89, ikona: 'team',
      kratko: '90 Minuten für Ihr Team, bis zu 6 Personen.',
      popis: 'Online-Schulung für Ihr Team: wie man Jarvis fragt, wie man mit Post, Aufgaben und Kunden arbeitet und was zu tun ist, wenn etwas nicht funktioniert. Bis zu 6 Personen, 90 Minuten, mit Aufzeichnung.' },
    { id: 'prenos-pc', kategoria: 'sluzby', nazov: 'Jarvis auf neuen Computer übertragen', cena: 79, ikona: 'move',
      kratko: 'Neuer Computer, derselbe Jarvis – mit allen Daten und Anmeldungen.',
      popis: 'Sie kaufen einen neuen Computer? Ich übertrage Jarvis samt allen Daten, dem Verlauf und den Einstellungen, verbinde die Konten und prüfe, dass alles wie zuvor funktioniert.' },
    { id: 'expres', kategoria: 'sluzby', nazov: 'Expresshilfe innerhalb von 2 Stunden', cena: 39, ikona: 'bolt',
      kratko: 'Wenn es brennt: Ich melde mich innerhalb von 2 Stunden an einem Arbeitstag.',
      popis: 'Einmalige Hilfe, wenn es nicht warten kann: Ich melde mich innerhalb von 2 Stunden an einem Arbeitstag zwischen 8:00 und 18:00 Uhr, und wir lösen die Sache per Bildschirmfreigabe.' },

    { id: 'balik-zivnostnik', kategoria: 'baliky', nazov: 'Jarvis für Selbstständige', cena: 498, povodne: 627, ikona: 'pack', balik: { plan: 'biznis', mesiacov: 12 },
      kratko: 'Installation, Tarif Business für 12 Monate, Händler nach Maß und Schulung.',
      popis: 'Alles, was ein Selbstständiger im ersten Jahr braucht: Installation und Einrichtung, Tarif Business für 12 Monate (bis zu 3 Computer, Jarvis auf dem Handy), ein auf Ihr Geschäft eingerichteter Händler und Online-Schulung.',
      vBaliku: ['Installation und Einrichtung von Jarvis', 'Tarif Business für 12 Monate', 'Jarvis auf dem Handy', 'Händler nach Maß', 'Online-Schulung (90 Min.)'] },
    { id: 'balik-firma', kategoria: 'baliky', nazov: 'Jarvis für Unternehmen', cena: 789, povodne: 955, ikona: 'pack', balik: { plan: 'pro', mesiacov: 12 },
      kratko: 'Installation, Tarif Pro für 12 Monate, 2 weitere Computer, Datenübertragung und Team-Schulung.',
      popis: 'Jarvis für das ganze kleine Unternehmen im ersten Jahr: Installation, Tarif Pro für 12 Monate (Offline-KI und jeden Monat eine Stunde Maßarbeit), Jarvis auf zwei weiteren Computern, Übertragung von Kontakten und Daten und Team-Schulung.',
      vBaliku: ['Installation und Einrichtung von Jarvis', 'Tarif Pro für 12 Monate', 'Jarvis auf 2 weiteren Computern', 'Eigenes Offline-KI-Modell', 'Übertragung von Kontakten und Daten', 'Online-Schulung für das Team (90 Min.)'] },

    { id: 'predlzenie', kategoria: 'skryte', nazov: 'Lizenzverlängerung', ikona: 'plan',
      kratko: 'Jarvis-Abo für den nächsten Zeitraum.', popis: 'Verlängerung Ihrer Jarvis-Lizenz um einen weiteren Zeitraum gemäß Tarif.' }
  ],

  /* Odvetvové balíky rozšírení (stránka Pre firmy): moduly + nastavenie pre odbor lacnejšie ako samostatne. */
  odvetvia: [
    { id: 'uctovnictvo', nazov: 'Buchhaltungsbüro', ikona: 'invoice', mesacne: 19, moduly: ['doklady', 'faktury', 'znalosti'], navyse: 'Termine für MwSt. und Steuern in Daten und Fristen',
      text: 'Belege der Kunden aus den E-Mails direkt in Tabellen, Rechnungen mit Mahnungen und Antworten nach Ihren Abläufen.' },
    { id: 'remeslo', nazov: 'Handwerker und Baufirma', ikona: 'deal', mesacne: 15, moduly: ['faktury', 'hovory'], navyse: 'Baustellenfotos vom Handy beim Auftrag',
      text: 'Angebot, Auftrag, Baustellenfotos, Stundennachweis und Rechnung – alles bei einem Kunden.' },
    { id: 'eshop', nazov: 'Onlineshop', ikona: 'cart', mesacne: 19, moduly: ['faktury', 'recenzie', 'doklady'], navyse: 'Anbindung von Shoptet oder WooCommerce inklusive',
      text: 'Bestellungen aus dem Onlineshop, Antworten an Kunden in Ihrem Stil, Bewertungen und Belege für die Buchhaltung.' },
    { id: 'salon', nazov: 'Salon und Dienstleistungen', ikona: 'plan', mesacne: 15, moduly: ['rezervacie', 'recenzie'], navyse: 'Terminerinnerungen an Kunden',
      text: 'Kunden reservieren selbst, Jarvis erinnert sie an den Termin und bittet nach dem Besuch um eine Bewertung.' },
    { id: 'gastro', nazov: 'Gastronomie', ikona: 'pack', mesacne: 15, moduly: ['sklad', 'reporty', 'recenzie'], navyse: 'Bestellungen bei Lieferanten per E-Mail',
      text: 'Rohstofflager mit Warnung, Bestellungen bei Lieferanten, wöchentliche Umsatzübersicht und Gästebewertungen.' }
  ],

  /* Hlavné časti Jarvisa (stránka Funkcie a úvod). */
  casti: [
    { id: 'ai', nazov: 'KI-Chat mit allen Ihren KI-Diensten', text: 'ChatGPT, Claude und Gemini über Ihre eigenen Abos in einem Fenster, dazu kostenlose KI-Dienste und ein Offline-Modell. Jarvis wählt Modell und Antworttiefe selbst; ist bei einem Konto das Limit erreicht, macht das nächste weiter. Bis zu 6 Aufgaben gleichzeitig in verschiedenen Chats.' },
    { id: 'agent', nazov: 'Erledigt Arbeit am Computer', text: 'Liest und erstellt PDF-, Word- und Excel-Dateien, führt Dokumente zusammen und füllt sie aus, arbeitet im Browser mit Ihren Anmeldungen und bedient Programmfenster. Vor dem Versenden, Bezahlen, Einkaufen oder Löschen fragt er immer nach. Passwörter tippt er nie ein.' },
    { id: 'posta', nazov: 'Post mit vollem Zugriff', text: 'Gmail und Firmenpostfächer an einem Ort. Sagen Sie „Schau meine Mails an“, und Sie bekommen eine Zusammenfassung mit Links; zu jeder Nachricht gibt es einen Antwortentwurf, den Sie mit zwei Klicks absenden. Unwichtige und unzustellbare Mails räumen Sie mit einem Klick auf.' },
    { id: 'obchodnik', nazov: 'Händler', text: 'Liest alle 15 Minuten die Firmenpostfächer, trägt Interessenten bei den Kunden ein, bereitet Antworten in Ihrem Stil vor und erinnert an Angebote ohne Antwort und an unbezahlte Arbeit. Nichts wird von allein versendet.' },
    { id: 'biznis', nazov: 'Geschäft und Kunden', text: 'Umsatz und Ausgaben nach Monaten, Monatsziel, was noch auf Zahlung wartet, Status Ihrer Websites und Zertifikate. Kunden von der Anfrage bis zur Zahlung, Angebote als PDF und eine Firmendatenbank aus dem Register nach Firmennummer.' },
    { id: 'ulohy', nazov: 'Aufgaben, Kalender und Erinnerungen', text: 'Eine eigene Tafel wie bei Trello mit Terminen, Labels und Wiederholungen; Aufgaben legen Sie per Satz an, etwa „morgen um 9 den Lieferanten anrufen“. Kalender mit Feiertagen und Namenstagen, Wecker, Timer und Erinnerungen.' },
    { id: 'hlas', nazov: 'Sprache und Besprechungsprotokolle', text: 'Halten Sie eine Taste gedrückt und diktieren Sie in ein beliebiges Fenster – die Transkription läuft offline auf Ihrer Grafikkarte. Nehmen Sie eine Besprechung oder ein Gespräch auf, und Sie erhalten ein Transkript mit Angabe, wer gesprochen hat, und ein Protokoll mit Aufgaben.' },
    { id: 'automatizacia', nazov: 'Automatisierung', text: 'Planen Sie Arbeit, die Jarvis selbst erledigt: jeden Morgen eine E-Mail-Übersicht, freitags Rechnungen aus E-Mails nach Excel, alle 4 Stunden eine Website-Kontrolle. Braucht er Ihre Zustimmung, schickt er eine Benachrichtigung und wartet.' },
    { id: 'mobil', nazov: 'Jarvis auf dem Handy', text: 'Chat, E-Mails, Aufgaben und Freigaben auf dem Handy – über eine private verschlüsselte Verbindung zu Ihrem PC. Eine Aufgabe, die Sie vom Handy aus starten, läuft auf dem Computer bis zum Ende, auch wenn Sie das Handy sperren.' },
    { id: 'okno', nazov: 'Alles in einem Fenster', text: 'Browser mit Tabs und Passwörtern, Dateien mit Vorschau für Word, Excel und PDF, Terminal, WhatsApp, Teams und Discord – Sie müssen Jarvis nie verlassen. Strg + K findet alles, Alt + S erstellt einen Bildschirmausschnitt.' },
    { id: 'efaktury', nazov: 'E-Rechnungen, bereit für 2027', text: 'Prüfen, Anzeigen und Ausstellen von E-Rechnungen nach der europäischen Norm EN 16931 und Peppol BIS 3.0, alles offline. Eine E-Rechnung aus einem E-Mail-Anhang prüfen Sie mit einem Klick.' },
    { id: 'sukromie', nazov: 'Privatsphäre und Sicherheit', text: 'Ihre Daten liegen auf Ihrem Computer, Passwörter verschlüsselt Windows, und die KI bekommt sie nie zu sehen. Virenschutz und VPN mit einem Klick; Inkognito schickt Firmen Löschanträge für Ihre Daten nach DSGVO.' }
  ],

  /* Appky v Jarvisovi (podľa Jarvis\public\mini\catalog.json, bez Generátora licencií – ten má len predajca). */
  appky: [
    { kategoria: 'Alltag', polozky: [
      ['Notizen', 'Schnelle Notizen mit Suche, Anheften und Bearbeitung per KI'],
      ['Wetter', 'Jetzt, stündlich und für 7 Tage für Ihre Stadt'],
      ['Uhr', 'Timer, Stoppuhr, Wecker, Pomodoro, Erinnerungen, Countdowns und Weltzeit'],
      ['Rechner', 'Berechnungen mit Verlauf, MwSt., Prozente, Einheiten und Währungen nach EZB'],
      ['Übersetzer', 'Übersetzung und Textbearbeitung über Ihre KI, 12 Sprachen'],
      ['Radio', 'Slowakische und internationale Radiosender live, Favoriten griffbereit'],
      ['Zwischenablage', 'Was Sie kopiert haben – mit einem Klick erneut einfügen, angeheftete Texte'],
      ['Gewohnheiten', 'Tägliche Gewohnheiten mit Serien und Jahreskarte'],
      ['Kalender', 'Monatsansicht mit Feiertagen und Namenstagen, Termine mit Erinnerung'],
      ['Diktiergerät', 'Sprachnotizen, direkt auf Ihrem Computer in Text umgewandelt'],
      ['Geld', 'Einnahmen und Ausgaben nach Monaten, Kategorien und Abos'],
      ['Aktien', 'Aktien, ETFs und Krypto – Chart, Firmenkennzahlen, Analysten, Nachrichten, Depot in Euro und Preisalarme'],
      ['Artikelleser', 'Artikel ohne Werbung und Pop-ups, KI-Zusammenfassung und Vorlesen'],
      ['Übung', 'Intervalltraining – Tabata, HIIT, Plank, Jarvis sagt die Übungen an'],
      ['Daten und Fristen', 'Letzter Tag der Frist nach Gesetz, Arbeitstage, Feiertage und Arbeitszeitkontingent'],
      ['Wer wem wie viel', 'Gemeinsame Ausgaben auf dem Ausflug oder in der Hütte – wer wem wie viel überweist, mit möglichst wenigen Zahlungen']
    ] },
    { kategoria: 'Arbeit', polozky: [
      ['Händler', 'Interessenten aus den Postfächern, vorbereitete Antworten und Erinnerungen – Sie müssen nur noch senden'],
      ['Kunden · CRM', 'Aufträge von der Anfrage bis zur Bezahlung, Personen und Firmen mit letztem Kontakt und nächstem Schritt'],
      ['Kontaktdatenbank', 'Firmen und Personen samt Kennzahlen – aus E-Mails, Excel und Websites; Geschäftsführer und Umsatz aus dem Register nach Firmennummer'],
      ['Angebot', 'Angebot für den Kunden mit Positionen und MwSt. als PDF mit einem Klick'],
      ['Texte für die Firma', 'Beiträge, Antworten auf Bewertungen, Angebote per E-Mail und Werbung über KI'],
      ['Besprechungsprotokoll', 'Nehmen Sie ein Gespräch oder eine Besprechung auf – Transkript mit Angabe, wer gesprochen hat, und KI-Protokoll mit Aufgaben'],
      ['Arbeitsbericht', 'Stoppuhr für Projekte und Kunden, Stunden × Satz, Bericht für den Kunden und CSV'],
      ['PDF-Werkzeuge', 'Seiten zusammenfügen, teilen, drehen und neu ordnen, Bilder in PDF'],
      ['Text aus dem Bild', 'Text aus einem Screenshot oder Bild, offline in Windows'],
      ['QR-Codes', 'QR für Link, WLAN, Kontakt und QR-Zahlung PAY by square'],
      ['Kontakte und Tabellen', 'CSV und Excel: Duplikate weg, E-Mail-Prüfung, Filter, Aufteilen'],
      ['Screenshots', 'Screenshot mit Pfeilen, Rahmen, Text und Verdecken sensibler Inhalte'],
      ['Bildschirmaufnahme', 'Bildschirm oder Fenster mit Ton und Mikrofon als Video'],
      ['Video und Ton', 'Video auf die gewünschte Größe in MB bringen, Ausschnitt schneiden, Ton als MP3, GIF'],
      ['Seitenwächter', 'Beobachtet Websites (Ausschreibungen, Preise, Anzeigen) und meldet sich, wenn sich dort etwas ändert'],
      ['Website-Prüfung', 'SEO und Technik der Website in wenigen Sekunden – mit Hinweisen, was zu beheben ist'],
      ['Website-Überblick', 'Die ganze Website Seite für Seite – defekte Links, SEO-Fehler, sitemap.xml'],
      ['SEO-Code für die Website', 'Titel, Beschreibung, Teilen, Firma für Google und robots.txt – mit Vorschau bei Google'],
      ['Bilder fürs Web', 'Verkleinern und in WebP oder JPEG umwandeln, auch viele auf einmal'],
      ['Favicon und Icons', 'Aus dem Logo alle Icons der Website – favicon.ico, Apple, Android, Manifest'],
      ['Farben', 'Farbtöne, Kontrast nach WCAG, Pipette und gespeicherte Paletten']
    ] },
    { kategoria: 'Entwicklung', polozky: [
      ['HTML-Tester', 'Fügen Sie HTML ein und sehen Sie sofort die Website auf Computer, Tablet und Handy, mit Fehlern in Rot'],
      ['Server · WinSCP', 'Dateien auf Ihren Servern über SFTP, FTP und SCP – hochladen, herunterladen, bearbeiten'],
      ['Odoo-Werkstatt', 'Code von Serveraktionen für Odoo 17 – 20, offline geprüft, Ihre Module als Zip'],
      ['Entwickler', 'JSON, Base64, URL, Hash, UUID, JWT, Zeit und Regex'],
      ['Text', 'Zähler, ohne Akzente, Slug, Groß- und Kleinbuchstaben, Zeilen'],
      ['Passwörter', 'Starke Passwörter und leicht merkbare Phrasen, Passwortstärke'],
      ['Texte vergleichen', 'Was zwischen zwei Textversionen hinzukam und was verschwand'],
      ['Symbole und Emoji', 'Anführungszeichen, Gedankenstriche, €, ×, Pfeile und Emoji per Stichwort']
    ] },
    { kategoria: 'Computer', polozky: [
      ['Festplatte', 'Was auf der Festplatte Platz belegt, Ordner für Ordner'],
      ['Internetgeschwindigkeit', 'Ping, Download und Upload, Messverlauf'],
      ['Netzwerk und DNS', 'DNS, E-Mail-Domain (SPF, DKIM, DMARC), SSL-Zertifikat, Ping, Ports'],
      ['Über den Computer', 'Prozessor, Grafik, Speicher, Laufwerke, Akku und Windows'],
      ['Programme in Jarvis', 'Git, Node.js und Ollama direkt in Jarvis statt als eigene Anwendungen'],
      ['Massenumbenennung', 'Viele Dateien auf einmal – ohne Akzente, Nummerierung, suchen und ersetzen, rückgängig machen'],
      ['Doppelte Dateien', 'Gleiche Dateien nach Inhalt – überzählige Kopien in den Papierkorb, eine bleibt immer'],
      ['Zeit am PC', 'Wie viel Zeit in welchem Programm – nach Tagen, mit einem Klick in den Arbeitsbericht'],
      ['Aufräumer', 'Sortiert Downloads in Ordner – löscht nichts, lässt sich rückgängig machen']
    ] },
    { kategoria: 'Lernen', polozky: [
      ['Vokabeln', 'Karteikarten mit Wiederholung zur richtigen Zeit – die KI erstellt sie aus Text'],
      ['Zehnfingerschreiben', 'Geschwindigkeit und Genauigkeit beim Tippen slowakischer Texte'],
      ['Enzyklopädie', 'Wikipedia auf Slowakisch direkt in Jarvis, Zusammenfassung und Vorlesen'],
      ['Quiz', 'KI-Quiz zu jedem Thema – auch fürs Abitur, mit Erklärung'],
      ['Funktionsgraph', 'Funktionen wie in der Schule – Graph, Nullstellen, Schnittpunkte und Wertetabelle'],
      ['Geografie', 'Flaggen und Hauptstädte – Quiz für Europa und die ganze Welt']
    ] },
    { kategoria: 'Spiele', polozky: [
      ['2048', 'Zahlen verschmelzen bis zur 2048'], ['Sudoku', 'Drei Schwierigkeitsstufen, Notizen, Fehlerprüfung und Zeit'],
      ['Gomoku', 'Fünf in einer Reihe gegen Jarvis'], ['Memory', 'Finden Sie die Paare, Rekorde je nach Größe'],
      ['Schlange', 'Klassische Schlange, wird schneller'], ['Zufall', 'Würfel, Münze, Zahl und Aufteilung in Teams'],
      ['Schach', 'Schach gegen Jarvis in drei Stufen'], ['Minensuche', 'Minen suchen, der erste Klick ist immer sicher'],
      ['Fallende Steine', 'Herabfallende Steine mit Schatten und Ablage'], ['Solitär', 'Klondike mit 1 oder 3 Karten'],
      ['Vier gewinnt', 'Vier in einer Reihe gegen Jarvis oder zu zweit'], ['Slovko', 'Slowakisches Wordle, jeden Tag ein neues Wort'],
      ['Arkanoid', 'Schläger, Ball und Steine – 6 Level']
    ] }
  ],

  otazky: [
    ['Kann ich Jarvis zuerst ausprobieren?', 'Ja. Sie laden Jarvis kostenlos herunter und nutzen ihn 7 Tage lang vollständig, außer den kostenpflichtigen Erweiterungen – ohne Lizenzschlüssel, ohne Karte und ohne Verpflichtung. Wenn Sie einen Tarif wählen, fügen Sie den Lizenzschlüssel in denselben Jarvis ein und machen einfach weiter. Wenn Sie keinen Tarif wählen, sperrt sich Jarvis nach 7 Tagen, Sie zahlen nichts und Ihre Daten bleiben auf Ihrem Computer.'],
    ['Auf welchem Computer läuft Jarvis?', 'Unter Windows 10 oder 11 (64 Bit). Wir empfehlen mindestens 16 GB RAM. Für ein eigenes Offline-KI-Modell eignet sich eine NVIDIA-Grafikkarte mit 12 GB Speicher oder 32 GB RAM – vor der Bestellung prüfe ich Ihren Computer gern.'],
    ['Brauche ich ein Abo für ChatGPT oder Claude?', 'Nein. Jarvis funktioniert auch mit kostenlosen KI-Diensten (zum Beispiel Google AI Studio oder Groq) und mit einem Offline-Modell. Mit einem Abo (ChatGPT Plus, Claude Pro, Gemini) erhalten Sie die besten Antworten. Das Abo bezahlen Sie direkt beim Anbieter – ohne Aufschlag, Jarvis nutzt lediglich Ihre Konten.'],
    ['Was bekomme ich genau für die Installation?', 'Jarvis installiert und für Ihre Arbeit eingerichtet: verbundene KI-Konten, E-Mail, Kalender und WhatsApp, eingerichtete Firmen, Preise und Antwortstil, Import der Kontakte, 60 Minuten Einweisung und 14 Tage bevorzugte Hilfe. Die Installation ist optional und wird einmal bezahlt – jetzt 99 € statt 149 €. Herunterladen und installieren können Sie Jarvis auch selbst kostenlos.'],
    ['Warum zahlt man monatlich?', 'Der Monatstarif ist die Lizenz zur Nutzung von Jarvis und die Betreuung: laufende Updates und neue Funktionen, Fehlerbehebungen, eine Prüfung nach jeder neuen Version und Support gemäß Tarif. Bei Jahreszahlung bezahlen Sie 12 Monate zum Preis von 10.'],
    ['Was, wenn ich nicht mehr zahle?', 'Die Lizenz gilt bis zum letzten bezahlten Tag. Danach haben Sie 14 Tage Zeit zur Verlängerung, bevor Jarvis gesperrt wird. Ihre Daten bleiben auf Ihrem Computer, und Sie können sie jederzeit exportieren.'],
    ['Wo sind meine Daten, und wer kann sie sehen?', 'Alles liegt auf Ihrem Computer. Passwörter verschlüsselt Windows, und die KI bekommt sie nie zu sehen. Text, den Sie schreiben, geht nur an den KI-Dienst, den Sie wählen – bei einem Offline-Modell verlässt er den Computer nicht. Ich als Verkäufer habe keinen Zugriff auf Ihre Daten; bei Fernhilfe habe ich ihn nur während der Verbindung, die Sie selbst erlauben und jederzeit beenden können.'],
    ['Wie läuft die Installation ab?', 'Selbst: Sie laden das Installationsprogramm herunter, starten es und geben Ihren Namen ein – das dauert ein paar Minuten. Wenn Sie die Installation bei mir bestellen, vereinbaren wir nach der Zahlung einen Termin. Die Installation dauert in der Regel 2–3 Stunden per Bildschirmfreigabe, in der Umgebung von Senec und Bratislava auch persönlich. Sie melden sich dabei nur bei Ihren Konten an – Passwörter gebe ich nicht ein.'],
    ['Kann ich Jarvis vor der Bestellung sehen?', 'Ja – laden Sie ihn herunter und testen Sie ihn 7 Tage kostenlos. Wenn Sie möchten, schreiben Sie mir und wir vereinbaren auch einen kurzen Videoanruf, in dem ich Ihnen Jarvis live zeige und Ihre Fragen beantworte.'],
    ['Funktioniert es auch auf dem Mac oder auf dem Handy?', 'Jarvis läuft unter Windows. Auf dem Handy (iPhone und Android) haben Sie ihn über eine private Verbindung zu Ihrem Computer – dieser muss eingeschaltet sein. Für den Mac gibt es ihn noch nicht.'],
    ['Tut Jarvis etwas ohne meine Zustimmung?', 'Lesen und alltägliche Dinge erledigt er sofort und gibt Bescheid. Vor dem Versenden einer E-Mail, vor Zahlungen, Käufen, dem Löschen, Veröffentlichen oder Bestätigen fragt er immer nach. Passwörter tippt er nie ein – Sie melden sich selbst an.'],
    ['Wie viele Computer kann ich haben?', 'Je nach Tarif: Start 1, Business 3 und Pro 5 Computer. Auf einem weiteren Computer installieren Sie Jarvis selbst; wenn ich das machen soll, kostet die Installation 99 €.'],
    ['Kann ich den Tarif wechseln?', 'Jederzeit. Ein höherer Tarif gilt ab der Zahlung der Differenz, ein niedrigerer ab dem nächsten Zeitraum.'],
    ['Wie wird bezahlt?', 'Per Überweisung auf das in der Bestellung genannte Konto – scannen Sie den SEPA-QR-Code in Ihrer Banking-App oder zahlen Sie per IBAN. Der Monatstarif wird im Voraus für einen Monat bezahlt, der Jahrestarif für 12 Monate. Nach der Zahlung schicke ich Ihnen den Lizenzschlüssel per E-Mail. Die Kartenzahlung kommt noch dazu.'],
    ['Kann ich den Vertrag widerrufen?', 'Ein Verbraucher kann einen im Fernabsatz geschlossenen Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen widerrufen. Verlangt er bei der Bestellung, dass ich früher beginne, zahlt er nur den anteiligen Betrag für die bereits erbrachte Leistung, und nach vollständiger Erbringung der Dienstleistung oder dem Beginn der Bereitstellung digitaler Inhalte erlischt das Widerrufsrecht. Einzelheiten stehen in den Allgemeinen Geschäftsbedingungen.'],
    ['Was, wenn etwas schiefgeht?', 'Nach jedem Update prüft sich Jarvis selbst und hält Fehler fest. Schreiben Sie mir, dann melde ich mich innerhalb der in Ihrem Tarif vorgesehenen Zeit; wenn es brennt, gibt es die Expresshilfe innerhalb von 2 Stunden.']
  ]
};
