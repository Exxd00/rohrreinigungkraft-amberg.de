/**
 * Company data and content for Rohrreinigung Kraft
 * Focused on the Amberg region (Oberpfalz): Amberg, Kümmersbruck, Sulzbach-Rosenberg + 60km Umkreis
 *
 * ⚠️ WICHTIG: Alle Zeitangaben einheitlich halten!
 * Standard: "70-100 Min" (echte Anfahrtszeit ab dem Firmensitz Nürnberg-Glockenhof, ~65km entfernt —
 * NICHT die schnellere Nürnberg-Zeit wiederverwenden. Immer die realistische Zeit am Telefon nennen.)
 */

// Firmenadresse - ECHT (von Gelbe Seiten verifiziert) — gleicher Fachbetrieb wie die Nürnberg-Seite,
// bedient von dort aus zusätzlich die Amberg-Region
export const company = {
  name: "Rohrreinigung Kraft",
  tagline: "Ihr Rohrreinigungsexperte für Amberg und die Oberpfalz",
  subTagline: "Amberg • Kümmersbruck • Sulzbach-Rosenberg • 24/7 Notdienst",
  mainCity: "Amberg",
  priorityCities: ["Amberg", "Kümmersbruck", "Sulzbach-Rosenberg"],
  region: "Oberpfalz",
  serviceRadius: 60, // km - Servicegebiet in der Oberpfalz

  contact: {
    phone: "+49 911 89218682",
    phoneDisplay: "0911 89218682",
    email: "Info@Rohrreinigung-kraft.de",
    whatsapp: "+4991189218682",
  },

  // ✅ ECHTE ADRESSE (Gelbe Seiten verifiziert)
  address: {
    street: "Ehemannstr. 9",
    zip: "90478",
    city: "Nürnberg",
    district: "Glockenhof",
    region: "Bayern",
    country: "Deutschland",
    fullAddress: "Ehemannstr. 9, 90478 Nürnberg-Glockenhof",
    googleMapsUrl: "https://maps.app.goo.gl/u8wZg2y4ERE86XtL6?g_st=ic",
  },

  // ✅ RECHTLICHE INFORMATIONEN (Handelsregister & Steuernummer)
  legal: {
    registergericht: "Amtsgericht Nürnberg",
    ustIdNr: "DE362340841",
    inhaber: "Michael Kraft",
  },

  hours: {
    regular: "24/7 Notdienst",
    emergency: true,
    emergencyText: "Rund um die Uhr erreichbar – auch nachts & am Wochenende",
  },

  pricing: {
    type: "quote",
    text: "Festpreis nach kostenloser Diagnose vor Ort",
    transparent: true,
    guarantees: [
      "Kostenlose Diagnose vor Ort",
      "Festpreis vor Arbeitsbeginn",
      "Keine versteckten Kosten",
      "Kein Start ohne Ihr OK",
    ],
    services: {
      rohrreinigung: { from: 89, label: "Rohrreinigung", description: "Alle Arten von Verstopfungen" },
      kanalreinigung: { from: 149, label: "Kanalreinigung", description: "Mit Hochdruck-Spültechnik" },
      toiletteVerstopft: { from: 79, label: "Toilette verstopft", description: "Schnelle Soforthilfe" },
      abflussreinigung: { from: 69, label: "Abflussreinigung", description: "Küche, Bad, Dusche" },
      notdienst: { from: 99, label: "24/7 Notdienst", description: "Auch nachts & Wochenende" },
      kameraInspektion: { from: 129, label: "TV-Inspektion", description: "Mit HD-Kamera" },
      dichtheitspruefung: { from: 179, label: "Dichtheitsprüfung", description: "Normgerecht nach DIN" },
      rohrsanierung: { from: 299, label: "Rohrsanierung", description: "Grabenlos & nachhaltig" },
      wartungsvertrag: { from: 29, label: "Wartungsvertrag", description: "Monatlich / pro Einheit" },
    },
  },

  // ⚠️ EINHEITLICHE ZEITANGABEN
  // Standard: 70-100 Min (echte Anfahrtszeit ab Nürnberg-Glockenhof)
  urgency: {
    responseTime: "70-100", // EINHEITLICH überall
    responseTimeDisplay: "70-100 Min",
    responseTimeShort: "Meist 70-100 Min",
    responseTimeNote: "Genaue Zeit sagen wir Ihnen ehrlich am Telefon",
    callbackTime: "wenigen", // "Rückruf in wenigen Minuten"
    availableTechnicians: "2-3",
    lastServiceCity: "Amberg",
    lastServiceTime: "vor 23 Min",
  },

  stats: {
    responseTime: "70-100 Min",
    availability: "24/7",
    localTeam: "Etablierter Fachbetrieb",
    region: "Oberpfalz",
    cities: "Amberg, Kümmersbruck, Sulzbach-Rosenberg",
    guarantee: "Festpreis vorab",
    yearsExperience: "10+",
    projectsCompleted: "2.000+",
    satisfactionRate: "98%",
  },

  // ✅ ECHTE BEWERTUNGEN (Google Maps - Stand April 2026)
  rating: {
    score: 5.0,
    maxScore: 5,
    reviewCount: 129, // Google Maps verifiziert
    displayText: "5.0/5",
    fullText: "5.0/5 basierend auf 129 Google-Bewertungen",
    platforms: [
      { name: "Google", score: 5.0, count: 129 },
    ],
  },

  // Google Reviews URL
  googleReviewsUrl: "https://www.google.com/maps/place/Rohrreinigung+Kraft/@49.4374,11.0895/reviews",

  b2b: {
    targetGroups: [
      {
        name: "Hausverwaltungen",
        icon: "building",
        benefits: ["Prioritäts-Service", "Dokumentation für WEG", "Rahmenverträge möglich"],
      },
      {
        name: "WEG & Eigentümergemeinschaften",
        icon: "users",
        benefits: ["Alle Einheiten aus einer Hand", "Koordinierte Termine", "Sammelrechnung"],
      },
      {
        name: "Gewerbe & Gastronomie",
        icon: "store",
        benefits: ["Außerhalb der Öffnungszeiten", "Fettabscheider-Wartung", "Regelmäßige Wartung"],
      },
      {
        name: "Immobilienbetreuung",
        icon: "home",
        benefits: ["Schnelle Reaktionszeit", "Direkte Kommunikation", "Transparente Abrechnung"],
      },
    ],
    services: [
      "Notdienst mit Priorität",
      "Regelmäßige Wartungsverträge",
      "TV-Inspektion mit Protokoll",
      "Komplette Dokumentation",
      "Direkte Technikerkommunikation",
      "Sammelrechnungen",
    ],
  },

  features: [
    {
      title: "24/7 Soforthilfe",
      description: "Rund um die Uhr – auch nachts & am Wochenende",
      icon: "clock"
    },
    {
      title: "Meist 70-100 Min",
      description: "Realistische Anfahrtszeit – ehrlich am Telefon genannt",
      icon: "truck"
    },
    {
      title: "Kostenlose Diagnose",
      description: "Erst prüfen, dann entscheiden – ohne Kosten",
      icon: "search"
    },
    {
      title: "Festpreis vorab",
      description: "Sie wissen den Preis, bevor wir starten",
      icon: "euro"
    },
    {
      title: "Keine versteckten Kosten",
      description: "Was wir sagen, das gilt – transparent & fair",
      icon: "shield"
    },
    {
      title: "Etablierter Fachbetrieb",
      description: "Seit 10+ Jahren im Handwerk – jetzt auch für die Amberg-Region",
      icon: "home"
    },
  ],

  trustFactors: [
    "Über 10 Jahre Erfahrung im Handwerk",
    "Mehr als 2000 erfolgreiche Einsätze",
    "Etablierter Fachbetrieb – jetzt auch für Amberg und die Oberpfalz",
    "Modernste Hochdruck- & Kameratechnik",
    "98% Kundenzufriedenheit",
    "Empfohlen von Hausverwaltungen",
  ],

  // ⚠️ EINHEITLICHE ANFAHRTSZEITEN PRO STADT
  cityContent: {
    amberg: {
      name: "Amberg",
      headline: "Rohrreinigung Amberg – Zuverlässiger Fachbetrieb",
      subheadline: "Service in allen Stadtteilen: Altstadt, Ammersricht, Raigering, Gailoh & mehr",
      localFacts: [
        "Regelmäßige Einsätze in Amberg und Umgebung",
        "Erfahrung mit der historischen Altstadt und Neubaugebieten",
        "Realistische Ankunftszeit bereits am Telefon",
      ],
      responseTime: "70-100 Min", // EINHEITLICH
      commonProblems: [
        "Altbau-Rohrsysteme in der Altstadt",
        "Wurzeleinwuchs in Wohngebieten",
        "Verstopfungen in Mehrfamilienhäusern",
      ],
    },
    kuemmersbruck: {
      name: "Kümmersbruck",
      headline: "Rohrreinigung Kümmersbruck – Direkt nebenan",
      subheadline: "Gleiche Anfahrtszeit wie Amberg – meist 70-100 Min bei Ihnen",
      localFacts: [
        "Direkte Nachbarschaft zu Amberg",
        "Kurze Anfahrtswege innerhalb der Gemeinde",
        "Erfahrung mit Wohnsiedlungen",
      ],
      responseTime: "70-100 Min", // EINHEITLICH
      commonProblems: [
        "Ältere Anschlussleitungen",
        "Fettablagerungen in Küchenabflüssen",
        "Saisonale Verstopfungen",
      ],
    },
    "sulzbach-rosenberg": {
      name: "Sulzbach-Rosenberg",
      headline: "Rohrreinigung Sulzbach-Rosenberg – Zuverlässig vor Ort",
      subheadline: "Service für Privat, Gewerbe & Hausverwaltungen",
      localFacts: [
        "Erfahrung mit der historischen Sulzbacher Altstadt",
        "Service für Gewerbeflächen in Rosenberg",
        "Zusammenarbeit mit lokalen Hausverwaltungen",
      ],
      responseTime: "80-110 Min", // EINHEITLICH
      commonProblems: [
        "Alte Rohrsysteme in der Altstadt",
        "Gewerbliche Anforderungen in Rosenberg",
        "Ältere Mehrfamilienhäuser",
      ],
    },
  },

  faq: {
    general: [
      {
        question: "Was kostet eine Rohrreinigung?",
        answer: "Die Kosten hängen vom Umfang der Verstopfung ab. Wir bieten eine kostenlose Diagnose vor Ort und nennen Ihnen dann einen Festpreis – ohne versteckte Kosten. Einfache Verstopfungen starten ab 79€.",
      },
      {
        question: "Wie schnell können Sie da sein?",
        answer: "In Amberg und der Region sind wir meist innerhalb von 70-100 Minuten bei Ihnen. Die genaue Zeit sagen wir Ihnen ehrlich bereits am Telefon.",
      },
      {
        question: "Arbeiten Sie auch am Wochenende?",
        answer: "Ja, unser 24/7 Notdienst ist rund um die Uhr verfügbar – auch nachts, am Wochenende und an Feiertagen.",
      },
      {
        question: "Muss ich im Voraus bezahlen?",
        answer: "Nein. Wir stellen erst nach erfolgreicher Arbeit eine Rechnung. Sie können bar, mit Karte oder auf Rechnung bezahlen.",
      },
      {
        question: "Bieten Sie Wartungsverträge an?",
        answer: "Ja, besonders für Hausverwaltungen und Gewerbebetriebe bieten wir regelmäßige Wartungsverträge mit Prioritäts-Service an.",
      },
    ],
    emergency: [
      {
        question: "Was soll ich tun, bis Sie da sind?",
        answer: "Drehen Sie wenn möglich den Hauptwasserhahn ab und vermeiden Sie weitere Wassernutzung. Legen Sie Handtücher aus, um Wasserschäden zu minimieren.",
      },
      {
        question: "Kostet der Notdienst nachts mehr?",
        answer: "Unser Notdienst hat faire Preise rund um die Uhr. Wir nennen Ihnen immer einen Festpreis vor Arbeitsbeginn – keine Überraschungen.",
      },
    ],
  },

  socialLinks: {
    facebook: "",
    instagram: "",
    google: "https://g.page/rohrreinigung-kraft",
    gelbeSeiten: "https://www.gelbeseiten.de/gsbiz/57c4739e-9c15-49d8-9a90-eca1cb4fdc82",
  },

  seo: {
    defaultTitle: "Rohrreinigung Kraft | 24/7 Notdienst Amberg, Kümmersbruck, Sulzbach-Rosenberg",
    defaultDescription: "Rohrreinigung & Kanalreinigung in der Amberg-Region ✓ Meist 70-100 Min ✓ 24/7 Notdienst ✓ Kostenlose Diagnose ✓ Festpreis vorab. Jetzt anrufen: 0911 89218682",
    keywords: [
      "Rohrreinigung Amberg",
      "Rohrreinigung Kümmersbruck",
      "Rohrreinigung Sulzbach-Rosenberg",
      "Kanalreinigung Oberpfalz",
      "Abfluss verstopft Amberg",
      "Notdienst Rohrreinigung",
      "Toilette verstopft",
      "24/7 Rohrreinigung",
    ],
    // TODO: Platzhalter-Domain — durch die echte Domain ersetzen, sobald registriert
    domain: "https://rohrreinigung-kraft-amberg.de"
  }
};

