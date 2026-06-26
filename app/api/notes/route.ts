import QRCode from "qrcode";
import { NextRequest, NextResponse } from "next/server";

import { noteStore } from "@/lib/notes/store";
import { validateNoteInput } from "@/lib/notes/schema";
import { buildMobileUrl, getBaseUrl } from "@/lib/notes/urls";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateNoteInput(body);

    if (!validation.ok) {
      return NextResponse.json(
        { success: false, message: "参数验证失败", errors: validation.errors },
        { status: 400 }
      );
    }

    const note = await noteStore.create(validation.value);
    const baseUrl = getBaseUrl({
      requestOrigin: request.headers.get("origin") ?? request.nextUrl.origin
    });
    const mobileUrl = buildMobileUrl(note.id, baseUrl);
    const qrcode = await QRCode.toDataURL(mobileUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: "#1c2430",
        light: "#ffffff"
      }
    });

    return NextResponse.json({
      success: true,
      message: "笔记任务已创建",
      data: {
        note,
        mobileUrl,
        qrcode
      }
    });
  } catch (error) {
    console.error("Create note failed", error);
    return NextResponse.json({ success: false, message: "创建笔记失败" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const notes = await noteStore.list();
    return NextResponse.json({ success: true, data: { notes } });
  } catch (error) {
    console.error("List notes failed", error);
    return NextResponse.json({ success: false, message: "读取笔记失败" }, { status: 500 });
  }
}
