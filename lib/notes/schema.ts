export type NoteType = "normal" | "video";

export type NoteInput = {
  type?: unknown;
  title?: unknown;
  content?: unknown;
  images?: unknown;
  video?: unknown;
  cover?: unknown;
};

export type ValidatedNoteInput = {
  type: NoteType;
  title: string;
  content: string;
  images: string[];
  video: string;
  cover: string;
};

export type ValidationResult =
  | { ok: true; value: ValidatedNoteInput }
  | { ok: false; errors: Record<string, string[]> };

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isPublicUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function addError(errors: Record<string, string[]>, field: string, message: string) {
  errors[field] = [...(errors[field] ?? []), message];
}

export function validateNoteInput(input: NoteInput): ValidationResult {
  const errors: Record<string, string[]> = {};
  const type = input.type === "video" ? "video" : "normal";
  const title = asText(input.title);
  const content = asText(input.content);
  const imageValues = Array.isArray(input.images) ? input.images.map(asText).filter(Boolean) : [];
  const images = imageValues.filter(isPublicUrl).slice(0, 18);
  const video = asText(input.video);
  const cover = asText(input.cover);

  if (title.length > 40) {
    addError(errors, "title", "标题最多 40 个字符");
  }

  if (content.length > 1000) {
    addError(errors, "content", "正文最多 1000 个字符");
  }

  if (type === "normal" && images.length === 0) {
    addError(errors, "images", "至少提供 1 个有效图片 URL");
  }

  if (type === "video") {
    if (!isPublicUrl(video)) {
      addError(errors, "video", "视频笔记必须提供有效视频 URL");
    }
    if (cover && !isPublicUrl(cover)) {
      addError(errors, "cover", "封面必须是有效 URL");
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      type,
      title,
      content,
      images: type === "normal" ? images : [],
      video: type === "video" ? video : "",
      cover: type === "video" ? cover : ""
    }
  };
}
