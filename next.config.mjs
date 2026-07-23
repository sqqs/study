/** @type {import('next').NextConfig} */

// GitHub Pages 项目站点的访问路径带仓库名前缀（如 /study）。
// 仅在使用 Actions 部署到 Pages 时（GITHUB_PAGES=true）启用 basePath/assetPrefix，
// 本地开发（npm run dev）不受影响。
const isGhPages = process.env.GITHUB_PAGES === "true";
const repo = "study";
const basePath = isGhPages ? `/${repo}` : "";
const assetPrefix = isGhPages ? `/${repo}/` : "";

const nextConfig = {
  output: "export", // 纯静态导出，可托管到 GitHub Pages / 任意静态空间
  basePath,
  assetPrefix,
  images: { unoptimized: true },
};

export default nextConfig;
