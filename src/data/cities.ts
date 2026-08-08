/**
 * Cities in the Oberpfalz - Service Area (60km radius from Amberg)
 * Focused on the Amberg-Sulzbach region and neighboring Oberpfalz districts for Google Ads campaigns
 */

export interface City {
  name: string;
  slug: string;
  region: string;
  distance: number; // km from Amberg
  population?: number;
  description: string;
  postalCodes?: string[];
}

// Generator function to create cities
const createCity = (
  name: string,
  slug: string,
  region: string,
  distance: number,
  population?: number,
  description?: string,
): City => ({
  name,
  slug,
  region,
  distance,
  population,
  description:
    description ||
    `Professionelle Rohrreinigung und Kanalreinigung in ${name}. 24/7 Notdienst mit schneller Anfahrt.`,
});

export const cities: City[] = [
  // === PRIORITY 1: HAUPTSTÄDTE (0-10 km) ===
  createCity(
    "Amberg",
    "amberg",
    "Oberpfalz",
    0,
    42000,
    "Kreisfreie Stadt in der Oberpfalz und unser Hauptstandort für Rohrreinigung und Kanalreinigung.",
  ),
  createCity(
    "Kümmersbruck",
    "kuemmersbruck",
    "Oberpfalz",
    4,
    8700,
    "Direkte Nachbargemeinde von Amberg. Schnelle Anfahrt für alle Rohrreinigungsarbeiten.",
  ),
  createCity(
    "Ammerthal",
    "ammerthal",
    "Oberpfalz",
    7,
    3300,
    "Gemeinde direkt vor den Toren Ambergs mit kurzer Anfahrtszeit.",
  ),

  // === PRIORITY 2: NAHES UMLAND (10-30 km) ===
  createCity("Poppenricht", "poppenricht", "Oberpfalz", 6, 3300),
  createCity("Gebenbach", "gebenbach", "Oberpfalz", 9, 1600),
  createCity("Ursensollen", "ursensollen", "Oberpfalz", 10, 4300),
  createCity("Hahnbach", "hahnbach", "Oberpfalz", 10, 5000),
  createCity("Ebermannsdorf", "ebermannsdorf", "Oberpfalz", 12, 3700),
  createCity(
    "Sulzbach-Rosenberg",
    "sulzbach-rosenberg",
    "Oberpfalz",
    14,
    18500,
    "Zweitgrößte Stadt im Landkreis Amberg-Sulzbach. Schnelle Soforthilfe bei Verstopfungen.",
  ),
  createCity("Freudenberg", "freudenberg", "Oberpfalz", 13, 3600),
  createCity("Edelsfeld", "edelsfeld", "Oberpfalz", 16, 1700),
  createCity("Illschwang", "illschwang", "Oberpfalz", 15, 2400),
  createCity("Königstein", "koenigstein", "Oberpfalz", 18, 2700),
  createCity("Birgland", "birgland", "Oberpfalz", 17, 2700),
  createCity(
    "Neukirchen bei Sulzbach-Rosenberg",
    "neukirchen-bei-sulzbach-rosenberg",
    "Oberpfalz",
    17,
    2000,
  ),
  createCity("Hirschbach", "hirschbach", "Oberpfalz", 18, 1600),
  createCity("Schnaittenbach", "schnaittenbach", "Oberpfalz", 18, 5000),
  createCity("Freihung", "freihung", "Oberpfalz", 20, 2800),
  createCity("Kastl", "kastl", "Oberpfalz", 20, 1900),
  createCity("Hirschau", "hirschau", "Oberpfalz", 22, 5200),
  createCity("Vilseck", "vilseck", "Oberpfalz", 23, 6300),
  createCity("Hohenburg", "hohenburg", "Oberpfalz", 22, 1400),
  createCity("Rieden", "rieden", "Oberpfalz", 22, 3000),
  createCity("Weigendorf", "weigendorf", "Oberpfalz", 20, 1900),
  createCity("Etzelwang", "etzelwang", "Oberpfalz", 22, 1600),
  createCity("Schmidmühlen", "schmidmuehlen", "Oberpfalz", 24, 2700),
  createCity(
    "Auerbach in der Oberpfalz",
    "auerbach-in-der-oberpfalz",
    "Oberpfalz",
    24,
    9000,
  ),

  // === PRIORITY 3: ERWEITERTES GEBIET (30-60 km) ===
  createCity("Lauterhofen", "lauterhofen", "Oberpfalz", 30, 4300),
  createCity("Velburg", "velburg", "Oberpfalz", 30, 6600),
  createCity(
    "Neumarkt in der Oberpfalz",
    "neumarkt-in-der-oberpfalz",
    "Oberpfalz",
    35,
    41000,
    "Kreisstadt des Landkreises Neumarkt. Zuverlässiger Rohrreinigungsservice.",
  ),
  createCity("Parsberg", "parsberg", "Oberpfalz", 38, 9300),
  createCity("Berching", "berching", "Oberpfalz", 40, 8700),
  createCity("Postbauer-Heng", "postbauer-heng", "Oberpfalz", 40, 8300),
  createCity("Freystadt", "freystadt", "Oberpfalz", 42, 9000),
  createCity("Burglengenfeld", "burglengenfeld", "Oberpfalz", 32, 11300),
  createCity("Teublitz", "teublitz", "Oberpfalz", 30, 8700),
  createCity("Wackersdorf", "wackersdorf", "Oberpfalz", 33, 4000),
  createCity(
    "Schwandorf",
    "schwandorf",
    "Oberpfalz",
    35,
    29000,
    "Kreisstadt des Landkreises Schwandorf. Zuverlässiger Rohrreinigungsservice.",
  ),
  createCity("Maxhütte-Haidhof", "maxhuette-haidhof", "Oberpfalz", 35, 12600),
  createCity("Nabburg", "nabburg", "Oberpfalz", 38, 6000),
  createCity("Neunburg vorm Wald", "neunburg-vorm-wald", "Oberpfalz", 45, 8800),
  createCity(
    "Weiden in der Oberpfalz",
    "weiden-in-der-oberpfalz",
    "Oberpfalz",
    40,
    42000,
    "Kreisfreie Stadt in der nördlichen Oberpfalz.",
  ),
  createCity(
    "Eschenbach in der Oberpfalz",
    "eschenbach-in-der-oberpfalz",
    "Oberpfalz",
    35,
    5000,
  ),
  createCity(
    "Neustadt an der Waldnaab",
    "neustadt-an-der-waldnaab",
    "Oberpfalz",
    45,
    6000,
  ),
  createCity("Vohenstrauß", "vohenstrauss", "Oberpfalz", 50, 7000),
  createCity(
    "Regensburg",
    "regensburg",
    "Oberpfalz",
    57,
    153000,
    "Größte Stadt der Oberpfalz an der Donau.",
  ),
  createCity("Regenstauf", "regenstauf", "Oberpfalz", 48, 11500),
  createCity("Pegnitz", "pegnitz", "Oberfranken", 40, 14000),
];

export const regions = ["Oberpfalz", "Oberfranken"];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}

export function getCitiesByRegion(region: string): City[] {
  return cities.filter((city) => city.region === region);
}

export function getNearbyCities(distance: number = 30): City[] {
  return cities.filter((city) => city.distance <= distance);
}

export function getAllCitySlugs(): string[] {
  return cities.map((city) => city.slug);
}

export function searchCities(query: string): City[] {
  const searchTerm = query.toLowerCase();
  return cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm) ||
      city.slug.toLowerCase().includes(searchTerm) ||
      city.region.toLowerCase().includes(searchTerm),
  );
}

export function getCitiesSortedByDistance(): City[] {
  return [...cities].sort((a, b) => a.distance - b.distance);
}

export function getCitiesSortedByName(): City[] {
  return [...cities].sort((a, b) => a.name.localeCompare(b.name, "de"));
}

// Total cities in service area
export const totalCities = cities.length;
