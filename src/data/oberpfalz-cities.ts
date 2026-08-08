/**
 * Priority cities in the Amberg region for focused SEO and Google Ads
 * Focus: Amberg + 60km Umkreis (Landkreis Amberg-Sulzbach and neighboring Oberpfalz districts)
 * These cities will be included in the sitemap
 *
 * ⚠️ Response times are calculated from our real Amberg branch (0km = Amberg).
 */

export interface PriorityCity {
  name: string;
  slug: string;
  priority: 1 | 2 | 3; // 1 = highest (Amberg, Kümmersbruck, Ammerthal)
  responseTime: string;
  distance: number; // km from Amberg
}

// Priority 1: Main cities - highest focus (0-10 km from Amberg)
export const priorityOneCities: PriorityCity[] = [
  {
    name: "Amberg",
    slug: "amberg",
    priority: 1,
    responseTime: "20-40 Min",
    distance: 0,
  },
  {
    name: "Kümmersbruck",
    slug: "kuemmersbruck",
    priority: 1,
    responseTime: "20-40 Min",
    distance: 4,
  },
  {
    name: "Ammerthal",
    slug: "ammerthal",
    priority: 1,
    responseTime: "25-45 Min",
    distance: 7,
  },
];

// Priority 2: Close surroundings - good focus (10-30 km from Amberg)
export const priorityTwoCities: PriorityCity[] = [
  {
    name: "Poppenricht",
    slug: "poppenricht",
    priority: 2,
    responseTime: "20-40 Min",
    distance: 6,
  },
  {
    name: "Gebenbach",
    slug: "gebenbach",
    priority: 2,
    responseTime: "25-45 Min",
    distance: 9,
  },
  {
    name: "Ursensollen",
    slug: "ursensollen",
    priority: 2,
    responseTime: "25-45 Min",
    distance: 10,
  },
  {
    name: "Hahnbach",
    slug: "hahnbach",
    priority: 2,
    responseTime: "25-45 Min",
    distance: 10,
  },
  {
    name: "Ebermannsdorf",
    slug: "ebermannsdorf",
    priority: 2,
    responseTime: "25-45 Min",
    distance: 12,
  },
  {
    name: "Freudenberg",
    slug: "freudenberg",
    priority: 2,
    responseTime: "25-45 Min",
    distance: 13,
  },
  {
    name: "Sulzbach-Rosenberg",
    slug: "sulzbach-rosenberg",
    priority: 2,
    responseTime: "25-45 Min",
    distance: 14,
  },
  {
    name: "Illschwang",
    slug: "illschwang",
    priority: 2,
    responseTime: "25-45 Min",
    distance: 15,
  },
  {
    name: "Edelsfeld",
    slug: "edelsfeld",
    priority: 2,
    responseTime: "30-50 Min",
    distance: 16,
  },
  {
    name: "Birgland",
    slug: "birgland",
    priority: 2,
    responseTime: "30-50 Min",
    distance: 17,
  },
  {
    name: "Neukirchen bei Sulzbach-Rosenberg",
    slug: "neukirchen-bei-sulzbach-rosenberg",
    priority: 2,
    responseTime: "30-50 Min",
    distance: 17,
  },
  {
    name: "Königstein",
    slug: "koenigstein",
    priority: 2,
    responseTime: "30-50 Min",
    distance: 18,
  },
  {
    name: "Hirschbach",
    slug: "hirschbach",
    priority: 2,
    responseTime: "30-50 Min",
    distance: 18,
  },
  {
    name: "Schnaittenbach",
    slug: "schnaittenbach",
    priority: 2,
    responseTime: "30-50 Min",
    distance: 18,
  },
  {
    name: "Weigendorf",
    slug: "weigendorf",
    priority: 2,
    responseTime: "30-50 Min",
    distance: 20,
  },
  {
    name: "Kastl",
    slug: "kastl",
    priority: 2,
    responseTime: "30-50 Min",
    distance: 20,
  },
  {
    name: "Freihung",
    slug: "freihung",
    priority: 2,
    responseTime: "30-50 Min",
    distance: 20,
  },
  {
    name: "Hohenburg",
    slug: "hohenburg",
    priority: 2,
    responseTime: "35-55 Min",
    distance: 22,
  },
  {
    name: "Rieden",
    slug: "rieden",
    priority: 2,
    responseTime: "35-55 Min",
    distance: 22,
  },
  {
    name: "Etzelwang",
    slug: "etzelwang",
    priority: 2,
    responseTime: "35-55 Min",
    distance: 22,
  },
  {
    name: "Hirschau",
    slug: "hirschau",
    priority: 2,
    responseTime: "35-55 Min",
    distance: 22,
  },
  {
    name: "Vilseck",
    slug: "vilseck",
    priority: 2,
    responseTime: "35-55 Min",
    distance: 23,
  },
  {
    name: "Schmidmühlen",
    slug: "schmidmuehlen",
    priority: 2,
    responseTime: "35-55 Min",
    distance: 24,
  },
  {
    name: "Auerbach in der Oberpfalz",
    slug: "auerbach-in-der-oberpfalz",
    priority: 2,
    responseTime: "35-55 Min",
    distance: 24,
  },
];

