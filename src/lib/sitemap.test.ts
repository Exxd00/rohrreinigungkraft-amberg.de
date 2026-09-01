import assert from "node:assert/strict";
import test from "node:test";
import sitemap, { importantServices } from "../app/sitemap.ts";
import { getAllServiceSlugs } from "../data/services.ts";

const SERVICE_URL_PREFIX =
  "https://rohrreinigungkraft-amberg.de/service/";

test("sitemap contains every service route exactly once", () => {
  const expectedSlugs = [...getAllServiceSlugs()].sort();
  const serviceEntries = sitemap().filter((entry) =>
    entry.url.startsWith(SERVICE_URL_PREFIX),
  );
  const actualSlugs = serviceEntries
    .map((entry) => entry.url.slice(SERVICE_URL_PREFIX.length))
    .sort();

  assert.deepEqual(actualSlugs, expectedSlugs);
  assert.equal(new Set(actualSlugs).size, actualSlugs.length);
});

test("sitemap preserves important priorities and lowers the remaining services", () => {
  const serviceEntries = new Map(
    sitemap()
      .filter((entry) => entry.url.startsWith(SERVICE_URL_PREFIX))
      .map((entry) => [
        entry.url.slice(SERVICE_URL_PREFIX.length),
        entry,
      ]),
  );
  const importantSlugs = new Set(
    importantServices.map((service) => service.slug),
  );

  for (const service of importantServices) {
    const entry = serviceEntries.get(service.slug);
    assert.ok(entry, `Missing important service: ${service.slug}`);
    assert.equal(entry.priority, service.priority);
    assert.equal(entry.changeFrequency, "weekly");
  }

  for (const [slug, entry] of serviceEntries) {
    if (importantSlugs.has(slug)) continue;
    assert.equal(entry.priority, 0.5);
    assert.equal(entry.changeFrequency, "monthly");
  }
});
