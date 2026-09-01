// =====================================================
// ROHRREINIGUNG KRAFT - GOOGLE SHEETS COMPLETE HANDLER
// Version 4.0 - With Google Ads Call Sync
// =====================================================
// Farben: #3AB0FF (Primär/Blau) | #1E3A8A (Dunkel) | #F8FBFF (Hell)
// Website: rohrreinigung-kraft.de | Nürnberg & Umgebung
// =====================================================
//
// هذا السكريبت يجمع 3 أنواع من الأحداث:
// 1. 📝 Formular - نماذج من الموقع
// 2. 📞 Anruf (Website) - مكالمات من الموقع
// 3. 📱 Anruf (Google Ads) - مكالمات مباشرة من الإعلان
//
// =====================================================

// ==================== الإعدادات ====================

var GOOGLE_ADS_SYNC_ENABLED = true;

// =====================================================
// دالة استقبال البيانات من الموقع
// =====================================================

// RRK Amberg lead receiver — version 5.0
// Bound to spreadsheet 1VV6Y0tNHFcaDisJlb6hTcw8tNqBxV6Ks3qw_Ffykfh4.

var RRK_LEADS_SHEET_NAME = "📞 Alle Anfragen";
var RRK_SOURCE_SITE = "rohrreinigungkraft-amberg.de";
var RRK_EVENT_ID_COLUMN = 18;
var RRK_EVENT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var RRK_EXPECTED_HEADERS = [
  "Datum",
  "Status",
  "Typ",
  "Name",
  "Telefon",
  "E-Mail",
  "Ort",
  "Dienstleistung",
  "Dringlichkeit",
  "Nachricht",
  "Bilder",
  "Anrufdauer",
  "Anrufstatus",
  "Quelle",
  "Kampagne",
  "GCLID",
  "Bewertung",
  "Call ID"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;

  try {
    locked = lock.tryLock(4000);
    if (!locked) throw new Error("receiver_busy");

    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("missing_payload");
    }

    var data = JSON.parse(e.postData.contents);
    rrk_validateIncomingEvent(data);

    var sheet = rrk_getLeadsSheet();
    rrk_assertLeadHeaders(sheet);

    var duplicateRow = rrk_findEventRow(sheet, data.eventId);
    if (duplicateRow) {
      return rrk_jsonResponse({
        success: true,
        recorded: false,
        deduplicated: true,
        sheet: RRK_LEADS_SHEET_NAME,
        row: duplicateRow,
        eventId: data.eventId
      });
    }

    var rowValues = rrk_buildLeadRow(data);
    sheet.appendRow(rowValues);
    SpreadsheetApp.flush();

    // Resolve the row by its UUID rather than getLastRow(), because a separate
    // manual Google Ads sync can append concurrently without this script lock.
    var row = rrk_findEventRow(sheet, data.eventId);
    if (row < 3) {
      throw new Error("event_id_write_verification_failed");
    }

    // The durable write and eventId verification are the receipt boundary.
    // Presentation helpers are best-effort and must not turn a recorded lead
    // into a false failure that prompts a duplicate retry.
    try {
      rrk_addStatusDropdown(sheet, row);
      rrk_addRatingDropdown(sheet, row);
      rrk_formatLeadRow(sheet, row, data);
      SpreadsheetApp.flush();
    } catch (formatError) {
      console.error("lead_row_formatting_failed", formatError);
    }

    return rrk_jsonResponse({
      success: true,
      recorded: true,
      deduplicated: false,
      sheet: RRK_LEADS_SHEET_NAME,
      row: row,
      eventId: data.eventId
    });
  } catch (error) {
    return rrk_jsonResponse({
      success: false,
      recorded: false,
      deduplicated: false,
      sheet: RRK_LEADS_SHEET_NAME,
      error: rrk_safeErrorCode(error)
    });
  } finally {
    if (locked) lock.releaseLock();
  }
}

function rrk_validateIncomingEvent(data) {
  if (!data || typeof data !== "object") throw new Error("invalid_payload");
  if (data.sourceSite !== RRK_SOURCE_SITE) throw new Error("invalid_source_site");
  if (!RRK_EVENT_ID_PATTERN.test(String(data.eventId || ""))) {
    throw new Error("invalid_event_id");
  }

  var allowed = {
    direct_call_click: "call",
    amberg_phone_click: "call",
    kraft_callback: "callback",
    kraft_thank_you: "form"
  };
  var expectedType = allowed[data.eventName];
  if (!expectedType || data.eventType !== expectedType) {
    throw new Error("unsupported_event");
  }
}

