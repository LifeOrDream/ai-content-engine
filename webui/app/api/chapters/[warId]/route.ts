import { NextResponse } from "next/server";
import { getChapterDetail } from "@/lib/chapters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ warId: string }> }) {
  try {
    const { warId } = await params;
    return NextResponse.json({ chapter: getChapterDetail(decodeURIComponent(warId)) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 404 });
  }
}