// Testimonials - fokussiert auf "Klarheit" und konkrete Erfahrungen
export const testimonials = [
  {
    name: "Thomas M.",
    location: "Nürnberg-Südstadt",
    rating: 5,
    text: "Was mich überzeugt hat: Der Preis wurde mir VORHER gesagt, nicht erst auf der Rechnung. 127€ für die Toilette, genau so war es. Endlich ein Handwerker, der nicht nachverhandelt.",
    date: "2026",
    service: "Toilette verstopft",
    price: "127€"
  },
  {
    name: "Sandra K.",
    location: "Fürth-Innenstadt",
    rating: 5,
    text: "Sonntag, 8 Uhr morgens, Keller unter Wasser. 40 Minuten später war das Team da. Das Beste: Bevor irgendjemand anfing, wurde mir der Festpreis genannt. Keine böse Überraschung. Das nenne ich fair!",
    date: "2026",
    service: "Notdienst",
    price: "189€"
  },
  {
    name: "Michael B.",
    location: "Erlangen",
    rating: 5,
    text: "Wiederkehrende Verstopfung im Küchenabraum. Der Techniker hat mir mit der Kamera gezeigt, wo das Problem liegt. Ich hab's selbst gesehen, nicht nur erzählt bekommen. Dann konnte ich entscheiden. So sollte es immer sein.",
    date: "2026",
    service: "Kamera-Inspektion",
    price: "149€"
  }
];

