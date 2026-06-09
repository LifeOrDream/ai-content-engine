import { NextRequest, NextResponse } from "next/server";
import { listRuns } from "@/lib/contentEngine";
import { activeJobsByBlueprint, startScriptJob } from "@/lib/jobStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ runs: listRuns(activeJobsByBlueprint()) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const job = startScriptJob({
      blueprintId: String(body.blueprintId || ""),
      only: body.only ? String(body.only) : undefined,
      from: body.from ? Number(body.from) : undefined,
      to: body.to ? Number(body.to) : undefined,
    });
    return NextResponse.json({ job }, { status: 202 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 400 });
  }
}
