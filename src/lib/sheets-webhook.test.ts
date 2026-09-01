import assert from "node:assert/strict";
import test from "node:test";
import {
  LEAD_SHEET_NAME,
  SheetsWebhookError,
  isValidEventId,
  sendToLeadSheet,
  validateSheetsReceipt,
} from "./sheets-webhook.ts";

const EVENT_ID = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

test("accepts only UUID v4 event IDs", () => {
  assert.equal(isValidEventId(EVENT_ID), true);
  assert.equal(isValidEventId("f47ac10b-58cc-1372-a567-0e02b2c3d479"), false);
  assert.equal(isValidEventId("not-an-event-id"), false);
});

test("validates a newly inserted Sheets receipt", () => {
  assert.deepEqual(
    validateSheetsReceipt(
      {
        success: true,
        recorded: true,
        deduplicated: false,
        sheet: LEAD_SHEET_NAME,
        row: 3,
        eventId: EVENT_ID,
      },
      EVENT_ID,
    ),
    {
      recorded: true,
      deduplicated: false,
      sheet: LEAD_SHEET_NAME,
      row: 3,
      eventId: EVENT_ID,
    },
  );
});

test("accepts a duplicate only when the receipt points to its existing row", () => {
  const receipt = validateSheetsReceipt(
    {
      success: true,
      recorded: false,
      deduplicated: true,
      sheet: LEAD_SHEET_NAME,
      row: 8,
      eventId: EVENT_ID,
    },
    EVENT_ID,
  );

  assert.equal(receipt.recorded, false);
  assert.equal(receipt.deduplicated, true);
  assert.equal(receipt.row, 8);
});

test("rejects failed, mismatched and internally inconsistent receipts", () => {
  const invalidReceipts = [
    {
      success: false,
      recorded: false,
      deduplicated: false,
      sheet: LEAD_SHEET_NAME,
      row: 3,
      eventId: EVENT_ID,
    },
    {
      success: true,
      recorded: true,
      deduplicated: false,
      sheet: "Sheet1",
      row: 3,
      eventId: EVENT_ID,
    },
    {
      success: true,
      recorded: true,
      deduplicated: false,
      sheet: LEAD_SHEET_NAME,
      row: 3,
      eventId: "5c5814f1-4196-4ab0-95ae-9dd8af4d7d5b",
    },
    {
      success: true,
      recorded: true,
      deduplicated: true,
      sheet: LEAD_SHEET_NAME,
      row: 3,
      eventId: EVENT_ID,
    },
  ];

  for (const receipt of invalidReceipts) {
    assert.throws(
      () => validateSheetsReceipt(receipt, EVENT_ID),
      SheetsWebhookError,
    );
  }
});

test("fails closed when the webhook is not configured", async () => {
  await assert.rejects(
    sendToLeadSheet(undefined, { eventId: EVENT_ID }),
    (error: unknown) =>
      error instanceof SheetsWebhookError && error.code === "not_configured",
  );
});

test("rejects a non-2xx webhook response", async () => {
  const fetcher = async () => new Response("upstream error", { status: 500 });

  await assert.rejects(
    sendToLeadSheet(
      "https://example.test/webhook",
      { eventId: EVENT_ID },
      fetcher,
    ),
    (error: unknown) =>
      error instanceof SheetsWebhookError && error.code === "request_failed",
  );
});

test("classifies an unreadable webhook body as an upstream failure", async () => {
  const fetcher = async () =>
    ({
      ok: true,
      status: 200,
      text: async () => {
        throw new Error("body stream interrupted");
      },
    }) as unknown as Response;

  await assert.rejects(
    sendToLeadSheet(
      "https://example.test/webhook",
      { eventId: EVENT_ID },
      fetcher,
    ),
    (error: unknown) =>
      error instanceof SheetsWebhookError && error.code === "request_failed",
  );
});

test("returns the validated webhook receipt", async () => {
  const fetcher = async () =>
    Response.json({
      success: true,
      recorded: true,
      deduplicated: false,
      sheet: LEAD_SHEET_NAME,
      row: 14,
      eventId: EVENT_ID,
    });

  const receipt = await sendToLeadSheet(
    "https://example.test/webhook",
    { eventId: EVENT_ID, eventName: "direct_call_click" },
    fetcher,
  );

  assert.equal(receipt.row, 14);
  assert.equal(receipt.eventId, EVENT_ID);
});
