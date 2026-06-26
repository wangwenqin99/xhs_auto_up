import Link from "next/link";
import { notFound } from "next/navigation";

import { noteStore } from "@/lib/notes/store";
import { PublishActions } from "./PublishActions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MobilePublishPage({ params }: Props) {
  const { id } = await params;
  const note = await noteStore.get(id);

  if (!note) {
    notFound();
  }

  return (
    <main className="mobile-page">
      <section className="panel">
        <p className="eyebrow">Mobile publish page</p>
        <h1 className="note-title">{note.title || "Untitled note"}</h1>
        <p className="hint">
          Use this page on your phone. Copy the title and body, open Xiaohongshu, then upload
          the media below.
        </p>

        <PublishActions title={note.title} content={note.content} />

        <div className="panel">{note.content || "No body text"}</div>

        <h2>Media</h2>
        {note.type === "normal" ? (
          <div className="media-grid">
            {note.images.map((image) => (
              <a href={image} target="_blank" rel="noreferrer" key={image}>
                <img src={image} alt="Note media" />
              </a>
            ))}
          </div>
        ) : (
          <div className="video-box">
            <a href={note.video} target="_blank" rel="noreferrer">
              Open video media
              <br />
              {note.video}
            </a>
          </div>
        )}

        {note.cover ? (
          <>
            <h2>Cover</h2>
            <div className="media-grid">
              <a href={note.cover} target="_blank" rel="noreferrer">
                <img src={note.cover} alt="Video cover" />
              </a>
            </div>
          </>
        ) : null}

        <div className="sdk-placeholder">
          Official Xiaohongshu share JS SDK integration point: replace this block with a
          publish button after the app key, signature rules, and allowed domain are available.
        </div>
      </section>

      <p className="hint" style={{ marginTop: 16 }}>
        <Link href="/">Back to create page</Link>
      </p>
    </main>
  );
}
