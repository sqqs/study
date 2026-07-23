# 学习导师 · LearnMentor（网页版）

把「学习飞轮」做成网页版 AI 学习导师：你在网页上与导师对话做题，导师**只引导、不直接给答案**，引导你真正掌握；掌握的方法与避坑经验会自动沉淀进**浏览器本地的「学习飞轮」**，下次遇到同类题导师会主动提醒。

基于 `vercel/ai-chatbot` 思路（Next.js + Vercel AI SDK + Tailwind），UI 为苹果玻璃风。

## 特性

- 🤖 **智能导师交互**：流式对话，大模型按「审题→建模→推演→验证→复盘→沉淀」门禁流程引导。
- 🔑 **API Key 自填、无需登录**：Key 只存在你自己浏览器，浏览器直连大模型，部署端零密钥、零服务端。
- 🔄 **模型可切换**：DeepSeek（默认）/ OpenAI / Claude / 通义千问 / 自定义，一键切换。纯静态模式下 DeepSeek / OpenAI / 通义可浏览器直连；Claude 受 CORS 限制需自备代理。
- 💾 **学习飞轮本地存储**：每个访问用户的模式都存在自己浏览器（localStorage）。
- 🧠 **自动识别同类题**：每次对话自动把你的飞轮注入上下文（替代 `/learn:advise`）。
- ⚡ **自动沉淀经验**：导师在对话中调用 `savePattern` 工具，把经验写入本地飞轮（替代 `/learn:retro`）。
- 📄 **Markdown 同步**：飞轮可导出/导入 `LEARNING_REGISTRY.md`，与你现有知识库双向同步。
- 🎚️ **Profile 自适应**：小学 / 初中 / 高中 / 大学 / 自学 / 竞赛，改变「怎么教」。
- 🖼️ **题目图片识别**：聊天区可直接上传或粘贴题目截图，导师读取图片后引导。

## 🌐 网页入口：打开网址即用（无需命令行、无需服务器）

本项目已改为 **纯静态站点**：大模型在**浏览器内直接调用**，没有任何服务端代码。因此可以托管到任意静态空间，最方便的是 **GitHub Pages**——你只要 push 到 `master` 分支，Actions 自动构建并发布，约 1 分钟后得到一个 `https://sqqs.github.io/study/` 网址，浏览器打开就能用，全程不用敲命令。所有密钥与对话只存在你自己的浏览器。

> ✅ 实测：DeepSeek、OpenAI 的 API 均返回 `Access-Control-Allow-Origin`，**浏览器可直连**；因此默认模型 DeepSeek（及 OpenAI / 通义等 OpenAI 兼容服务）在纯静态下开箱即用。Anthropic Claude 通常屏蔽浏览器 CORS，纯静态模式选它会失败，建议用 DeepSeek / OpenAI。

### 方式一：GitHub Pages（推荐，零命令行）

仓库已内置 `.github/workflows/deploy.yml`，push 即部署：

1. 在 GitHub 仓库 **Settings → Pages → Build and deployment → Source 选 "GitHub Actions"**。
2. 把代码 push 到 `master` 分支（本项目就在 `study` 仓库的 `learn-mentor-web/` 子目录）。
3. 等待 Actions 跑完，访问 `https://sqqs.github.io/study/` 即可使用。

> 构建时自动设置 `basePath=/study` 与 `.nojekyll`，无需任何环境变量（API Key 在你浏览器本地填）。

### 方式二：Vercel / Netlify（同样可行）

静态导出产物在 `learn-mentor-web/out/`，可直接拖到 Vercel/Netlify，或连接仓库部署（Root/Base Directory 选 `learn-mentor-web`）。

### 使用

打开网址 → 右上角「设置」填你的大模型 API Key（图片题需选支持视觉的模型，如 DeepSeek-VL / gpt-4o）→ 开始对话。

## 本地预览（开发）

```bash
cd learn-mentor-web
npm install
npm run dev        # 本地开发服务器 http://localhost:3000
# 或构建静态产物到 out/ 后本地用任意静态服务器打开
npm run build && npx serve out
```

> 说明：本项目**纯静态、浏览器直连大模型**，没有任何服务端。所有密钥与对话只存在于你浏览器，可安全公开托管。

## 使用流程

1. 设置里选好模型、填好 Key。
2. 顶部选好你的 Profile（如「初中」）。
3. 把题目发给导师，它会一步步提问引导你作答。
4. 完成后导师复盘，并在掌握方法时自动沉淀到「学习飞轮」（左侧「学习飞轮」页可查看/搜索/编辑/删除）。
5. 在「学习飞轮」页可导出 Markdown 备份，或导入你已有的 `LEARNING_REGISTRY.md`。

## 目录结构

```
src/
  app/
    page.tsx              导师对话主页
    registry/page.tsx     学习飞轮管理页
    (无服务端)            浏览器内 streamText 直连大模型，无需后端
  components/             聊天、侧边栏、Profile、设置弹窗、飞轮列表/编辑/导入导出
  lib/
    types.ts             Pattern / LLMSettings 类型
    settings-store.ts    LLM 设置 + Profile（localStorage）
    registry-store.ts    学习飞轮（localStorage）
    prompt.ts            LearnMentor 系统提示词 + 飞轮上下文注入
    ai.ts                provider 工厂（OpenAI 兼容 / Anthropic）
    tools.ts             savePattern 客户端工具
    use-mentor-chat.ts   useChat 封装
    markdown.ts          Pattern ↔ Markdown 双向转换
```

## 技术栈

Next.js 15（App Router）· React 19 · Vercel AI SDK v4 · Tailwind CSS 3 · Zustand · lucide-react
