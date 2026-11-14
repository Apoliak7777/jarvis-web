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
    { id: 'start', nazov: 'Start', mesacne: 15, pc: 1, pre: 'Para una persona que quiere tenerlo todo en una sola ventana.',
      body: ['Todas las funciones y más de 70 aplicaciones', 'Lo básico de cada extensión incluido: p. ej. solicitud de pago con QR, copia de seguridad con un clic, comprobación de empresas, recordatorios de servicio', '1 ordenador', 'Actualizaciones continuas y nuevas funciones', 'Soporte por correo en un plazo de 2 días laborables'] },
    { id: 'biznis', nazov: 'Business', mesacne: 29, pc: 3, odporucany: true, pre: 'Para autónomos y pequeñas empresas que viven del correo y de sus clientes.',
      body: ['Todo lo de Start', 'Hasta 3 ordenadores', 'Jarvis en el móvil – configuración incluida', 'Soporte en un plazo de 1 día laborable', 'Ayuda remota una vez al mes', 'Revisión y ajuste una vez al trimestre'] },
    { id: 'pro', nazov: 'Pro', mesacne: 49, pc: 5, pre: 'Para una empresa que quiere adaptar Jarvis a su trabajo.',
      body: ['Todo lo de Business', 'Hasta 5 ordenadores', 'Su propio modelo de IA sin conexión – configuración incluida', '1 hora de trabajo a medida cada mes', 'Soporte en 4 horas los días laborables, también por teléfono', 'Nuevas funciones antes que nadie'] }
  ],
  porovnanie: [
    ['Todas las funciones y más de 70 aplicaciones', true, true, true],
    ['Lo básico de cada extensión (solicitud de pago con QR, justificantes a mano, 10 documentos de la empresa, copia de seguridad, QR para reseñas, comprobación de empresas, 2 plantillas de documentos, recordatorios de servicio)', true, true, true],
    ['Número de ordenadores', '1', '3', '5'],
    ['Actualizaciones y nuevas funciones', true, true, true],
    ['Soporte por correo', 'en 2 días laborables', 'en 1 día laborable', 'en 4 horas'],
    ['Soporte telefónico', false, false, true],
    ['Ayuda remota compartiendo la pantalla', false, '1× al mes', 'según sea necesario'],
    ['Jarvis en el móvil (configuración)', '59 €', 'incluido', 'incluido'],
    ['Su propio modelo de IA sin conexión (configuración)', '149 €', '149 €', 'incluido'],
    ['Revisión y ajuste de Jarvis', false, 'una vez al trimestre', 'una vez al mes'],
    ['Trabajo a medida', false, false, '1 hora al mes'],
    ['Nuevas funciones antes (versiones de prueba)', false, false, true]
  ],
  instalaciaObsahuje: [
    'Instalación de Jarvis en su ordenador – a distancia, o en persona en los alrededores de Senec y Bratislava',
    'Conexión de sus cuentas de IA (ChatGPT, Claude, Gemini) o de servicios de IA gratuitos',
    'Conexión del correo – todos sus buzones, el calendario y WhatsApp',
    'Configuración según su trabajo: menú, empresas, precios, firma y estilo de las respuestas',
    'Importación de contactos desde una fuente (Excel, Outlook o el teléfono)',
    '60 minutos de formación, hasta que sepa dónde está cada cosa',
    '14 días de ayuda prioritaria tras la instalación',
    'Licencia para el primer ordenador'
  ],

  /* Obchod. kategoria: plany | doplnky | sluzby | baliky. cena = jednorazovo; plán má cenu z plany[]. */
  kategorie: [
    { id: 'plany', nazov: 'Instalación y planes' },
    { id: 'doplnky', nazov: 'Complementos' },
    { id: 'rozsirenia', nazov: 'Extensiones para empresas' },
    { id: 'sluzby', nazov: 'Servicios' },
    { id: 'baliky', nazov: 'Paquetes' }
  ],
  produkty: [
    { id: 'instalacia', kategoria: 'plany', nazov: 'Instalación y configuración de Jarvis', cena: 99, povodne: 149, ikona: 'install',
      kratko: 'Jarvis instalado y configurado para su trabajo. A petición: también puede descargarlo e instalarlo usted mismo.',
      popis: 'Le instalo Jarvis y lo configuro para que lo use desde el primer día en su trabajo real, no para hacer pruebas. Conectamos sus cuentas de IA, su correo y su calendario, configuramos sus empresas, precios y el estilo de las respuestas, y en una hora le enseño todo lo importante.',
      obsahuje: 'instalacia', poznamka: 'Se paga una vez. Junto con la instalación elige un plan mensual o anual.' },
    { id: 'plan-start', kategoria: 'plany', plan: 'start', nazov: 'Plan Start', ikona: 'plan',
      kratko: '1 ordenador, todas las funciones, actualizaciones y soporte por correo.',
      popis: 'Jarvis completo con todas sus funciones para una persona en un ordenador. Las actualizaciones y las funciones nuevas llegan solas, y respondo a las preguntas por correo en 2 días laborables.' },
    { id: 'plan-biznis', kategoria: 'plany', plan: 'biznis', nazov: 'Plan Business', ikona: 'plan',
      kratko: 'Hasta 3 ordenadores, Jarvis en el móvil y soporte más rápido.',
      popis: 'Para un autónomo o una pequeña empresa: Jarvis en hasta tres ordenadores, en el móvil (configuración incluida), soporte en un día laborable, ayuda remota una vez al mes y una revisión trimestral de que todo funciona como debe.' },
    { id: 'plan-pro', kategoria: 'plany', plan: 'pro', nazov: 'Plan Pro', ikona: 'plan',
      kratko: 'Hasta 5 ordenadores, IA sin conexión y una hora de trabajo a medida al mes.',
      popis: 'Jarvis adaptado a su empresa: hasta cinco ordenadores, su propio modelo de IA sin conexión configurado e incluido, una hora de trabajo a medida cada mes (una función nueva, una automatización, una conexión) y soporte en 4 horas los días laborables, también por teléfono.' },

    { id: 'dalsi-pc', kategoria: 'doplnky', nazov: 'Jarvis en otro ordenador', cena: 99, ikona: 'pc', mnozstvo: true,
      kratko: 'Instalación y configuración en otro ordenador dentro de su plan.',
      popis: 'Instalo Jarvis en otro ordenador de su empresa y le conecto las cuentas de la persona que lo va a usar. El número de ordenadores depende del plan (Start 1, Business 3, Pro 5); si necesita más, basta con un plan superior.' },
    { id: 'mobil', kategoria: 'doplnky', nazov: 'Jarvis en el móvil', cena: 59, ikona: 'phone', vCene: ['biznis', 'pro'],
      kratko: 'Todo Jarvis en el teléfono mediante una conexión privada y cifrada con su PC.',
      popis: 'Jarvis en iPhone y Android: chat, correo, tareas, resumen del día, aprobaciones sí/no y notificaciones. La conexión va por una red privada cifrada entre su teléfono y su ordenador; nadie la ve desde internet. Una tarea encargada desde el móvil se ejecuta en el PC hasta el final, aunque bloquee el teléfono.',
      poznamka: 'En los planes Business y Pro la configuración está incluida. El ordenador tiene que estar encendido.' },
    { id: 'offline-ai', kategoria: 'doplnky', nazov: 'Su propio modelo de IA sin conexión', cena: 149, ikona: 'chip', vCene: ['pro'],
      kratko: 'Una IA que funciona solo en su ordenador. Nada sale a Internet.',
      popis: 'Instalo y ajusto un modelo de lenguaje que funciona directamente en su tarjeta gráfica. Jarvis lo usa para los asuntos sensibles (correo, contratos, cifras de la empresa) y como respaldo cuando no hay internet o suscripción. Antes del pedido compruebo si su ordenador puede con él.',
      poznamka: 'Recomendado: una tarjeta gráfica NVIDIA con 12 GB de memoria o 32 GB de RAM. Incluido en el plan Pro.' },
    { id: 'obchodnik', kategoria: 'doplnky', nazov: 'Comercial a medida', cena: 149, ikona: 'deal',
      kratko: 'Interesados de sus buzones, respuestas con su estilo y recordatorios de pago.',
      popis: 'Configuro el Comercial para su negocio: qué vende, cuáles son sus precios, cómo responde y cuál es el siguiente paso. Después, Jarvis lee los buzones de la empresa cada 15 minutos, registra a los interesados en Clientes, prepara una respuesta para su aprobación y le recuerda las ofertas sin respuesta y el trabajo sin cobrar.' },
    { id: 'prenos-dat', kategoria: 'doplnky', nazov: 'Traslado de contactos y datos', cena: 79, ikona: 'import',
      kratko: 'Contactos y clientes de varias fuentes: Excel, un CRM antiguo, Outlook, el teléfono.',
      popis: 'Traslado sus contactos, clientes y notas de varias fuentes a Jarvis, fusiono los duplicados, compruebo los correos y completo los datos de las empresas desde el registro según su número IČO.' },
    { id: 'hlas', kategoria: 'doplnky', nazov: 'Voz y dictado a medida', cena: 49, ikona: 'mic',
      kratko: 'Micrófono, su propio diccionario de nombres y expresiones, atajos de teclado.',
      popis: 'Configuro el dictado para que entienda su trabajo: un diccionario con los nombres de sus clientes, productos y términos técnicos, teclas para dictar en cualquier ventana y traducción al inglés. La transcripción funciona sin conexión en su ordenador.' },
    { id: 'automatizacia', kategoria: 'doplnky', nazov: 'Automatización a medida', cena: 149, ikona: 'auto', mnozstvo: true,
      kratko: 'Un trabajo repetitivo que Jarvis hace solo, p. ej. las facturas del correo a Excel.',
      popis: 'Elegimos una tarea que repite una y otra vez, y Jarvis la hará solo a la hora fijada: facturas del correo a una hoja de cálculo, un resumen matutino del correo y las tareas, la revisión de la web y la tienda online, un resumen semanal de ingresos. Antes de enviar o pagar siempre pregunta.' },
    { id: 'odoo', kategoria: 'doplnky', nazov: 'Conexión con Odoo', cena: 290, ikona: 'link',
      kratko: 'Jarvis lee y escribe en su Odoo: pedidos, contactos, facturas.',
      popis: 'Conecto Jarvis con su Odoo mediante la API: busca un pedido o una factura, registra un contacto o una tarea nuevos y prepara un resumen. La conexión básica cubre hasta 5 tipos de registros; un alcance mayor lo acordamos de antemano.' },
    { id: 'prepojenie', kategoria: 'doplnky', nazov: 'Conexión con su sistema', cena: 190, ikona: 'link',
      kratko: 'Pohoda, Money S3, SuperFaktúra, PrestaShop, Shopify, Google Workspace o Microsoft 365.',
      popis: 'Conecto Jarvis con el sistema que su empresa ya utiliza: programa de contabilidad (Pohoda, Money S3), facturación (SuperFaktúra), tienda online (PrestaShop, Shopify; para WooCommerce y Shoptet existe la extensión Conexión con la tienda online) o Google Workspace o Microsoft 365. Jarvis lee de él y escribe en él. El precio es para la conexión básica de un sistema; un alcance mayor lo acordamos de antemano.' },
    { id: 'postupy', kategoria: 'doplnky', nazov: 'Procedimientos de la empresa', cena: 149, ikona: 'auto',
      kratko: '5 procedimientos del tipo «cuando llegue una reclamación, haz esto»: Jarvis los cumple paso a paso.',
      popis: 'Juntos describimos cinco cosas que en su empresa se hacen siempre igual (una reclamación, un cliente nuevo, un pedido de material, una oferta, el cierre del mes) y las configuro como procedimientos en Jarvis. Cuando dice «ha llegado una reclamación», Jarvis actúa exactamente como usted lo haría.' },
    { id: 'vzhlad', kategoria: 'doplnky', nazov: 'Apariencia de la empresa', cena: 99, ikona: 'palette',
      kratko: 'El logo, los colores y el nombre de su empresa en Jarvis.',
      popis: 'Jarvis con los colores de su empresa, con su logotipo y su nombre («Jarvis · Cafetería Sova»), un saludo para sus empleados y la firma de la empresa en las respuestas.' },

    /* Rozšírenia pre firmy: mesačne ku plánu, platia spolu s licenciou (v kľúči pole m). pripravujeme = zatiaľ sa nedá kúpiť.
       zaklad = čo z rozšírenia má každý plán zadarmo (Jarvis 3.117: ľahká verzia v každom Jarvisovi, rozšírenie pridá zvyšok). */
    { id: 'modul-reporty', modul: 'reporty', kategoria: 'rozsirenia', nazov: 'Resumen para el propietario', mesacne: 5, ikona: 'chart', snimka: 'modul_prehlad',
      zaklad: 'la tarjeta Esta semana en Negocio con los ingresos, las facturas sin cobrar y los nuevos interesados, y en cada encargo sus ingresos y las horas trabajadas.',
      kratko: 'Cada lunes un resumen de la empresa y la rentabilidad de cada encargo: lo que ganó después de los costes.',
      popis: 'Cada lunes por la mañana recibe un resumen de la empresa: ingresos y gastos frente a la semana y el mes anteriores, nuevos interesados, ofertas en juego, lo que está pendiente de pago y qué tareas están vencidas. A fin de mes, un cierre en PDF para enviar a su socio o a su contable. Además, Cuándo se acabará el dinero: el saldo de la cuenta dentro de 30, 60 y 90 días según los vencimientos de facturas, justificantes, pagos periódicos y contratos, con un aviso si fuera a bajar de cero. Rentabilidad de los encargos: para cada encargo, los ingresos de las facturas, las horas trabajadas del Registro de horas, el material del almacén y los justificantes y costes que le asigne: beneficio, margen y ganancia por hora, para ver qué encargos compensan.' },
    { id: 'modul-hovory', modul: 'hovory', kategoria: 'rozsirenia', nazov: 'Llamadas y reuniones al CRM', mesacne: 9, ikona: 'phonecall', snimka: 'modul_hovory_navrh',
      zaklad: 'Acta de la reunión, con grabación, transcripción y resumen.',
      kratko: 'Una llamada o reunión grabada → transcripción, resumen y tareas directamente en el cliente.',
      popis: 'Grabe una llamada con un cliente o una reunión y Jarvis hará una transcripción con quién dijo qué, un breve resumen y las tareas. Lo guarda todo en el cliente correcto y pone las tareas en el Tablero. La transcripción funciona sin conexión en su ordenador.' },
    { id: 'modul-faktury', modul: 'faktury', kategoria: 'rozsirenia', nazov: 'Facturas y recordatorios', mesacne: 9, ikona: 'invoice', snimka: 'modul_faktury',
      zaklad: 'solicitud de pago con código QR PAY by square y texto para el cliente.',
      kratko: 'Factura con QR y pago con tarjeta, facturas electrónicas por Peppol, oferta con botón Aceptar y cobros conciliados solos.',
      popis: 'Emite la factura con código QR para el pago directamente desde la ficha del cliente, con numeración, PDF y al momento también como factura electrónica Peppol para la facturación electrónica obligatoria en Eslovaquia desde 2027. La envía por correo con un clic, se registra en Negocio y Jarvis vigila el vencimiento: 3 y 14 días después prepara un recordatorio que usted solo revisa y envía. Facturas electrónicas por Peppol: con una cuenta en un «cartero digital» (punto de acceso Peppol según el estándar eslovaco SAPI-SK), Jarvis envía la factura directamente al sistema del cliente y recoge por sí solo en Justificantes las facturas electrónicas de los proveedores. Pago con tarjeta: con su propia cuenta de Stripe, cada factura enviada por correo lleva también un enlace para pagar con tarjeta y, una vez pagada, se marca sola como cobrada. Cobros del banco: concilia el extracto de la banca online (XML o CSV, automáticamente con Fio banka) con las facturas y los justificantes según el símbolo variable y el importe, y concilia por sí solo cada media hora las notificaciones por correo del banco sobre pagos recibidos (solo mensajes verificados del banco). Oferta con botón Aceptar: envía el presupuesto como enlace, el cliente lo acepta con un clic y en Clientes se crea un encargo, si quiere, también con factura de anticipo. Las facturas periódicas (hosting, contrato de mantenimiento, alquiler) se emiten solas cada mes, trimestre o año; liquida con un clic una factura de anticipo pagada y emite una factura rectificativa de una factura. Cada mes prepara una exportación para su contable a POHODA o Money S3. Funciona tanto para sujetos pasivos del IVA como para no sujetos.' },
    { id: 'modul-doklady', modul: 'doklady', kategoria: 'rozsirenia', nazov: 'Justificantes del correo', mesacne: 9, ikona: 'mail', snimka: 'modul_doklady',
      zaklad: 'un justificante añadido a mano (PDF o foto); Jarvis extrae el proveedor, el importe y el vencimiento y lo anota en Negocio.',
      kratko: 'Facturas y tiques del correo y del móvil a una tabla para la gestoría.',
      popis: 'Una vez al día, Jarvis encuentra en su correo las facturas y facturas electrónicas recibidas, lee incluso un tique fotografiado y extrae el proveedor, el importe, el IVA, el vencimiento, el IBAN y el símbolo variable. Usted solo revisa los datos y los registra como gastos con un clic; lo que haya que pagar lo paga con el código QR en el móvil. A fin de mes prepara un paquete para su contable: una tabla para Excel y todos los justificantes en un solo archivo ZIP o un archivo para importar en POHODA o Money S3. Los justificantes vencidos los paga de una vez con una orden de transferencia múltiple SEPA que solo tiene que subir a la banca online.' },
    { id: 'modul-znalosti', modul: 'znalosti', kategoria: 'rozsirenia', nazov: 'Conocimiento de la empresa', mesacne: 9, ikona: 'book',
      zaklad: 'hasta 10 documentos y preguntas sobre ellos en la aplicación Conocimiento de la empresa.',
      kratko: 'Jarvis aprende sus tarifas, procedimientos y contratos y responde a partir de ellos.',
      popis: 'Le da a Jarvis los documentos de la empresa (tarifas, procedimientos, contratos, respuestas a preguntas frecuentes) y él responde a partir de ellos, con un enlace a la fuente. Una persona nueva en la empresa pregunta a Jarvis en lugar de a usted, y las respuestas siempre siguen la tarifa vigente.' },
    { id: 'modul-sukromie', modul: 'sukromie', kategoria: 'rozsirenia', nazov: 'Modo privado', mesacne: 9, ikona: 'lock',
      zaklad: 'copia de seguridad de todos los datos de Jarvis con un clic en una carpeta, en un USB o en un NAS.',
      kratko: 'Correo y clientes solo con la IA sin conexión, registro y copias de seguridad en el disco de la empresa.',
      popis: 'Para empresas con datos sensibles: el correo, los clientes y los contratos van solo al modelo de IA de su ordenador, nunca a la nube. El Diario muestra quién hizo qué, y los datos se copian cada día cifrados en el disco de la empresa o en un NAS. Requiere el modelo de IA sin conexión.' },
    { id: 'modul-recenzie', modul: 'recenzie', kategoria: 'rozsirenia', nazov: 'Reseñas y reputación', mesacne: 5, ikona: 'star',
      zaklad: 'enlace y código QR para reseñas de Google, reseñas añadidas a mano, propuesta de respuesta y petición de reseña por correo.',
      kratko: 'Vigilancia de las reseñas de Google y respuestas con su estilo, tarjetas NFC para nuevas reseñas.',
      popis: 'Jarvis sigue las nuevas reseñas de su empresa en Google, le avisa cuando llega una mala y prepara una respuesta con su estilo. Unos días después del pago de una factura prepara en Borradores una petición de reseña para el cliente, como máximo una vez al año a cada uno. Además, las tarjetas NFC ťukni para el mostrador: el cliente acerca el móvil y escribe la reseña al momento.' },
    /* Jarvis 3.118: druhá várka – Preverenie firmy, Dokumenty zo šablón, Hromadné maily, Tendre a dotácie; Sklad hotový */
    { id: 'modul-preverenie', modul: 'preverenie', kategoria: 'rozsirenia', nazov: 'Comprobación de la empresa', mesacne: 5, ikona: 'shield',
      zaklad: 'la comprobación de una empresa con un clic según el número IČO: concurso, liquidación, deudores y responsabilidad por el IVA.',
      kratko: 'Vigila cada semana a sus clientes y proveedores: deudas, concurso y responsabilidad por el IVA.',
      popis: 'Antes de un negocio introduce el número IČO y Jarvis consulta el registro mercantil, las últimas cuentas anuales, los deudores de la Administración Financiera y de la Seguridad Social eslovacas y la lista de contribuyentes del IVA con motivo para la baja en el registro, de cuyo IVA usted respondería. Con la extensión vuelve a comprobar por sí solo cada semana a todos sus clientes y proveedores y le avisa cuando alguno aparece entre los deudores o en concurso.' },
    { id: 'modul-sablony', modul: 'sablony', kategoria: 'rozsirenia', nazov: 'Documentos a partir de plantillas', mesacne: 5, ikona: 'invoice',
      zaklad: 'dos plantillas de Word propias rellenadas desde Clientes y el registro de empresas, en Word y PDF.',
      kratko: 'Contratos, actas y pedidos a partir de sus plantillas de Word con un clic.',
      popis: 'En su documento de Word escribe campos como {{firma}}, {{ico}} o {{adresa}} y Jarvis lo rellena con la ficha del cliente, el registro mercantil y los datos de su empresa: Word y PDF listos. La extensión añade cualquier número de plantillas y un mismo documento para varios clientes a la vez.' },
    { id: 'modul-hromadne', modul: 'hromadne', kategoria: 'rozsirenia', nazov: 'Correos masivos a clientes', mesacne: 9, ikona: 'mail',
      kratko: 'Un correo a los clientes elegidos con su nombre, a Borradores o poco a poco desde el buzón.',
      popis: 'Usted escribe un solo correo (también con ayuda de la IA) y Jarvis lo prepara para cada cliente elegido con su nombre y su empresa: en Borradores para revisarlo, o lo envía poco a poco desde su buzón para que nadie lo marque como spam. Bajo cada correo añade la opción de darse de baja y gestiona por sí solo las respuestas que piden la baja.' },
    { id: 'modul-tendre', modul: 'tendre', kategoria: 'rozsirenia', nazov: 'Licitaciones y subvenciones', mesacne: 9, ikona: 'deal',
      kratko: 'Cada mañana, nuevas licitaciones públicas y convocatorias de subvenciones según a lo que se dedica.',
      popis: 'Describe a qué se dedica su empresa y cada mañana Jarvis revisa las nuevas licitaciones de poderes adjudicadores eslovacos en el diario de la UE (TED) y las nuevas convocatorias de subvenciones (Eurofondy, MIRRI, SBA). Lo que encaja se lo muestra con el plazo y el valor y le avisa.' },
    { id: 'modul-sklad', modul: 'sklad', kategoria: 'rozsirenia', nazov: 'Almacén y pedidos', mesacne: 9, ikona: 'pack',
      kratko: 'Un almacén sencillo, aviso de existencias mínimas y pedido con un clic.',
      popis: 'Un almacén sencillo sin un sistema complicado: mercancía y material, entradas, salidas e inventario con historial, existencias mínimas y aviso cuando algo se está agotando. Jarvis prepara el pedido al proveedor como un correo que usted solo tiene que enviar, y tras la entrega da entrada a la mercancía con un clic. Una lista de Excel la sube de una vez.' },
    /* Jarvis 3.119: GDPR pre firmu a Prepojenie s e-shopom */
    { id: 'modul-gdpr', modul: 'gdpr', kategoria: 'rozsirenia', nazov: 'RGPD para la empresa', mesacne: 5, ikona: 'lock',
      zaklad: 'la información a los clientes sobre el tratamiento de datos personales y el consentimiento al tratamiento, rellenados con los datos de su empresa en PDF.',
      kratko: 'Registros de tratamiento, solicitudes de las personas con el plazo vigilado, consentimientos y brechas.',
      popis: 'Todo lo que una pequeña empresa necesita para el RGPD, en un solo lugar: registros de actividades de tratamiento a partir de modelos (clientes, empleados, newsletter, cámaras), solicitudes de las personas sobre sus datos con control del plazo de un mes y respuesta en Borradores, registro de consentimientos, violaciones de seguridad de los datos con las 72 horas para notificarlas y documentos con los datos de su empresa: información para los clientes, consentimiento, contrato de encargo del tratamiento e instrucciones para empleados.' },
    { id: 'modul-eshop', modul: 'eshop', kategoria: 'rozsirenia', nazov: 'Conexión con la tienda online', mesacne: 9, ikona: 'cart',
      kratko: 'Los pedidos de WooCommerce o Shoptet van solos a los clientes, las facturas y el almacén.',
      popis: 'Cada 30 minutos Jarvis revisa su tienda online en WooCommerce o Shoptet y procesa solo los pedidos nuevos: registra al cliente en Clientes, emite la factura (si la tienda no la emite ya), da de baja la mercancía del almacén según su código y anota la venta en Negocio. Basta con una clave de solo lectura: Jarvis no escribe nada en la tienda.' },
    /* Jarvis 3.120: Tím a Rezervácie online hotové (Jarvis Brána na stiahnut.apoliak.online), nové Zmluvy a poistky a AI asistent na web */
    { id: 'modul-tim', modul: 'tim', kategoria: 'rozsirenia', nazov: 'Equipo', mesacne: 5, zaCloveka: true, mnozstvo: true, ikona: 'team',
      kratko: 'Clientes, tareas y notas compartidos para todos en la empresa.',
      popis: 'Clientes, tareas y notas compartidos por toda la empresa: quién se encarga de cada encargo, qué está hecho y qué está vencido. Los compañeros se unen con el código del equipo y un cambio en un ordenador aparece en los demás en menos de medio minuto; si dos personas cambian lo mismo, vale el cambio más reciente. Solo se comparte lo que es para el equipo: Clientes, el tablero Equipo en Tareas y las notas marcadas para el equipo; las notas privadas siguen siendo suyas. Los datos pasan por el servidor de Jarvis cifrados con la clave del equipo, que solo tiene su equipo: el servidor no puede leerlos. Se paga por cada persona del equipo.' },
    { id: 'modul-rezervacie', modul: 'rezervacie', kategoria: 'rozsirenia', nazov: 'Reservas online', mesacne: 15, ikona: 'plan',
      kratko: 'Sistema de reservas para sus clientes: citas en el calendario de Jarvis, lista de espera, estadísticas.',
      popis: 'Sus clientes reservan la cita por su cuenta en su página de reservas (salón, taller, consulta, cursos): eligen el servicio, la persona o la sala, el día y la hora entre los huecos libres de su Calendario. La cita se apunta sola en el Calendario de Jarvis y el cliente en Clientes; el cliente recibe la confirmación por correo desde su buzón y un recordatorio antes de la cita, y puede cambiarla o cancelarla con el enlace de la confirmación. Cuando está todo completo, se apunta a la lista de espera y recibe un correo cuando queda un hueco libre. En cada servicio configura una pausa antes y después; en Jarvis ve el día por persona, quién vino y quién no, el historial de cada cliente y las estadísticas de ingresos. Tras la visita, Jarvis le pide al cliente una reseña en Google. La página está en 10 idiomas, con el color de su empresa, y funciona aunque su ordenador esté apagado. El enlace lo pone en su web, su perfil de Google o Instagram.' },
    { id: 'modul-zmluvy', modul: 'zmluvy', kategoria: 'rozsirenia', nazov: 'Contratos y seguros', mesacne: 5, ikona: 'contract',
      zaklad: '5 contratos y seguros con plazo de preaviso y aviso.',
      kratko: 'Alquiler, seguros, suministros y leasing con plazos de preaviso: Jarvis le avisa a tiempo.',
      popis: 'Todos los contratos de la empresa en un solo lugar: alquiler, seguros, energía, leasing, teléfonos y servicios. Jarvis sabe hasta cuándo están vigentes, cuándo se renuevan solos y hasta cuándo hay que enviar la rescisión, y le avisa con antelación, una semana y un día antes. Prepara la rescisión como carta en PDF, extrae por sí solo de un contrato en PDF la otra parte, el importe y las fechas, e incluye los pagos periódicos en el resumen Cuándo se acabará el dinero. La extensión añade un número ilimitado de contratos, la lectura de contratos con IA y la rescisión en PDF.' },
    { id: 'modul-asistent', modul: 'asistent', kategoria: 'rozsirenia', nazov: 'Asistente de IA para la web', mesacne: 15, ikona: 'chat',
      zaklad: 'una ventana en su web con formulario de contacto; las consultas llegan directamente a Clientes.',
      kratko: 'Una ventana en su web que responde a los clientes con sus tarifas y documentos.',
      popis: 'Inserta una sola línea de código en su web (WordPress, Wix, Shoptet o su propia web) y abajo a la derecha aparece una ventana con el color de su empresa. A los visitantes les responde su Jarvis, solo a partir de lo que usted le permita: servicios, precios, horario de apertura y documentos seleccionados de Conocimiento de la empresa. Cuando no sabe qué responder o el ordenador está apagado, ofrece un formulario de contacto y la consulta llega directamente a Clientes. Las respuestas pasan por su propia clave de API o por un modelo sin conexión, y usted ve cada pregunta y cada respuesta en Jarvis.' },
    /* Jarvis 3.151 (Alex 13. 11. 2026: „tie letenky to bude za nejaký príplatok … dobre naceň“): 50 € ročne ako Going Premium;
       3.152 aj Wizz Air, ubytovanie na dni letu s cenou celej dovolenky a zájazdy */
    { id: 'modul-letenky', modul: 'letenky', kategoria: 'rozsirenia', nazov: 'Vuelos + escapadas', mesacne: 5, ikona: 'plane',
      zaklad: 'los vuelos de ida y vuelta de Ryanair más baratos desde un aeropuerto, los diez destinos más baratos.',
      kratko: 'Vuelos baratos de Ryanair y Wizz Air desde cuatro aeropuertos a la vez, alojamiento para los días del vuelo, paquetes y una alerta de precios.',
      popis: 'Indica el periodo, cuántas noches quiere quedarse y el precio máximo: Jarvis revisa las tarifas de Ryanair y Wizz Air día a día en cada ruta desde Bratislava, Viena, Košice y Budapest y muestra los billetes de ida y vuelta más baratos con las horas de salida. Para los vuelos más baratos encuentra al momento alojamiento justo para esos días (hoteles y apartamentos bien valorados) y le dice cuánto cuestan las vacaciones completas. En la pestaña Paquetes encuentra los paquetes vacacionales más baratos con vuelo, hotel y comidas de agencias de viajes eslovacas y checas. Para cada destino, más fechas, el tiempo de ese mes y una foto del lugar. Una alerta de precio revisa su búsqueda cada 3 horas y le avisa con una notificación cuando aparece un vuelo más barato. Lo básico en cada Jarvis: un aeropuerto y los diez destinos más baratos.' },

    { id: 'appka', kategoria: 'sluzby', nazov: 'Aplicación a medida en Jarvis', cena: 490, ikona: 'app',
      kratko: 'Una pequeña aplicación hecha exactamente para su negocio: un registro, una calculadora, un formulario.',
      popis: 'Programo la aplicación que le falta a su negocio y la añado a Jarvis: un registro (p. ej., de encargos, coches, revisiones), una calculadora de precios, un formulario de pedido o un resumen. El precio es para una aplicación pequeña; una más grande la acordamos de antemano.' },
    { id: 'hodina', kategoria: 'sluzby', nazov: 'Una hora de trabajo a medida', cena: 45, ikona: 'clock', mnozstvo: true,
      kratko: 'Un cambio, una nueva función, una conexión o ayuda; se factura por horas.',
      popis: 'Una hora de mi trabajo en su Jarvis: ajustar su comportamiento, una función nueva, la conexión con un servicio que usted utiliza o ayuda con cualquier cosa relacionada con Jarvis.' },
    { id: 'balik-5h', kategoria: 'sluzby', nazov: 'Bono de 5 horas de trabajo', cena: 199, ikona: 'clock',
      kratko: '5 horas de trabajo a medida a mejor precio, válidas 6 meses.',
      popis: 'Cinco horas de trabajo a medida que va utilizando a lo largo de 6 meses. Frente a las horas sueltas, ahorra 26 €.' },
    { id: 'skolenie', kategoria: 'sluzby', nazov: 'Formación del equipo en línea', cena: 89, ikona: 'team',
      kratko: '90 minutos para las personas de su empresa, hasta 6 participantes.',
      popis: 'Formación en línea para su equipo: cómo preguntar a Jarvis, cómo trabajar con el correo, las tareas y los clientes y qué hacer cuando algo no funciona. Hasta 6 participantes, 90 minutos, con grabación.' },
    { id: 'prenos-pc', kategoria: 'sluzby', nazov: 'Traslado de Jarvis a un ordenador nuevo', cena: 79, ikona: 'move',
      kratko: 'Un ordenador nuevo, el mismo Jarvis, con todos los datos e inicios de sesión.',
      popis: '¿Compra un ordenador nuevo? Traslado Jarvis con todos sus datos, historial y ajustes, conecto sus cuentas y compruebo que todo funciona como antes.' },
    { id: 'expres', kategoria: 'sluzby', nazov: 'Ayuda exprés en 2 horas', cena: 39, ikona: 'bolt',
      kratko: 'Cuando algo arde: le respondo en 2 horas en día laborable.',
      popis: 'Ayuda puntual cuando no puede esperar: le contesto en 2 horas en un día laborable entre las 8:00 y las 18:00 y lo resolvemos mediante pantalla compartida.' },

    { id: 'balik-zivnostnik', kategoria: 'baliky', nazov: 'Jarvis para autónomos', cena: 498, povodne: 627, ikona: 'pack', balik: { plan: 'biznis', mesiacov: 12 },
      kratko: 'Instalación, plan Business para 12 meses, Comercial a medida y formación.',
      popis: 'Todo lo que un autónomo necesita para el primer año: instalación y configuración, plan Business durante 12 meses (hasta 3 ordenadores, Jarvis en el móvil), el Comercial configurado para su negocio y formación en línea.',
      vBaliku: ['Instalación y configuración de Jarvis', 'Plan Business durante 12 meses', 'Jarvis en el móvil', 'Comercial a medida', 'Formación en línea (90 min)'] },
    { id: 'balik-firma', kategoria: 'baliky', nazov: 'Jarvis para empresas', cena: 789, povodne: 955, ikona: 'pack', balik: { plan: 'pro', mesiacov: 12 },
      kratko: 'Instalación, plan Pro para 12 meses, 2 ordenadores más, traslado de datos y formación del equipo.',
      popis: 'Jarvis para toda una pequeña empresa durante el primer año: instalación, plan Pro durante 12 meses (IA sin conexión y una hora de trabajo a medida cada mes), Jarvis en otros dos ordenadores, traslado de contactos y datos y formación del equipo.',
      vBaliku: ['Instalación y configuración de Jarvis', 'Plan Pro durante 12 meses', 'Jarvis en otros 2 ordenadores', 'Su propio modelo de IA sin conexión', 'Traslado de contactos y datos', 'Formación del equipo en línea (90 min)'] },

    { id: 'predlzenie', kategoria: 'skryte', nazov: 'Renovación de la licencia', ikona: 'plan',
      kratko: 'Suscripción de Jarvis para el siguiente periodo.', popis: 'Prórroga de su licencia de Jarvis por otro periodo según su plan.' }
  ],

  /* Odvetvové balíky rozšírení (stránka Pre firmy): moduly + nastavenie pre odbor lacnejšie ako samostatne. */
  odvetvia: [
    { id: 'uctovnictvo', nazov: 'Asesoría contable', ikona: 'invoice', mesacne: 19, moduly: ['doklady', 'faktury', 'znalosti'], navyse: 'Plazos del IVA, pagos a cuenta y cotizaciones en el Calendario fiscal',
      text: 'Los justificantes de los clientes del correo directamente a tablas, facturas con recordatorios y respuestas según sus procedimientos.' },
    { id: 'remeslo', nazov: 'Oficios y construcción', ikona: 'deal', mesacne: 15, moduly: ['faktury', 'hovory'], navyse: 'Fotos de la obra desde el móvil asociadas al encargo',
      text: 'Presupuesto, encargo, fotos de la obra, registro de horas y factura: todo en un mismo cliente.' },
    { id: 'eshop', nazov: 'Tienda online', ikona: 'cart', mesacne: 25, moduly: ['eshop', 'faktury', 'recenzie', 'doklady'], navyse: 'Configuración de la conexión con Shoptet o WooCommerce incluida',
      text: 'Pedidos de la tienda online, respuestas a los clientes con su estilo, reseñas y justificantes para la contabilidad.' },
    { id: 'salon', nazov: 'Salón y servicios', ikona: 'plan', mesacne: 15, moduly: ['rezervacie', 'recenzie'], navyse: 'Recordatorios de citas a los clientes',
      text: 'Los clientes reservan por su cuenta, Jarvis les recuerda la cita y tras la visita pide una reseña.' },
    { id: 'gastro', nazov: 'Hostelería', ikona: 'pack', mesacne: 15, moduly: ['sklad', 'reporty', 'recenzie'], navyse: 'Pedidos a proveedores por correo',
      text: 'Almacén de materias primas con avisos, pedidos a proveedores, resumen semanal de ingresos y reseñas de los clientes.' }
  ],

  /* Hlavné časti Jarvisa (stránka Funkcie a úvod). */
  casti: [
    { id: 'ai', nazov: 'Chat de IA con todas sus IA', text: 'ChatGPT, Claude y Gemini con sus suscripciones en una sola ventana, además de servicios de IA gratuitos y un modelo sin conexión. Jarvis elige solo el modelo y la profundidad de la respuesta, y cuando una cuenta llega a su límite, continúa la siguiente. Hasta 6 tareas a la vez en distintos chats.' },
    { id: 'agent', nazov: 'Hace el trabajo en el ordenador', text: 'Lee y crea PDF, Word y Excel, une y rellena documentos, trabaja en el navegador con sus inicios de sesión y maneja las ventanas de los programas. Antes de enviar, pagar, comprar o borrar algo, siempre pregunta. Nunca escribe contraseñas.' },
    { id: 'posta', nazov: 'Correo con acceso completo', text: 'Gmail y los buzones de empresa en un solo lugar. «Revisa mi correo» y tiene un resumen con enlaces; en cada mensaje, una propuesta de respuesta que envía con dos clics. Los correos sin importancia y no entregables se ordenan con un solo botón.' },
    { id: 'obchodnik', nazov: 'Comercial', text: 'Cada 15 minutos lee los buzones de la empresa, anota a los interesados en Clientes, prepara una respuesta con su estilo y le recuerda las ofertas sin respuesta y el trabajo sin cobrar. Nada se envía solo.' },
    { id: 'biznis', nazov: 'Negocio y clientes', text: 'Ingresos y gastos por meses, objetivo mensual, lo que espera ser cobrado, estado de sus webs y certificados. Clientes desde el primer interés hasta el pago, presupuestos en PDF y una base de empresas del registro según el número IČO.' },
    { id: 'ulohy', nazov: 'Tareas, calendario y recordatorios', text: 'Su propio tablero tipo Trello con plazos, etiquetas y repeticiones; añada una tarea con una frase como «mañana a las 9 llamar al proveedor». Calendario con festivos y santos, alarma, temporizador y recordatorios.' },
    { id: 'hlas', nazov: 'Voz y actas de reuniones', text: 'Mantenga pulsada una tecla y dicte en cualquier ventana: la transcripción funciona sin conexión en su tarjeta gráfica. Grabe una reunión o una llamada y obtendrá la transcripción con quién habló y un acta con tareas.' },
    { id: 'automatizacia', nazov: 'Automatización', text: 'Programe el trabajo que Jarvis hace solo: cada mañana un resumen del correo, los viernes las facturas del correo a Excel, cada 4 horas una comprobación de la web. Cuando necesita su aprobación, envía un aviso y espera.' },
    { id: 'mobil', nazov: 'Jarvis en el móvil', text: 'Chat, correo, tareas y aprobaciones en el teléfono mediante una conexión privada y cifrada con su PC. Una tarea iniciada desde el móvil sigue en el ordenador hasta el final, aunque bloquee el teléfono.' },
    { id: 'okno', nazov: 'Todo en una sola ventana', text: 'Navegador con pestañas y contraseñas, archivos con vista previa de Word, Excel y PDF, terminal, WhatsApp, Teams y Discord: no hace falta salir de Jarvis. Ctrl + K encuentra cualquier cosa, Alt + S hace una captura de pantalla.' },
    { id: 'efaktury', nazov: 'Facturas electrónicas preparadas para 2027', text: 'Comprobación, visualización y emisión de facturas electrónicas según la norma europea EN 16931 y Peppol BIS 3.0, todo sin conexión. Comprueba una factura electrónica adjunta en el correo con un solo clic.' },
    { id: 'sukromie', nazov: 'Privacidad y seguridad', text: 'Los datos están en su ordenador, Windows cifra las contraseñas y la IA nunca las recibe. Antivirus y VPN con un clic; Incógnito envía a las empresas solicitudes de supresión de sus datos según el RGPD.' }
  ],

  /* Appky v Jarvisovi (podľa Jarvis\public\mini\catalog.json, bez Generátora licencií – ten má len predajca). */
  appky: [
    { kategoria: 'Cada día', polozky: [
      ['Notas', 'Notas rápidas con búsqueda, anclaje y edición con IA'],
      ['Tiempo', 'Ahora, por horas y a 7 días para su ciudad'],
      ['Reloj', 'Temporizador, cronómetro, alarma, Pomodoro, recordatorios, cuentas atrás y hora mundial'],
      ['Calculadora', 'Cálculos con historial, IVA, porcentajes, unidades y divisas según el BCE'],
      ['Traductor', 'Traducción y edición de textos con su IA, 12 idiomas'],
      ['Radio', 'Radios eslovacas y del mundo en directo, con las favoritas a mano'],
      ['Portapapeles', 'Lo que ha copiado, de nuevo con un clic, y textos anclados'],
      ['Hábitos', 'Hábitos diarios con rachas y el mapa de todo el año'],
      ['Calendario', 'Mes con festivos y santos, eventos con recordatorio'],
      ['Dictáfono', 'Notas de voz transcritas a texto directamente en el ordenador'],
      ['Dinero', 'Ingresos y gastos por meses, categorías y suscripciones'],
      ['Acciones', 'Acciones, ETF y criptomonedas – gráfico, cifras de la empresa, analistas, noticias, cartera en euros y alertas de precio'],
      ['Lector de artículos', 'Artículo sin anuncios ni ventanas emergentes, resumen con IA y lectura en voz alta'],
      ['Ejercicio', 'Entrenamiento por intervalos – Tabata, HIIT, plancha, Jarvis anuncia los ejercicios'],
      ['Fechas y plazos', 'Último día del plazo según la ley, días laborables, festivos y jornada laboral'],
      ['Quién debe cuánto a quién', 'Gastos compartidos en un viaje o en una casa rural – quién paga cuánto a quién, con el menor número de pagos']
    ] },
    { kategoria: 'Trabajo', polozky: [
      ['Comercial', 'Interesados de los buzones, respuestas preparadas y recordatorios: usted solo envía'],
      ['Clientes · CRM', 'Encargos desde el interés hasta el pago, personas y empresas con el último contacto y el siguiente paso'],
      ['Base de contactos', 'Empresas y personas con sus números: del correo, de Excel y de las webs; administradores y facturación del registro según el número IČO'],
      ['Presupuesto', 'Oferta para el cliente con conceptos e IVA en PDF con un clic'],
      ['Textos para la empresa', 'Publicaciones, respuestas a reseñas, ofertas por correo y anuncios con IA'],
      ['Acta de la reunión', 'Grabe una llamada o una reunión: transcripción con quién habló y acta con IA con tareas'],
      ['Registro de horas', 'Cronómetro por proyectos y clientes, horas × tarifa, informe para el cliente y CSV'],
      ['Herramientas PDF', 'Unir, dividir, girar y reordenar páginas, imágenes a PDF'],
      ['Texto de la imagen', 'Texto de una captura de pantalla o imagen, sin conexión en Windows'],
      ['Códigos QR', 'QR para enlace, Wi-Fi, contacto y pago QR PAY by square'],
      ['Contactos y tablas', 'CSV y Excel: eliminar duplicados, comprobar correos, filtrar, dividir'],
      ['Capturas de pantalla', 'Captura con flechas, recuadros, texto y tapado de cosas sensibles'],
      ['Grabación de pantalla', 'La pantalla o una ventana con sonido y micrófono a vídeo'],
      ['Vídeo y audio', 'Vídeo por debajo de los MB elegidos, fragmento recortado, audio a MP3, GIF'],
      ['Vigilante de páginas', 'Vigila webs (convocatorias, precios, anuncios) y le avisa cuando algo cambia en ellas'],
      ['Comprobación de la web', 'SEO y aspectos técnicos de la web en pocos segundos, con consejos sobre qué corregir'],
      ['Vista general de la web', 'Todo el sitio página a página – enlaces rotos, errores SEO, sitemap.xml'],
      ['Código SEO para la web', 'Título, descripción, compartir, empresa para Google y robots.txt – con vista previa en Google'],
      ['Imágenes para la web', 'Reducir y convertir a WebP o JPEG, también muchos a la vez'],
      ['Favicon e iconos', 'Todos los iconos de la web a partir del logo – favicon.ico, Apple, Android, manifest'],
      ['Colores', 'Tonos, contraste según WCAG, cuentagotas y paletas guardadas']
    ] },
    { kategoria: 'Desarrollo', polozky: [
      ['Probador de HTML', 'Pegue HTML y vea al instante la web en ordenador, tableta y móvil, con los errores en rojo'],
      ['Servidores · WinSCP', 'Los archivos de sus servidores por SFTP, FTP y SCP: subir, descargar, editar'],
      ['Taller de Odoo', 'Código de acciones de servidor para Odoo 17 – 20 comprobado sin conexión, sus módulos en zip'],
      ['Desarrollador', 'JSON, Base64, URL, hash, UUID, JWT, tiempo y regex'],
      ['Texto', 'Contador, sin tildes, slug, mayúsculas y minúsculas, líneas'],
      ['Contraseñas', 'Contraseñas seguras y frases fáciles de recordar, seguridad de la contraseña'],
      ['Comparar textos', 'Lo que se añadió y lo que desapareció entre dos versiones de un texto'],
      ['Símbolos y emoji', 'Comillas, guiones, €, ×, flechas y emoji buscando por palabra']
    ] },
    { kategoria: 'Ordenador', polozky: [
      ['Disco', 'Qué ocupa espacio en el disco, carpeta por carpeta'],
      ['Velocidad de internet', 'Ping, descarga y subida, historial de mediciones'],
      ['Red y DNS', 'DNS, dominio de correo (SPF, DKIM, DMARC), certificado SSL, ping, puertos'],
      ['Acerca del ordenador', 'Procesador, gráfica, memoria, discos, batería y Windows'],
      ['Programas en Jarvis', 'Git, Node.js y Ollama directamente en Jarvis en lugar de aplicaciones separadas'],
      ['Renombrado masivo', 'Muchos archivos a la vez – sin tildes, numeración, buscar y reemplazar, deshacer'],
      ['Archivos duplicados', 'Archivos iguales por contenido – las copias sobrantes a la Papelera, siempre queda una'],
      ['Tiempo frente al PC', 'Cuánto tiempo en cada programa, por días, al Registro de horas con un clic'],
      ['Organizador', 'Ordena Descargas en carpetas: no borra nada y se puede deshacer']
    ] },
    { kategoria: 'Aprendizaje', polozky: [
      ['Vocabulario', 'Tarjetas con repaso en el momento justo – la IA las crea a partir de un texto'],
      ['Mecanografía con los diez dedos', 'Velocidad y precisión de escritura con textos eslovacos'],
      ['Enciclopedia', 'Wikipedia en español directamente en Jarvis, resumen y lectura en voz alta'],
      ['Quiz', 'Quiz de IA sobre cualquier tema – también para el bachillerato, con explicación'],
      ['Gráfica de funciones', 'Funciones como en el colegio – gráfica, ceros, intersecciones y tabla de valores'],
      ['Geografía', 'Banderas y capitales: quiz de Europa y de todo el mundo']
    ] },
    { kategoria: 'Juegos', polozky: [
      ['2048', 'Una los números hasta llegar a 2048'], ['Sudoku', 'Tres dificultades, notas, comprobación y tiempo'],
      ['Cinco en raya', 'Cinco en raya contra Jarvis'], ['Memoria', 'Encuentre las parejas, récords según el tamaño'],
      ['Serpiente', 'La serpiente clásica, cada vez más rápida'], ['Azar', 'Dados, moneda, número y reparto en equipos'],
      ['Ajedrez', 'Ajedrez contra Jarvis en tres niveles'], ['Buscaminas', 'Buscaminas, el primer clic siempre es seguro'],
      ['Dados', 'Bloques que caen, con sombra y reserva'], ['Solitario', 'Klondike con 1 o 3 cartas'],
      ['Cuatro en raya', 'Cuatro en raya contra Jarvis o entre dos'], ['Slovko', 'El Wordle eslovaco, una palabra nueva cada día'],
      ['Arkanoid', 'Pala, pelota y ladrillos: 6 niveles']
    ] }
  ],

  otazky: [
    ['¿Puedo probar Jarvis primero?', 'Sí. Descarga Jarvis gratis y lo usa completo durante 7 días, salvo las extensiones de pago: sin clave de licencia, sin tarjeta y sin compromiso. Cuando elige un plan, introduce la clave de licencia en el mismo Jarvis y sigue adelante. Si no elige un plan, Jarvis se bloquea a los 7 días, no paga nada y sus datos se quedan en el ordenador. Después puede probar además cada extensión de pago durante 7 días completa, directamente en Jarvis.'],
    ['¿En qué ordenador funciona Jarvis?', 'En Windows 10 u 11 (64 bits). Recomendamos al menos 16 GB de RAM. Para su propio modelo de IA sin conexión conviene una gráfica NVIDIA con 12 GB de memoria o 32 GB de RAM; con gusto reviso su ordenador antes del pedido.'],
    ['¿Necesito una suscripción a ChatGPT o Claude?', 'No. Jarvis funciona también con servicios de IA gratuitos (por ejemplo Google AI Studio o Groq) y con un modelo sin conexión. Con una suscripción (ChatGPT Plus, Claude Pro, Gemini) obtiene las mejores respuestas. La suscripción la paga directamente al proveedor, sin recargo; Jarvis solo usa sus cuentas.'],
    ['¿Qué obtengo exactamente con la instalación?', 'Jarvis instalado y configurado para su trabajo: cuentas de IA, correo, calendario y WhatsApp conectados, empresas, precios y estilo de las respuestas configurados, importación de contactos, 60 minutos de formación y 14 días de ayuda prioritaria. La instalación es opcional y se paga una sola vez: ahora 99 € en lugar de 149 €. También puede descargar e instalar Jarvis usted mismo gratis.'],
    ['¿Por qué se paga cada mes?', 'El plan mensual es la licencia de uso de Jarvis y su cuidado: actualizaciones continuas y nuevas funciones, correcciones, comprobación tras cada nueva versión y soporte según el plan. Con el pago anual, paga 12 meses por el precio de 10.'],
    ['¿Qué pasa si dejo de pagar?', 'La licencia es válida hasta el último día pagado. Después tiene 14 días para renovarla antes de que Jarvis se bloquee. Sus datos se quedan en su ordenador y puede exportarlos en cualquier momento.'],
    ['¿Dónde están mis datos y quién los ve?', 'Todo está en su ordenador. Las contraseñas las cifra Windows y la IA nunca las recibe. El texto que escribe va solo al servicio de IA que usted elija; con un modelo sin conexión no sale a ningún sitio. Como vendedor, no tengo acceso a sus datos; en la ayuda remota, solo durante la conexión que usted autoriza y puede terminar en cualquier momento.'],
    ['¿Cómo es la instalación?', 'Por su cuenta: descarga el instalador, lo ejecuta y escribe su nombre; tarda unos minutos. Si me encarga la instalación, después del pago acordamos la fecha. La instalación suele durar 2–3 horas mediante pantalla compartida, y en los alrededores de Senec y Bratislava también en persona. Usted solo inicia sesión en sus cuentas: las contraseñas no las introduzco yo.'],
    ['¿Puedo ver Jarvis antes de pedirlo?', 'Sí: descárguelo y pruébelo gratis durante 7 días. Si quiere, escríbame y acordamos también una breve videollamada en la que le mostraré Jarvis en directo y responderé a sus preguntas.'],
    ['¿Funciona también en Mac o en el móvil?', 'Jarvis funciona en Windows. En el móvil (iPhone y Android) lo usa a través de una conexión privada con su ordenador, que tiene que estar encendido. Para Mac todavía no existe.'],
    ['¿Hace Jarvis algo sin mi consentimiento?', 'Lee y hace las tareas habituales al momento y le avisa. Antes de enviar un correo, pagar, comprar, borrar, publicar o confirmar algo, siempre pregunta. Nunca escribe contraseñas: el inicio de sesión lo hace usted.'],
    ['¿En cuántos ordenadores puedo tenerlo?', 'Según el plan: Start 1, Business 3 y Pro 5 ordenadores. En otro ordenador instala Jarvis usted; si prefiere que lo haga yo, la instalación cuesta 99 €.'],
    ['¿Puedo cambiar de plan?', 'Cuando quiera. Un plan superior se aplica desde que paga la diferencia; uno inferior, desde el periodo siguiente.'],
    ['¿Cómo se paga?', 'Por transferencia a la cuenta indicada en el pedido: escanee el código QR SEPA en la aplicación de su banco o pague con el IBAN. El plan mensual se paga por adelantado para un mes; el anual, para 12 meses. Después del pago le enviaré la clave de licencia por correo. El pago con tarjeta llegará pronto.'],
    ['¿Puedo desistir del contrato?', 'El consumidor puede desistir de un contrato celebrado a distancia en un plazo de 14 días sin indicar el motivo. Si al hacer el pedido solicita que empiece antes, paga solo la parte proporcional de lo ya prestado, y una vez prestado por completo el servicio o iniciado el suministro del contenido digital, el derecho de desistimiento se extingue. Los detalles están en las condiciones generales.'],
    ['¿Y si algo falla?', 'Después de cada actualización, Jarvis se revisa solo y registra el error. Escríbame y le responderé en el plazo de su plan; si es urgente, tiene la Ayuda exprés en 2 horas.']
  ]
};
