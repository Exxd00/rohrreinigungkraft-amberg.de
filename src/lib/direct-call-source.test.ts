import assert from "node:assert/strict";
import test from "node:test";
import {
  getDirectCallInteractionLocation,
  getDirectCallSheetMessage,
} from "./direct-call-source.ts";

test("attributes city hero and final call links to their exact CTA source", () => {
  assert.equal(
    getDirectCallInteractionLocation("city_page_amberg_hero"),
    "city_page_amberg_hero",
  );
  assert.equal(
    getDirectCallInteractionLocation("city_page_sulzbach-rosenberg_final"),
    "city_page_sulzbach-rosenberg_final",
  );
});

test("keeps modal-based direct calls attributed to the call modal", () => {
  assert.equal(
    getDirectCallInteractionLocation("header_desktop"),
    "floating_call_modal",
  );
});

test("describes city CTA clicks without claiming they came from a modal", () => {
  assert.equal(
    getDirectCallSheetMessage("city_page_kuemmersbruck_hero"),
    'Klick auf "Jetzt anrufen" auf der Stadtseite (city_page_kuemmersbruck_hero).',
  );
  assert.equal(
    getDirectCallSheetMessage("floating_button"),
    'Klick auf "Jetzt direkt anrufen" im Anruf-Dialog (floating_button).',
  );
});
