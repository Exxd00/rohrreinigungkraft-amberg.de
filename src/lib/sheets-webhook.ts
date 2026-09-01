export const LEAD_SHEET_NAME = "📞 Alle Anfragen";

const WEBHOOK_TIMEOUT_MS = 10_000;

export type SheetsWebhookErrorCode =
  | "not_configured"
  | "invalid_event_id"
  | "request_failed"
  | "invalid_response";

export interface SheetsReceipt {
  sheet: typeof LEAD_SHEET_NAME;
  row: number;
  eventId: string;
  recorded: boolean;
  deduplicated: boolean;
}

export class SheetsWebhookError extends Error {
  readonly code: SheetsWebhookErrorCode;

  constructor(code: SheetsWebhookErrorCode, message: string) {
    super(message);
    this.name = "SheetsWebhookError";
    this.code = code;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isValidEventId = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

export function validateSheetsReceipt(
  value: unknown,
  expectedEventId: string,
): SheetsReceipt {
  if (!isRecord(value)) {
    throw new SheetsWebhookError(
      "invalid_response",
      "Google Sheets returned a non-object response",
    );
  }

  if (value.success !== true) {
    throw new SheetsWebhookError(
      "invalid_response",
      "Google Sheets did not confirm success",
    );
  }

  if (value.sheet !== LEAD_SHEET_NAME) {
    throw new SheetsWebhookError(
      "invalid_response",
      `Google Sheets confirmed the wrong sheet: ${String(value.sheet || "missing")}`,
    );
  }

  if (
    typeof value.row !== "number" ||
    !Number.isSafeInteger(value.row) ||
    value.row < 3
  ) {
    throw new SheetsWebhookError(
      "invalid_response",
      "Google Sheets did not confirm a valid data row",
    );
  }

  if (value.eventId !== expectedEventId) {
    throw new SheetsWebhookError(
      "invalid_response",
      "Google Sheets confirmed a different eventId",
    );
  }

  if (
    typeof value.recorded !== "boolean" ||
    typeof value.deduplicated !== "boolean" ||
    value.recorded === value.deduplicated
  ) {
    throw new SheetsWebhookError(
      "invalid_response",
      "Google Sheets returned an invalid recorded/deduplicated state",
    );
  }

  return {
    sheet: LEAD_SHEET_NAME,
    row: value.row,
    eventId: expectedEventId,
    recorded: value.recorded,
    deduplicated: value.deduplicated,
  };
}

export async function sendToLeadSheet(
  webhookUrl: string | undefined,
  payload: Record<string, unknown> & { eventId: string },
  fetcher: typeof fetch = fetch,
): Promise<SheetsReceipt> {
  if (!webhookUrl) {
    throw new SheetsWebhookError(
      "not_configured",
      "GOOGLE_SHEETS_WEBHOOK_URL is not configured",
    );
  }

  if (!isValidEventId(payload.eventId)) {
    throw new SheetsWebhookError(
      "invalid_event_id",
      "A valid eventId is required before writing to Google Sheets",
    );
  }

  let response: Response;
  try {
    response = await fetcher(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
  } catch (error) {
    throw new SheetsWebhookError(
      "request_failed",
      `Google Sheets request failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  let responseText: string;
  try {
    responseText = await response.text();
  } catch (error) {
    throw new SheetsWebhookError(
      "request_failed",
      `Google Sheets response body could not be read: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
  if (!response.ok) {
    throw new SheetsWebhookError(
      "request_failed",
      `Google Sheets returned HTTP ${response.status}`,
    );
  }

  let responseBody: unknown;
  try {
    responseBody = JSON.parse(responseText);
  } catch {
    throw new SheetsWebhookError(
      "invalid_response",
      "Google Sheets returned invalid JSON",
    );
  }

  return validateSheetsReceipt(responseBody, payload.eventId);
}