// Priority 3: Extended area - 30-60 km from Amberg
export const priorityThreeCities: PriorityCity[] = [
  {
    name: "Teublitz",
    slug: "teublitz",
    priority: 3,
    responseTime: "40-60 Min",
    distance: 30,
  },
  {
    name: "Lauterhofen",
    slug: "lauterhofen",
    priority: 3,
    responseTime: "40-60 Min",
    distance: 30,
  },
  {
    name: "Velburg",
    slug: "velburg",
    priority: 3,
    responseTime: "40-60 Min",
    distance: 30,
  },
  {
    name: "Burglengenfeld",
    slug: "burglengenfeld",
    priority: 3,
    responseTime: "40-60 Min",
    distance: 32,
  },
  {
    name: "Wackersdorf",
    slug: "wackersdorf",
    priority: 3,
    responseTime: "40-60 Min",
    distance: 33,
  },
  {
    name: "Neumarkt in der Oberpfalz",
    slug: "neumarkt-in-der-oberpfalz",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 35,
  },
  {
    name: "Schwandorf",
    slug: "schwandorf",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 35,
  },
  {
    name: "Maxhütte-Haidhof",
    slug: "maxhuette-haidhof",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 35,
  },
  {
    name: "Eschenbach in der Oberpfalz",
    slug: "eschenbach-in-der-oberpfalz",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 35,
  },
  {
    name: "Parsberg",
    slug: "parsberg",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 38,
  },
  {
    name: "Nabburg",
    slug: "nabburg",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 38,
  },
  {
    name: "Berching",
    slug: "berching",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 40,
  },
  {
    name: "Postbauer-Heng",
    slug: "postbauer-heng",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 40,
  },
  {
    name: "Weiden in der Oberpfalz",
    slug: "weiden-in-der-oberpfalz",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 40,
  },
  {
    name: "Pegnitz",
    slug: "pegnitz",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 40,
  },
  {
    name: "Freystadt",
    slug: "freystadt",
    priority: 3,
    responseTime: "45-65 Min",
    distance: 42,
  },
  {
    name: "Neunburg vorm Wald",
    slug: "neunburg-vorm-wald",
    priority: 3,
    responseTime: "50-70 Min",
    distance: 45,
  },
  {
    name: "Neustadt an der Waldnaab",
    slug: "neustadt-an-der-waldnaab",
    priority: 3,
    responseTime: "50-70 Min",
    distance: 45,
  },
  {
    name: "Regenstauf",
    slug: "regenstauf",
    priority: 3,
    responseTime: "50-70 Min",
    distance: 48,
  },
  {
    name: "Vohenstrauß",
    slug: "vohenstrauss",
    priority: 3,
    responseTime: "50-75 Min",
    distance: 50,
  },
  {
    name: "Regensburg",
    slug: "regensburg",
    priority: 3,
    responseTime: "55-75 Min",
    distance: 57,
  },
];

// All Amberg-region cities for sitemap (60km radius)
export const oberpfalzCities: PriorityCity[] = [
  ...priorityOneCities,
  ...priorityTwoCities,
  ...priorityThreeCities,
];

// Main services for service pages
export const mainServices = [
  { name: "Rohrreinigung", slug: "rohrreinigung" },
  { name: "Kanalreinigung", slug: "kanalreinigung" },
  { name: "Abflussreinigung", slug: "abflussreinigung" },
  { name: "Notdienst", slug: "rohrreinigung-notdienst" },
  { name: "Toilette verstopft", slug: "toilette-verstopft" },
  { name: "TV-Inspektion", slug: "kamera-inspektion" },
];

// Get city slugs for sitemap
export function getOberpfalzCitySlugs(): string[] {
  return oberpfalzCities.map((city) => city.slug);
}

// Get main service slugs for sitemap
export function getMainServiceSlugs(): string[] {
  return mainServices.map((service) => service.slug);
}

// Get priority city by slug
export function getPriorityCityBySlug(slug: string): PriorityCity | undefined {
  return oberpfalzCities.find((city) => city.slug === slug);
}

// Get cities within a specific radius
export function getCitiesWithinRadius(maxDistance: number): PriorityCity[] {
  return oberpfalzCities.filter((city) => city.distance <= maxDistance);
}

// Total count
export const totalOberpfalzCities = oberpfalzCities.length;
