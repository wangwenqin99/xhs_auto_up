# XHS Auto Up POC Design

## Goal

Build a self-use Xiaohongshu publishing assistant that accepts note content, stores it locally, and generates a mobile publish page plus QR code.

## Scope

The first version keeps the final publishing step manual. It does not store Xiaohongshu credentials, automate private Xiaohongshu APIs, manage billing, or provide public multi-user registration. The mobile page helps copy the title and body, previews media URLs, and leaves a clear integration point for the official Xiaohongshu share JS SDK once valid app credentials are available.

## Architecture

Use a Next.js app with server route handlers. Notes are persisted in `data/notes.json` through a small storage module, keeping the persistence boundary easy to replace with SQLite later. QR codes are generated from the public mobile page URL returned by the create-note API.

## Main Flow

1. The desktop page collects note type, title, content, image URLs, video URL, and cover URL.
2. `POST /api/notes` validates and stores the note.
3. The response returns the note id, mobile URL, and QR code data URL.
4. The mobile page at `/p/[id]` loads the note and provides copy/open actions for manual publishing.

## Data Model

Each note stores `id`, `type`, `title`, `content`, `images`, `video`, `cover`, `createdAt`, and `updatedAt`. Image notes allow up to 18 image URLs. Video notes require one video URL and may include one cover URL.

## Error Handling

Validation errors return HTTP 400 with field-level messages. Missing notes return HTTP 404. Storage failures return HTTP 500 with a generic message so local paths and internals are not exposed.

## Testing

Unit tests cover validation, URL derivation, and JSON file storage behavior. Build verification covers the Next.js app.
