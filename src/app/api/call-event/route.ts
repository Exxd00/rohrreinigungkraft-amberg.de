import {
  SheetsWebhookError,
  isValidEventId,
  sendToLeadSheet,
} from "@/lib/sheets-webhook";
import {
  ANALYTICS_CONSENT_COOKIE,
  isAnalyticsConsentCookieAccepted,
} from "@/lib/analytics-consent-policy";
import { getDirectCallSheetMessage } from "@/lib/direct-call-source";
import { type NextRequest, NextResponse } from "next/server";

type TelephoneEventType = "amberg_phone_click" | "direct_call_click";

interface TelephoneEventData {
  eventType: TelephoneEventType;
  eventId: string;
  analyticsConsent?: boolean;
  source?: string;
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  landingPage?: string | null;
  currentPage?: string | null;
  referrer?: string | null;
}

const clean = (value: unknown, maxLength = 240) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TelephoneEventData;

    if (
      body.eventType !== "direct_call_click" &&
      body.eventType !== "amberg_phone_click"
    ) {
      return NextResponse.json(
        {
          success: false,
          recorded: false,
          error: "unsupported_event",
        },
        { status: 400 },
      );
    }

    if (!isValidEventId(body.eventId)) {
      return NextResponse.json(
        {
          success: false,
          recorded: false,
          error: "invalid_event_id",
        },
        { status: 400 },
      );
    }

    const analyticsConsentAccepted = isAnalyticsConsentCookieAccepted(
      request.cookies.get(ANALYTICS_CONSENT_COOKIE)?.value,
    );
    if (body.analyticsConsent !== true || !analyticsConsentAccepted) {
      return NextResponse.json(
        {
          success: false,
          recorded: false,
          error: "analytics_consent_required",
        },
        { status: 403 },
      );
    }

    const source = clean(body.source, 120) || "floating_call_modal";
    const trafficSource = clean(body.utmSource, 80) || "Website";
    const trafficMedium = clean(body.utmMedium, 80);
    const attribution = trafficMedium
      ? `${trafficSource} / ${trafficMedium}`
      : trafficSource;

    const isDirectCall = body.eventType === "direct_call_click";
    const payload = {
      timestamp: new Date().toISOString(),
      name: "📞 Website-Telefonklick",
      phone: "Direkter Anruf",
      email: "",
      city: "Amberg",
      service: "Telefonischer Kontakt",
      message: isDirectCall
        ? getDirectCallSheetMessage(source)
        : `Klick auf einen Telefonlink (${source}).`,
      images: 0,
      source: attribution,
      referrer: clean(body.referrer, 500) || "direct",
      gclid: clean(body.gclid, 200) || null,
      gbraid: clean(body.gbraid, 200) || null,
      wbraid: clean(body.wbraid, 200) || null,
      medium: trafficMedium || null,
      campaign: clean(body.utmCampaign, 160) || null,
      landingPage: clean(body.landingPage, 500) || null,
      currentPage: clean(body.currentPage, 500) || null,
      eventId: body.eventId,
      eventName: body.eventType,
      eventType: "call",
      callStatus: isDirectCall
        ? "direct_click_not_confirmed"
        : "phone_click_not_confirmed",
      sourceSite: "rohrreinigungkraft-amberg.de",
    };

    const receipt = await sendToLeadSheet(
      process.env.GOOGLE_SHEETS_WEBHOOK_URL,
      payload,
    );

    return NextResponse.json({
      success: true,
      ...receipt,
    });
  } catch (error) {
    console.error("[Direct call event] Error:", error);

    if (error instanceof SheetsWebhookError) {
      return NextResponse.json(
        {
          success: false,
          recorded: false,
          error: error.code,
        },
        { status: error.code === "not_configured" ? 503 : 502 },
      );
    }

    return NextResponse.json(
      { success: false, recorded: false, error: "invalid_request" },
      { status: 400 },
    );
  }
}
