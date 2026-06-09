import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getRunMediaPath } from "@/lib/contentEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mediaType(file: string): string {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".webm") return "video/webm";
  if (ext === ".mov") return "video/quicktime";
  return "video/mp4";
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; file: string }> }) {
  try {
    const { id, file } = await params;
    const filePath = getRunMediaPath(decodeURIComponent(id), decodeURIComponent(file));
    const bytes = await fs.readFile(filePath);
    return new NextResponse(bytes, {
      headers: {
        "content-type": mediaType(file),
        "cache-control": "public, max-age=60",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 404 });
  }
}
