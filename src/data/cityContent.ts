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
    subheadline: "Zuverlässiger Fachbetrieb für die ganze Oberpfalz-Metropole",
    localExpertise: {
      title: "Unser Service in Amberg",
      points: [
        "Regelmäßige Einsätze für Privat- und Gewerbekunden in Amberg",
        "Erfahrung mit der historischen Bausubstanz der Altstadt und modernen Neubaugebieten",
        "Anfahrt über die A6 direkt nach Amberg",
        "Zusammenarbeit mit Hausverwaltungen im Landkreis Amberg-Sulzbach",
        "Realistische Ankunftszeit bereits am Telefon – keine falschen Versprechen",
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
      fastest: "ca. 60 Minuten bei freier A6",
      note: "Wir sagen Ihnen die realistische Anfahrtszeit bereits am Telefon – lieber ehrlich als ein falsches Versprechen.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Amberg vor Ort?",
        answer:
          "Realistisch meist in 20-40 Minuten – wir sagen Ihnen die voraussichtliche Ankunftszeit bereits am Telefon, damit Sie sich darauf einstellen können. Bei akuten Notfällen (Wasserschaden, Rückstau) priorisieren wir die Anfahrt.",
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
        "Nur wenige Kilometer von Amberg entfernt",
        "Erfahrung mit Ein- und Mehrfamilienhäusern in Wohngebieten",
        "Zusammenarbeit mit lokalen Hausverwaltungen",
        "Realistische Ankunftszeit bereits am Telefon",
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
      fastest: "ca. 60 Minuten",
      note: "Kurze Distanz zu Amberg – die Anfahrtszeit teilen wir Ihnen ehrlich am Telefon mit.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Kümmersbruck?",
        answer:
          "Meist in 20-40 Minuten. Wir nennen Ihnen die voraussichtliche Ankunftszeit bereits beim Anruf.",
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
        "Realistische Ankunftszeit bereits am Telefon",
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
      typical: "20-40 Minuten",
      fastest: "ca. 65 Minuten",
      note: "Wir sagen Ihnen die realistische Ankunftszeit bereits am Telefon.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Ammerthal?",
        answer:
          "Meist in 20-40 Minuten. Bei akuten Notfällen priorisieren wir die Anfahrt und informieren Sie über die voraussichtliche Ankunftszeit.",
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
        "Realistische Ankunftszeit bereits am Telefon",
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
      typical: "20-40 Minuten",
      fastest: "ca. 70 Minuten",
      note: "Wir sagen Ihnen die realistische Ankunftszeit bereits am Telefon.",
    },
    faq: [
      {
        question: "Wie schnell sind Sie in Sulzbach-Rosenberg?",
        answer:
          "Meist in 20-40 Minuten. Wir nennen Ihnen die voraussichtliche Ankunftszeit bereits beim Anruf, damit Sie sich darauf einstellen können.",
      },
      {
        question: "Reinigen Sie auch in Rosenberg und den Ortsteilen?",
        answer:
          "Ja, wir bedienen sowohl Sulzbach als auch Rosenberg und die umliegenden Ortsteile.",
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
