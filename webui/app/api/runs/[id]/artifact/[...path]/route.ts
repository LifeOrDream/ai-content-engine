import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getRunArtifactPath } from "@/lib/contentEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function contentType(file: string): string {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webm") return "video/webm";
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".mp3") return "audio/mpeg";
  if (ext === ".wav") return "audio/wav";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".srt" || ext === ".vtt" || ext === ".txt") return "text/plain; charset=utf-8";
  return "text/markdown; charset=utf-8";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; path: string[] }> },
) {
  try {
    const { id, path: artifactPath } = await params;
    const filePath = getRunArtifactPath(decodeURIComponent(id), artifactPath.map(decodeURIComponent));
    const bytes = await fs.readFile(filePath);
    return new NextResponse(bytes, {
      headers: {
        "content-type": contentType(filePath),
        "cache-control": "public, max-age=60",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 404 });
  }
}
