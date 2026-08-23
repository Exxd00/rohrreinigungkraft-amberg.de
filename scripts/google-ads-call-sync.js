/**
 * Google Ads -> dedicated Amberg lead sheet.
 *
 * Install this in the Google Ads account under Tools > Scripts, replace the
 * placeholder with the private spreadsheet URL, authorize it and schedule it
 * hourly. Never commit the real spreadsheet URL to GitHub.
 */
const SPREADSHEET_URL = "PASTE_DEDICATED_AMBERG_SHEET_URL_HERE";
const SHEET_NAME = "📞 Alle Anfragen";
const ACCOUNT_ID = "3817334700";
const CAMPAIGN_NAME = "AM | Search | Rohrreinigung | 24-7";
const TIME_ZONE = "Europe/Berlin";

function main() {
  const accountId = AdsApp.currentAccount().getCustomerId().replace(/-/g, "");
  if (accountId !== ACCOUNT_ID) {
    throw new Error("Safety stop: wrong Google Ads account " + accountId);
  }
  if (SPREADSHEET_URL.indexOf("PASTE_") === 0) {
    throw new Error("Set the dedicated Amberg spreadsheet URL first.");
  }

  const sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getSheetByName(
    SHEET_NAME,
  );
  if (!sheet) throw new Error("Sheet not found: " + SHEET_NAME);

  const processedIds = getProcessedCallIds(sheet);
  const oldestCallDate = new Date();
  oldestCallDate.setDate(oldestCallDate.getDate() - 30);
  const startDate = Utilities.formatDate(oldestCallDate, TIME_ZONE, "yyyy-MM-dd");
  const query = [
    "SELECT",
    "call_view.resource_name,",
    "call_view.start_call_date_time,",
    "call_view.call_duration_seconds,",
    "call_view.call_status,",
    "call_view.caller_area_code,",
    "call_view.caller_country_code,",
    "call_view.call_tracking_display_location,",
    "call_view.type,",
    "campaign.name,",
    "ad_group.name",
    "FROM call_view",
    "WHERE call_view.start_call_date_time >= '" + startDate + "'",
    "AND campaign.name = '" + CAMPAIGN_NAME + "'",
    "ORDER BY call_view.start_call_date_time ASC",
  ].join(" ");

  const rows = AdsApp.search(query);
  let appended = 0;
  for (const row of rows) {
    const call = row.callView;
    const callId = call.resourceName;
    if (!callId || processedIds.has(callId)) continue;

    const duration = Number(call.callDurationSeconds || 0);
    const status = translateStatus(call.callStatus);
    const callerArea = [call.callerCountryCode, call.callerAreaCode]
      .filter(Boolean)
      .join(" ");
    const timestamp = formatCallTime(call.startCallDateTime);

    sheet.appendRow([
      timestamp, // A Datum
      "🆕 Neu", // B Status
      "📞 Google Ads Anruf", // C Typ
      "Anruf über Anzeige", // D Name
      callerArea || "Nicht übermittelt", // E Telefon / verfügbare Vorwahl
      "", // F E-Mail
      callerArea ? "Vorwahl " + callerArea : "", // G Ort
      row.adGroup?.name || "Anruf über Anzeige", // H Dienstleistung
      "Sofort", // I Dringlichkeit
      "Call from Ads · " + duration + " Sek. · " + (call.type || "Anruf"), // J Nachricht
      "", // K Bilder
      duration, // L Anrufdauer
      status, // M Anrufstatus
      "Google Ads – Call from Ads", // N Quelle
      row.campaign?.name || "", // O Kampagne
      "", // P GCLID (not exposed in call_view)
      "", // Q Bewertung
      callId, // R hidden technical deduplication ID
    ]);

    processedIds.add(callId);
    appended += 1;
  }
  console.log("Amberg call sync finished. New rows: " + appended);
}

function formatCallTime(value) {
  const raw = String(value || "");
  const parsed = new Date(raw.replace(" ", "T"));
  if (isNaN(parsed.getTime())) return raw || "Zeit nicht übermittelt";
  return Utilities.formatDate(parsed, TIME_ZONE, "dd.MM.yyyy HH:mm:ss");
}

function getProcessedCallIds(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 3) return new Set();
  const values = sheet.getRange(3, 18, lastRow - 2, 1).getDisplayValues();
  return new Set(values.flat().filter(Boolean));
}

function translateStatus(status) {
  const labels = {
    RECEIVED: "Angenommen",
    MISSED: "Verpasst",
    UNKNOWN: "Unbekannt",
  };
  return labels[status] || status || "Unbekannt";
}
