import { NextResponse } from "next/server";

import { noteStore } from "@/lib/notes/store";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const note = await noteStore.get(id);

    if (!note) {
      return NextResponse.json({ success: false, message: "笔记不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { note } });
  } catch (error) {
    console.error("Get note failed", error);
    return NextResponse.json({ success: false, message: "读取笔记失败" }, { status: 500 });
  }
}
