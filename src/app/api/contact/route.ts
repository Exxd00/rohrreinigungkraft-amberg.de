import {
  type SheetsReceipt,
  SheetsWebhookError,
  isValidEventId,
  sendToLeadSheet,
} from "@/lib/sheets-webhook";
import {
  ANALYTICS_CONSENT_COOKIE,
  isAnalyticsConsentCookieAccepted,
  stripAnalyticsAttribution,
} from "@/lib/analytics-consent-policy";
import { type NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "info@rohrreinigung-kraft.de";
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || FROM_EMAIL;
const RESEND_FROM_EMAIL = `Rohrreinigung Kraft <${FROM_EMAIL}>`;

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  message: string;
  images?: string[]; // base64 images
  // Tracking data
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  eventId: string;
  website?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  landingPage?: string;
  currentPage?: string;
  referrer?: string;
  requestType?: "contact" | "callback";
}

interface ImageUploadResult {
  uploadedUrls: string[];
  failedCount: number;
  totalProvided: number;
  errors: string[];
}

async function uploadImageToImgBB(
  base64Image: string,
  index: number,
): Promise<{ url: string | null; error: string | null }> {
  if (!IMGBB_API_KEY) {
    const error = `[Image ${index + 1}] IMGBB_API_KEY is not configured`;
    console.error(error);
    return { url: null, error };
  }

  try {
    // Remove data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const sizeKB = Math.round((base64Data.length * 0.75) / 1024);
    console.log(
      `[Image ${index + 1}] Uploading to ImgBB... (size: ~${sizeKB}KB)`,
    );

    // Use URLSearchParams for more reliable upload
    const params = new URLSearchParams();
    params.append("key", IMGBB_API_KEY);
    params.append("image", base64Data);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.success && data.data?.url) {
      console.log(`[Image ${index + 1}] Upload successful: ${data.data.url}`);
      return { url: data.data.url, error: null };
    }

    const error = `[Image ${index + 1}] ImgBB error: ${JSON.stringify(data.error || data)}`;
    console.error(error);
    return { url: null, error };
  } catch (error) {
    const errorMsg = `[Image ${index + 1}] Upload error: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMsg);
    return { url: null, error: errorMsg };
  }
}

async function uploadAllImages(images: string[]): Promise<ImageUploadResult> {
  const result: ImageUploadResult = {
    uploadedUrls: [],
    failedCount: 0,
    totalProvided: images.length,
    errors: [],
  };

  console.log(`[Images] Starting upload of ${images.length} image(s)...`);

  for (let i = 0; i < images.length; i++) {
    const { url, error } = await uploadImageToImgBB(images[i], i);
    if (url) {
      result.uploadedUrls.push(url);
    } else {
      result.failedCount++;
      if (error) result.errors.push(error);
    }
  }

  console.log(
    `[Images] Upload complete: ${result.uploadedUrls.length}/${result.totalProvided} successful`,
  );
  if (result.errors.length > 0) {
    console.log(`[Images] Errors: ${result.errors.join(", ")}`);
  }

  return result;
}

function formatDate(): string {
  return new Date().toLocaleString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function sendEmailViaResend(
  formData: ContactFormData,
  imageResult: ImageUploadResult,
): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return false;
  }

  console.log("=== EMAIL CONFIG ===");
  console.log("FROM:", RESEND_FROM_EMAIL);
  console.log("TO:", RECIPIENT_EMAIL);
  console.log(
    "Images:",
    imageResult.uploadedUrls.length,
    "uploaded,",
    imageResult.failedCount,
    "failed",
  );
  console.log("====================");

  const emailHtml = `
<!DOCTYPE html>
<html lang="de" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.name} - ${formData.service}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @media (max-width: 480px) {
      .container { padding: 16px !important; }
      .phone-btn { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 20px 12px;">
    <tr>
      <td align="center">
        <table class="container" cellpadding="0" cellspacing="0" style="max-width: 420px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">

          <!-- Thin Top Bar -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #10b981, #3b82f6);"></td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 24px 20px;">

              <!-- Time -->
              <div style="text-align: center; margin-bottom: 16px;">
                <span style="display: inline-block; background-color: #f1f5f9; color: #64748b; font-size: 11px; padding: 5px 12px; border-radius: 16px;">
                  ${formatDate()}
                </span>
              </div>

              <!-- Service -->
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 14px 24px; border-radius: 14px;">
                  <span style="color: rgba(255,255,255,0.8); font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; display: block;">Service</span>
                  <span style="color: #ffffff; font-size: 18px; font-weight: 700; display: block; margin-top: 4px;">${formData.service}</span>
                </div>
              </div>

              <!-- Customer Name -->
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Kunde</span>
                <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; margin-top: 4px;">${formData.name}</h1>
              </div>

              <!-- Phone Button -->
              <a href="tel:${formData.phone}" style="display: block; background: linear-gradient(135deg, #10b981, #059669); padding: 16px 20px; border-radius: 14px; text-decoration: none; text-align: center; margin-bottom: 16px;">
                <span style="color: rgba(255,255,255,0.85); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block;">📞 Telefon</span>
                <span class="phone-btn" style="color: #ffffff; font-size: 24px; font-weight: 800; display: block; margin-top: 4px; letter-spacing: 0.5px;">${formData.phone}</span>
              </a>

              <!-- Info Box -->
              <div style="background-color: #f8fafc; border-radius: 14px; padding: 14px; margin-bottom: 16px;">
                <!-- Location -->
                <div style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <table width="100%"><tr>
                    <td width="28" style="font-size: 16px; vertical-align: middle;">📍</td>
                    <td style="vertical-align: middle;">
                      <span style="color: #94a3b8; font-size: 10px; text-transform: uppercase; display: block;">Ort</span>
                      <span style="color: #1e293b; font-size: 15px; font-weight: 600;">${formData.city}</span>
                    </td>
                  </tr></table>
                </div>
                <!-- Email -->
                <div style="padding: 10px 0;">
                  <table width="100%"><tr>
                    <td width="28" style="font-size: 16px; vertical-align: middle;">✉️</td>
                    <td style="vertical-align: middle;">
                      <span style="color: #94a3b8; font-size: 10px; text-transform: uppercase; display: block;">E-Mail</span>
                      <span style="color: #1e293b; font-size: 14px;">${formData.email ? `<a href="mailto:${formData.email}" style="color: #3b82f6; text-decoration: none;">${formData.email}</a>` : '<span style="color: #cbd5e1;">—</span>'}</span>
                    </td>
                  </tr></table>
                </div>
              </div>

              <!-- Message -->
              ${
                formData.message
                  ? `
              <div style="background-color: #f0f9ff; border-radius: 14px; padding: 14px; margin-bottom: 16px; border-left: 3px solid #3b82f6;">
                <span style="color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">💬 Nachricht</span>
                <p style="color: #334155; font-size: 14px; line-height: 1.5; margin: 0; white-space: pre-wrap;">${formData.message}</p>
              </div>
              `
                  : ""
              }

              <!-- Images -->
              ${
                imageResult.uploadedUrls.length > 0
                  ? `
              <div style="background-color: #f8fafc; border-radius: 14px; padding: 14px; margin-bottom: 16px;">
                <span style="color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 10px;">📷 ${imageResult.uploadedUrls.length} Bild${imageResult.uploadedUrls.length > 1 ? "er" : ""}</span>
                <div>
                  ${imageResult.uploadedUrls.map((url, i) => `<a href="${url}" target="_blank" style="display: inline-block; margin: 3px;"><img src="${url}" alt="Bild ${i + 1}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px; border: 2px solid #e2e8f0;" /></a>`).join("")}
                </div>
              </div>
              `
                  : ""
              }

              <!-- Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <a href="tel:${formData.phone}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 32px; border-radius: 10px; text-decoration: none; text-align: center; font-weight: 600; font-size: 13px;">📞 Anrufen</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 12px; text-align: center;">
              <span style="color: #94a3b8; font-size: 10px;">rohrreinigung-kraft.de</span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [RECIPIENT_EMAIL],
        subject: `${formData.name} · ${formData.service} · ${formData.city}`,
        html: emailHtml,
        reply_to: formData.email || undefined,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Resend API error:", JSON.stringify(data, null, 2));
      return false;
    }
    console.log("Email sent successfully:", data.id);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

async function sendToGoogleSheets(
  formData: ContactFormData,
  imageCount: number,
): Promise<SheetsReceipt> {
  // Build source info based on tracking data
  let sourceInfo = "Website";
  if (formData.gclid) {
    sourceInfo = "Google Ads";
  } else if (formData.source) {
    sourceInfo = formData.source;
    if (formData.medium) {
      sourceInfo += ` / ${formData.medium}`;
    }
  } else if (formData.referrer) {
    if (formData.referrer.includes("google")) {
      sourceInfo = "Google (Organic)";
    } else if (formData.referrer.includes("facebook")) {
      sourceInfo = "Facebook";
    } else if (formData.referrer !== "direct" && formData.referrer !== "") {
      try {
        sourceInfo = `Referral: ${new URL(formData.referrer).hostname}`;
      } catch {
        sourceInfo = "Referral";
      }
    }
  }

  const eventName =
    formData.requestType === "callback" ? "kraft_callback" : "kraft_thank_you";

  const payload = {
    timestamp: new Date().toISOString(),
    name: formData.name,
    phone: formData.phone,
    email: formData.email || "",
    city: formData.city,
    service: formData.service,
    message: formData.message || "",
    images: imageCount,
    source: sourceInfo,
    referrer: formData.referrer || "direct",
    gclid: formData.gclid || null,
    gbraid: formData.gbraid || null,
    wbraid: formData.wbraid || null,
    eventId: formData.eventId,
    eventName,
    eventType: formData.requestType === "callback" ? "callback" : "form",
    sourceSite: "rohrreinigungkraft-amberg.de",
    medium: formData.medium || null,
    campaign: formData.campaign || null,
    landingPage: formData.landingPage || null,
    currentPage: formData.currentPage || null,
  };

  return sendToLeadSheet(process.env.GOOGLE_SHEETS_WEBHOOK_URL, payload);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const submittedFormData: ContactFormData = body;
    const analyticsConsentAccepted = isAnalyticsConsentCookieAccepted(
      request.cookies.get(ANALYTICS_CONSENT_COOKIE)?.value,
    );
    const formData = analyticsConsentAccepted
      ? submittedFormData
      : stripAnalyticsAttribution(submittedFormData);

    // Quietly accept bot submissions caught by the hidden honeypot field.
    if (formData.website?.trim()) {
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (
      !formData.name ||
      !formData.phone ||
      !formData.city ||
      !formData.service
    ) {
      return NextResponse.json(
        {
          error: "Pflichtfelder fehlen",
          details: "Name, Telefon, Ort und Service sind erforderlich",
        },
        { status: 400 },
      );
    }

    if (!isValidEventId(formData.eventId)) {
      return NextResponse.json(
        {
          error: "Ungültige Anfrage-ID",
          details: "Eine gültige eventId ist erforderlich",
        },
        { status: 400 },
      );
    }

    if (
      formData.requestType !== "contact" &&
      formData.requestType !== "callback"
    ) {
      return NextResponse.json(
        {
          error: "Ungültiger Anfragetyp",
          details: "requestType muss contact oder callback sein",
        },
        { status: 400 },
      );
    }

    // Check if RESEND_API_KEY is configured
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        {
          error: "Server-Konfigurationsfehler",
          details: "RESEND_API_KEY fehlt",
        },
        { status: 500 },
      );
    }

    // Upload images to ImgBB if provided
    let imageResult: ImageUploadResult = {
      uploadedUrls: [],
      failedCount: 0,
      totalProvided: 0,
      errors: [],
    };

    if (formData.images && formData.images.length > 0) {
      console.log(`[Contact Form] ${formData.images.length} image(s) provided`);
      imageResult = await uploadAllImages(formData.images);
    }

    // Google Sheets is the source of truth. Do not report success until the
    // webhook confirms the exact sheet, row, eventId and dedupe state.
    const sheetsReceipt = await sendToGoogleSheets(
      formData,
      imageResult.uploadedUrls.length,
    );

    // Send email only after the lead is durably recorded in Google Sheets.
    const emailSent = await sendEmailViaResend(formData, imageResult);

    if (!emailSent) {
      return NextResponse.json(
        {
          error: "E-Mail konnte nicht gesendet werden",
          details:
            "Resend API Fehler. Mögliche Ursachen: 1) Domain nicht verifiziert bei Resend 2) RECIPIENT_EMAIL muss die verifizierte Resend E-Mail sein bei Nutzung von onboarding@resend.dev",
        },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Anfrage erfolgreich gesendet",
      emailSent,
      sheetsSent: true,
      ...sheetsReceipt,
      imagesUploaded: imageResult.uploadedUrls.length,
      imagesFailed: imageResult.failedCount,
      imageErrors: imageResult.errors,
      // Return tracking info for debugging
      trackingInfo: {
        hasGclid: !!formData.gclid,
        source: formData.source || "direct",
      },
    });

    if (formData.requestType === "contact") {
      response.cookies.set("kraft_thank_you_access", "granted", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 300,
        path: "/thank-you",
      });
    }

    return response;
  } catch (error) {
    console.error("Error processing contact form:", error);

    if (error instanceof SheetsWebhookError) {
      return NextResponse.json(
        {
          error: "Google Sheets konnte die Anfrage nicht bestätigen",
          details: error.code,
        },
        { status: error.code === "not_configured" ? 503 : 502 },
      );
    }

    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten", details: String(error) },
      { status: 500 },
    );
  }
}