function rrk_getLeadsSheet() {
  var sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(RRK_LEADS_SHEET_NAME);
  if (!sheet) throw new Error("lead_sheet_not_found");
  return sheet;
}

function rrk_assertLeadHeaders(sheet) {
  if (sheet.getLastRow() < 2) throw new Error("lead_sheet_schema_mismatch");
  var headers = sheet
    .getRange(1, 1, 1, RRK_EXPECTED_HEADERS.length)
    .getDisplayValues()[0];
  for (var i = 0; i < RRK_EXPECTED_HEADERS.length; i++) {
    if (headers[i] !== RRK_EXPECTED_HEADERS[i]) {
      throw new Error("lead_sheet_schema_mismatch");
    }
  }
}

function rrk_findEventRow(sheet, eventId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return 0;

  var match = sheet
    .getRange(3, RRK_EVENT_ID_COLUMN, lastRow - 2, 1)
    .createTextFinder(eventId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function rrk_buildLeadRow(data) {
  return [
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd.MM.yyyy HH:mm:ss"),
    "🆕 Neu",
    rrk_displayEventType(data),
    rrk_clean(data.name, 160),
    rrk_clean(data.phone, 80),
    rrk_clean(data.email, 200),
    rrk_clean(data.city, 120),
    rrk_getServiceIcon(data.service),
    rrk_getUrgencyLevel(data.service),
    rrk_clean(data.message, 2000),
    Number(data.images) || 0,
    rrk_clean(data.callDuration, 80),
    rrk_clean(data.callStatus, 120),
    rrk_getSourceInfo(data),
    rrk_clean(data.campaign, 200),
    rrk_clean(data.gclid, 240),
    "",
    data.eventId
  ];
}

function rrk_displayEventType(data) {
  if (data.eventName === "direct_call_click") return "📞 Direktklick (Website)";
  if (data.eventType === "call") return "📞 Anruf (Website)";
  if (data.eventType === "callback") return "📞 Rückruf (Website)";
  return "📝 Formular";
}

function rrk_clean(value, maxLength) {
  if (typeof value !== "string") return "";
  var text = value.trim().slice(0, maxLength || 240);

  // Keep untrusted form and attribution values as text. Without this guard,
  // appendRow can interpret leading spreadsheet operators as formulas.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function rrk_getServiceIcon(service) {
  var serviceMap = {
    "Rohrreinigung": "🔧 Rohrreinigung",
    "Kanalreinigung": "🚰 Kanalreinigung",
    "Abflussreinigung": "🚿 Abflussreinigung",
    "Notdienst 24/7": "🚨 NOTDIENST 24/7",
    "Kamera-Inspektion": "📹 Kamera-Inspektion",
    "Rohrsanierung": "🛠️ Rohrsanierung",
    "Toilette verstopft": "🚽 Toilette verstopft",
    "Waschbecken verstopft": "🪥 Waschbecken verstopft",
    "Dusche verstopft": "🚿 Dusche verstopft",
    "Telefonischer Kontakt": "📞 Telefonischer Kontakt",
    "Rückrufwunsch": "📞 Rückrufwunsch",
    "Sonstiges": "📝 Sonstiges"
  };
  return serviceMap[service] || "❓ " + rrk_clean(service || "Nicht angegeben", 160);
}

function rrk_getUrgencyLevel(service) {
  var urgent = ["Notdienst 24/7", "Toilette verstopft", "Telefonischer Kontakt"];
  var high = [
    "Rohrreinigung",
    "Abflussreinigung",
    "Dusche verstopft",
    "Waschbecken verstopft",
    "Rückrufwunsch"
  ];
  if (urgent.indexOf(service) !== -1) return "🔴 NOTFALL";
  if (high.indexOf(service) !== -1) return "🟡 Hoch";
  return "🟢 Normal";
}

function rrk_getSourceInfo(data) {
  if (rrk_clean(data.gclid, 240)) return "🔵 Google Ads";
  if (rrk_clean(data.source, 240)) return rrk_clean(data.source, 240);
  var referrer = rrk_clean(data.referrer, 500);
  if (referrer.indexOf("google") !== -1) return "🟢 Google (Organic)";
  if (referrer && referrer !== "direct") return "🔗 Referral";
  return "🌐 Website (Direct)";
}

function rrk_addStatusDropdown(sheet, row) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      "🆕 Neu",
      "📞 Angerufen",
      "📞 Rückruf nötig",
      "🚗 Unterwegs",
      "🔧 Vor Ort",
      "✅ Erledigt",
      "💰 Bezahlt",
      "📅 Termin vereinbart",
      "⏳ Wartet auf Rückmeldung",
      "❌ Storniert",
      "🚫 Nicht erreicht"
    ], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(row, 2).setDataValidation(rule);
}

