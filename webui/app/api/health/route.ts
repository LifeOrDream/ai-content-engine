import { NextResponse } from "next/server";
import { REPO_ROOT } from "@/lib/contentEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    ok: true,
    repoRoot: REPO_ROOT,
    service: "minebtc-ai-content-engine-webui",
  });
}
