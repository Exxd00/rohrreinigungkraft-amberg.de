# Rohrreinigung Kraft — Amberg

Professionelle Rohrreinigung & Kanalreinigung in der Oberpfalz (Amberg-Region).

**Website:** [rohrreinigungkraft-amberg.de](https://rohrreinigungkraft-amberg.de)

## Über das Projekt

Diese Seite ist auf **Amberg und Umgebung** (Oberpfalz) ausgerichtet. Tracking, Webhook und Analytics sind für dieses Projekt separat konfiguriert.

Firmensitz und rechtliche Angaben bleiben die echten Angaben aus Nürnberg-Glockenhof. Für die Amberg-Region gilt laut bestätigter Einsatzplanung eine übliche Ankunftszeit von 20–40 Minuten; die konkrete Zeit wird abhängig von Verkehr und Einsatzlage am Telefon bestätigt.

### Hauptstädte

- **Amberg** - Kernstadt
- **Kümmersbruck** - Direkter Nachbar
- **Sulzbach-Rosenberg** - Zweitgrößte Stadt im Landkreis

### Servicegebiet

60 km Umkreis von Amberg, inkl. Hahnbach, Vilseck, Hirschau, Neumarkt i.d.OPf., Schwandorf und viele weitere Orte.

## Technologie

- **Framework:** Next.js 15.5 (Turbopack)
- **Styling:** Tailwind CSS + shadcn/ui
- **Sprache:** TypeScript
- **Hosting:** Vercel

## Entwicklung

```bash
# Installation
bun install

# Entwicklungsserver starten
bun run dev

# Build erstellen
bun run build
```

## Tracking

- GA4 Measurement ID: projektspezifisch in `src/app/layout.tsx`
- Consent Mode v2: standardmäßig verweigert, bis der Besucher zustimmt
- Erfolgsereignisse: Kontaktformular und Rückruf erst nach Server-Erfolg
- Telefonklick: sekundäres Analyseereignis, kein bestätigter Anruf

## Kontakt

- **Telefon:** 01787401958
- **E-Mail:** Info@Rohrreinigung-kraft.de
- **Firmensitz:** Nürnberg-Glockenhof (echte Adresse, siehe Impressum)
- **Servicegebiet dieser Seite:** Amberg-Region, Oberpfalz

## Google Ads

Die vorhandenen Dateien in `google_ads_editor/` sind ein alter Entwurf für ein anderes Konto und dürfen **nicht importiert** werden. Die aktuelle Kampagne wird direkt im dedizierten Amberg-Konto angelegt und bleibt bis zur Freigabe pausiert.
