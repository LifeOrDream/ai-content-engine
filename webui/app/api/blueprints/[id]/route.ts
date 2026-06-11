import { NextRequest, NextResponse } from "next/server";
import { getBlueprintDocument, saveBlueprintDocument } from "@/lib/contentEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return NextResponse.json({ blueprint: getBlueprintDocument(decodeURIComponent(id)) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 404 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const blueprint = saveBlueprintDocument({
      id: String(body.id || id),
      title: String(body.title || ""),
      genre: String(body.genre || "story"),
      logline: String(body.logline || ""),
      targetSeconds: Number(body.targetSeconds || 75),
      minSeconds: Number(body.minSeconds || 24),
      countdown: String(body.countdown || "24:00:00"),
      cta: String(body.cta || "Mine your HashBeast - minebtc.fun"),
      cast: Array.isArray(body.cast) ? body.cast.map(String) : String(body.cast || "").split(","),
      body: String(body.body || ""),
    }, { create: false, currentId: decodeURIComponent(id) });
    return NextResponse.json({ blueprint });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 400 });
  }
}
