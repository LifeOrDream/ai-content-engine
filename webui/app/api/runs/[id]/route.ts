import { NextResponse } from "next/server";
import { getRunDetail } from "@/lib/contentEngine";
import { activeJobsByBlueprint } from "@/lib/jobStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return NextResponse.json({ run: getRunDetail(decodeURIComponent(id), activeJobsByBlueprint()) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 404 });
  }
}
