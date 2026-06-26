import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "XHS Auto Up",
  description: "Self-use Xiaohongshu publishing assistant"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
