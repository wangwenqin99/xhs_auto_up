"use client";

import { FormEvent, useMemo, useState } from "react";

type NoteType = "normal" | "video";

type CreatedResult = {
  note: {
    id: string;
    title: string;
  };
  mobileUrl: string;
  qrcode: string;
};

const sampleImages = [
  "https://images.unsplash.com/photo-1493612276216-ee3925520721",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
].join("\n");

export default function HomePage() {
  const [type, setType] = useState<NoteType>("normal");
  const [title, setTitle] = useState("AI 内容发布测试");
  const [content, setContent] = useState("这里是要发布到小红书的正文。");
  const [images, setImages] = useState(sampleImages);
  const [video, setVideo] = useState("");
  const [cover, setCover] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CreatedResult | null>(null);

  const payload = useMemo(
    () => ({
      type,
      title,
      content,
      images: type === "normal" ? images.split("\n").map((item) => item.trim()) : [],
      video: type === "video" ? video : "",
      cover: type === "video" ? cover : ""
    }),
    [type, title, content, images, video, cover]
  );

  async function createNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        const detail = json.errors
          ? Object.values(json.errors).flat().join("；")
          : json.message || "创建失败";
        setError(detail);
        return;
      }

      setResult(json.data);
    } catch {
      setError("网络请求失败，请确认本地服务正在运行");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">X</div>
          <div>
            <p className="eyebrow">Self-use publishing assistant</p>
            <h1>XHS Auto Up</h1>
          </div>
        </div>
        <p className="hint">先生成手机发布页，扫码后在手机端完成复制和发布。</p>
      </header>

      <div className="layout">
        <form className="panel" onSubmit={createNote}>
          <h2>创建笔记任务</h2>
          <p className="hint">第一版不保存小红书账号，也不调用私有发帖接口。</p>

          <div className="field">
            <span className="label">笔记类型</span>
            <div className="segmented">
              <label className="segment">
                <input
                  type="radio"
                  checked={type === "normal"}
                  onChange={() => setType("normal")}
                />
                图文
              </label>
              <label className="segment">
                <input
                  type="radio"
                  checked={type === "video"}
                  onChange={() => setType("video")}
                />
                视频
              </label>
            </div>
          </div>

          <div className="field">
            <label htmlFor="title">标题</label>
            <input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="content">正文</label>
            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>

          {type === "normal" ? (
            <div className="field">
              <label htmlFor="images">图片 URL</label>
              <textarea
                id="images"
                value={images}
                onChange={(event) => setImages(event.target.value)}
              />
              <p className="hint">每行一个公网图片 URL，最多 18 张。</p>
            </div>
          ) : (
            <>
              <div className="field">
                <label htmlFor="video">视频 URL</label>
                <input id="video" value={video} onChange={(event) => setVideo(event.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="cover">封面 URL</label>
                <input id="cover" value={cover} onChange={(event) => setCover(event.target.value)} />
              </div>
            </>
          )}

          <button className="button" type="submit" disabled={loading}>
            {loading ? "生成中..." : "生成发布二维码"}
          </button>
        </form>

        <section className="panel">
          <h2>发布入口</h2>
          {!result && !error ? (
            <p className="hint">提交后这里会显示二维码和手机发布页链接。</p>
          ) : null}

          {error ? <div className="error">{error}</div> : null}

          {result ? (
            <div className="result">
              <div className="success">笔记任务已创建：{result.note.id}</div>
              <img className="qr" src={result.qrcode} alt="发布页二维码" />
              <div>
                <p className="label">手机发布页</p>
                <p className="url">{result.mobileUrl}</p>
              </div>
              <a className="button secondary" href={result.mobileUrl} target="_blank">
                打开发布页
              </a>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