// Work gallery — echte Fotos aus unseren eigenen Einsätzen (Quelle: Firmenmaterial)
export const gallery = [
  {
    id: 1,
    title: "Kanalschacht – Vorher",
    description: "Stark verschmutzter Kanalschacht mit Fett und Ablagerungen",
    category: "Kanalreinigung",
    serviceSlug: "kanalreinigung",
    image: "/work/kanalreinigung-vorher.jpg",
  },
  {
    id: 2,
    title: "Kanalschacht – Nachher",
    description: "Derselbe Schacht nach unserer Hochdruckreinigung",
    category: "Kanalreinigung",
    serviceSlug: "kanalreinigung",
    image: "/work/kanalreinigung-nachher.jpg",
  },
  {
    id: 3,
    title: "Wurzeleinwuchs im Rohr",
    description: "Eingewachsene Wurzeln – eine der häufigsten Verstopfungsursachen",
    category: "Rohrreinigung",
    serviceSlug: "rohrreinigung",
    image: "/work/verstopfung-wurzeln.jpg",
  },
  {
    id: 4,
    title: "Fettablagerungen im Abfluss",
    description: "Verhärtete Fettschichten verengen den Abfluss – typisch in Küche & Gastro",
    category: "Abflussreinigung",
    serviceSlug: "abflussreinigung",
    image: "/work/fettablagerungen.jpg",
  },
  {
    id: 5,
    title: "Ablagerungen im Rohr",
    description: "Feste Ablagerungen an der Rohrwand reduzieren den Durchfluss",
    category: "Kanalreinigung",
    serviceSlug: "kanalreinigung",
    image: "/work/ablagerung.jpg",
  },
  {
    id: 6,
    title: "Starke Verkrustungen",
    description: "Jahrelange Ablagerungen verengen den Rohrquerschnitt massiv",
    category: "Kanalreinigung",
    serviceSlug: "kanalreinigung",
    image: "/work/ablagerungen.jpg",
  },
  {
    id: 7,
    title: "Verschmutzung im Rohr",
    description: "Schlamm und Schmutz im Rohrinneren vor der Reinigung",
    category: "Rohrreinigung",
    serviceSlug: "rohrreinigung",
    image: "/work/verschmutzungen-rohr.jpg",
  },
  {
    id: 8,
    title: "TV-Kamerabefahrung",
    description: "Millimetergenaue Ortung von Schäden & Verstopfungen per HD-Kamera",
    category: "Kamera-Inspektion",
    serviceSlug: "kamera-inspektion",
    image: "/work/kamerabefahrung.jpg",
  },
  {
    id: 9,
    title: "Kamera-Inspektion der Leitung",
    description: "Dokumentierte Zustandsprüfung Ihrer Rohrleitung",
    category: "Kamera-Inspektion",
    serviceSlug: "kamera-inspektion",
    image: "/work/kamerabefahrung-2.jpg",
  },
  {
    id: 10,
    title: "Bodenablauf reinigen",
    description: "Gründliche Reinigung eines verstopften Bodenablaufs",
    category: "Abflussreinigung",
    serviceSlug: "abflussreinigung",
    image: "/work/bodenablauf-reinigen.jpg",
  },
];