function rrk_addRatingDropdown(sheet, row) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      "⭐⭐⭐ Ausgezeichnet",
      "⭐⭐ Sehr Gut",
      "⭐ Gut",
      "➖ Neutral",
      "👎 Nicht zufrieden",
      "❌ Nicht erreicht",
      "🚫 Abgelehnt",
      "📵 Falsche Nummer"
    ], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange(row, 17).setDataValidation(rule);
}

function rrk_formatLeadRow(sheet, row, data) {
  var rowRange = sheet.getRange(row, 1, 1, RRK_EXPECTED_HEADERS.length);
  rowRange.setVerticalAlignment("middle");
  rowRange.setBackground(data.eventType === "form" ? "#E8F4FD" : "#FEF3C7");

  var typeCell = sheet.getRange(row, 3);
  typeCell.setFontWeight("bold");
  typeCell.setFontColor(data.eventType === "form" ? "#1D4ED8" : "#D97706");

  var sourceCell = sheet.getRange(row, 14);
  if (data.gclid || String(sourceCell.getValue()).indexOf("Google Ads") !== -1) {
    sourceCell.setBackground("#DBEAFE");
    sourceCell.setFontColor("#1D4ED8");
    sourceCell.setFontWeight("bold");
  }
}

function rrk_jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function rrk_safeErrorCode(error) {
  var message = error && error.message ? error.message : String(error || "unknown_error");
  var allowed = {
    receiver_busy: true,
    missing_payload: true,
    invalid_payload: true,
    invalid_source_site: true,
    invalid_event_id: true,
    unsupported_event: true,
    lead_sheet_not_found: true,
    lead_sheet_schema_mismatch: true,
    event_id_write_verification_failed: true
  };
  return allowed[message] ? message : "receiver_error";
}

function syncGoogleAdsCalls(callsData) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(4000)) throw new Error("receiver_busy");

  try {
    var sheet = rrk_getLeadsSheet();
    ensureHeaders(sheet);

    var existingCalls = getExistingCallIds(sheet);
    var newCallsCount = 0;

    for (var i = 0; i < callsData.length; i++) {
      var call = callsData[i];
      var callId = call.startTime + "_" + call.duration;

      if (!existingCalls[callId]) {
        var row = [
          formatGoogleAdsDateTime(call.startTime),
          "🆕 Neu",
          "📱 Anruf (Google Ads)",
          "",
          formatPhoneFromAds(call.callerCountryCode, call.callerAreaCode),
          "",
          "",
          "📞 Telefonischer Kontakt",
          "🟡 Hoch",
          "Direkter Anruf aus Google Ads Anzeige",
          0,
          formatDuration(call.duration),
          translateCallStatus(call.status),
          "🔵 Google Ads (Call)",
          call.campaign || "",
          call.gclid || "",
          "",
          callId
        ];

        sheet.appendRow(row);
        SpreadsheetApp.flush();
        var callRow = rrk_findEventRow(sheet, callId);
        if (callRow < 3) throw new Error("event_id_write_verification_failed");

        addStatusDropdown(sheet, callRow);
        addRatingDropdown(sheet, callRow);
        highlightGoogleAdsCall(sheet, callRow);
        formatGoogleAdsCallCells(sheet, callRow, call);

        existingCalls[callId] = true;
        newCallsCount++;
      }
    }

    return newCallsCount;
  } finally {
    lock.releaseLock();
  }
}

