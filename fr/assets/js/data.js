/* Jarvis · web a obchod – JEDINÉ miesto s údajmi predajcu, cenníkom, plánmi, doplnkami, funkciami a otázkami.
   Číta ho prehliadač (košík počíta ceny odtiaľto) aj zostavenie webu (node nastroje/postav.mjs vyrobí stránky).
   Po zmene ceny alebo textu spusti zostavenie znova. Ceny sú v eurách, konečné. */
window.JARVIS_DATA = {
  // i18n:off – údaje predajcu sa neprekladajú (nastroje/preklad.mjs)
  predajca: {
    // na webe značka, telefón, e-mail, IČO a zápis v živnostenskom registri (živnosť od 9. 11. 2026), bez mena a adresy
    meno: 'Apoliak',
    znacka: 'Apoliak',
    adresa: '',
    // majiteľ účtu – len pri platbe prevodom (QR a údaje na platbu po objednávke): banka overuje meno príjemcu s účtom
    prijemca: 'Alex Poliak',
    krajina: 'Slovenská republika',
    ico: '57 990 883',  // zobrazí sa v pätičke, podmienkach, ochrane údajov, kontakte a objednávke
    zapis: 'zapísaný v živnostenskom registri Okresného úradu Senec, č. 140-39176', // § 3a ObZ – podmienky a ochrana údajov
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
    // 3.121: objednávky idú cez Jarvis Bránu na VPS rovno do Alexovho Jarvisa; platbu kartou (Stripe) zapne Alex v Generátore
    // licencií → Objednávky a košík sa na ňu pýta Brány. Prázdne = objednávka sa pošle e-mailom ako predtým.
    obchodApi: 'https://stiahnut.apoliak.online/brana',
    verejnyKluc: '',           // Jarvis → Nastavenia → Generátor licencií → Cenník → Kopírovať verejný kľúč (PEM)
    adresaWebu: 'https://jarvis.apoliak.online', // verejná adresa (náhľad v sieťach, Google, mapa stránok); zverejní nastroje/zverejni.mjs
    podmienkyOd: '10. 11. 2026'
  },

  plany: [
    { id: 'start', nazov: 'Start', mesacne: 15, pc: 1, pre: 'Pour une personne qui veut tout avoir dans une seule fenêtre.',
      body: ['Toutes les fonctions et plus de 70 applis', 'La base de chaque extension incluse – par ex. demande de paiement avec QR, sauvegarde en un clic, vérification d’entreprise, rappels d’entretien', '1 ordinateur', 'Mises à jour continues et nouvelles fonctions', 'Assistance par e-mail sous 2 jours ouvrés'] },
    { id: 'biznis', nazov: 'Business', mesacne: 29, pc: 3, odporucany: true, pre: 'Pour l’indépendant et la petite entreprise qui vivent de leurs e-mails et de leurs clients.',
      body: ['Tout ce qu’offre Start', 'Jusqu’à 3 ordinateurs', 'Jarvis sur le mobile – configuration incluse', 'Assistance sous 1 jour ouvré', 'Aide à distance une fois par mois', 'Contrôle et réglage une fois par trimestre'] },
    { id: 'pro', nazov: 'Pro', mesacne: 49, pc: 5, pre: 'Pour l’entreprise qui veut adapter Jarvis à son travail.',
      body: ['Tout ce qu’offre Business', 'Jusqu’à 5 ordinateurs', 'Votre propre modèle d’IA hors ligne – configuration incluse', '1 heure de travail sur mesure chaque mois', 'Assistance sous 4 heures les jours ouvrés, aussi par téléphone', 'Les nouvelles fonctions avant les autres'] }
  ],
  porovnanie: [
    ['Toutes les fonctions et plus de 70 applis', true, true, true],
    ['La base de chaque extension (demande de paiement avec QR, justificatifs saisis à la main, 10 documents d’entreprise, sauvegarde, QR pour les avis, vérification d’entreprise, 2 modèles de documents, rappels d’entretien)', true, true, true],
    ['Nombre d’ordinateurs', '1', '3', '5'],
    ['Mises à jour et nouvelles fonctions', true, true, true],
    ['Assistance par e-mail', 'sous 2 jours ouvrés', 'sous 1 jour ouvré', 'sous 4 heures'],
    ['Assistance téléphonique', false, false, true],
    ['Aide à distance par partage d’écran', false, '1× par mois', 'selon les besoins'],
    ['Jarvis sur le mobile (configuration)', '59 €', 'inclus', 'inclus'],
    ['Votre propre modèle d’IA hors ligne (configuration)', '149 €', '149 €', 'inclus'],
    ['Contrôle et réglage de Jarvis', false, 'une fois par trimestre', 'une fois par mois'],
    ['Travail sur mesure', false, false, '1 heure par mois'],
    ['Les nouvelles fonctions plus tôt (versions d’essai)', false, false, true]
  ],
  instalaciaObsahuje: [
    'Installation de Jarvis sur votre ordinateur – à distance, ou en personne autour de Senec et de Bratislava',
    'Connexion de vos comptes IA (ChatGPT, Claude, Gemini) ou de services IA gratuits',
    'Connexion de la messagerie – toutes vos boîtes mail, l’agenda et WhatsApp',
    'Configuration selon votre travail : menu, entreprises, prix, signature et style des réponses',
    'Import des contacts depuis une source (Excel, Outlook ou téléphone)',
    '60 minutes de formation, jusqu’à ce que vous sachiez où se trouve chaque chose',
    '14 jours d’aide prioritaire après l’installation',
    'Licence pour le premier ordinateur'
  ],

  /* Obchod. kategoria: plany | doplnky | sluzby | baliky. cena = jednorazovo; plán má cenu z plany[]. */
  kategorie: [
    { id: 'plany', nazov: 'Installation et plans' },
    { id: 'doplnky', nazov: 'Options' },
    { id: 'rozsirenia', nazov: 'Extensions pour les entreprises' },
    { id: 'sluzby', nazov: 'Services' },
    { id: 'baliky', nazov: 'Offres groupées' }
  ],
  produkty: [
    { id: 'instalacia', kategoria: 'plany', nazov: 'Installation et configuration de Jarvis', cena: 99, povodne: 149, ikona: 'install',
      kratko: 'Jarvis installé et configuré pour votre travail. Sur demande – vous pouvez aussi le télécharger et l’installer vous-même.',
      popis: 'J’installe Jarvis et je le configure pour que vous l’utilisiez dès le premier jour pour un vrai travail – pas pour des essais. Nous connectons vos comptes IA, votre messagerie et votre agenda, nous configurons vos entreprises, vos prix et le style des réponses, et en une heure je vous montre tout l’essentiel.',
      obsahuje: 'instalacia', poznamka: 'Se paie une seule fois. Avec l’installation, vous choisissez un plan mensuel ou annuel.' },
    { id: 'plan-start', kategoria: 'plany', plan: 'start', nazov: 'Plan Start', ikona: 'plan',
      kratko: '1 ordinateur, toutes les fonctions, mises à jour et assistance par e-mail.',
      popis: 'Tout Jarvis avec toutes ses fonctions, pour une personne sur un ordinateur. Les mises à jour et les nouvelles fonctions arrivent d’elles-mêmes, et je réponds aux questions par e-mail sous 2 jours ouvrés.' },
    { id: 'plan-biznis', kategoria: 'plany', plan: 'biznis', nazov: 'Plan Business', ikona: 'plan',
      kratko: 'Jusqu’à 3 ordinateurs, Jarvis sur le mobile et une assistance plus rapide.',
      popis: 'Pour un indépendant ou une petite entreprise : Jarvis sur trois ordinateurs maximum, sur le mobile (configuration incluse), support sous un jour ouvré, une aide à distance par mois et un contrôle trimestriel pour vérifier que tout fonctionne comme il faut.' },
    { id: 'plan-pro', kategoria: 'plany', plan: 'pro', nazov: 'Plan Pro', ikona: 'plan',
      kratko: 'Jusqu’à 5 ordinateurs, IA hors ligne, une heure de travail sur mesure par mois.',
      popis: 'Jarvis adapté à votre entreprise : jusqu’à cinq ordinateurs, votre propre modèle d’IA hors ligne configuré et inclus, une heure de travail sur mesure chaque mois (nouvelle fonction, automatisation, connexion) et un support sous 4 heures les jours ouvrés, y compris par téléphone.' },

    { id: 'dalsi-pc', kategoria: 'doplnky', nazov: 'Jarvis sur un autre ordinateur', cena: 99, ikona: 'pc', mnozstvo: true,
      kratko: 'Installation et configuration sur un autre ordinateur dans le cadre de votre plan.',
      popis: 'J’installe Jarvis sur un autre ordinateur de votre entreprise et j’y connecte les comptes de la personne concernée. Le nombre d’ordinateurs dépend du plan (Start 1, Business 3, Pro 5) ; s’il vous en faut plus, il suffit de passer à un plan supérieur.' },
    { id: 'mobil', kategoria: 'doplnky', nazov: 'Jarvis sur le mobile', cena: 59, ikona: 'phone', vCene: ['biznis', 'pro'],
      kratko: 'Tout Jarvis sur votre téléphone via une connexion privée et chiffrée avec votre PC.',
      popis: 'Jarvis sur iPhone comme sur Android : chat, courrier, tâches, aperçu de la journée, validations oui/non et notifications. La connexion passe par un réseau privé chiffré entre votre téléphone et votre ordinateur – personne ne la voit depuis Internet. Une tâche lancée depuis le mobile s’exécute sur le PC jusqu’au bout, même si vous verrouillez le téléphone.',
      poznamka: 'Dans les plans Business et Pro, la configuration est incluse. L’ordinateur doit être allumé.' },
    { id: 'offline-ai', kategoria: 'doplnky', nazov: 'Votre propre modèle d’IA hors ligne', cena: 149, ikona: 'chip', vCene: ['pro'],
      kratko: 'Une IA qui tourne uniquement sur votre ordinateur. Rien ne part sur Internet.',
      popis: 'J’installe et j’ajuste un modèle de langage qui tourne directement sur votre carte graphique. Jarvis l’utilise pour les sujets sensibles (courrier, contrats, chiffres de l’entreprise) et comme solution de secours quand il n’y a pas d’Internet ou d’abonnement. Avant la commande, je vérifie que votre ordinateur en est capable.',
      poznamka: 'Recommandé : une carte graphique NVIDIA avec 12 Go de mémoire, ou 32 Go de RAM. Inclus dans le plan Pro.' },
    { id: 'obchodnik', kategoria: 'doplnky', nazov: 'Commercial sur mesure', cena: 149, ikona: 'deal',
      kratko: 'Prospects issus de vos boîtes mail, réponses dans votre style et rappels de paiement.',
      popis: 'Je configure le Commercial pour votre activité : ce que vous vendez, vos prix, votre façon de répondre et la prochaine étape. Jarvis lit ensuite les boîtes mail de l’entreprise toutes les 15 minutes, enregistre les prospects dans Clients, prépare une réponse à valider et vous rappelle les devis restés sans réponse et le travail impayé.' },
    { id: 'prenos-dat', kategoria: 'doplnky', nazov: 'Transfert des contacts et des données', cena: 79, ikona: 'import',
      kratko: 'Contacts et clients depuis plusieurs sources – Excel, ancien CRM, Outlook, téléphone.',
      popis: 'Je transfère vos contacts, clients et notes de plusieurs sources dans Jarvis, je fusionne les doublons, je vérifie les adresses e-mail et je complète les entreprises avec les données du registre d’après leur numéro IČO.' },
    { id: 'hlas', kategoria: 'doplnky', nazov: 'Voix et dictée sur mesure', cena: 49, ikona: 'mic',
      kratko: 'Microphone, votre propre dictionnaire de noms et d’expressions, raccourcis clavier.',
      popis: 'Je configure la dictée pour qu’elle comprenne votre métier : un dictionnaire des noms de vos clients, de vos produits et de vos termes techniques, des touches pour dicter dans n’importe quelle fenêtre et la traduction en anglais. La transcription se fait hors ligne sur votre ordinateur.' },
    { id: 'automatizacia', kategoria: 'doplnky', nazov: 'Automatisation sur mesure', cena: 149, ikona: 'auto', mnozstvo: true,
      kratko: 'Une tâche répétitive que Jarvis fait seul – par ex. les factures de la messagerie vers Excel.',
      popis: 'Nous choisissons une tâche que vous faites encore et encore, et Jarvis la fera lui-même à l’heure fixée : les factures de la messagerie vers un tableau, un récapitulatif matinal du courrier et des tâches, la vérification du site web et de la boutique en ligne, un résumé hebdomadaire du chiffre d’affaires. Il demande toujours avant d’envoyer ou de payer.' },
    { id: 'odoo', kategoria: 'doplnky', nazov: 'Liaison avec Odoo', cena: 290, ikona: 'link',
      kratko: 'Jarvis lit et écrit dans votre Odoo – commandes, contacts, factures.',
      popis: 'Je relie Jarvis à votre Odoo via l’API : il retrouve une commande ou une facture, enregistre un nouveau contact ou une tâche et prépare un aperçu. La liaison de base couvre jusqu’à 5 types d’enregistrements ; pour un périmètre plus large, nous nous mettons d’accord à l’avance.' },
    { id: 'prepojenie', kategoria: 'doplnky', nazov: 'Liaison avec votre système', cena: 190, ikona: 'link',
      kratko: 'Pohoda, Money S3, SuperFaktúra, PrestaShop, Shopify, Google Workspace ou Microsoft 365.',
      popis: 'Je relie Jarvis au système que votre entreprise utilise déjà – logiciel de comptabilité (Pohoda, Money S3), facturation (SuperFaktúra), boutique en ligne (PrestaShop, Shopify – pour WooCommerce et Shoptet, il existe l’extension Liaison avec la boutique en ligne) ou Google Workspace ou Microsoft 365. Jarvis y lit et y écrit. Le prix s’entend pour la liaison de base d’un seul système ; pour un périmètre plus large, nous nous mettons d’accord à l’avance.' },
    { id: 'postupy', kategoria: 'doplnky', nazov: 'Procédures de l’entreprise', cena: 149, ikona: 'auto',
      kratko: '5 procédures du type « quand une réclamation arrive, fais ceci » – Jarvis les suit pas à pas.',
      popis: 'Ensemble, nous décrivons cinq choses qui se font toujours de la même façon dans votre entreprise (réclamation, nouveau client, commande de matériel, devis, clôture du mois), et je les configure comme procédures dans Jarvis. Quand vous dites « une réclamation est arrivée », Jarvis suit exactement votre façon de faire.' },
    { id: 'vzhlad', kategoria: 'doplnky', nazov: 'Image de marque', cena: 99, ikona: 'palette',
      kratko: 'Le logo, les couleurs et le nom de votre entreprise dans Jarvis.',
      popis: 'Jarvis aux couleurs de votre entreprise, avec votre logo et votre nom (« Jarvis · Café Sova »), un message d’accueil pour vos employés et une signature d’entreprise dans les réponses.' },

    /* Rozšírenia pre firmy: mesačne ku plánu, platia spolu s licenciou (v kľúči pole m). pripravujeme = zatiaľ sa nedá kúpiť.
       zaklad = čo z rozšírenia má každý plán zadarmo (Jarvis 3.117: ľahká verzia v každom Jarvisovi, rozšírenie pridá zvyšok). */
    { id: 'modul-reporty', modul: 'reporty', kategoria: 'rozsirenia', nazov: 'Aperçu pour le propriétaire', mesacne: 5, ikona: 'chart', snimka: 'modul_prehlad',
      zaklad: 'la carte Cette semaine dans Business avec le chiffre d’affaires, les factures impayées et les nouveaux prospects, et pour chaque affaire le chiffre d’affaires et les heures travaillées.',
      kratko: 'Chaque lundi un résumé de l’entreprise et la rentabilité de chaque affaire – ce qu’elle a rapporté après les coûts.',
      popis: 'Chaque lundi matin, vous recevez un récapitulatif de l’entreprise : chiffre d’affaires et dépenses par rapport à la semaine et au mois précédents, nouveaux prospects, devis en cours, ce qui attend d’être payé et quelles tâches sont en retard. En fin de mois, une clôture en PDF à envoyer à votre associé ou à votre comptable. En plus, Quand l’argent manquera : le solde du compte dans 30, 60 et 90 jours selon les échéances des factures, des justificatifs, des paiements réguliers et des contrats, avec une alerte s’il risquait de passer sous zéro. Rentabilité des commandes : pour chaque commande, le chiffre d’affaires des factures, les heures travaillées issues du Relevé d’heures, le matériel sorti du stock ainsi que les justificatifs et coûts que vous y rattachez – bénéfice, marge et gain horaire, pour voir quelles commandes sont rentables.' },
    { id: 'modul-hovory', modul: 'hovory', kategoria: 'rozsirenia', nazov: 'Appels et réunions vers le CRM', mesacne: 9, ikona: 'phonecall', snimka: 'modul_hovory_navrh',
      zaklad: 'Compte rendu de réunion – enregistrement, transcription et résumé.',
      kratko: 'Un appel ou une réunion enregistrés → transcription, résumé et tâches directement chez le client.',
      popis: 'Enregistrez un appel avec un client ou une réunion, et Jarvis en fait une transcription indiquant qui a dit quoi, un bref résumé et des tâches. Il classe le tout chez le bon client et place les tâches sur le Tableau. La transcription se fait hors ligne sur votre ordinateur.' },
    { id: 'modul-faktury', modul: 'faktury', kategoria: 'rozsirenia', nazov: 'Factures et relances', mesacne: 9, ikona: 'invoice', snimka: 'modul_faktury',
      zaklad: 'demande de paiement avec code QR PAY by square et texte pour le client.',
      kratko: 'Facture avec QR et paiement par carte, factures électroniques via Peppol, offre avec bouton Accepter et paiements rapprochés automatiquement.',
      popis: 'Vous émettez une facture avec un code QR de paiement directement depuis la fiche du client – avec numérotation, PDF et aussitôt aussi en e-facture Peppol pour la facturation électronique obligatoire en Slovaquie à partir de 2027. Vous l’envoyez par e-mail d’un clic, elle est enregistrée dans Business et Jarvis surveille l’échéance : 3 et 14 jours après, il prépare une relance que vous vérifiez et envoyez simplement. E-factures via Peppol : avec un compte chez un « facteur numérique » (point d’accès Peppol selon la norme slovaque SAPI-SK), Jarvis envoie la facture directement dans le système du client et récupère lui-même les e-factures des fournisseurs dans Pièces. Paiement par carte : avec votre propre compte Stripe, chaque facture envoyée par e-mail contient aussi un lien pour payer par carte et, une fois payée, elle se marque d’elle-même comme réglée. Paiements bancaires : il rapproche le relevé de votre banque en ligne (XML ou CSV, automatiquement avec Fio banka) des factures et des justificatifs d’après le symbole variable et le montant – et rapproche lui-même toutes les demi-heures les notifications e-mail de la banque sur les paiements reçus (uniquement les messages vérifiés de la banque). Offre avec bouton Accepter : vous envoyez le devis sous forme de lien, le client l’accepte d’un clic et une affaire est créée dans Clients, avec une facture d’acompte si vous le souhaitez. Les factures récurrentes (hébergement, contrat de maintenance, loyer) s’émettent d’elles-mêmes chaque mois, trimestre ou année ; vous soldez une facture d’acompte payée d’un clic et émettez un avoir sur une facture. Pour chaque mois, il prépare un export pour votre comptable vers POHODA ou Money S3. Fonctionne pour les assujettis à la TVA comme pour les non-assujettis.' },
    { id: 'modul-doklady', modul: 'doklady', kategoria: 'rozsirenia', nazov: 'Pièces du courrier', mesacne: 9, ikona: 'mail', snimka: 'modul_doklady',
      zaklad: 'un justificatif ajouté à la main (PDF ou photo) – Jarvis relève le fournisseur, le montant et l’échéance et l’inscrit dans Business.',
      kratko: 'Factures et tickets de la messagerie et du mobile dans un tableau pour la comptable.',
      popis: 'Une fois par jour, Jarvis trouve dans votre messagerie les factures et e-factures reçues, lit même un ticket de caisse photographié et en extrait le fournisseur, le montant, la TVA, l’échéance, l’IBAN et le symbole variable. Vous vérifiez simplement les données et les enregistrez en dépenses d’un clic ; ce qui doit être payé, vous le réglez avec le code QR sur votre mobile. En fin de mois, il prépare un dossier pour votre comptable – un tableau pour Excel et tous les justificatifs dans un seul fichier ZIP, ou un fichier à importer dans POHODA ou Money S3. Les justificatifs arrivés à échéance se paient en une seule fois avec un ordre de virement groupé SEPA que vous chargez simplement dans votre banque en ligne.' },
    { id: 'modul-znalosti', modul: 'znalosti', kategoria: 'rozsirenia', nazov: 'Connaissances de l\'entreprise', mesacne: 9, ikona: 'book',
      zaklad: 'jusqu’à 10 documents et des questions sur eux dans l’appli Connaissances de l’entreprise.',
      kratko: 'Jarvis apprend vos tarifs, procédures et contrats et répond à partir d’eux.',
      popis: 'Vous donnez à Jarvis les documents de l’entreprise – grilles tarifaires, procédures, contrats, réponses aux questions fréquentes – et il répond à partir d’eux, avec un lien vers la source. Un nouveau venu dans l’entreprise interroge Jarvis au lieu de vous, et les réponses suivent toujours la grille tarifaire en vigueur.' },
    { id: 'modul-sukromie', modul: 'sukromie', kategoria: 'rozsirenia', nazov: 'Mode privé', mesacne: 9, ikona: 'lock',
      zaklad: 'sauvegarde de toutes les données de Jarvis en un clic dans un dossier, sur une clé USB ou un NAS.',
      kratko: 'Courrier et clients uniquement via l’IA hors ligne, journal et sauvegardes sur le disque de l’entreprise.',
      popis: 'Pour les entreprises aux données sensibles : courrier, clients et contrats ne vont qu’au modèle d’IA de votre ordinateur, jamais dans le cloud. Le Journal montre qui a fait quoi, et les données sont sauvegardées chaque jour, chiffrées, sur le disque de l’entreprise ou un NAS. Nécessite le modèle d’IA hors ligne.' },
    { id: 'modul-recenzie', modul: 'recenzie', kategoria: 'rozsirenia', nazov: 'Avis et réputation', mesacne: 5, ikona: 'star',
      zaklad: 'lien et code QR vers un avis Google, avis ajoutés à la main, proposition de réponse et demande d’avis par e-mail.',
      kratko: 'Surveillance des avis Google et réponses dans votre style, cartes NFC pour de nouveaux avis.',
      popis: 'Jarvis suit les nouveaux avis sur votre entreprise sur Google, vous alerte en cas d’avis négatif et prépare une réponse dans votre style. Quelques jours après le paiement d’une facture, il prépare dans les Brouillons une demande d’avis pour le client – au maximum une fois par an pour chacun. En plus, les cartes NFC ťukni pour le comptoir – le client approche son téléphone et rédige aussitôt un avis.' },
    /* Jarvis 3.118: druhá várka – Preverenie firmy, Dokumenty zo šablón, Hromadné maily, Tendre a dotácie; Sklad hotový */
    { id: 'modul-preverenie', modul: 'preverenie', kategoria: 'rozsirenia', nazov: 'Vérification de l\'entreprise', mesacne: 5, ikona: 'shield',
      zaklad: 'la vérification d’une entreprise en un clic selon le numéro IČO – faillite, liquidation, débiteurs et responsabilité pour la TVA.',
      kratko: 'Surveille chaque semaine vos clients et fournisseurs : dettes, faillite et responsabilité pour la TVA.',
      popis: 'Avant une affaire, vous saisissez le numéro IČO et Jarvis consulte le registre des entreprises, les derniers comptes annuels, les débiteurs de l’Administration financière et de la Sécurité sociale slovaques et la liste des assujettis à la TVA présentant un motif d’annulation de l’immatriculation, pour la TVA desquels vous seriez solidairement responsable. Avec l’extension, il revérifie lui-même chaque semaine tous vos clients et fournisseurs et vous prévient lorsque l’un d’eux apparaît parmi les débiteurs ou en faillite.' },
    { id: 'modul-sablony', modul: 'sablony', kategoria: 'rozsirenia', nazov: 'Documents à partir de modèles', mesacne: 5, ikona: 'invoice',
      zaklad: 'deux modèles Word personnels remplis depuis Clients et le registre des entreprises – Word et PDF.',
      kratko: 'Contrats, procès-verbaux et bons de commande à partir de vos modèles Word en un clic.',
      popis: 'Dans votre document Word, vous écrivez des champs comme {{firma}}, {{ico}} ou {{adresa}} et Jarvis le remplit à partir de la fiche du client, du registre des entreprises et des données de votre entreprise – Word et PDF prêts. L’extension ajoute un nombre illimité de modèles et un même document pour plusieurs clients à la fois.' },
    { id: 'modul-hromadne', modul: 'hromadne', kategoria: 'rozsirenia', nazov: 'Mails groupés aux clients', mesacne: 9, ikona: 'mail',
      kratko: 'Un mail aux clients choisis avec leur nom – dans Brouillons ou lentement depuis la boîte.',
      popis: 'Vous écrivez un seul e-mail (avec l’aide de l’IA si vous le souhaitez) et Jarvis le prépare pour chaque client choisi avec son nom et son entreprise – dans les Brouillons pour vérification, ou il l’envoie lentement depuis votre boîte pour que personne ne la signale comme spam. Il ajoute un lien de désinscription sous chaque e-mail et traite lui-même les réponses demandant la désinscription.' },
    { id: 'modul-tendre', modul: 'tendre', kategoria: 'rozsirenia', nazov: 'Appels d\'offres et subventions', mesacne: 9, ikona: 'deal',
      kratko: 'Chaque matin, les nouveaux marchés publics et appels à subventions selon ce que vous faites.',
      popis: 'Vous décrivez ce que fait votre entreprise et chaque matin Jarvis parcourt les nouveaux marchés des acheteurs publics slovaques au Journal officiel de l’UE (TED) et les nouveaux appels à subventions (Eurofondy, MIRRI, SBA). Ce qui vous correspond, il l’affiche avec la date limite et la valeur, et vous prévient.' },
    { id: 'modul-sklad', modul: 'sklad', kategoria: 'rozsirenia', nazov: 'Stock et commandes', mesacne: 9, ikona: 'pack',
      kratko: 'Un stock simple, une alerte de stock minimum et la commande en un clic.',
      popis: 'Une gestion de stock simple, sans système compliqué : marchandises et matériaux, entrées, sorties et inventaires avec historique, stocks minimaux et alerte quand quelque chose vient à manquer. Jarvis prépare la commande au fournisseur sous forme d’e-mail que vous n’avez plus qu’à envoyer, et après la livraison il met la marchandise en stock d’un clic. Vous importez une liste depuis Excel en une seule fois.' },
    /* Jarvis 3.119: GDPR pre firmu a Prepojenie s e-shopom */
    { id: 'modul-gdpr', modul: 'gdpr', kategoria: 'rozsirenia', nazov: 'RGPD pour l\'entreprise', mesacne: 5, ikona: 'lock',
      zaklad: 'l’information des clients sur le traitement des données personnelles et le consentement au traitement – remplis avec les données de votre entreprise en PDF.',
      kratko: 'Registres des traitements, demandes des personnes avec le délai surveillé, consentements et violations.',
      popis: 'Tout ce dont une petite entreprise a besoin pour le RGPD, au même endroit : registres des activités de traitement d’après des modèles (clients, salariés, newsletter, caméras), demandes des personnes concernant leurs données avec suivi du délai d’un mois et réponse dans les Brouillons, registre des consentements, violations de données avec les 72 heures pour les notifier, et documents remplis avec les données de votre entreprise – informations pour les clients, consentement, contrat de sous-traitance et information des salariés.' },
    { id: 'modul-eshop', modul: 'eshop', kategoria: 'rozsirenia', nazov: 'Liaison avec la boutique en ligne', mesacne: 9, ikona: 'cart',
      kratko: 'Les commandes WooCommerce ou Shoptet vont toutes seules dans les clients, les factures et le stock.',
      popis: 'Toutes les 30 minutes, Jarvis consulte votre boutique en ligne sur WooCommerce ou Shoptet et traite lui-même les nouvelles commandes : il enregistre le client dans Clients, émet la facture (si la boutique ne le fait pas déjà), sort la marchandise du stock d’après sa référence et inscrit la vente dans Business. Une clé en lecture seule suffit – Jarvis n’écrit rien dans la boutique.' },
    /* Jarvis 3.120: Tím a Rezervácie online hotové (Jarvis Brána na stiahnut.apoliak.online), nové Zmluvy a poistky a AI asistent na web */
    { id: 'modul-tim', modul: 'tim', kategoria: 'rozsirenia', nazov: 'Équipe', mesacne: 5, zaCloveka: true, mnozstvo: true, ikona: 'team',
      kratko: 'Clients, tâches et notes partagés pour toute l’entreprise.',
      popis: 'Clients, tâches et notes partagés par toute l’entreprise : qui s’occupe de quelle affaire, ce qui est fait et ce qui est en retard. Les collègues rejoignent l’équipe avec le code d’équipe, et une modification sur un ordinateur apparaît sur les autres en moins d’une demi-minute ; si deux personnes modifient la même chose, la modification la plus récente l’emporte. Seul ce qui est destiné à l’équipe est partagé – Clients, le tableau Équipe dans Tâches et les notes marquées pour l’équipe ; les notes privées restent les vôtres. Les données transitent par le serveur de Jarvis, chiffrées avec la clé de l’équipe que seule votre équipe possède – le serveur ne peut pas les lire. Le prix s’entend par personne de l’équipe.' },
    { id: 'modul-rezervacie', modul: 'rezervacie', kategoria: 'rozsirenia', nazov: 'Réservations en ligne', mesacne: 15, ikona: 'plan',
      kratko: 'Un système de réservation pour vos clients – rendez-vous dans le calendrier de Jarvis, liste d’attente, statistiques.',
      popis: 'Vos clients réservent eux-mêmes un créneau sur votre page de réservation (salon, atelier, cabinet de conseil, cours) – ils choisissent le service, la personne ou la salle, le jour et l’heure parmi les créneaux libres de votre Calendrier. Le rendez-vous s’inscrit de lui-même dans le Calendrier de Jarvis et le client dans Clients ; le client reçoit une confirmation par e-mail depuis votre boîte et un rappel avant le rendez-vous, et peut le déplacer ou l’annuler lui-même via le lien de la confirmation. Quand tout est complet, il s’inscrit sur la liste d’attente et reçoit un e-mail dès qu’un créneau se libère. Pour chaque service, vous réglez une pause avant et après. Dans Jarvis, vous voyez la journée par personne, qui est venu et qui ne l’est pas, l’historique de chaque client et les statistiques de chiffre d’affaires. Après la visite, Jarvis demande au client un avis sur Google. La page existe en 10 langues, aux couleurs de votre entreprise, et fonctionne même lorsque votre ordinateur est éteint. Vous mettez son lien sur votre site, votre profil Google ou Instagram.' },
    { id: 'modul-zmluvy', modul: 'zmluvy', kategoria: 'rozsirenia', nazov: 'Contrats et assurances', mesacne: 5, ikona: 'contract',
      zaklad: '5 contrats et assurances avec délai de résiliation et rappel.',
      kratko: 'Loyer, assurances, énergie et leasing avec les délais de résiliation – Jarvis vous prévient à temps.',
      popis: 'Tous les contrats de l’entreprise au même endroit – loyer, assurances, énergie, leasing, téléphones et services. Jarvis sait jusqu’à quand ils courent, quand ils se renouvellent d’eux-mêmes et jusqu’à quand il faut envoyer la résiliation, et vous prévient à l’avance, une semaine et un jour avant. Il prépare la résiliation sous forme de lettre en PDF, extrait lui-même d’un contrat en PDF le cocontractant, le montant et les dates, et intègre les paiements réguliers à l’aperçu Quand l’argent manquera. L’extension ajoute un nombre illimité de contrats, la lecture des contrats par l’IA et la résiliation en PDF.' },
    { id: 'modul-asistent', modul: 'asistent', kategoria: 'rozsirenia', nazov: 'Assistant IA pour le site web', mesacne: 15, ikona: 'chat',
      zaklad: 'une fenêtre sur votre site avec formulaire de contact – les demandes arrivent directement dans Clients.',
      kratko: 'Une fenêtre sur votre site qui répond aux clients à partir de vos tarifs et documents.',
      popis: 'Vous insérez une seule ligne de code sur votre site (WordPress, Wix, Shoptet ou votre propre site) et une fenêtre aux couleurs de votre entreprise apparaît en bas à droite. C’est votre Jarvis qui répond aux visiteurs – uniquement à partir de ce que vous lui autorisez : services, prix, horaires d’ouverture et documents choisis dans Connaissances de l’entreprise. Lorsqu’il ne sait pas répondre ou que l’ordinateur est éteint, il propose un formulaire de contact et la demande arrive directement dans Clients. Les réponses passent par votre propre clé API ou par un modèle hors ligne, et vous voyez chaque question et chaque réponse dans Jarvis.' },
    /* Jarvis 3.151 (Alex 13. 11. 2026: „tie letenky to bude za nejaký príplatok … dobre naceň“): 50 € ročne ako Going Premium;
       3.152 aj Wizz Air, ubytovanie na dni letu s cenou celej dovolenky a zájazdy */
    { id: 'modul-letenky', modul: 'letenky', kategoria: 'rozsirenia', nazov: 'Vols + évasion', mesacne: 5, ikona: 'plane',
      zaklad: 'les allers-retours Ryanair les moins chers depuis un aéroport – les dix destinations les moins chères.',
      kratko: 'Des vols Ryanair et Wizz Air pas chers depuis quatre aéroports à la fois, l’hébergement pour les jours du vol, des séjours et une alerte de prix.',
      popis: 'Vous indiquez la période, le nombre de nuits souhaité et le prix maximal – Jarvis parcourt les tarifs de Ryanair et de Wizz Air jour après jour sur chaque ligne au départ de Bratislava, Vienne, Košice et Budapest et affiche les allers-retours les moins chers avec les heures de départ. Pour les vols les moins chers, il trouve aussitôt un hébergement exactement pour ces dates – hôtels et appartements bien notés – et indique le prix de tout le séjour. Dans l’onglet Séjours, il trouve les séjours organisés les moins chers avec vol, hôtel et repas proposés par des agences de voyages slovaques et tchèques. Pour chaque destination : d’autres dates, la météo de ce mois-là et une photo du lieu. Une alerte de prix vérifie votre recherche toutes les 3 heures et vous prévient par une notification dès qu’un vol moins cher apparaît. La base dans chaque Jarvis : un aéroport et les dix destinations les moins chères.' },

    { id: 'appka', kategoria: 'sluzby', nazov: 'Appli sur mesure dans Jarvis', cena: 490, ikona: 'app',
      kratko: 'Une petite appli faite exactement pour votre activité – registre, calculatrice, formulaire.',
      popis: 'Je programme l’appli qui manque à votre activité et je l’ajoute à Jarvis : un registre (p. ex. des affaires, des véhicules, des contrôles), un calculateur de prix, un formulaire de commande ou un tableau de synthèse. Le prix s’entend pour une petite appli ; pour une plus grande, nous convenons du prix à l’avance.' },
    { id: 'hodina', kategoria: 'sluzby', nazov: 'Une heure de travail sur mesure', cena: 45, ikona: 'clock', mnozstvo: true,
      kratko: 'Modification, nouvelle fonction, connexion ou aide – facturé à l’heure.',
      popis: 'Une heure de mon travail sur votre Jarvis : ajustement de son comportement, nouvelle fonction, connexion à un service que vous utilisez ou aide pour tout ce qui touche à Jarvis.' },
    { id: 'balik-5h', kategoria: 'sluzby', nazov: 'Forfait de 5 heures de travail', cena: 199, ikona: 'clock',
      kratko: '5 heures de travail sur mesure à un meilleur prix, valables 6 mois.',
      popis: 'Cinq heures de travail sur mesure que vous utilisez progressivement sur 6 mois. Par rapport à des heures à l’unité, vous économisez 26 €.' },
    { id: 'skolenie', kategoria: 'sluzby', nazov: 'Formation de l’équipe en ligne', cena: 89, ikona: 'team',
      kratko: '90 minutes pour les personnes de votre entreprise, jusqu’à 6 participants.',
      popis: 'Une formation en ligne pour votre équipe : comment interroger Jarvis, comment travailler avec le courrier, les tâches et les clients, et que faire quand quelque chose ne marche pas. Jusqu’à 6 participants, 90 minutes, avec enregistrement.' },
    { id: 'prenos-pc', kategoria: 'sluzby', nazov: 'Transfert de Jarvis sur un nouvel ordinateur', cena: 79, ikona: 'move',
      kratko: 'Un nouvel ordinateur, le même Jarvis – avec toutes les données et connexions.',
      popis: 'Vous achetez un nouvel ordinateur ? Je transfère Jarvis avec toutes ses données, son historique et ses réglages, je reconnecte vos comptes et je vérifie que tout fonctionne comme avant.' },
    { id: 'expres', kategoria: 'sluzby', nazov: 'Aide express sous 2 heures', cena: 39, ikona: 'bolt',
      kratko: 'Quand c’est urgent : je vous réponds sous 2 heures un jour ouvré.',
      popis: 'Une aide ponctuelle quand ça ne peut pas attendre : je vous recontacte dans les 2 heures un jour ouvré entre 8 h et 18 h, et nous réglons le problème par partage d’écran.' },

    { id: 'balik-zivnostnik', kategoria: 'baliky', nazov: 'Jarvis pour les indépendants', cena: 498, povodne: 627, ikona: 'pack', balik: { plan: 'biznis', mesiacov: 12 },
      kratko: 'Installation, plan Business pour 12 mois, Commercial sur mesure et formation.',
      popis: 'Tout ce dont un indépendant a besoin pour la première année : installation et configuration, plan Business pour 12 mois (jusqu’à 3 ordinateurs, Jarvis sur le mobile), le Commercial configuré pour votre activité et une formation en ligne.',
      vBaliku: ['Installation et configuration de Jarvis', 'Plan Business pour 12 mois', 'Jarvis sur le mobile', 'Commercial sur mesure', 'Formation en ligne (90 min)'] },
    { id: 'balik-firma', kategoria: 'baliky', nazov: 'Jarvis pour l’entreprise', cena: 789, povodne: 955, ikona: 'pack', balik: { plan: 'pro', mesiacov: 12 },
      kratko: 'Installation, plan Pro pour 12 mois, 2 ordinateurs supplémentaires, transfert des données et formation de l’équipe.',
      popis: 'Jarvis pour toute une petite entreprise pendant la première année : installation, plan Pro pour 12 mois (IA hors ligne et une heure de travail sur mesure chaque mois), Jarvis sur deux autres ordinateurs, transfert des contacts et des données et formation de l’équipe.',
      vBaliku: ['Installation et configuration de Jarvis', 'Plan Pro pour 12 mois', 'Jarvis sur 2 autres ordinateurs', 'Votre propre modèle d’IA hors ligne', 'Transfert des contacts et des données', 'Formation de l’équipe en ligne (90 min)'] },

    { id: 'predlzenie', kategoria: 'skryte', nazov: 'Renouvellement de licence', ikona: 'plan',
      kratko: 'Abonnement Jarvis pour la période suivante.', popis: 'Prolongation de votre licence Jarvis d’une période supplémentaire selon votre plan.' }
  ],

  /* Odvetvové balíky rozšírení (stránka Pre firmy): moduly + nastavenie pre odbor lacnejšie ako samostatne. */
  odvetvia: [
    { id: 'uctovnictvo', nazov: 'Cabinet comptable', ikona: 'invoice', mesacne: 19, moduly: ['doklady', 'faktury', 'znalosti'], navyse: 'Échéances de TVA, d’acomptes et de cotisations dans le Calendrier fiscal',
      text: 'Les justificatifs des clients de la messagerie directement dans des tableaux, les factures avec relances et des réponses selon vos procédures.' },
    { id: 'remeslo', nazov: 'Artisan et entreprise du bâtiment', ikona: 'deal', mesacne: 15, moduly: ['faktury', 'hovory'], navyse: 'Photos du chantier depuis le mobile, rattachées à l’affaire',
      text: 'Devis, affaire, photos du chantier, relevé d’heures et facture – tout réuni sous un même client.' },
    { id: 'eshop', nazov: 'Boutique en ligne', ikona: 'cart', mesacne: 25, moduly: ['eshop', 'faktury', 'recenzie', 'doklady'], navyse: 'Configuration de la liaison avec Shoptet ou WooCommerce incluse',
      text: 'Commandes de la boutique en ligne, réponses aux clients dans votre style, avis et justificatifs pour la comptabilité.' },
    { id: 'salon', nazov: 'Salon et services', ikona: 'plan', mesacne: 15, moduly: ['rezervacie', 'recenzie'], navyse: 'Rappels de rendez-vous aux clients',
      text: 'Les clients réservent eux-mêmes, Jarvis leur rappelle le rendez-vous et demande un avis après la visite.' },
    { id: 'gastro', nazov: 'Restauration', ikona: 'pack', mesacne: 15, moduly: ['sklad', 'reporty', 'recenzie'], navyse: 'Commandes aux fournisseurs par e-mail',
      text: 'Stock des ingrédients avec alertes, commandes aux fournisseurs, aperçu hebdomadaire du chiffre d’affaires et avis des clients.' }
  ],

  /* Hlavné časti Jarvisa (stránka Funkcie a úvod). */
  casti: [
    { id: 'ai', nazov: 'Chat IA avec toutes vos IA', text: 'ChatGPT, Claude et Gemini via vos abonnements dans une seule fenêtre, plus des services IA gratuits et un modèle hors ligne. Jarvis choisit lui-même le modèle et la profondeur de la réponse, et quand un compte atteint sa limite, le suivant prend le relais. Jusqu’à 6 tâches à la fois dans différents chats.' },
    { id: 'agent', nazov: 'Il travaille sur l’ordinateur', text: 'Il lit et crée des PDF, Word et Excel, fusionne et remplit des documents, travaille dans le navigateur avec vos connexions et pilote les fenêtres des programmes. Avant un envoi, un paiement, un achat ou une suppression, il demande toujours. Il ne tape jamais de mots de passe.' },
    { id: 'posta', nazov: 'Messagerie avec accès complet', text: 'Gmail et les boîtes mail professionnelles au même endroit. « Regarde mes mails » et vous avez un résumé avec des liens ; pour chaque message, une proposition de réponse que vous envoyez en deux clics. Les mails sans importance et non distribuables se rangent d’un seul bouton.' },
    { id: 'obchodnik', nazov: 'Commercial', text: 'Toutes les 15 minutes, il lit les boîtes mail professionnelles, inscrit les prospects dans Clients, prépare une réponse dans votre style et rappelle les offres sans réponse ainsi que le travail impayé. Rien ne part tout seul.' },
    { id: 'biznis', nazov: 'Business et clients', text: 'Recettes et dépenses par mois, objectif mensuel, ce qui attend d’être payé, état de vos sites web et de leurs certificats. Les clients du premier intérêt jusqu’au paiement, des devis en PDF et une base d’entreprises issue du registre selon le numéro IČO.' },
    { id: 'ulohy', nazov: 'Tâches, calendrier et rappels', text: 'Votre propre tableau façon Trello avec échéances, étiquettes et répétitions ; ajout d’une tâche par une phrase « demain à 9 h appeler le fournisseur ». Un calendrier avec jours fériés et fêtes des prénoms, réveil, minuteur et rappels.' },
    { id: 'hlas', nazov: 'Voix et comptes rendus de réunion', text: 'Maintenez une touche et dictez dans n’importe quelle fenêtre – la transcription tourne hors ligne sur votre carte graphique. Enregistrez une réunion ou un appel et vous obtenez une transcription indiquant qui a parlé, ainsi qu’un compte rendu avec des tâches.' },
    { id: 'automatizacia', nazov: 'Automatisation', text: 'Planifiez le travail que Jarvis fait seul : chaque matin un résumé de la messagerie, le vendredi les factures de la messagerie vers Excel, toutes les 4 heures un contrôle du site web. Quand il faut votre accord, il envoie une notification et attend.' },
    { id: 'mobil', nazov: 'Jarvis sur le mobile', text: 'Chat, messagerie, tâches et validations sur le téléphone via une connexion privée et chiffrée avec votre PC. Une tâche lancée depuis le mobile continue sur l’ordinateur jusqu’au bout, même si vous verrouillez le téléphone.' },
    { id: 'okno', nazov: 'Tout dans une seule fenêtre', text: 'Un navigateur avec onglets et mots de passe, des fichiers avec aperçus Word, Excel et PDF, un terminal, WhatsApp, Teams et Discord – inutile de quitter Jarvis. Ctrl + K trouve n’importe quoi, Alt + S fait une capture d’écran.' },
    { id: 'efaktury', nazov: 'Factures électroniques prêtes pour 2027', text: 'Contrôle, affichage et émission de factures électroniques selon la norme européenne EN 16931 et Peppol BIS 3.0, entièrement hors ligne. Vous contrôlez une facture électronique reçue en pièce jointe d’un seul clic.' },
    { id: 'sukromie', nazov: 'Confidentialité et sécurité', text: 'Les données sont sur votre ordinateur, Windows chiffre les mots de passe et l’IA ne les reçoit jamais. Antivirus et VPN en un clic ; Incognito envoie aux entreprises des demandes d’effacement de vos données selon le RGPD.' }
  ],

  /* Appky v Jarvisovi (podľa Jarvis\public\mini\catalog.json, bez Generátora licencií – ten má len predajca). */
  appky: [
    { kategoria: 'Chaque jour', polozky: [
      ['Notes', 'Notes rapides avec recherche, épinglage et retouche via l\'IA'],
      ['Météo', 'Maintenant, heure par heure et sur 7 jours pour votre ville'],
      ['Horloge', 'Minuteur, chronomètre, réveil, Pomodoro, rappels, comptes à rebours et heure mondiale'],
      ['Calculatrice', 'Calculs avec historique, TVA, pourcentages, unités et devises selon la BCE'],
      ['Traducteur', 'Traduction et retouche de texte via votre IA, 12 langues'],
      ['Radio', 'Radios slovaques et du monde en direct, favorites à portée de main'],
      ['Presse-papiers', 'Ce que vous avez copié – à nouveau en un clic, textes épinglés'],
      ['Habitudes', 'Habitudes quotidiennes avec séries et carte de toute l\'année'],
      ['Calendrier', 'Mois avec jours fériés et fêtes des prénoms, événements avec rappel'],
      ['Dictaphone', 'Notes vocales transcrites en texte directement sur l’ordinateur'],
      ['Argent', 'Recettes et dépenses par mois, catégories et abonnements'],
      ['Actions', 'Actions, ETF et crypto – graphique, chiffres de l’entreprise, analystes, actualités, portefeuille en euros et alertes de prix'],
      ['Lecteur d\'articles', 'Article sans publicité ni pop-ups, résumé IA et lecture à voix haute'],
      ['Exercice', 'Entraînement fractionné – Tabata, HIIT, gainage, Jarvis annonce les exercices'],
      ['Dates et délais', 'Dernier jour du délai selon la loi, jours ouvrés, jours fériés et temps de travail'],
      ['Qui doit combien à qui', 'Dépenses communes en voyage ou au chalet – qui envoie combien à qui, avec le moins de paiements']
    ] },
    { kategoria: 'Travail', polozky: [
      ['Commercial', 'Prospects issus des boîtes mail, réponses préparées et rappels – vous n’avez plus qu’à envoyer'],
      ['Clients · CRM', 'Des affaires du premier intérêt jusqu’au paiement, personnes et entreprises avec le dernier contact et la prochaine étape'],
      ['Base de contacts', 'Entreprises et personnes avec leurs chiffres – depuis la messagerie, Excel et les sites web ; dirigeants et chiffre d’affaires du registre selon le numéro IČO'],
      ['Devis', 'Une offre pour le client avec lignes et TVA en PDF en un clic'],
      ['Textes pour l\'entreprise', 'Publications, réponses aux avis, offres par e-mail et publicités via l\'IA'],
      ['Compte rendu de réunion', 'Enregistrez un appel ou une réunion – transcription indiquant qui a parlé et compte rendu IA avec tâches'],
      ['Relevé d\'heures', 'Chronomètre par projet et client, heures × taux, relevé pour le client et CSV'],
      ['Outils PDF', 'Fusionner, diviser, tourner et réorganiser les pages, images vers PDF'],
      ['Texte de l\'image', 'Texte d\'une capture d\'écran ou d\'une image, hors ligne dans Windows'],
      ['Codes QR', 'QR pour un lien, le Wi-Fi, un contact et le paiement QR PAY by square'],
      ['Contacts et tableaux', 'CSV et Excel : suppression des doublons, contrôle des e-mails, filtre, division'],
      ['Captures d\'écran', 'Capture avec flèches, cadres, texte et masquage des choses sensibles'],
      ['Enregistrement de l\'écran', 'L’écran ou une fenêtre avec le son et le micro en vidéo'],
      ['Vidéo et son', 'Vidéo sous la taille choisie en Mo, extrait découpé, son en MP3, GIF'],
      ['Gardien de pages', 'Surveille des sites web (appels à projets, prix, annonces) et vous prévient quand quelque chose y change'],
      ['Contrôle du site', 'SEO et technique du site en quelques secondes – avec des conseils sur ce qu’il faut corriger'],
      ['Aperçu du site', 'Tout le site page par page – liens cassés, erreurs SEO, sitemap.xml'],
      ['Code SEO pour le site', 'Titre, description, partage, entreprise pour Google et robots.txt – avec aperçu dans Google'],
      ['Images pour le web', 'Réduire et convertir en WebP ou JPEG, même beaucoup à la fois'],
      ['Favicon et icônes', 'Toutes les icônes du site à partir du logo – favicon.ico, Apple, Android, manifest'],
      ['Couleurs', 'Nuances, contraste selon WCAG, pipette et palettes enregistrées']
    ] },
    { kategoria: 'Développement', polozky: [
      ['Testeur HTML', 'Collez du HTML et voyez tout de suite le site sur ordinateur, tablette et mobile, avec les erreurs en rouge'],
      ['Serveurs · WinSCP', 'Les fichiers sur vos serveurs via SFTP, FTP et SCP – envoyer, télécharger, modifier'],
      ['Atelier Odoo', 'Code des actions serveur pour Odoo 17 – 20 vérifié hors ligne, vos modules en zip'],
      ['Développeur', 'JSON, Base64, URL, hash, UUID, JWT, temps et regex'],
      ['Texte', 'Compteur, sans accents, slug, majuscules et minuscules, lignes'],
      ['Mots de passe', 'Mots de passe forts et phrases faciles à retenir, force du mot de passe'],
      ['Comparer des textes', 'Ce qui a été ajouté et ce qui a disparu entre deux versions d\'un texte'],
      ['Symboles et emoji', 'Guillemets, tirets, €, ×, flèches et emoji par mot-clé']
    ] },
    { kategoria: 'Ordinateur', polozky: [
      ['Disque', 'Ce qui prend de la place sur le disque, dossier par dossier'],
      ['Vitesse d\'internet', 'Ping, téléchargement et envoi, historique des mesures'],
      ['Réseau et DNS', 'DNS, domaine e-mail (SPF, DKIM, DMARC), certificat SSL, ping, ports'],
      ['À propos de l\'ordinateur', 'Processeur, carte graphique, mémoire, disques, batterie et Windows'],
      ['Programmes dans Jarvis', 'Git, Node.js et Ollama directement dans Jarvis au lieu d’applications séparées'],
      ['Renommage en masse', 'Beaucoup de fichiers à la fois – sans accents, numérotation, rechercher et remplacer, annuler'],
      ['Fichiers en double', 'Fichiers identiques par contenu – les copies en trop à la Corbeille, une reste toujours'],
      ['Temps au PC', 'Combien de temps dans quel programme – par jour, d’un clic dans le Relevé d’heures'],
      ['Nettoyeur', 'Range les Téléchargements dans des dossiers – ne supprime rien, peut être annulé']
    ] },
    { kategoria: 'Apprentissage', polozky: [
      ['Vocabulaire', 'Cartes de révision au bon moment – l\'IA les crée à partir d\'un texte'],
      ['Taper avec les dix doigts', 'Vitesse et précision de frappe sur des textes slovaques'],
      ['Encyclopédie', 'Wikipédia en français directement dans Jarvis, résumé et lecture à voix haute'],
      ['Quiz', 'Quiz IA sur n\'importe quel sujet – même pour le bac, avec explications'],
      ['Graphique de fonctions', 'Fonctions comme à l\'école – graphique, zéros, intersections et tableau de valeurs'],
      ['Géographie', 'Drapeaux et capitales – quiz pour l’Europe et le monde entier']
    ] },
    { kategoria: 'Jeux', polozky: [
      ['2048', 'Assemblez les nombres jusqu’à 2048'], ['Sudoku', 'Trois difficultés, notes, vérification et temps'],
      ['Morpion', 'Cinq en ligne contre Jarvis'], ['Memory', 'Trouvez les paires, records selon la taille'],
      ['Serpent', 'Le serpent classique, qui accélère'], ['Hasard', 'Dés, pièce, nombre et répartition en équipes'],
      ['Échecs', 'Les échecs contre Jarvis à trois niveaux'], ['Mines', 'Démineur, le premier clic est toujours sûr'],
      ['Dés', 'Blocs qui tombent, avec ombre et mise de côté'], ['Solitaire', 'Klondike à 1 ou 3 cartes'],
      ['Quatre en ligne', 'Quatre en ligne contre Jarvis ou à deux'], ['Slovko', 'Le Wordle slovaque, un nouveau mot chaque jour'],
      ['Arkanoid', 'Raquette, balle et briques – 6 niveaux']
    ] }
  ],

  otazky: [
    ['Puis-je d’abord essayer Jarvis ?', 'Oui. Vous téléchargez Jarvis gratuitement et l’utilisez en entier pendant 7 jours, sauf les extensions payantes – sans clé de licence, sans carte et sans engagement. Quand vous choisissez un plan, vous saisissez la clé de licence dans le même Jarvis et vous continuez. Si vous ne choisissez pas de plan, Jarvis se verrouille au bout de 7 jours, vous ne payez rien et vos données restent sur l’ordinateur. Chaque extension payante, vous pouvez ensuite l’essayer encore une fois pendant 7 jours en entier, directement dans Jarvis.'],
    ['Sur quel ordinateur Jarvis fonctionne-t-il ?', 'Sur Windows 10 ou 11 (64 bits). Nous recommandons au moins 16 Go de RAM. Pour votre propre modèle d’IA hors ligne, une carte graphique NVIDIA avec 12 Go de mémoire ou 32 Go de RAM convient – je vérifie volontiers votre ordinateur avant la commande.'],
    ['Dois-je avoir un abonnement ChatGPT ou Claude ?', 'Non. Jarvis fonctionne aussi avec des services IA gratuits (par exemple Google AI Studio ou Groq) et avec un modèle hors ligne. Avec un abonnement (ChatGPT Plus, Claude Pro, Gemini), vous obtenez les meilleures réponses. Vous payez l’abonnement directement au fournisseur – sans supplément, Jarvis utilise simplement vos comptes.'],
    ['Que comprend exactement l’installation ?', 'Jarvis installé et configuré pour votre travail : comptes IA, messagerie, agenda et WhatsApp connectés, entreprises, prix et style des réponses configurés, import des contacts, 60 minutes de formation et 14 jours d’aide prioritaire. L’installation se fait sur demande et se paie une seule fois – actuellement 99 € au lieu de 149 €. Vous pouvez aussi télécharger et installer Jarvis vous-même gratuitement.'],
    ['Pourquoi paie-t-on chaque mois ?', 'Le plan mensuel est une licence d’utilisation de Jarvis et le soin que je lui apporte : mises à jour continues et nouvelles fonctions, corrections, contrôle après chaque nouvelle version et assistance selon le plan. À l’année, vous payez 12 mois pour le prix de 10.'],
    ['Et si j’arrête de payer ?', 'La licence est valable jusqu’au dernier jour payé. Ensuite, vous avez 14 jours pour la renouveler avant que Jarvis ne se verrouille. Vos données restent sur votre ordinateur et vous pouvez les exporter à tout moment.'],
    ['Où sont mes données et qui peut les voir ?', 'Tout se trouve sur votre ordinateur. Les mots de passe sont chiffrés par Windows et l’IA ne les reçoit jamais. Le texte que vous écrivez va uniquement au service d’IA que vous choisissez – avec un modèle hors ligne, il ne part nulle part. En tant que vendeur, je n’ai pas accès à vos données ; lors d’une aide à distance, seulement pendant la connexion que vous autorisez vous-même et pouvez interrompre à tout moment.'],
    ['Comment se déroule l’installation ?', 'Par vous-même : vous téléchargez le programme d’installation, vous le lancez et vous saisissez votre nom – cela prend quelques minutes. Si vous me commandez l’installation, nous convenons d’une date après le paiement. L’installation dure généralement 2 à 3 heures par partage d’écran ; dans la région de Senec et de Bratislava, elle peut aussi se faire sur place. Vous vous contentez de vous connecter à vos comptes – ce n’est pas moi qui saisis les mots de passe.'],
    ['Puis-je voir Jarvis avant de commander ?', 'Oui – téléchargez-le et essayez-le gratuitement pendant 7 jours. Si vous le souhaitez, écrivez-moi et nous conviendrons aussi d’un court appel vidéo au cours duquel je vous montrerai Jarvis en direct et répondrai à vos questions.'],
    ['Fonctionne-t-il aussi sur Mac ou sur mobile ?', 'Jarvis fonctionne sous Windows. Sur mobile (iPhone comme Android), vous l’utilisez via une connexion privée à votre ordinateur – qui doit être allumé. Il n’existe pas encore pour Mac.'],
    ['Jarvis fait-il quelque chose sans mon accord ?', 'Il lit et règle les choses courantes tout de suite, puis vous en informe. Avant d’envoyer un e-mail, de payer, d’acheter, de supprimer, de publier ou de confirmer quoi que ce soit, il demande toujours. Il ne saisit jamais de mots de passe – vous vous connectez vous-même.'],
    ['Sur combien d’ordinateurs puis-je utiliser Jarvis ?', 'Selon le plan : Start 1, Business 3 et Pro 5 ordinateurs. Sur un autre ordinateur, vous installez Jarvis vous-même ; si vous souhaitez que je m’en charge, l’installation coûte 99 €.'],
    ['Puis-je changer de plan ?', 'À tout moment. Un plan supérieur s’applique dès le paiement de la différence, un plan inférieur à partir de la période suivante.'],
    ['Comment payer ?', 'Par virement sur le compte indiqué dans la commande – scannez le code QR SEPA dans l’application de votre banque ou payez avec l’IBAN. Un plan mensuel se paie d’avance pour un mois, un plan annuel pour 12 mois. Après le paiement, je vous envoie la clé de licence par e-mail. Le paiement par carte arrive bientôt.'],
    ['Puis-je me rétracter du contrat ?', 'Le consommateur peut se rétracter d’un contrat conclu à distance dans un délai de 14 jours sans avoir à motiver sa décision. S’il demande lors de la commande que je commence plus tôt, il ne paie que la part proportionnelle de la prestation déjà fournie, et une fois le service entièrement fourni ou la fourniture du contenu numérique commencée, le droit de rétractation s’éteint. Les détails figurent dans les conditions générales de vente.'],
    ['Et si quelque chose tombe en panne ?', 'Après chaque mise à jour, Jarvis se contrôle lui-même et enregistre l’erreur. Écrivez-moi et je vous répondrai dans le délai prévu par votre plan ; en cas d’urgence, il y a l’Aide express sous 2 heures.']
  ]
};
