# Rohrreinigung Kraft — Amberg

Professionelle Rohrreinigung & Kanalreinigung in der Oberpfalz (Amberg-Region).

**Website:** rohrreinigung-kraft-amberg.de _(Platzhalter-Domain — noch nicht registriert)_

## Über das Projekt

Diese Seite ist eine geografisch retargetierte Kopie der [rohrreinigung-kraft.de](https://rohrreinigung-kraft.de) Nürnberg-Seite, ausgerichtet auf **Amberg und Umgebung** (Oberpfalz) statt auf Mittelfranken. Design, Leistungskatalog, Preisstruktur und Tracking-Infrastruktur sind identisch — nur die geografische Ausrichtung wurde angepasst.

Firmensitz und rechtliche Angaben (Adresse, Handelsregister, USt-ID) bleiben unverändert die echten Angaben aus Nürnberg-Glockenhof — das ist derselbe Fachbetrieb, der jetzt zusätzlich die Amberg-Region bedient. Da die reale Anfahrt von dort ca. 65 km beträgt, wurden alle Anfahrtszeiten-Angaben ehrlich neu berechnet (ca. 70-100 Min statt der schnelleren Nürnberg-Zeiten) — siehe Kommentar in `src/data/company.ts`.

### Hauptstädte

- **Amberg** - Kernstadt
- **Kümmersbruck** - Direkter Nachbar
- **Sulzbach-Rosenberg** - Zweitgrößte Stadt im Landkreis

### Servicegebiet

60 km Umkreis von Amberg, inkl. Hahnbach, Vilseck, Hirschau, Neumarkt i.d.OPf., Schwandorf und viele weitere Orte.

## Technologie

- **Framework:** Next.js 15 (Turbopack)
- **Styling:** Tailwind CSS + shadcn/ui
- **Sprache:** TypeScript
- **Hosting:** Vercel / Netlify

## Entwicklung

```bash
# Installation
bun install

# Entwicklungsserver starten
bun run dev

# Build erstellen
bun run build
```

## Offene Punkte vor dem Go-Live

- [ ] Echte Domain registrieren und Platzhalter `rohrreinigung-kraft-amberg.de` überall ersetzen (grep danach suchen)
- [ ] Eigene GA4-Property anlegen und Platzhalter-ID `G-XXXXXXXXXX` in `src/app/layout.tsx` ersetzen
- [ ] Google Ads Geo-Target-IDs in `src/app/api/google-ads/campaigns/route.ts` über die Google Ads API nachschlagen (aktuell leer, siehe TODO-Kommentar dort)
- [ ] Google Ads Konto/Zugangsdaten für die Amberg-Kampagnen konfigurieren (`.env`)

## Kontakt

- **Telefon:** 0911 89218682
- **E-Mail:** Info@Rohrreinigung-kraft.de
- **Firmensitz:** Nürnberg-Glockenhof (echte Adresse, siehe Impressum)
- **Servicegebiet dieser Seite:** Amberg-Region, Oberpfalz

## Google Ads

Die Google Ads Kampagnen-Dateien befinden sich im Ordner `google_ads_editor/` und sind für den Import in Google Ads Editor vorbereitet:

- Targeting: Amberg + 60 km Umkreis
- Fokus: Oberpfalz
- Kampagnen: Notdienst, Rohrreinigung Amberg, Kümmersbruck/Sulzbach-Rosenberg, High-Value Services
