import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

import type { ValidatedNoteInput } from "./schema";

export type Note = ValidatedNoteInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type NotesFile = {
  notes: Note[];
};

export type NoteStore = {
  create(input: ValidatedNoteInput): Promise<Note>;
  get(id: string): Promise<Note | null>;
  list(): Promise<Note[]>;
};

const defaultFilePath = join(process.cwd(), "data", "notes.json");

async function readNotes(filePath: string): Promise<NotesFile> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as NotesFile;
    return { notes: Array.isArray(parsed.notes) ? parsed.notes : [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { notes: [] };
    }
    throw error;
  }
}

async function writeNotes(filePath: string, data: NotesFile): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function createNoteStore(filePath = defaultFilePath): NoteStore {
  return {
    async create(input) {
      const data = await readNotes(filePath);
      const now = new Date().toISOString();
      const note: Note = {
        id: `note_${randomUUID().replaceAll("-", "").slice(0, 16)}`,
        ...input,
        createdAt: now,
        updatedAt: now
      };
      data.notes.unshift(note);
      await writeNotes(filePath, data);
      return note;
    },

    async get(id) {
      const data = await readNotes(filePath);
      return data.notes.find((note) => note.id === id) ?? null;
    },

    async list() {
      const data = await readNotes(filePath);
      return data.notes;
    }
  };
}

export const noteStore = createNoteStore();
