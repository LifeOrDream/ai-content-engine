import { NextResponse } from "next/server";
import { listBlueprints } from "@/lib/contentEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ blueprints: listBlueprints() });
}