// Echtes Vorher/Nachher-Paar (Kanalschacht) für den interaktiven Vergleich
export const beforeAfterGallery = [
  {
    id: 1,
    title: "Kanalschacht-Reinigung",
    description:
      "Verstopfter Kanalschacht mit Wurzeln – nach der Reinigung wieder voll funktionsfähig.",
    category: "Kanalreinigung",
    serviceSlug: "kanalreinigung",
    beforeImage: "/work/kanalreinigung-vorher.jpg",
    afterImage: "/work/kanalreinigung-nachher.jpg",
  },
];

// Real work videos (transcoded from company footage to web-friendly H.264 MP4)
export const workVideos = [
  {
    id: "kamerabefahrung-stromkabel",
    title: "Kamera-Inspektion: Stromkabel in der Leitung",
    shortTitle: "TV-Kamerabefahrung",
    description:
      "Echte TV-Kamerabefahrung: In dieser Abwasserleitung entdecken wir ein quer verlegtes Stromkabel, das für Rückstau sorgt. So finden wir die Ursache – millimetergenau und ohne Aufgraben.",
    category: "Kamera-Inspektion",
    serviceSlug: "kamera-inspektion",
    src: "/videos/kamerabefahrung-stromkabel.mp4",
    poster: "/videos/kamerabefahrung-stromkabel-poster.jpg",
    orientation: "landscape" as const,
    duration: "1:48",
    featured: true,
  },
  {
    id: "einsatz-kanal",
    title: "Kanalschacht vor dem Einsatz",
    shortTitle: "Kanalschacht",
    description:
      "Ein stark verschmutzter Kanalschacht vor unserem Einsatz – mit Fett, Schlamm und Ablagerungen komplett zugesetzt. Mit Hochdruck-Spültechnik machen wir ihn wieder frei.",
    category: "Kanalreinigung",
    serviceSlug: "kanalreinigung",
    src: "/videos/einsatz-kanal.mp4",
    poster: "/videos/einsatz-kanal-poster.jpg",
    orientation: "portrait" as const,
    duration: "0:10",
    featured: false,
  },
  {
    id: "einsatz-rohr",
    title: "Verkalkte Rohrleitung von innen",
    shortTitle: "Rohr von innen",
    description:
      "Blick ins Innere einer stark verkalkten Rohrleitung vor der Reinigung. Ablagerungen verengen den Querschnitt massiv – ein klassischer Fall für unsere Fräs- und Spültechnik.",
    category: "Rohrreinigung",
    serviceSlug: "rohrreinigung",
    src: "/videos/einsatz-rohr.mp4",
    poster: "/videos/einsatz-rohr-poster.jpg",
    orientation: "portrait" as const,
    duration: "0:10",
    featured: false,
  },
];

// How it works steps
export const howItWorks = [
  {
    step: 1,
    title: "Anruf & Beratung",
    description: "Rufen Sie uns an oder schreiben Sie uns. Wir beraten Sie kostenlos und unverbindlich.",
    icon: "phone"
  },
  {
    step: 2,
    title: "Anfahrt",
    description: "Unser Fachteam ist meist innerhalb von 70-100 Minuten bei Ihnen vor Ort – die genaue Zeit sagen wir ehrlich am Telefon.",
    icon: "truck"
  },
  {
    step: 3,
    title: "Problemlösung",
    description: "Wir beseitigen die Verstopfung professionell und hinterlassen alles sauber.",
    icon: "check"
  }
];