function importCallsFromCSV() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    '📱 Import Google Ads Calls',
    'Paste the call data (one call per line, format: DateTime,Duration,AreaCode,Status,Campaign):',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() == ui.Button.OK) {
    var lines = response.getResponseText().split('\n');
    var calls = [];

    for (var i = 0; i < lines.length; i++) {
      var parts = lines[i].split(',');
      if (parts.length >= 4) {
        calls.push({
          startTime: parts[0].trim(),
          duration: parseInt(parts[1].trim()) || 0,
          callerAreaCode: parts[2].trim(),
          status: parts[3].trim(),
          campaign: parts[4] ? parts[4].trim() : '',
          callerCountryCode: '49'
        });
      }
    }

    var count = syncGoogleAdsCalls(calls);
    ui.alert('✅ Fertig!', count + ' neue Anrufe wurden importiert.', ui.ButtonSet.OK);
  }
}

function getExistingCallIds(sheet) {
  var ids = {};
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return ids;

  var values = sheet
    .getRange(3, RRK_EVENT_ID_COLUMN, lastRow - 2, 1)
    .getDisplayValues();
  for (var i = 0; i < values.length; i++) {
    var callId = String(values[i][0] || "");
    if (callId) ids[callId] = true;
  }

  return ids;
}

// =====================================================
// إنشاء الهيكل والعناوين
// =====================================================

function ensureHeaders(sheet) {
  rrk_assertLeadHeaders(sheet);
}

function createHeaders(sheet) {
  var headers = [
    ["Datum",           "📅 Eingangsdatum"],
    ["Status",          "📊 Bearbeitungsstatus"],
    ["Typ",             "📱 Kontaktart"],
    ["Name",            "👤 Kundenname"],
    ["Telefon",         "📱 Telefonnummer"],
    ["E-Mail",          "✉️ E-Mail-Adresse"],
    ["Ort",             "📍 Stadt/Ort"],
    ["Dienstleistung",  "🔧 Gewünschte Leistung"],
    ["Dringlichkeit",   "⚡ Priorität"],
    ["Nachricht",       "💬 Problembeschreibung"],
    ["Bilder",          "📷 Anzahl Fotos"],
    ["Anrufdauer",      "⏱️ Dauer (Sekunden)"],
    ["Anrufstatus",     "📶 Verbindungsstatus"],
    ["Quelle",          "🌐 Herkunft"],
    ["Kampagne",        "📢 Google Ads Kampagne"],
    ["GCLID",           "📊 Google Click ID"],
    ["Bewertung",       "⭐ Kundenbewertung"],
    ["Call ID",         "🔒 Event-/Call-ID (technisch)"]
  ];

  var headerRow1 = headers.map(function(h) { return h[0]; });
  sheet.getRange(1, 1, 1, headers.length).setValues([headerRow1]);

  var headerRow2 = headers.map(function(h) { return h[1]; });
  sheet.getRange(2, 1, 1, headers.length).setValues([headerRow2]);

  var range1 = sheet.getRange(1, 1, 1, headers.length);
  range1.setBackground("#3AB0FF");
  range1.setFontColor("#FFFFFF");
  range1.setFontWeight("bold");
  range1.setFontSize(11);
  range1.setHorizontalAlignment("center");
  range1.setVerticalAlignment("middle");

  var range2 = sheet.getRange(2, 1, 1, headers.length);
  range2.setBackground("#1E3A8A");
  range2.setFontColor("#FFFFFF");
  range2.setFontSize(9);
  range2.setHorizontalAlignment("center");
  range2.setVerticalAlignment("middle");

  sheet.setFrozenRows(2);

  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 140);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 160);
  sheet.setColumnWidth(5, 150);
  sheet.setColumnWidth(6, 200);
  sheet.setColumnWidth(7, 120);
  sheet.setColumnWidth(8, 180);
  sheet.setColumnWidth(9, 120);
  sheet.setColumnWidth(10, 300);
  sheet.setColumnWidth(11, 80);
  sheet.setColumnWidth(12, 120);
  sheet.setColumnWidth(13, 130);
  sheet.setColumnWidth(14, 160);
  sheet.setColumnWidth(15, 200);
  sheet.setColumnWidth(16, 180);
  sheet.setColumnWidth(17, 150);
  sheet.setColumnWidth(18, 260);

  sheet.setRowHeight(1, 35);
  sheet.setRowHeight(2, 30);
}

// =====================================================
// القوائم المنسدلة
// =====================================================

