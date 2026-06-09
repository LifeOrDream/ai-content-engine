import { NextRequest, NextResponse } from "next/server";
import { readRunFile } from "@/lib/contentEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const file = request.nextUrl.searchParams.get("name") || "";
    const text = readRunFile(decodeURIComponent(id), file);
    const contentType = file.endsWith(".json")
      ? "application/json; charset=utf-8"
      : file.endsWith(".srt") || file.endsWith(".vtt") || file.endsWith(".txt")
        ? "text/plain; charset=utf-8"
        : "text/markdown; charset=utf-8";
    return new NextResponse(text, {
      headers: {
        "content-type": contentType,
        "cache-control": "no-store",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 400 });
  }
}
