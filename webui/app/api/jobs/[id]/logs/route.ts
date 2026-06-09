import { NextResponse } from "next/server";
import { getJobWithLogs } from "@/lib/jobStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getJobWithLogs(decodeURIComponent(id));
  if (!data) return NextResponse.json({ error: "job not found" }, { status: 404 });
  return NextResponse.json(data);
}
