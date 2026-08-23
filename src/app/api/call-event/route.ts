import { NextResponse } from "next/server";

// Kept as a harmless compatibility endpoint for old cached clients.
// A website phone click is not proof of a completed call and must never create
// a lead row. Real ad calls are imported from Google Ads call reporting.
export async function POST() {
  return NextResponse.json({ success: true, recorded: false });
}
