"use client";

type Props = {
  title: string;
  content: string;
};

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function PublishActions({ title, content }: Props) {
  return (
    <div className="copy-row">
      <button className="button secondary" type="button" onClick={() => copyText(title)}>
        Copy title
      </button>
      <button className="button secondary" type="button" onClick={() => copyText(content)}>
        Copy body
      </button>
      <a className="button" href="xhsdiscover://">
        Try opening XHS
      </a>
    </div>
  );
}
