# xhs_auto_up

Self-use Xiaohongshu publishing assistant POC.

## What It Does

- Creates a note task from title, body, image URLs, or video URL.
- Stores tasks in `data/notes.json`.
- Returns a mobile publish URL and QR code.
- Provides a mobile page for copying title/body and opening media.
- Leaves a clear placeholder for the official Xiaohongshu share JS SDK.

This project does not store Xiaohongshu credentials and does not call private posting APIs.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test On A Phone

Do not scan a QR code that points to `127.0.0.1` or `localhost`. On a phone,
that address means the phone itself, not your computer.

For same-Wi-Fi testing, run:

```bash
npm run dev:lan
```

The command prints a LAN URL such as:

```text
LAN app URL: http://192.168.31.88:3000
```

Open that URL on the desktop page, create a note again, and scan the new QR
code. The phone and computer must be on the same network, and Windows Firewall
must allow inbound access to Node.js on port `3000`.

## Environment

Copy `.env.example` to `.env.local` when deploying:

```bash
APP_URL=https://your-domain.example
```

`APP_URL` is used to generate QR-code mobile links. Local development falls back to the request origin.

For real Xiaohongshu auto-fill, the mobile page must be served from a public
HTTPS domain that is allowed by the official Xiaohongshu share JS SDK app
configuration. Local LAN IPs are useful for testing the page, but they are not
enough for the official share SDK flow.

## API

Create an image note:

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "type": "normal",
    "title": "AI content test",
    "content": "Body text",
    "images": ["https://example.com/image.png"]
  }'
```

Create a video note:

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "type": "video",
    "title": "Video note",
    "content": "Body text",
    "video": "https://example.com/video.mp4",
    "cover": "https://example.com/cover.jpg"
  }'
```

## Verification

```bash
npm test -- --run
npm run build
```
