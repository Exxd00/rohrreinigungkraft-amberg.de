/**
 * Enhanced city content for local SEO and AEO optimization
 * Adds local depth to city pages with:
 * - Neighborhoods (Stadtteile)
 * - Local problems and specialties
 * - Response time specifics
 * - Local testimonial (optional — only set when a real, attributable quote exists)
 * - FAQ specific to the city
 */

export interface CityNeighborhood {
  name: string;
  description?: string;
  commonProblems?: string[];
}

export interface EnhancedCityContent {
  slug: string;
  headline: string;
  subheadline: string;
  localExpertise: {
    title: string;
    points: string[];
  };
  neighborhoods: CityNeighborhood[];
  localProblems: {
    title: string;
    problems: { problem: string; areas: string; solution: string }[];
  };
  responseInfo: {
    typical: string;
    fastest: string;
    note: string;
  };
  localTestimonial?: {
    text: string;
    name: string;
    neighborhood: string;
    service: string;
  };
  faq: { question: string; answer: string }[];
}

export const enhancedCityContent: Record<string, EnhancedCityContent> = {
  amberg: {
    slug: "amberg",
    headline: "Rohrreinigung Amberg",
    subheadline: "Ihr lokaler Fachbetrieb mit eigener Filiale in Amberg",
    localExpertise: {
      title: "Unser Service in Amberg",
      points: [
        "Eigene Filiale direkt in Amberg",
        "Regelmäßige Einsätze für Privat- und Gewerbekunden in Amberg",
        "Erfahrung mit der historischen Bausubstanz der Altstadt und modernen Neubaugebieten",
        "Zusammenarbeit mit Hausverwaltungen im Landkreis Amberg-Sulzbach",
        "Meist in 20-40 Minuten bei Ihnen",
      ],
    },
    neighborhoods: [
      {
        name: "Altstadt",
        description: "Historischer Stadtkern mit gewachsenen Rohrsystemen",
        commonProblems: [
          "Alte Guss- und Steinzeugrohre",
          "Enge Schächte in dichter Bebauung",
        ],
      },
      {
        name: "Ammersricht",
        description: "Wohngebiet am östlichen Stadtrand",
        commonProblems: ["Standard-Verstopfungen", "Ältere Anschlussleitungen"],
      },
      {
        name: "Raigering",
        description: "Gewachsener Stadtteil mit Einfamilienhäusern",
        commonProblems: ["Wurzeleinwuchs in Gärten"],
      },
      {
        name: "Gailoh",
        description: "Wohngebiet mit gemischter Bebauung",
        commonProblems: ["Fettablagerungen", "Ältere Kanalisation"],
      },
      {
        name: "Kalvarienberg",
        description: "Wohnlage mit älterem Baubestand",
        commonProblems: ["Kalkablagerungen in alten Leitungen"],
      },
      {
        name: "Drahthammer",
        description: "Ehemaliges Industrieareal, heute gemischt genutzt",
        commonProblems: ["Gewerbeabwässer", "Ältere Anschlüsse"],
      },
    ],
    localProblems: {
      title: "Typische Rohrprobleme in Amberg",
      problems: [
        {
          problem: "Alte Rohrsysteme in der Altstadt",
          areas: "Altstadt, Kalvarienberg",
          solution: "Schonende Reinigung + Kamerainspektion",
        },
        {
          problem: "Wurzeleinwuchs durch Gartenbäume",
          areas: "Raigering, Ammersricht",
          solution: "Wurzelfräse + präventive Wartung",
        },
        {
          problem: "Fettablagerungen (Gastronomie)",
          areas: "Innenstadt",
          solution: "Hochdruck + regelmäßige Wartung",
        },
        {
          problem: "Ältere Grundleitungen in Gewerbearealen",
          areas: "Drahthammer, Gewerbegebiete",
          solution: "TV-Inspektion + gezielte Sanierung",
        },
      ],
    },
    responseInfo: {
      typical: "20-40 Minuten",
      fastest: "ca. 15 Minuten",
      note: "Dank unserer eigenen Filiale in Amberg sind wir schnell bei Ihnen.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Amberg vor Ort?",
        answer:
          "Meist in 20-40 Minuten – dank unserer eigenen Filiale in Amberg. Bei akuten Notfällen (Wasserschaden, Rückstau) priorisieren wir die Anfahrt.",
      },
      {
        question: "Kennen Sie sich mit Altbauten in der Amberger Altstadt aus?",
        answer:
          "Ja, wir haben Erfahrung mit historischen Guss- und Steinzeugrohren, wie sie in der Amberger Altstadt häufig verbaut sind, und arbeiten mit schonenden Methoden.",
      },
      {
        question: "Reinigen Sie auch für Hausverwaltungen in Amberg?",
        answer:
          "Ja, wir arbeiten mit Hausverwaltungen im Landkreis Amberg-Sulzbach zusammen. Koordinierte Termine für mehrere Einheiten und Sammelrechnungen sind möglich.",
      },
    ],
  },

  kuemmersbruck: {
    slug: "kuemmersbruck",
    headline: "Rohrreinigung Kümmersbruck",
    subheadline: "Direkt vor den Toren Ambergs",
    localExpertise: {
      title: "Unser Service in Kümmersbruck",
      points: [
        "Nur wenige Kilometer von unserer Filiale in Amberg entfernt",
        "Erfahrung mit Ein- und Mehrfamilienhäusern in Wohngebieten",
        "Zusammenarbeit mit lokalen Hausverwaltungen",
        "Meist in 20-40 Minuten bei Ihnen",
      ],
    },
    neighborhoods: [
      {
        name: "Kümmersbruck",
        description: "Hauptort der Gemeinde",
        commonProblems: ["Standard-Verstopfungen"],
      },
      {
        name: "Haselmühl",
        description: "Wohngebiet an der Vils",
        commonProblems: ["Ältere Anschlussleitungen"],
      },
    ],
    localProblems: {
      title: "Typische Probleme in Kümmersbruck",
      problems: [
        {
          problem: "Ältere Anschlussleitungen in Wohnsiedlungen",
          areas: "Kümmersbruck, Haselmühl",
          solution: "Kamerainspektion + gezielte Reinigung",
        },
        {
          problem: "Fettablagerungen im Küchenabfluss",
          areas: "gesamte Gemeinde",
          solution: "Hochdruck + Fettlöser",
        },
      ],
    },
    responseInfo: {
      typical: "20-40 Minuten",
      fastest: "ca. 15 Minuten",
      note: "Kurze Distanz von unserer Filiale in Amberg.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Kümmersbruck?",
        answer: "Meist in 20-40 Minuten – wir sind ja gleich nebenan in Amberg.",
      },
      {
        question: "Bedienen Sie auch Haselmühl?",
        answer: "Ja, wir bedienen ganz Kümmersbruck inklusive aller Ortsteile.",
      },
    ],
  },

  ammerthal: {
    slug: "ammerthal",
    headline: "Rohrreinigung Ammerthal",
    subheadline: "Schnelle Hilfe in der Gemeinde vor den Toren Ambergs",
    localExpertise: {
      title: "Unser Service in Ammerthal",
      points: [
        "Regelmäßige Einsätze in Ammerthal und Umgebung",
        "Erfahrung mit Einfamilienhäusern und landwirtschaftlichen Anwesen",
        "Kurze Anfahrt von unserer Filiale in Amberg",
      ],
    },
    neighborhoods: [
      {
        name: "Ammerthal",
        description: "Hauptort der Gemeinde",
        commonProblems: ["Standard-Verstopfungen", "Ältere Grundleitungen"],
      },
    ],
    localProblems: {
      title: "Typische Probleme in Ammerthal",
      problems: [
        {
          problem: "Ältere Grundleitungen bei Einfamilienhäusern",
          areas: "gesamte Gemeinde",
          solution: "Kamerainspektion + Hochdruckreinigung",
        },
        {
          problem: "Wurzeleinwuchs in Gartenanlagen",
          areas: "gesamte Gemeinde",
          solution: "Wurzelfräse",
        },
      ],
    },
    responseInfo: {
      typical: "25-45 Minuten",
      fastest: "ca. 20 Minuten",
      note: "Kurze Anfahrt von unserer Filiale in Amberg.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Ammerthal?",
        answer:
          "Meist in 25-45 Minuten. Bei akuten Notfällen priorisieren wir die Anfahrt.",
      },
    ],
  },

  "sulzbach-rosenberg": {
    slug: "sulzbach-rosenberg",
    headline: "Rohrreinigung Sulzbach-Rosenberg",
    subheadline: "Zuverlässiger Service für die zweitgrößte Stadt im Landkreis",
    localExpertise: {
      title: "Unser Service in Sulzbach-Rosenberg",
      points: [
        "Regelmäßige Einsätze in Sulzbach-Rosenberg und den Ortsteilen",
        "Erfahrung mit historischer Bausubstanz und Industriebrachen",
        "Zusammenarbeit mit Hausverwaltungen und Gewerbebetrieben",
        "Schnelle Anfahrt von unserer Filiale in Amberg",
      ],
    },
    neighborhoods: [
      {
        name: "Sulzbach (Altstadt)",
        description: "Historischer Kern mit alter Bausubstanz",
        commonProblems: ["Alte Rohrsysteme"],
      },
      {
        name: "Rosenberg",
        description: "Ehemalige Industrie- und Bergbaustadt",
        commonProblems: ["Ältere Anschlussleitungen", "Gewerbeabwässer"],
      },
    ],
    localProblems: {
      title: "Typische Probleme in Sulzbach-Rosenberg",
      problems: [
        {
          problem: "Alte Rohrsysteme in der Sulzbacher Altstadt",
          areas: "Sulzbach",
          solution: "Schonende Reinigung + Kamerainspektion",
        },
        {
          problem: "Gewerbeabwässer aus ehemaligen Industrieflächen",
          areas: "Rosenberg",
          solution: "Industrielle Reinigung",
        },
      ],
    },
    responseInfo: {
      typical: "25-45 Minuten",
      fastest: "ca. 20 Minuten",
      note: "Schnelle Anfahrt von unserer Filiale in Amberg.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Sulzbach-Rosenberg?",
        answer: "Meist in 25-45 Minuten von unserer Filiale in Amberg aus.",
      },
      {
        question: "Reinigen Sie auch in Rosenberg und den Ortsteilen?",
        answer:
          "Ja, wir bedienen sowohl Sulzbach als auch Rosenberg und die umliegenden Ortsteile.",
      },
    ],
  },
  poppenricht: {
    slug: "poppenricht",
    headline: "Rohrreinigung Poppenricht",
    subheadline: "Zuverlässiger Service für die Gemeinde östlich von Amberg",
    localExpertise: {
      title: "Unser Service in Poppenricht",
      points: [
        "Regelmäßige Einsätze in Poppenricht und den Ortsteilen",
        "Erfahrung mit Einfamilienhäusern und landwirtschaftlichen Anwesen",
        "Kurze Anfahrt von unserer Filiale in Amberg",
        "Meist in 20-40 Minuten bei Ihnen",
      ],
    },
    neighborhoods: [
      {
        name: "Poppenricht",
        description: "Hauptort der Gemeinde",
        commonProblems: ["Standard-Verstopfungen", "Ältere Grundleitungen"],
      },
    ],
    localProblems: {
      title: "Typische Probleme in Poppenricht",
      problems: [
        {
          problem: "Ältere Grundleitungen bei Einfamilienhäusern",
          areas: "gesamte Gemeinde",
          solution: "Kamerainspektion + Hochdruckreinigung",
        },
        {
          problem: "Wurzeleinwuchs in Gartenanlagen",
          areas: "gesamte Gemeinde",
          solution: "Wurzelfräse",
        },
      ],
    },
    responseInfo: {
      typical: "20-40 Minuten",
      fastest: "ca. 15 Minuten",
      note: "Kurze Anfahrt von unserer Filiale in Amberg.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Poppenricht?",
        answer:
          "Meist in 20-40 Minuten – Poppenricht liegt nur wenige Kilometer von unserer Filiale in Amberg entfernt.",
      },
    ],
  },

  gebenbach: {
    slug: "gebenbach",
    headline: "Rohrreinigung Gebenbach",
    subheadline: "Schnelle Hilfe für die ländlich geprägte Gemeinde",
    localExpertise: {
      title: "Unser Service in Gebenbach",
      points: [
        "Regelmäßige Einsätze in Gebenbach und Umgebung",
        "Erfahrung mit landwirtschaftlichen Anwesen und Einfamilienhäusern",
        "Kurze Anfahrt von unserer Filiale in Amberg",
      ],
    },
    neighborhoods: [
      {
        name: "Gebenbach",
        description: "Hauptort der Gemeinde",
        commonProblems: ["Standard-Verstopfungen", "Ältere Anschlussleitungen"],
      },
    ],
    localProblems: {
      title: "Typische Probleme in Gebenbach",
      problems: [
        {
          problem: "Ältere Anschlussleitungen bei landwirtschaftlichen Anwesen",
          areas: "gesamte Gemeinde",
          solution: "Kamerainspektion + gezielte Reinigung",
        },
        {
          problem: "Wurzeleinwuchs in Gärten und Grundstücken",
          areas: "gesamte Gemeinde",
          solution: "Wurzelfräse + präventive Wartung",
        },
      ],
    },
    responseInfo: {
      typical: "25-45 Minuten",
      fastest: "ca. 20 Minuten",
      note: "Kurze Anfahrt von unserer Filiale in Amberg.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Gebenbach?",
        answer:
          "Meist in 25-45 Minuten. Bei akuten Notfällen priorisieren wir die Anfahrt.",
      },
    ],
  },

  ursensollen: {
    slug: "ursensollen",
    headline: "Rohrreinigung Ursensollen",
    subheadline: "Ihr Ansprechpartner für die Gemeinde im Sulzbacher Land",
    localExpertise: {
      title: "Unser Service in Ursensollen",
      points: [
        "Regelmäßige Einsätze in Ursensollen und den Ortsteilen",
        "Erfahrung mit Einfamilienhäusern und Gewerbebetrieben",
        "Kurze Anfahrt von unserer Filiale in Amberg",
      ],
    },
    neighborhoods: [
      {
        name: "Ursensollen",
        description: "Hauptort der Gemeinde",
        commonProblems: ["Standard-Verstopfungen", "Ältere Grundleitungen"],
      },
    ],
    localProblems: {
      title: "Typische Probleme in Ursensollen",
      problems: [
        {
          problem: "Ältere Grundleitungen in Wohnsiedlungen",
          areas: "gesamte Gemeinde",
          solution: "Kamerainspektion + gezielte Reinigung",
        },
        {
          problem: "Fettablagerungen im Küchenabfluss",
          areas: "gesamte Gemeinde",
          solution: "Hochdruck + Fettlöser",
        },
      ],
    },
    responseInfo: {
      typical: "25-45 Minuten",
      fastest: "ca. 20 Minuten",
      note: "Kurze Anfahrt von unserer Filiale in Amberg.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Ursensollen?",
        answer:
          "Meist in 25-45 Minuten. Bei akuten Notfällen priorisieren wir die Anfahrt.",
      },
    ],
  },

  hahnbach: {
    slug: "hahnbach",
    headline: "Rohrreinigung Hahnbach",
    subheadline: "Zuverlässiger Service für den Markt Hahnbach",
    localExpertise: {
      title: "Unser Service in Hahnbach",
      points: [
        "Regelmäßige Einsätze in Hahnbach und den Ortsteilen",
        "Erfahrung mit historischer und moderner Bausubstanz",
        "Zusammenarbeit mit lokalen Hausverwaltungen",
        "Kurze Anfahrt von unserer Filiale in Amberg",
      ],
    },
    neighborhoods: [
      {
        name: "Hahnbach",
        description: "Marktgemeinde mit historischem Ortskern",
        commonProblems: ["Alte Rohrsysteme", "Standard-Verstopfungen"],
      },
    ],
    localProblems: {
      title: "Typische Probleme in Hahnbach",
      problems: [
        {
          problem: "Alte Rohrsysteme im historischen Ortskern",
          areas: "Ortskern Hahnbach",
          solution: "Schonende Reinigung + Kamerainspektion",
        },
        {
          problem: "Wurzeleinwuchs in Gartenanlagen",
          areas: "gesamte Marktgemeinde",
          solution: "Wurzelfräse",
        },
      ],
    },
    responseInfo: {
      typical: "25-45 Minuten",
      fastest: "ca. 20 Minuten",
      note: "Kurze Anfahrt von unserer Filiale in Amberg.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Hahnbach?",
        answer:
          "Meist in 25-45 Minuten. Bei akuten Notfällen priorisieren wir die Anfahrt.",
      },
    ],
  },

  ebermannsdorf: {
    slug: "ebermannsdorf",
    headline: "Rohrreinigung Ebermannsdorf",
    subheadline: "Schnelle Hilfe für die Gemeinde im Landkreis Amberg-Sulzbach",
    localExpertise: {
      title: "Unser Service in Ebermannsdorf",
      points: [
        "Regelmäßige Einsätze in Ebermannsdorf und den Ortsteilen",
        "Erfahrung mit Einfamilienhäusern und landwirtschaftlichen Anwesen",
        "Kurze Anfahrt von unserer Filiale in Amberg",
      ],
    },
    neighborhoods: [
      {
        name: "Ebermannsdorf",
        description: "Hauptort der Gemeinde",
        commonProblems: ["Standard-Verstopfungen", "Ältere Grundleitungen"],
      },
      {
        name: "Massenricht",
        description: "Ortsteil der Gemeinde Ebermannsdorf",
        commonProblems: ["Ältere Anschlussleitungen"],
      },
    ],
    localProblems: {
      title: "Typische Probleme in Ebermannsdorf",
      problems: [
        {
          problem: "Ältere Grundleitungen bei Einfamilienhäusern",
          areas: "Ebermannsdorf, Massenricht",
          solution: "Kamerainspektion + Hochdruckreinigung",
        },
        {
          problem: "Wurzeleinwuchs in Gartenanlagen",
          areas: "gesamte Gemeinde",
          solution: "Wurzelfräse",
        },
      ],
    },
    responseInfo: {
      typical: "25-45 Minuten",
      fastest: "ca. 20 Minuten",
      note: "Kurze Anfahrt von unserer Filiale in Amberg.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Ebermannsdorf?",
        answer:
          "Meist in 25-45 Minuten. Bei akuten Notfällen priorisieren wir die Anfahrt.",
      },
      {
        question: "Bedienen Sie auch Massenricht?",
        answer:
          "Ja, wir bedienen die gesamte Gemeinde Ebermannsdorf inklusive aller Ortsteile.",
      },
    ],
  },

  freudenberg: {
    slug: "freudenberg",
    headline: "Rohrreinigung Freudenberg",
    subheadline: "Ihr Fachbetrieb für den Markt Freudenberg",
    localExpertise: {
      title: "Unser Service in Freudenberg",
      points: [
        "Regelmäßige Einsätze in Freudenberg und Umgebung",
        "Erfahrung mit historischer Bausubstanz rund um die Burgruine",
        "Erfahrung mit Einfamilienhäusern und landwirtschaftlichen Anwesen",
        "Kurze Anfahrt von unserer Filiale in Amberg",
      ],
    },
    neighborhoods: [
      {
        name: "Freudenberg",
        description: "Marktgemeinde mit historischem Ortskern und Burgruine",
        commonProblems: ["Alte Rohrsysteme", "Standard-Verstopfungen"],
      },
    ],
    localProblems: {
      title: "Typische Probleme in Freudenberg",
      problems: [
        {
          problem: "Alte Rohrsysteme im historischen Ortskern",
          areas: "Ortskern Freudenberg",
          solution: "Schonende Reinigung + Kamerainspektion",
        },
        {
          problem: "Wurzeleinwuchs bei landwirtschaftlichen Anwesen",
          areas: "gesamte Marktgemeinde",
          solution: "Wurzelfräse + präventive Wartung",
        },
      ],
    },
    responseInfo: {
      typical: "25-45 Minuten",
      fastest: "ca. 20 Minuten",
      note: "Kurze Anfahrt von unserer Filiale in Amberg.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Freudenberg?",
        answer:
          "Meist in 25-45 Minuten. Bei akuten Notfällen priorisieren wir die Anfahrt.",
      },
    ],
  },
};

// Helper function to get enhanced city content
export function getEnhancedCityContent(
  slug: string,
): EnhancedCityContent | null {
  return enhancedCityContent[slug] || null;
}

// Get all slugs that have enhanced content
export function getEnhancedCitySlugs(): string[] {
  return Object.keys(enhancedCityContent);
}