function addStatusDropdown(sheet, row) {
  var statusCell = sheet.getRange(row, 2);

  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      "🆕 Neu",
      "📞 Angerufen",
      "📞 Rückruf nötig",
      "🚗 Unterwegs",
      "🔧 Vor Ort",
      "✅ Erledigt",
      "💰 Bezahlt",
      "📅 Termin vereinbart",
      "⏳ Wartet auf Rückmeldung",
      "❌ Storniert",
      "🚫 Nicht erreicht"
    ], true)
    .setAllowInvalid(false)
    .build();

  statusCell.setDataValidation(rule);
}

function addRatingDropdown(sheet, row) {
  var ratingCell = sheet.getRange(row, 17);

  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      "⭐⭐⭐ Ausgezeichnet",
      "⭐⭐ Sehr Gut",
      "⭐ Gut",
      "➖ Neutral",
      "👎 Nicht zufrieden",
      "❌ Nicht erreicht",
      "🚫 Abgelehnt",
      "📵 Falsche Nummer"
    ], true)
    .setAllowInvalid(true)
    .build();

  ratingCell.setDataValidation(rule);
}

// =====================================================
// التنسيق
// =====================================================

function highlightNewRow(sheet, row, eventType) {
  var range = sheet.getRange(row, 1, 1, sheet.getLastColumn());

  if (eventType === "call") {
    range.setBackground("#FEF3C7");
  } else {
    range.setBackground("#E8F4FD");
  }

  range.setVerticalAlignment("middle");
}

function highlightGoogleAdsCall(sheet, row) {
  var range = sheet.getRange(row, 1, 1, sheet.getLastColumn());
  range.setBackground("#EDE9FE");
  range.setVerticalAlignment("middle");
}

function formatCells(sheet, row, data) {
  formatEventTypeCell(sheet, row, data.eventType);
  formatUrgencyCell(sheet, row);
  formatSourceCell(sheet, row, data);
}

function formatGoogleAdsCallCells(sheet, row, call) {
  var typeCell = sheet.getRange(row, 3);
  typeCell.setBackground("#EDE9FE");
  typeCell.setFontColor("#7C3AED");
  typeCell.setFontWeight("bold");

  var sourceCell = sheet.getRange(row, 14);
  sourceCell.setBackground("#DBEAFE");
  sourceCell.setFontColor("#1D4ED8");
  sourceCell.setFontWeight("bold");

  var statusCell = sheet.getRange(row, 13);
  if (call.status === "RECEIVED" || call.status === "Received") {
    statusCell.setBackground("#D1FAE5");
    statusCell.setFontColor("#059669");
  } else {
    statusCell.setBackground("#FEE2E2");
    statusCell.setFontColor("#DC2626");
  }

  var durationCell = sheet.getRange(row, 12);
  var duration = parseInt(call.duration) || 0;
  if (duration >= 60) {
    durationCell.setBackground("#D1FAE5");
    durationCell.setFontWeight("bold");
  } else if (duration >= 30) {
    durationCell.setBackground("#FEF3C7");
  } else if (duration > 0) {
    durationCell.setBackground("#FEE2E2");
  }
}

function formatEventTypeCell(sheet, row, eventType) {
  var typeCell = sheet.getRange(row, 3);

  if (eventType === "call") {
    typeCell.setBackground("#FEF3C7");
    typeCell.setFontColor("#D97706");
    typeCell.setFontWeight("bold");
  } else {
    typeCell.setBackground("#DBEAFE");
    typeCell.setFontColor("#1D4ED8");
    typeCell.setFontWeight("bold");
  }
}

function formatUrgencyCell(sheet, row) {
  var urgencyCell = sheet.getRange(row, 9);
  var urgency = urgencyCell.getValue();

  if (urgency.includes("NOTFALL")) {
    urgencyCell.setBackground("#FEE2E2");
    urgencyCell.setFontColor("#DC2626");
    urgencyCell.setFontWeight("bold");
  } else if (urgency.includes("Hoch")) {
    urgencyCell.setBackground("#FEF3C7");
    urgencyCell.setFontColor("#D97706");
    urgencyCell.setFontWeight("bold");
  } else {
    urgencyCell.setBackground("#D1FAE5");
    urgencyCell.setFontColor("#059669");
  }
}

