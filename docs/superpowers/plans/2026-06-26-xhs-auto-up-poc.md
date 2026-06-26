# XHS Auto Up POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-use Xiaohongshu publishing assistant that creates note tasks, QR codes, and mobile publish pages.

**Architecture:** Next.js App Router serves both UI pages and API route handlers. Core note validation, URL building, and file-backed storage live in focused library modules covered by Vitest tests.

**Tech Stack:** Next.js, React, TypeScript, Vitest, qrcode, local JSON file storage.

---

### Task 1: Project Skeleton

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `app/layout.tsx`
- Create: `app/globals.css`

- [ ] Add minimal Next.js and test tooling configuration.
- [ ] Install dependencies with `npm install`.

### Task 2: Note Domain

**Files:**
- Create: `lib/notes/schema.ts`
- Create: `lib/notes/urls.ts`
- Create: `lib/notes/store.ts`
- Create: `tests/notes.test.ts`

- [ ] Write tests for image note validation, video note validation, stable public URL generation, and JSON persistence.
- [ ] Run `npm test -- --run` and verify tests fail because modules do not exist.
- [ ] Implement validation, URL helpers, and file-backed store.
- [ ] Run `npm test -- --run` and verify tests pass.

### Task 3: API Routes

**Files:**
- Create: `app/api/notes/route.ts`
- Create: `app/api/notes/[id]/route.ts`

- [ ] Add create-note and get-note route handlers using the tested domain modules.
- [ ] Return 400 for invalid input, 404 for missing notes, and 500 for unexpected storage errors.

### Task 4: User Interface

**Files:**
- Create: `app/page.tsx`
- Create: `app/p/[id]/page.tsx`

- [ ] Build the desktop form for creating notes and showing QR results.
- [ ] Build the mobile publish page with title/body copy controls and media previews.
- [ ] Keep the official SDK integration as an explicit disabled placeholder until credentials are available.

### Task 5: Verification And Git

**Files:**
- Modify: all created files

- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Commit the POC.
- [ ] Add remote `https://github.com/wangwenqin99/xhs_auto_up.git`.
- [ ] Attempt `git push -u origin main`.
