import { NextRequest, NextResponse } from "next/server";
import { listBlueprints, saveBlueprintDocument } from "@/lib/contentEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ blueprints: listBlueprints() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const blueprint = saveBlueprintDocument({
      id: String(body.id || ""),
      title: String(body.title || ""),
      genre: String(body.genre || "story"),
      logline: String(body.logline || ""),
      targetSeconds: Number(body.targetSeconds || 75),
      minSeconds: Number(body.minSeconds || 24),
      countdown: String(body.countdown || "24:00:00"),
      cta: String(body.cta || "Mine your HashBeast - minebtc.fun"),
      cast: Array.isArray(body.cast) ? body.cast.map(String) : String(body.cast || "").split(","),
      body: String(body.body || ""),
    }, { create: true });
    return NextResponse.json({ blueprint }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 400 });
  }
}