function formatSourceCell(sheet, row, data) {
  var sourceCell = sheet.getRange(row, 14);
  var source = sourceCell.getValue();

  if (data.gclid || source.includes("Google Ads")) {
    sourceCell.setBackground("#DBEAFE");
    sourceCell.setFontColor("#1D4ED8");
    sourceCell.setFontWeight("bold");
  } else if (source.includes("Organic")) {
    sourceCell.setBackground("#D1FAE5");
    sourceCell.setFontColor("#059669");
  }
}

// =====================================================
// تغييرات تفاعلية عند التعديل
// =====================================================

function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== RRK_LEADS_SHEET_NAME) return;
  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();

  if (row <= 2) return;

  if (col === 2) {
    handleStatusChange(sheet, row, range.getValue());
  }

  if (col === 17) {
    handleRatingChange(sheet, row, range.getValue());
  }
}

function handleStatusChange(sheet, row, status) {
  var rowRange = sheet.getRange(row, 1, 1, sheet.getLastColumn());

  var statusColors = {
    "🆕 Neu":                    "#E8F4FD",
    "📞 Angerufen":              "#DBEAFE",
    "📞 Rückruf nötig":          "#FEF3C7",
    "🚗 Unterwegs":              "#FDE68A",
    "🔧 Vor Ort":                "#FCD34D",
    "✅ Erledigt":               "#D1FAE5",
    "💰 Bezahlt":                "#A7F3D0",
    "📅 Termin vereinbart":      "#E0E7FF",
    "⏳ Wartet auf Rückmeldung": "#F3F4F6",
    "❌ Storniert":              "#FEE2E2",
    "🚫 Nicht erreicht":         "#FECACA"
  };

  rowRange.setBackground(statusColors[status] || "#FFFFFF");
}

function handleRatingChange(sheet, row, rating) {
  var ratingCell = sheet.getRange(row, 17);

  if (rating.includes("Ausgezeichnet")) {
    ratingCell.setBackground("#D1FAE5");
    ratingCell.setFontColor("#059669");
    ratingCell.setFontWeight("bold");
  } else if (rating.includes("Sehr Gut")) {
    ratingCell.setBackground("#DBEAFE");
    ratingCell.setFontColor("#1D4ED8");
  } else if (rating.includes("Gut")) {
    ratingCell.setBackground("#FEF3C7");
    ratingCell.setFontColor("#D97706");
  } else if (rating.includes("Neutral")) {
    ratingCell.setBackground("#F3F4F6");
    ratingCell.setFontColor("#6B7280");
  } else if (rating.includes("Abgelehnt") || rating.includes("Nicht") || rating.includes("Falsche")) {
    ratingCell.setBackground("#FEE2E2");
    ratingCell.setFontColor("#DC2626");
  }
}

// =====================================================
// الدوال المساعدة
// =====================================================

function getServiceIcon(service) {
  var serviceMap = {
    "Rohrreinigung":        "🔧 Rohrreinigung",
    "Kanalreinigung":       "🚰 Kanalreinigung",
    "Abflussreinigung":     "🚿 Abflussreinigung",
    "Notdienst 24/7":       "🚨 NOTDIENST 24/7",
    "Kamera-Inspektion":    "📹 Kamera-Inspektion",
    "Rohrsanierung":        "🛠️ Rohrsanierung",
    "Toilette verstopft":   "🚽 Toilette verstopft",
    "Waschbecken verstopft":"🪥 Waschbecken verstopft",
    "Dusche verstopft":     "🚿 Dusche verstopft",
    "Telefonischer Kontakt":"📞 Telefonischer Kontakt",
    "Sonstiges":            "📝 Sonstiges"
  };
  return serviceMap[service] || "❓ " + (service || "Nicht angegeben");
}

function getUrgencyLevel(service) {
  var urgentServices = ["Notdienst 24/7", "Toilette verstopft", "Telefonischer Kontakt"];
  var highPriorityServices = ["Rohrreinigung", "Abflussreinigung", "Dusche verstopft", "Waschbecken verstopft"];

  if (urgentServices.includes(service)) {
    return "🔴 NOTFALL";
  } else if (highPriorityServices.includes(service)) {
    return "🟡 Hoch";
  } else {
    return "🟢 Normal";
  }
}

function getSourceInfo(data) {
  if (data.source) return data.source;
  if (data.gclid) return "🔵 Google Ads";
  if (data.referrer && data.referrer.includes("google")) return "🟢 Google (Organic)";
  if (data.referrer && data.referrer !== "direct") return "🔗 Referral";
  return "🌐 Website (Direct)";
}

