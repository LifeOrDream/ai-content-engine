import { NextResponse } from "next/server";
import { killJob } from "@/lib/jobStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = killJob(decodeURIComponent(id));
  if (!job) return NextResponse.json({ error: "running job not found" }, { status: 404 });
  return NextResponse.json({ job });
}
