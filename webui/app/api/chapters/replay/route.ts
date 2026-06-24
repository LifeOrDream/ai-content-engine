import { NextRequest, NextResponse } from "next/server";
import { startReplayJob } from "@/lib/jobStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Launch a chapter replay. The optional `apiKey` is forwarded to the child
 * process via env ONLY (never argv, logs, or disk) by startReplayJob.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const job = startReplayJob({
      warId: Number(body.warId),
      mode: body.mode === "render-only" ? "render-only" : "full",
      fromVersion: body.fromVersion ? String(body.fromVersion) : undefined,
      apiKey: body.apiKey ? String(body.apiKey) : undefined,
    });
    return NextResponse.json({ job }, { status: 202 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 400 });
  }
}