function formatGoogleAdsDateTime(dateTimeStr) {
  if (!dateTimeStr) return "";

  try {
    var date = new Date(dateTimeStr);
    return Utilities.formatDate(date, Session.getScriptTimeZone(), "dd.MM.yyyy HH:mm:ss");
  } catch (e) {
    return dateTimeStr;
  }
}

function formatPhoneFromAds(countryCode, areaCode) {
  if (!countryCode && !areaCode) return "";
  return "+49 " + (areaCode || "???") + " ****";
}

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return "0 Sek";

  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;

  if (mins > 0) {
    return mins + " Min " + secs + " Sek";
  }
  return secs + " Sek";
}

function translateCallStatus(status) {
  var statusMap = {
    "RECEIVED": "✅ Angenommen",
    "Received": "✅ Angenommen",
    "MISSED": "❌ Verpasst",
    "Missed": "❌ Verpasst",
    "UNKNOWN": "❓ Unbekannt"
  };
  return statusMap[status] || status;
}

// =====================================================
// API Endpoint
// =====================================================

function doGet() {
  return rrk_jsonResponse({
    success: true,
    service: "rrk-amberg-lead-receiver",
    version: "5.0",
    sheet: RRK_LEADS_SHEET_NAME
  });
}

// =====================================================
// إعداد الـ Sheet
// =====================================================

function setupSheet() {
  var sheet = rrk_getLeadsSheet();
  if (sheet.getLastRow() === 0) {
    createHeaders(sheet);
  } else {
    rrk_assertLeadHeaders(sheet);
  }
  addConditionalFormatting(sheet);

  SpreadsheetApp.getUi().alert('✅ Schema geprüft!', 'Die Tabelle ist vollständig und wurde nicht geleert.', SpreadsheetApp.getUi().ButtonSet.OK);
}

function addConditionalFormatting(sheet) {
  var rules = [];

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("NOTFALL")
    .setBackground("#FEE2E2")
    .setFontColor("#DC2626")
    .setBold(true)
    .setRanges([sheet.getRange("I:I")])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("NOTDIENST")
    .setBackground("#FEE2E2")
    .setFontColor("#DC2626")
    .setBold(true)
    .setRanges([sheet.getRange("H:H")])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("Google Ads")
    .setBackground("#DBEAFE")
    .setFontColor("#1D4ED8")
    .setBold(true)
    .setRanges([sheet.getRange("N:N")])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("📱 Anruf (Google Ads)")
    .setBackground("#EDE9FE")
    .setFontColor("#7C3AED")
    .setBold(true)
    .setRanges([sheet.getRange("C:C")])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("📞 Anruf (Website)")
    .setBackground("#FEF3C7")
    .setFontColor("#D97706")
    .setBold(true)
    .setRanges([sheet.getRange("C:C")])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("📞 Direktklick (Website)")
    .setBackground("#FEF3C7")
    .setFontColor("#D97706")
    .setBold(true)
    .setRanges([sheet.getRange("C:C")])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("📝 Formular")
    .setBackground("#DBEAFE")
    .setFontColor("#1D4ED8")
    .setBold(true)
    .setRanges([sheet.getRange("C:C")])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("✅ Angenommen")
    .setBackground("#D1FAE5")
    .setFontColor("#059669")
    .setRanges([sheet.getRange("M:M")])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("❌ Verpasst")
    .setBackground("#FEE2E2")
    .setFontColor("#DC2626")
    .setRanges([sheet.getRange("M:M")])
    .build());

  sheet.setConditionalFormatRules(rules);
}

// =====================================================
// تصدير البيانات
// =====================================================

