import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test, afterEach } from "vitest";

import { createNoteStore } from "../lib/notes/store";
import { buildMobileUrl, getBaseUrl } from "../lib/notes/urls";
import { validateNoteInput } from "../lib/notes/schema";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

async function tempFile() {
  const dir = await mkdtemp(join(tmpdir(), "xhs-auto-up-"));
  tempDirs.push(dir);
  return join(dir, "notes.json");
}

describe("note validation", () => {
  test("accepts image notes with up to 18 public URLs", () => {
    const result = validateNoteInput({
      type: "normal",
      title: "AI 绘图分享",
      content: "今天生成了一组图。",
      images: ["https://example.com/a.png", "https://example.com/b.webp"]
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.images).toHaveLength(2);
      expect(result.value.video).toBe("");
    }
  });

  test("rejects image notes without usable image URLs", () => {
    const result = validateNoteInput({
      type: "normal",
      title: "",
      content: "",
      images: ["", "not-a-url"]
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.images).toContain("至少提供 1 个有效图片 URL");
    }
  });

  test("accepts video notes with a video URL and optional cover", () => {
    const result = validateNoteInput({
      type: "video",
      title: "视频笔记",
      content: "一条测试视频。",
      video: "https://example.com/video.mp4",
      cover: "https://example.com/cover.jpg"
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.images).toEqual([]);
      expect(result.value.video).toBe("https://example.com/video.mp4");
    }
  });
});

describe("url helpers", () => {
  test("normalizes base URL from explicit app URL or request origin", () => {
    expect(getBaseUrl({ appUrl: "https://demo.example.com/" })).toBe("https://demo.example.com");
    expect(getBaseUrl({ requestOrigin: "http://localhost:3000" })).toBe("http://localhost:3000");
  });

  test("builds mobile note URL", () => {
    expect(buildMobileUrl("note_123", "https://demo.example.com")).toBe(
      "https://demo.example.com/p/note_123"
    );
  });
});

describe("note store", () => {
  test("creates and retrieves notes from a JSON file", async () => {
    const store = createNoteStore(await tempFile());
    const input = validateNoteInput({
      type: "normal",
      title: "标题",
      content: "正文",
      images: ["https://example.com/a.png"]
    });

    expect(input.ok).toBe(true);
    if (!input.ok) return;

    const note = await store.create(input.value);
    const found = await store.get(note.id);

    expect(note.id).toMatch(/^note_/);
    expect(found?.title).toBe("标题");
    expect(found?.images).toEqual(["https://example.com/a.png"]);
  });
}
);
