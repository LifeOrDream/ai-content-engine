import { NextResponse } from "next/server";
import { listJobs } from "@/lib/jobStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ jobs: listJobs() });
}