function exportForGoogleAds() {
  var sheet = rrk_getLeadsSheet();
  var data = sheet.getDataRange().getValues();
  var exportData = [["Google Click ID", "Conversion Name", "Conversion Time", "Conversion Value", "Conversion Currency"]];

  for (var i = 2; i < data.length; i++) {
    var gclid = data[i][15];
    var eventType = data[i][2];
    var status = data[i][1];
    var isDirectEngagement = String(eventType || "").includes("Direktklick");

    if (gclid && gclid !== "" && status.includes("Erledigt") && !isDirectEngagement) {
      var timestamp = data[i][0];
      var conversionName = "Lead";
      var conversionValue = 50;

      if (eventType.includes("Google Ads")) {
        conversionName = "Phone Call (Google Ads)";
        conversionValue = 30;
      } else if (eventType.includes("Anruf")) {
        conversionName = "Phone Call (Website)";
        conversionValue = 25;
      } else {
        conversionName = "Lead Form";
        conversionValue = 50;
      }

      exportData.push([
        gclid,
        conversionName,
        Utilities.formatDate(new Date(timestamp), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
        conversionValue,
        "EUR"
      ]);
    }
  }

  var exportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Google Ads Export");
  if (!exportSheet) {
    exportSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Google Ads Export");
  } else {
    exportSheet.clear();
  }

  exportSheet.getRange(1, 1, exportData.length, 5).setValues(exportData);
  exportSheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#4285f4").setFontColor("white");

  SpreadsheetApp.getUi().alert('✅ Export abgeschlossen!', (exportData.length - 1) + ' Conversions wurden exportiert.', SpreadsheetApp.getUi().ButtonSet.OK);

  return exportData.length - 1;
}

// =====================================================
// إحصائيات
// =====================================================

function showStats() {
  var stats = getLeadStats();
  var ui = SpreadsheetApp.getUi();

  var message = "📊 STATISTIKEN\n\n";
  message += "━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  message += "📈 Gesamt: " + stats.total + " Anfragen\n\n";
  message += "📝 Formulare: " + stats.forms + "\n";
  message += "📞 Anrufe (Website): " + stats.websiteCalls + "\n";
  message += "📱 Anrufe (Google Ads): " + stats.googleAdsCalls + "\n\n";
  message += "━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  message += "🔵 Von Google Ads: " + stats.googleAds + "\n";
  message += "🟢 Organic: " + stats.organic + "\n";
  message += "🌐 Direkt: " + stats.direct + "\n\n";
  message += "━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  message += "✅ Erledigt: " + stats.completed + "\n";
  message += "🆕 Neu: " + stats.new + "\n";
  message += "⏳ In Bearbeitung: " + stats.inProgress + "\n";

  ui.alert('📊 Statistiken', message, ui.ButtonSet.OK);
}

function getLeadStats() {
  var sheet = rrk_getLeadsSheet();
  var data = sheet.getDataRange().getValues();

  var stats = {
    total: 0,
    forms: 0,
    websiteCalls: 0,
    googleAdsCalls: 0,
    googleAds: 0,
    organic: 0,
    direct: 0,
    completed: 0,
    new: 0,
    inProgress: 0
  };

  for (var i = 2; i < data.length; i++) {
    stats.total++;

    var eventType = data[i][2] || "";
    var source = data[i][13] || "";
    var status = data[i][1] || "";

    if (eventType.includes("Google Ads")) {
      stats.googleAdsCalls++;
    } else if (eventType.includes("Anruf") || eventType.includes("Direktklick")) {
      stats.websiteCalls++;
    } else {
      stats.forms++;
    }

    if (source.includes("Google Ads")) {
      stats.googleAds++;
    } else if (source.includes("Organic")) {
      stats.organic++;
    } else {
      stats.direct++;
    }

    if (status.includes("Erledigt") || status.includes("Bezahlt")) {
      stats.completed++;
    } else if (status.includes("Neu")) {
      stats.new++;
    } else {
      stats.inProgress++;
    }
  }

  return stats;
}

// =====================================================
// القائمة المخصصة
// =====================================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🔧 Rohrreinigung Kraft')
    .addItem('📊 Statistiken anzeigen', 'showStats')
    .addItem('📱 Google Ads Anrufe importieren', 'importCallsFromCSV')
    .addSeparator()
    .addItem('📤 Für Google Ads exportieren', 'exportForGoogleAds')
    .addSeparator()
    .addItem('🔍 Header prüfen', 'setupSheet')
    .addToUi();
}

// =====================================================
// دالة اختبار
// =====================================================

function testAddCall() {
  var testCalls = [
    {
      startTime: new Date().toISOString(),
      duration: 180,
      callerAreaCode: "0176",
      callerCountryCode: "49",
      status: "RECEIVED",
      campaign: "Rohrreinigung Kraft | Nuernberg | Final Attack v5",
      gclid: "test_gclid_12345"
    }
  ];

  var count = syncGoogleAdsCalls(testCalls);
  Logger.log("Added " + count + " test calls");
}
