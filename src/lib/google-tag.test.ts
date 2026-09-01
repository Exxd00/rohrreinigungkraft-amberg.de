import assert from "node:assert/strict";
import test from "node:test";
import {
  ensureGoogleTagQueue,
  type GoogleTagWindow,
} from "./google-tag.ts";

test("queues gtag commands as Arguments objects", () => {
  const tagWindow: GoogleTagWindow = {};
  const gtag = ensureGoogleTagQueue(tagWindow);

  gtag("config", "G-4YZB1PX342");

  const command = tagWindow.dataLayer?.[0] as IArguments | undefined;
  assert.equal(Object.prototype.toString.call(command), "[object Arguments]");
  assert.equal(command?.[0], "config");
  assert.equal(command?.[1], "G-4YZB1PX342");
});

test("preserves an already installed gtag implementation", () => {
  const calls: unknown[][] = [];
  const existing = (...args: unknown[]) => calls.push(args);
  const tagWindow: GoogleTagWindow = { gtag: existing };

  assert.equal(ensureGoogleTagQueue(tagWindow), existing);
});
