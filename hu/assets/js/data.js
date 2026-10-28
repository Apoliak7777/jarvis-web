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
    podmienkyOd: '24. 10. 2026'
  },

  plany: [
    { id: 'start', nazov: 'Start', mesacne: 15, pc: 1, pre: 'Egy embernek, aki mindent egyetlen ablakban szeretne kezelni.',
      body: ['Minden funkció és 70+ alkalmazás', '1 számítógép', 'Folyamatos frissítések és új funkciók', 'E-mailes támogatás 2 munkanapon belül'] },
    { id: 'biznis', nazov: 'Business', mesacne: 29, pc: 3, odporucany: true, pre: 'Egyéni vállalkozónak és kis cégnek, amely a levelezésből és az ügyfelekből él.',
      body: ['Minden a Start csomagból', 'Akár 3 számítógép', 'Jarvis a telefonon – a beállítás az árban', 'Támogatás 1 munkanapon belül', 'Távsegítség havonta egyszer', 'Ellenőrzés és finomhangolás negyedévente'] },
    { id: 'pro', nazov: 'Pro', mesacne: 49, pc: 5, pre: 'Cégnek, amely a Jarvist a saját munkájához szeretné igazítani.',
      body: ['Minden a Business csomagból', 'Akár 5 számítógép', 'Saját offline AI-modell – a beállítás az árban', 'Havonta 1 óra testre szabott munka', 'Támogatás 4 órán belül munkanapokon, telefonon is', 'Az új funkciókat mások előtt kapja meg'] }
  ],
  porovnanie: [
    ['Minden funkció és 70+ alkalmazás', true, true, true],
    ['Számítógépek száma', '1', '3', '5'],
    ['Frissítések és új funkciók', true, true, true],
    ['E-mailes támogatás', '2 munkanapon belül', '1 munkanapon belül', '4 órán belül'],
    ['Telefonos támogatás', false, false, true],
    ['Távsegítség képernyőmegosztással', false, 'havonta 1×', 'igény szerint'],
    ['Jarvis a telefonon (beállítás)', '59 €', 'az árban', 'az árban'],
    ['Saját offline AI-modell (beállítás)', '149 €', '149 €', 'az árban'],
    ['A Jarvis ellenőrzése és finomhangolása', false, 'negyedévente egyszer', 'havonta egyszer'],
    ['Testre szabott munka', false, false, 'havonta 1 óra'],
    ['Új funkciók elsőként (előzetes verziók)', false, false, true]
  ],
  instalaciaObsahuje: [
    'A Jarvis telepítése az Ön számítógépére – távolról, Senec (Szenc) és Bratislava (Pozsony) környékén személyesen is',
    'Az AI-fiókjai (ChatGPT, Claude, Gemini) vagy ingyenes AI-szolgáltatások csatlakoztatása',
    'Levelezés (az összes postafiókja), naptár és WhatsApp csatlakoztatása',
    'Beállítás az Ön munkájához: menü, cégek, árak, aláírás és a válaszok stílusa',
    'Névjegyek importálása egy forrásból (Excel, Outlook vagy telefon)',
    '60 perc betanítás, amíg el nem igazodik benne',
    '14 nap elsőbbségi segítség a telepítés után',
    'Licenc az első számítógépre'
  ],

  /* Obchod. kategoria: plany | doplnky | sluzby | baliky. cena = jednorazovo; plán má cenu z plany[]. */
  kategorie: [
    { id: 'plany', nazov: 'Telepítés és csomagok' },
    { id: 'doplnky', nazov: 'Kiegészítők' },
    { id: 'rozsirenia', nazov: 'Céges bővítmények' },
    { id: 'sluzby', nazov: 'Szolgáltatások' },
    { id: 'baliky', nazov: 'Csomagajánlatok' }
  ],
  produkty: [
    { id: 'instalacia', kategoria: 'plany', nazov: 'A Jarvis telepítése és beállítása', cena: 500, ikona: 'install',
      kratko: 'A Jarvis telepítve és az Ön munkájához beállítva. Az első megrendelésnél kötelező.',
      popis: 'A Jarvist úgy telepítem és állítom be, hogy már az első naptól valódi munkára használhassa – ne csak kipróbálásra. Összekapcsoljuk az AI-fiókjait, a levelezését és a naptárát, beállítjuk a cégeit, az árait és a válaszok stílusát, és egy óra alatt megmutatok mindent, ami fontos.',
      obsahuje: 'instalacia', poznamka: 'Egyszer kell fizetni. A telepítéshez havi vagy éves csomagot választ.' },
    { id: 'plan-start', kategoria: 'plany', plan: 'start', nazov: 'Start csomag', ikona: 'plan',
      kratko: '1 számítógép, minden funkció, frissítések és e-mailes támogatás.',
      popis: 'A teljes Jarvis minden funkcióval egy embernek, egy számítógépen. A frissítések és az új funkciók maguktól érkeznek, a kérdésekre e-mailben 2 munkanapon belül válaszolok.' },
    { id: 'plan-biznis', kategoria: 'plany', plan: 'biznis', nazov: 'Business csomag', ikona: 'plan',
      kratko: 'Akár 3 számítógép, Jarvis a telefonon és gyorsabb támogatás.',
      popis: 'Egyéni vállalkozónak vagy kis cégnek: a Jarvis akár három számítógépen, telefonon (a beállítás az árban), támogatás egy munkanapon belül, havonta egyszer távsegítség, negyedévente pedig ellenőrzés, hogy minden úgy fut-e, ahogy kell.' },
    { id: 'plan-pro', kategoria: 'plany', plan: 'pro', nazov: 'Pro csomag', ikona: 'plan',
      kratko: 'Akár 5 számítógép, offline AI, havonta egy óra testre szabott munka.',
      popis: 'A cégéhez igazított Jarvis: akár öt számítógép, saját offline AI-modell beállítva az árban, havonta egy óra testre szabott munka (új funkció, automatizálás, integráció), és támogatás munkanapokon 4 órán belül, telefonon is.' },

    { id: 'dalsi-pc', kategoria: 'doplnky', nazov: 'Jarvis egy további számítógépre', cena: 99, ikona: 'pc', mnozstvo: true,
      kratko: 'Telepítés és beállítás egy további számítógépen a csomagja keretében.',
      popis: 'Telepítem a Jarvist a cége egy további számítógépére, és csatlakoztatom hozzá az adott ember fiókjait. A számítógépek számát a csomag határozza meg (Start 1, Business 3, Pro 5); ha többre van szüksége, elég egy magasabb csomag.' },
    { id: 'mobil', kategoria: 'doplnky', nazov: 'Jarvis a telefonon', cena: 59, ikona: 'phone', vCene: ['biznis', 'pro'],
      kratko: 'A teljes Jarvis a telefonján, az Ön számítógépével létesített privát, titkosított kapcsolaton keresztül.',
      popis: 'A Jarvis iPhone-on és Androidon: csevegés, posta, feladatok, napi áttekintés, igen/nem jóváhagyás és értesítések. A kapcsolat az Ön telefonja és számítógépe közötti privát, titkosított hálózaton keresztül megy – az internetről senki nem látja. A telefonról megadott feladat akkor is végigfut a számítógépen, ha lezárja a telefont.',
      poznamka: 'A Business és a Pro csomagban a beállítás az árban van. A számítógépnek be kell lennie kapcsolva.' },
    { id: 'offline-ai', kategoria: 'doplnky', nazov: 'Saját offline AI-modell', cena: 149, ikona: 'chip', vCene: ['pro'],
      kratko: 'AI, amely csak az Ön számítógépén fut. Semmi nem kerül ki az internetre.',
      popis: 'Telepítek és finomhangolok egy nyelvi modellt, amely közvetlenül az Ön videokártyáján fut. A Jarvis érzékeny dolgokra (levelezés, szerződések, a cég számai) és tartalékként használja, ha nincs internet vagy előfizetés. A megrendelés előtt ellenőrzöm, hogy a számítógépe bírja-e.',
      poznamka: 'Ajánlott: 12 GB memóriás NVIDIA videokártya vagy 32 GB RAM. A Pro csomagban az árban van.' },
    { id: 'obchodnik', kategoria: 'doplnky', nazov: 'Testre szabott Kereskedő', cena: 149, ikona: 'deal',
      kratko: 'Érdeklődők a postafiókokból, az Ön stílusában megírt válaszok és fizetési emlékeztetők.',
      popis: 'A Kereskedőt az Ön üzletére állítom be: mit árul, milyenek az árai, hogyan válaszol, és mi a következő lépés. A Jarvis ezután 15 percenként átnézi a céges postafiókokat, az érdeklődőket felveszi az Ügyfelek közé, jóváhagyásra előkészíti a választ, és emlékeztet a válasz nélkül maradt ajánlatra és a ki nem fizetett munkára is.' },
    { id: 'prenos-dat', kategoria: 'doplnky', nazov: 'Névjegyek és adatok átvitele', cena: 79, ikona: 'import',
      kratko: 'Névjegyek és ügyfelek több forrásból – Excel, régi CRM, Outlook, telefon.',
      popis: 'Átviszem a névjegyeit, ügyfeleit és jegyzeteit több forrásból a Jarvisba, összevonom az ismétlődéseket, ellenőrzöm az e-mail-címeket, és a cégekhez kiegészítem az adatokat a nyilvántartásból az IČO (szlovák cégazonosító) alapján.' },
    { id: 'hlas', kategoria: 'doplnky', nazov: 'Testre szabott hang és diktálás', cena: 49, ikona: 'mic',
      kratko: 'Mikrofon, saját nevek és kifejezések szótára, billentyűparancsok.',
      popis: 'Úgy állítom be a diktálást, hogy értse az Ön munkáját: az ügyfelek, termékek és szakkifejezések szótára, billentyűk a diktáláshoz bármelyik ablakba, valamint fordítás angolra. Az átírás offline, az Ön számítógépén fut.' },
    { id: 'automatizacia', kategoria: 'doplnky', nazov: 'Testre szabott automatizálás', cena: 149, ikona: 'auto', mnozstvo: true,
      kratko: 'Egy ismétlődő feladat, amelyet a Jarvis magától elvégez – pl. a levelezésben érkező számlák Excelbe gyűjtése.',
      popis: 'Kiválasztunk egy olyan dolgot, amelyet Ön újra és újra elvégez, a Jarvis pedig a beállított időpontban magától csinálja: a levelezésben érkező számlák táblázatba gyűjtése, reggeli áttekintés a levelezésről és a feladatokról, a weboldal és a webáruház ellenőrzése, heti bevételi összesítő. Küldés vagy fizetés előtt mindig rákérdez.' },
    { id: 'odoo', kategoria: 'doplnky', nazov: 'Odoo-integráció', cena: 290, ikona: 'link',
      kratko: 'A Jarvis olvas az Ön Odoo-jából és ír bele – megrendelések, kapcsolatok, számlák.',
      popis: 'Az API-n keresztül összekapcsolom a Jarvist az Ön Odoo rendszerével: megkeres egy megrendelést vagy számlát, rögzít egy új kapcsolatot vagy feladatot, és áttekintést készít. Az alapintegráció legfeljebb 5 típusú rekordot fed le; a nagyobb terjedelmet előre megbeszéljük.' },
    { id: 'prepojenie', kategoria: 'doplnky', nazov: 'Integráció az Ön rendszerével', cena: 190, ikona: 'link',
      kratko: 'Pohoda, Money S3, SuperFaktúra, Shoptet, WooCommerce, Google Workspace vagy Microsoft 365.',
      popis: 'Összekapcsolom a Jarvist azzal a rendszerrel, amelyet a cégében már használ – könyvelőprogram (Pohoda, Money S3), számlázás (SuperFaktúra), webáruház (Shoptet, WooCommerce) vagy Google Workspace, illetve Microsoft 365. A Jarvis olvas belőle, és ír bele. Az ár egy rendszer alapintegrációjára érvényes; a nagyobb terjedelmet előre megbeszéljük.' },
    { id: 'postupy', kategoria: 'doplnky', nazov: 'Céges munkafolyamatok', cena: 149, ikona: 'auto',
      kratko: '5 „ha reklamáció érkezik, tedd ezt” típusú munkafolyamat – a Jarvis lépésről lépésre betartja őket.',
      popis: 'Együtt leírunk öt olyan dolgot, amelyet a cégében mindig ugyanúgy csinálnak (reklamáció, új ügyfél, anyagrendelés, ajánlat, havi zárás), és munkafolyamatként beállítom őket a Jarvisban. Ha azt mondja: „reklamáció érkezett”, a Jarvis pontosan az Ön szabályai szerint jár el.' },
    { id: 'vzhlad', kategoria: 'doplnky', nazov: 'Céges megjelenés', cena: 99, ikona: 'palette', pripravujeme: true,
      kratko: 'A cége logója, színei és neve a Jarvisban.',
      popis: 'A Jarvis a cége színeiben, az Ön logójával és nevével („Jarvis · Bagoly Kávézó”), üdvözléssel a munkatársaknak és céges aláírással a válaszokban.' },

    /* Rozšírenia pre firmy: mesačne ku plánu, platia spolu s licenciou (v kľúči pole m). pripravujeme = zatiaľ sa nedá kúpiť. */
    { id: 'modul-reporty', modul: 'reporty', kategoria: 'rozsirenia', nazov: 'Áttekintés a tulajdonosnak', mesacne: 5, ikona: 'chart', snimka: 'modul_prehlad',
      kratko: 'Minden hétfőn összefoglaló: bevételek, érdeklődők, kifizetetlen tételek és lejárt határidejű feladatok.',
      popis: 'Minden hétfő reggel megkapja a cég összefoglalóját: bevételek és kiadások az előző héthez és hónaphoz képest, új érdeklődők, nyitott ajánlatok, mi vár kifizetésre, és mely feladatok határideje járt le. A hónap végén PDF-ben a zárás, amelyet elküldhet a társtulajdonosnak vagy a könyvelőnek.' },
    { id: 'modul-hovory', modul: 'hovory', kategoria: 'rozsirenia', nazov: 'Hívások és megbeszélések a CRM-be', mesacne: 9, ikona: 'phonecall', snimka: 'modul_hovory_navrh',
      kratko: 'Felvett hívás vagy megbeszélés → átirat, összefoglaló és feladatok egyenesen az ügyfélhez.',
      popis: 'Vegyen fel egy ügyfélhívást vagy megbeszélést, és a Jarvis átiratot készít belőle arról, hogy ki mit mondott, rövid összefoglalót és feladatokat. Mindent a megfelelő ügyfélhez rögzít, a feladatokat pedig a táblára teszi. Az átírás offline, az Ön számítógépén fut.' },
    { id: 'modul-faktury', modul: 'faktury', kategoria: 'rozsirenia', nazov: 'Számlák és fizetési felszólítások', mesacne: 9, ikona: 'invoice', snimka: 'modul_faktury',
      kratko: 'Számla QR-kóddal egy kattintással, e-számla a 2027-es évre és a kifizetések követése.',
      popis: 'A fizetési QR-kóddal ellátott számlát közvetlenül az ügyfél adatlapjáról állíthatja ki – számozással, PDF-ben, és rögtön Peppol e-számlaként is a 2027-től kötelező e-számlázáshoz. Egy kattintással elküldheti e-mailben, rögzül az Üzletben, a Jarvis pedig őrzi a fizetési határidőt: a lejárat után 3 és 14 nappal előkészít egy fizetési felszólítást, amelyet Önnek csak ellenőriznie és elküldenie kell. Áfafizetőknek és nem áfafizetőknek egyaránt működik.' },
    { id: 'modul-doklady', modul: 'doklady', kategoria: 'rozsirenia', nazov: 'Bizonylatok a levelezésből', mesacne: 9, ikona: 'mail', snimka: 'modul_doklady',
      kratko: 'Számlák és nyugták a levelezésből és a telefonról egy táblázatba a könyvelőnek.',
      popis: 'A Jarvis naponta egyszer megkeresi a levelezésben a beérkezett számlákat és e-számlákat, elolvassa a lefényképezett nyugtát is, és kiírja a szállítót, az összeget, az áfát, a fizetési határidőt, az IBAN-t és a változó szimbólumot (VS). Ön az adatokat csak ellenőrzi, és egy kattintással rögzíti a kiadások közé; amit ki kell fizetni, azt a telefonon QR-kóddal egyenlítheti ki. A hónap végén előkészíti a csomagot a könyvelőnek – Excel-táblázatot és az összes bizonylatot egyetlen ZIP-fájlban.' },
    { id: 'modul-znalosti', modul: 'znalosti', kategoria: 'rozsirenia', nazov: 'Céges tudásbázis', mesacne: 9, ikona: 'book', pripravujeme: true,
      kratko: 'A Jarvis megtanulja az árlistáit, eljárásait és szerződéseit, és ezek alapján válaszol.',
      popis: 'Átadja a Jarvisnak a céges dokumentumokat – árlistákat, eljárásokat, szerződéseket, válaszokat a gyakori kérdésekre –, és ő ezek alapján válaszol, a forrásra való hivatkozással is. Az új munkatárs a Jarvist kérdezi Ön helyett, és a válaszok mindig az érvényes árlista szerintiek.' },
    { id: 'modul-sukromie', modul: 'sukromie', kategoria: 'rozsirenia', nazov: 'Privát mód', mesacne: 9, ikona: 'lock', pripravujeme: true,
      kratko: 'A posta és az ügyfelek csak offline AI-n keresztül, napló és mentések a céges lemezre.',
      popis: 'Érzékeny adatokkal dolgozó cégeknek: a levelezés, az ügyfelek és a szerződések kizárólag az Ön számítógépén lévő AI-modellhez kerülnek, soha nem a felhőbe. A napló megmutatja, ki mit csinált, az adatok pedig minden nap titkosítva mentődnek a céges lemezre vagy NAS-ra. Offline AI-modellt igényel.' },
    { id: 'modul-recenzie', modul: 'recenzie', kategoria: 'rozsirenia', nazov: 'Értékelések és hírnév', mesacne: 5, ikona: 'star', pripravujeme: true,
      kratko: 'A Google-értékelések figyelése és válaszok az Ön stílusában, NFC-kártyák új értékelésekhez.',
      popis: 'A Jarvis figyeli a cége új Google-értékeléseit, rossz értékelésnél jelentkezik, és az Ön stílusában előkészít egy választ. Ehhez jönnek a ťukni NFC-kártyák a pultra – a vásárló hozzáérinti a telefonját, és azonnal írja az értékelést.' },
    { id: 'modul-sklad', modul: 'sklad', kategoria: 'rozsirenia', nazov: 'Raktár és rendelések', mesacne: 9, ikona: 'pack', pripravujeme: true,
      kratko: 'Egyszerű raktár, figyelmeztetés minimális készletre és rendelés egy kattintással.',
      popis: 'Egyszerű raktár bonyolult rendszer nélkül: áru és anyag, minimális készletek és figyelmeztetés, ha valami fogytán van. A beszállítónak szóló rendelést a Jarvis e-mailként készíti elő, Önnek csak el kell küldenie.' },
    { id: 'modul-tim', modul: 'tim', kategoria: 'rozsirenia', nazov: 'Csapat', mesacne: 5, zaCloveka: true, ikona: 'team', pripravujeme: true,
      kratko: 'Közös ügyfelek, feladatok és jegyzetek mindenkinek a cégnél.',
      popis: 'Az egész cég számára közös ügyfelek, feladatok és jegyzetek: ki melyik megrendelésért felel, mi van kész, és mi késik. Az egyik számítógépen végzett módosítás azonnal megjelenik a többin.' },
    { id: 'modul-rezervacie', modul: 'rezervacie', kategoria: 'rozsirenia', nazov: 'Online foglalások', mesacne: 15, ikona: 'plan', pripravujeme: true,
      kratko: 'Foglalási oldal az ügyfeleinek, az időpontok egyenesen a Jarvis naptárában.',
      popis: 'Az ügyfelei maguk foglalnak időpontot az Ön oldalán (szalon, szerviz, tanácsadás, tanfolyamok), és az időpont azonnal megjelenik a Jarvis naptárában. Az ügyfelek az időpont előtt emlékeztetőt kapnak, Ön pedig az egész napot egy helyen látja.' },

    { id: 'appka', kategoria: 'sluzby', nazov: 'Testre szabott alkalmazás a Jarvisban', cena: 490, ikona: 'app',
      kratko: 'Kis alkalmazás pontosan az Ön üzletéhez – nyilvántartás, kalkulátor, űrlap.',
      popis: 'Megprogramozom azt az alkalmazást, amely az Ön üzletéből hiányzik, és hozzáadom a Jarvishoz: nyilvántartás (pl. megrendelések, autók, felülvizsgálatok), árkalkulátor, megrendelési űrlap vagy áttekintés. Az ár kis alkalmazásra érvényes; a nagyobbat előre megbeszéljük.' },
    { id: 'hodina', kategoria: 'sluzby', nazov: 'Egy óra testre szabott munka', cena: 45, ikona: 'clock', mnozstvo: true,
      kratko: 'Módosítás, új funkció, integráció vagy segítség – órákban számlázva.',
      popis: 'Egy óra az én munkámból az Ön Jarvisán: a viselkedés módosítása, új funkció, integráció egy Ön által használt szolgáltatással, vagy segítség bármiben a Jarvis körül.' },
    { id: 'balik-5h', kategoria: 'sluzby', nazov: '5 órás munkacsomag', cena: 199, ikona: 'clock',
      kratko: '5 óra testre szabott munka kedvezőbben, 6 hónapig érvényes.',
      popis: 'Öt óra testre szabott munka, amelyet fokozatosan, 6 hónap alatt vehet igénybe. Az egyedi órákhoz képest 26 € megtakarítás.' },
    { id: 'skolenie', kategoria: 'sluzby', nazov: 'A csapat online betanítása', cena: 89, ikona: 'team',
      kratko: '90 perc a cége munkatársainak, legfeljebb 6 résztvevővel.',
      popis: 'Online betanítás a csapatának: hogyan kérdezze a Jarvist, hogyan dolgozzon a levelezéssel, a feladatokkal és az ügyfelekkel, és mit tegyen, ha valami nem működik. Legfeljebb 6 résztvevő, 90 perc, felvétellel.' },
    { id: 'prenos-pc', kategoria: 'sluzby', nazov: 'A Jarvis áthelyezése új számítógépre', cena: 79, ikona: 'move',
      kratko: 'Új számítógép, ugyanaz a Jarvis – minden adattal és bejelentkezéssel.',
      popis: 'Új számítógépet vásárol? Áthelyezem a Jarvist az összes adattal, előzménnyel és beállítással együtt, csatlakoztatom a fiókokat, és ellenőrzöm, hogy minden úgy működik-e, mint azelőtt.' },
    { id: 'expres', kategoria: 'sluzby', nazov: 'Expressz segítség 2 órán belül', cena: 39, ikona: 'bolt',
      kratko: 'Ha ég a ház: munkanapon 2 órán belül jelentkezem.',
      popis: 'Egyszeri segítség, ha a dolog nem várhat: munkanapon 8:00 és 18:00 között 2 órán belül jelentkezem, és a problémát képernyőmegosztással megoldjuk.' },

    { id: 'balik-zivnostnik', kategoria: 'baliky', nazov: 'Jarvis egyéni vállalkozónak', cena: 899, povodne: 1028, ikona: 'pack', balik: { plan: 'biznis', mesiacov: 12 },
      kratko: 'Telepítés, Business csomag 12 hónapra, testre szabott Kereskedő és betanítás.',
      popis: 'Minden, amire egy egyéni vállalkozónak az első évben szüksége van: telepítés és beállítás, Business csomag 12 hónapra (akár 3 számítógép, Jarvis a telefonon), az Ön üzletére beállított Kereskedő és online betanítás.',
      vBaliku: ['A Jarvis telepítése és beállítása', 'Business csomag 12 hónapra', 'Jarvis a telefonon', 'Testre szabott Kereskedő', 'Online betanítás (90 perc)'] },
    { id: 'balik-firma', kategoria: 'baliky', nazov: 'Jarvis cégnek', cena: 1190, povodne: 1356, ikona: 'pack', balik: { plan: 'pro', mesiacov: 12 },
      kratko: 'Telepítés, Pro csomag 12 hónapra, 2 további számítógép, adatátvitel és a csapat betanítása.',
      popis: 'Jarvis az egész kis cégnek az első évre: telepítés, Pro csomag 12 hónapra (offline AI és havonta egy óra testre szabott munka), Jarvis két további számítógépen, névjegyek és adatok átvitele, valamint a csapat betanítása.',
      vBaliku: ['A Jarvis telepítése és beállítása', 'Pro csomag 12 hónapra', 'Jarvis 2 további számítógépen', 'Saját offline AI-modell', 'Névjegyek és adatok átvitele', 'A csapat online betanítása (90 perc)'] },

    { id: 'predlzenie', kategoria: 'skryte', nazov: 'Licenc meghosszabbítása', ikona: 'plan',
      kratko: 'A Jarvis előfizetése a következő időszakra.', popis: 'Az Ön Jarvis-licencének meghosszabbítása egy újabb időszakra a csomag szerint.' }
  ],

  /* Odvetvové balíky rozšírení (stránka Pre firmy): moduly + nastavenie pre odbor lacnejšie ako samostatne. */
  odvetvia: [
    { id: 'uctovnictvo', nazov: 'Könyvelőiroda', ikona: 'invoice', mesacne: 19, moduly: ['doklady', 'faktury', 'znalosti'], navyse: 'Áfa- és adóhatáridők a Határidők alkalmazásban',
      text: 'Az ügyfelek bizonylatai a levelezésből egyenesen táblázatokba, számlák fizetési felszólításokkal és válaszok az Ön munkafolyamatai szerint.' },
    { id: 'remeslo', nazov: 'Iparos és építőipari cég', ikona: 'deal', mesacne: 15, moduly: ['faktury', 'hovory'], navyse: 'Építkezési fotók a telefonról a megrendeléshez',
      text: 'Ajánlat, megrendelés, fotók az építkezésről, munkaidő-kimutatás és számla – minden egy ügyfélnél.' },
    { id: 'eshop', nazov: 'Webáruház', ikona: 'cart', mesacne: 19, moduly: ['faktury', 'recenzie', 'doklady'], navyse: 'Shoptet- vagy WooCommerce-integráció az árban',
      text: 'A webáruház rendelései, válaszok az ügyfeleknek az Ön stílusában, értékelések és bizonylatok a könyvelőnek.' },
    { id: 'salon', nazov: 'Szalon és szolgáltatások', ikona: 'plan', mesacne: 15, moduly: ['rezervacie', 'recenzie'], navyse: 'Időpont-emlékeztetők az ügyfeleknek',
      text: 'Az ügyfelek maguk foglalnak, a Jarvis emlékezteti őket az időpontra, és a látogatás után értékelést kér.' },
    { id: 'gastro', nazov: 'Vendéglátás', ikona: 'pack', mesacne: 15, moduly: ['sklad', 'reporty', 'recenzie'], navyse: 'Rendelések a beszállítóknak e-mailben',
      text: 'Alapanyag-raktár figyelmeztetéssel, rendelések a beszállítóknak, heti bevételi áttekintés és a vendégek értékelései.' }
  ],

  /* Hlavné časti Jarvisa (stránka Funkcie a úvod). */
  casti: [
    { id: 'ai', nazov: 'AI-csevegés az összes AI-jával', text: 'ChatGPT, Claude és Gemini az Ön előfizetésével, egyetlen ablakban, mellettük ingyenes AI-szolgáltatások és offline modell. A Jarvis maga választja ki a modellt és a válasz mélységét; ha az egyik fiók eléri a korlátját, folytatja a következő. Akár 6 feladat egyszerre, különböző csevegésekben.' },
    { id: 'agent', nazov: 'Elvégzi a munkát a számítógépen', text: 'PDF-, Word- és Excel-fájlokat olvas és készít, dokumentumokat fűz össze és tölt ki, a böngészőben az Ön bejelentkezéseivel dolgozik, és kezeli a programok ablakait. Küldés, fizetés, vásárlás vagy törlés előtt mindig rákérdez. Jelszót soha nem ír be.' },
    { id: 'posta', nazov: 'Posta teljes hozzáféréssel', text: 'A Gmail és a céges postafiókok egy helyen. Elég azt mondania: „nézd meg a leveleimet”, és kap egy összefoglalót hivatkozásokkal, egy üzenethez pedig válaszjavaslatot, amelyet két kattintással elküldhet. A lényegtelen és a kézbesíthetetlen leveleket egyetlen gombbal kitakaríthatja.' },
    { id: 'obchodnik', nazov: 'Kereskedő', text: '15 percenként átnézi a céges postafiókokat, az érdeklődőket felveszi az Ügyfelek közé, az Ön stílusában előkészíti a választ, és emlékeztet a válasz nélkül maradt ajánlatra és a ki nem fizetett munkára is. Magától semmi nem megy ki.' },
    { id: 'biznis', nazov: 'Üzlet és ügyfelek', text: 'Bevételek és kiadások havi bontásban, havi cél, mi vár még kifizetésre, a weboldalai és tanúsítványai állapota. Ügyfelek az érdeklődéstől a kifizetésig, árajánlatok PDF-ben, valamint cégadatbázis a nyilvántartásból az IČO (szlovák cégazonosító) alapján.' },
    { id: 'ulohy', nazov: 'Feladatok, naptár és emlékeztetők', text: 'Saját tábla, mint a Trello: határidőkkel, címkékkel és ismétléssel; a feladatot egyetlen mondattal felveheti: „holnap 9-kor felhívni a beszállítót”. Naptár ünnepnapokkal és névnapokkal, ébresztő, időzítő és emlékeztetők.' },
    { id: 'hlas', nazov: 'Hang és megbeszélések jegyzőkönyvei', text: 'Tartson lenyomva egy billentyűt, és diktáljon bármelyik ablakba – az átírás offline, az Ön videokártyáján fut. Vegyen fel egy megbeszélést vagy hívást, és megkapja az átiratot a beszélők megnevezésével, valamint a feladatokat tartalmazó jegyzőkönyvet.' },
    { id: 'automatizacia', nazov: 'Automatizálás', text: 'Ütemezzen be olyan munkát, amelyet a Jarvis magától elvégez: minden reggel levelezési összefoglaló, pénteken a levelezésben érkezett számlák Excelbe gyűjtése, 4 óránként a weboldal ellenőrzése. Ha az Ön jóváhagyására van szükség, értesítést küld, és megvárja.' },
    { id: 'mobil', nazov: 'Jarvis a telefonon', text: 'Csevegés, posta, feladatok és jóváhagyás a telefonon, az Ön számítógépével létesített privát, titkosított kapcsolaton keresztül. A telefonról indított feladat akkor is végigfut a számítógépen, ha lezárja a telefont.' },
    { id: 'okno', nazov: 'Minden egy ablakban', text: 'Böngésző lapokkal és jelszavakkal, fájlok Word-, Excel- és PDF-előnézettel, terminál, WhatsApp, Teams és Discord – nem kell kilépnie a Jarvisból. A Ctrl + K bármit megtalál, az Alt + S képernyőkivágást készít.' },
    { id: 'efaktury', nazov: 'E-számlák, készen a 2027-es évre', text: 'E-számlák ellenőrzése, megjelenítése és kiállítása az EN 16931 európai szabvány és a Peppol BIS 3.0 szerint, teljesen offline. A levélmellékletben érkezett e-számlát egyetlen kattintással ellenőrizheti.' },
    { id: 'sukromie', nazov: 'Adatvédelem és biztonság', text: 'Az adatai az Ön számítógépén vannak, a jelszavakat a Windows titkosítja, és az AI soha nem kapja meg őket. Vírusirtó és VPN egy kattintással; az Inkognitó a GDPR alapján kéri a cégektől az Ön adatainak törlését.' }
  ],

  /* Appky v Jarvisovi (podľa Jarvis\public\mini\catalog.json, bez Generátora licencií – ten má len predajca). */
  appky: [
    { kategoria: 'Mindennapi', polozky: [
      ['Jegyzetek', 'Gyors jegyzetek kereséssel, kitűzéssel és AI-s szerkesztéssel'],
      ['Időjárás', 'Jelenlegi, óránkénti és 7 napos előrejelzés az Ön városára'],
      ['Óra', 'Időzítő, stopper, ébresztő, Pomodoro, emlékeztetők, visszaszámlálások és világidő'],
      ['Számológép', 'Számítások előzményekkel, áfa, százalékok, mértékegységek és pénznemek az EKB szerint'],
      ['Fordító', 'Szövegfordítás és -szerkesztés az Ön AI-ja segítségével, 12 nyelven'],
      ['Rádió', 'Szlovák és világrádiók élőben, a kedvencek kéznél'],
      ['Vágólap', 'Amit másolt – újra egy kattintással, kitűzött szövegek'],
      ['Szokások', 'Napi szokások sorozatokkal és egész éves térképpel'],
      ['Naptár', 'A hónap ünnepnapokkal és névnapokkal, események emlékeztetővel'],
      ['Diktafon', 'Hangjegyzetek szöveggé alakítva közvetlenül a számítógépen'],
      ['Pénz', 'Bevételek és kiadások havonta, kategóriák és előfizetések'],
      ['Részvények', 'Részvények, ETF-ek és kriptovaluták – grafikon, a cég pénzügyi adatai, elemzők, hírek, portfólió euróban és árfigyelmeztetések'],
      ['Cikkolvasó', 'Cikk reklámok és felugró ablakok nélkül, AI-összefoglaló és felolvasás'],
      ['Gyakorlat', 'Intervallumedzés – Tabata, HIIT, plank, a Jarvis bemondja a gyakorlatokat'],
      ['Dátumok és határidők', 'A határidő utolsó napja a törvény szerint, munkanapok, ünnepnapok és munkaidőkeret'],
      ['Ki kinek mennyit', 'Közös kiadások kiránduláson vagy nyaralóban – ki kinek mennyit küld, a lehető legkevesebb utalással']
    ] },
    { kategoria: 'Munka', polozky: [
      ['Kereskedő', 'Érdeklődők a postafiókokból, előkészített válaszok és emlékeztetők – Önnek csak el kell küldenie'],
      ['Ügyfelek · CRM', 'Megrendelések az érdeklődéstől a kifizetésig, személyek és cégek az utolsó kapcsolatfelvétellel és a következő lépéssel'],
      ['Kapcsolat-adatbázis', 'Cégek és személyek telefonszámokkal – a levelezésből, Excelből és weboldalakról; a nyilvántartásból az IČO (szlovák cégazonosító) alapján az ügyvezetők és a bevétel'],
      ['Árajánlat', 'Ajánlat az ügyfélnek tételekkel és áfával PDF-ben egy kattintással'],
      ['Szövegek a cégnek', 'Bejegyzések, válaszok az értékelésekre, ajánlatok e-mailben és hirdetések AI-jal'],
      ['Megbeszélés jegyzőkönyve', 'Vegyen fel egy hívást vagy megbeszélést – átirat a beszélők megnevezésével és AI-jegyzőkönyv feladatokkal'],
      ['Munkaidő-kimutatás', 'Stopper projektekhez és ügyfelekhez, órák × díj, kimutatás az ügyfélnek és CSV'],
      ['PDF-eszközök', 'Oldalak összefűzése, szétszedése, forgatása és átrendezése, képek PDF-be'],
      ['Szöveg a képről', 'Szöveg képernyőképről vagy képről, offline a Windowsban'],
      ['QR-kódok', 'QR-kód hivatkozáshoz, Wi-Fi-hez, névjegyhez és PAY by square QR-fizetéshez'],
      ['Kapcsolatok és táblázatok', 'CSV és Excel: ismétlődések törlése, e-mail-címek ellenőrzése, szűrés, felosztás'],
      ['Képernyőképek', 'Képernyőkép nyilakkal, keretekkel, szöveggel és az érzékeny dolgok kitakarásával'],
      ['Képernyőfelvétel', 'Képernyő vagy ablak hanggal és mikrofonnal videóba'],
      ['Videó és hang', 'Videó a megadott MB-méret alá, kivágott részlet, hang MP3-ba, GIF'],
      ['Oldalőr', 'Weboldalakat figyel (pályázati felhívások, árak, hirdetések), és jelentkezik, ha valami változik rajtuk'],
      ['Webhely-ellenőrzés', 'A weboldal SEO-ja és technikai állapota néhány másodperc alatt – tanácsokkal, mit érdemes javítani'],
      ['Webhely-áttekintés', 'Az egész webhely oldalról oldalra – hibás hivatkozások, SEO-hibák, sitemap.xml'],
      ['SEO-kód a webhelyhez', 'Cím, leírás, megosztás, cég a Google számára és robots.txt – Google-előnézettel'],
      ['Képek webre', 'Kicsinyítés és átalakítás WebP-be vagy JPEG-be, akár sokat egyszerre'],
      ['Favicon és ikonok', 'A logóból a webhely összes ikonja – favicon.ico, Apple, Android, manifest'],
      ['Színek', 'Árnyalatok, WCAG szerinti kontraszt, pipetta és mentett paletták']
    ] },
    { kategoria: 'Fejlesztés', polozky: [
      ['HTML-tesztelő', 'Illessze be a HTML-kódot, és azonnal látja a weboldalt számítógépen, táblagépen és telefonon, a hibákat pirossal jelölve'],
      ['Szerverek · WinSCP', 'Fájlok a szervereken SFTP-n, FTP-n és SCP-n keresztül – feltöltés, letöltés, szerkesztés'],
      ['Odoo-műhely', 'Az Odoo 17 – 20 szerverműveleteinek kódja offline ellenőrizve, a moduljai zip-fájlban'],
      ['Fejlesztő', 'JSON, Base64, URL, hash, UUID, JWT, idő és regex'],
      ['Szöveg', 'Számláló, ékezetek nélkül, slug, nagy- és kisbetűk, sorok'],
      ['Jelszavak', 'Erős jelszavak és könnyen megjegyezhető kifejezések, jelszóerősség'],
      ['Szövegek összehasonlítása', 'Mi került be és mi tűnt el a szöveg két változata között'],
      ['Szimbólumok és emojik', 'Idézőjelek, gondolatjelek, €, ×, nyilak és szó alapján kereshető emojik']
    ] },
    { kategoria: 'Számítógép', polozky: [
      ['Lemez', 'Mi foglalja a helyet a lemezen, mappáról mappára'],
      ['Internetsebesség', 'Ping, letöltés és feltöltés, mérési előzmények'],
      ['Hálózat és DNS', 'DNS, e-mail-domain (SPF, DKIM, DMARC), SSL-tanúsítvány, ping, portok'],
      ['A számítógépről', 'Processzor, videokártya, memória, lemezek, akkumulátor és Windows'],
      ['Programok a Jarvisban', 'Git, Node.js és Ollama közvetlenül a Jarvisban, különálló alkalmazások helyett'],
      ['Tömeges átnevezés', 'Sok fájl egyszerre – ékezetek nélkül, számozás, keresés és csere, visszavonás'],
      ['Ismétlődő fájlok', 'Tartalom szerint azonos fájlok – a felesleges másolatok a Lomtárba, egy mindig megmarad'],
      ['Gépnél töltött idő', 'Mennyi időt tölt melyik programban – napokra bontva, egy kattintással a Munkaidő-kimutatásba'],
      ['Rendrakó', 'A Letöltések tartalmát mappákba rendezi – semmit nem töröl, visszavonható']
    ] },
    { kategoria: 'Tanulás', polozky: [
      ['Szókincs', 'Kártyák ismétléssel a megfelelő időben – az AI szövegből készíti őket'],
      ['Tízujjas gépelés', 'A gépelés sebessége és pontossága szlovák szövegeken'],
      ['Lexikon', 'Wikipédia szlovákul közvetlenül a Jarvisban, összefoglaló és felolvasás'],
      ['Kvíz', 'AI-kvíz bármilyen témában – érettségire is, magyarázattal'],
      ['Függvénygrafikon', 'Függvények, mint az iskolában – grafikon, zérushelyek, metszéspontok és értéktáblázat'],
      ['Földrajz', 'Zászlók és fővárosok – kvíz Európáról és az egész világról']
    ] },
    { kategoria: 'Játékok', polozky: [
      ['2048', 'Egyesítse a számokat egészen 2048-ig'], ['Sudoku', 'Három nehézségi szint, jegyzetek, ellenőrzés és idő'],
      ['Amőba', 'Öt egy sorban a Jarvis ellen'], ['Memóriajáték', 'Keresse meg a párokat, rekordok méret szerint'],
      ['Kígyó', 'A klasszikus kígyó, egyre gyorsabb'], ['Véletlen', 'Dobókocka, pénzfeldobás, véletlen szám és csapatokba osztás'],
      ['Sakk', 'Sakk a Jarvis ellen három szinten'], ['Aknakereső', 'Aknakeresés, az első kattintás mindig biztonságos'],
      ['Kockák', 'Hulló kockák árnyékkal és a kocka félretételével'], ['Pasziánsz', 'Klondike 1 vagy 3 lap húzásával'],
      ['Négy egy sorban', 'Négy egy sorban a Jarvis ellen vagy kettesben'], ['Slovko', 'Szlovák Wordle, minden nap új szó'],
      ['Arkanoid', 'Ütő, labda és téglák – 6 pálya']
    ] }
  ],

  otazky: [
    ['Milyen számítógépen fut a Jarvis?', 'Windows 10 vagy 11 rendszeren (64 bites). Legalább 16 GB RAM-ot ajánlunk. Saját offline AI-modellhez 12 GB memóriás NVIDIA videokártya vagy 32 GB RAM megfelelő – a megrendelés előtt szívesen megnézem a számítógépét.'],
    ['Szükségem van ChatGPT- vagy Claude-előfizetésre?', 'Nem. A Jarvis ingyenes AI-szolgáltatásokkal (például Google AI Studio vagy Groq) és offline modellel is működik. Előfizetéssel (ChatGPT Plus, Claude Pro, Gemini) kapja a legjobb válaszokat. Az előfizetést közvetlenül a szolgáltatónak fizeti – felár nélkül, a Jarvis csak az Ön fiókjait használja.'],
    ['Pontosan mit kapok a telepítésért?', 'Az Ön munkájához telepített és beállított Jarvist: csatlakoztatott AI-fiókokat, levelezést, naptárat és WhatsAppot, beállított cégeket, árakat és válaszstílust, névjegyimportot, 60 perc betanítást és 14 nap elsőbbségi segítséget. A telepítést egyszer kell fizetni.'],
    ['Miért kell havonta fizetni?', 'A havi csomag a Jarvis használati licence és a róla való gondoskodás: folyamatos frissítések és új funkciók, javítások, ellenőrzés minden új verzió után, valamint a csomagnak megfelelő támogatás. Éves fizetéssel 12 hónapot fizet 10 hónap áráért.'],
    ['Mi történik, ha nem fizetek tovább?', 'A licenc a kifizetett időszak utolsó napjáig érvényes. Utána 14 napja van a megújításra, mielőtt a Jarvis zárolódik. Az adatai az Ön számítógépén maradnak, és bármikor kiexportálhatja őket.'],
    ['Hol vannak az adataim, és ki látja őket?', 'Minden az Ön számítógépén van. A jelszavakat a Windows titkosítja, és az AI soha nem kapja meg őket. A szöveg, amelyet beír, csak az Ön által választott AI-szolgáltatásnak megy el – offline modell esetén sehová sem kerül ki. Én eladóként nem férek hozzá az adataihoz; távsegítségnél is csak a kapcsolat idejére, amelyet Ön maga engedélyez, és bármikor megszakíthat.'],
    ['Hogyan zajlik a telepítés?', 'A kifizetés után egyeztetünk az időpontról. A telepítés általában 2 – 3 óráig tart, képernyőmegosztással, Senec (Szenc) és Bratislava (Pozsony) környékén személyesen is. Ön eközben csak bejelentkezik a fiókjaiba – a jelszavakat nem én adom meg.'],
    ['Láthatom a Jarvist a megrendelés előtt?', 'Igen. Írjon nekem, és megbeszélünk egy rövid videohívást, amelyen élőben megmutatom a Jarvist, és válaszolok a kérdéseire.'],
    ['Működik Macen vagy telefonon is?', 'A Jarvis Windowson fut. Telefonon (iPhone-on és Androidon is) az Ön számítógépével létesített privát kapcsolaton keresztül éri el – a számítógépnek be kell lennie kapcsolva. Macre egyelőre nincs.'],
    ['Csinál a Jarvis bármit az engedélyem nélkül?', 'Az olvasást és a szokásos dolgokat azonnal elvégzi, és jelzi. E-mail elküldése, fizetés, vásárlás, törlés, közzététel vagy bármi jóváhagyása előtt mindig rákérdez. Jelszót soha nem ír be – Ön jelentkezik be maga.'],
    ['Hány számítógépem lehet?', 'A csomagtól függően: Start 1, Business 3 és Pro 5 számítógép. Minden további számítógépre a telepítés 99 €.'],
    ['Válthatok csomagot?', 'Bármikor. A magasabb csomag a különbözet kifizetésétől érvényes, az alacsonyabb a következő időszaktól.'],
    ['Hogyan lehet fizetni?', 'Átutalással a megrendelés szerinti számlára – a banki alkalmazásban elég beolvasni a SEPA QR-kódot, vagy fizethet az IBAN-nal. A havi csomagot előre kell fizetni egy hónapra, az évit 12 hónapra. Kártyás fizetés is lesz majd.'],
    ['Elállhatok a szerződéstől?', 'A fogyasztó a távollévők között kötött szerződéstől 14 napon belül indoklás nélkül elállhat. Ha a megrendeléskor kéri, hogy korábban kezdjem meg, csak a már teljesített szolgáltatás arányos részét fizeti meg, a szolgáltatás teljes teljesítése, illetve a digitális tartalom szolgáltatásának megkezdése után pedig az elállási jog megszűnik. A részletek az általános szerződési feltételekben találhatók.'],
    ['Mi van, ha valami elromlik?', 'A Jarvis minden frissítés után maga ellenőrzi magát, és a hibát feljegyzi. Írjon nekem, és a csomagjának megfelelő időn belül jelentkezem; ha ég a ház, ott van az Expressz segítség 2 órán belül.']
  ]
};
