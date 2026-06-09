import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getWhitelistedAssetPath } from "@/lib/contentEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function assetType(file: string): string {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: assetPath } = await params;
    const filePath = getWhitelistedAssetPath(assetPath.map(decodeURIComponent));
    const bytes = await fs.readFile(filePath);
    return new NextResponse(bytes, {
      headers: {
        "content-type": assetType(filePath),
        "cache-control": "public, max-age=300",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 404 });
  }
}
