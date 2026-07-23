import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "学习导师 · LearnMentor",
  description: "网页版 AI 学习导师，引导你真正掌握，并把好方法沉淀进学习飞轮。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="h-full">{children}</body>
    </html>
  );
}
