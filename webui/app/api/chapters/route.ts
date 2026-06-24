import { NextResponse } from "next/server";
import { listChapterSummaries } from "@/lib/chapters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ chapters: listChapterSummaries() });
}
