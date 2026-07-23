# 学习导师 · LearnMentor（网页版）

把「学习飞轮」做成网页版 AI 学习导师：你在网页上与导师对话做题，导师**只引导、不直接给答案**，引导你真正掌握；掌握的方法与避坑经验会自动沉淀进**浏览器本地的「学习飞轮」**，下次遇到同类题导师会主动提醒。

基于 `vercel/ai-chatbot` 思路（Next.js + Vercel AI SDK + Tailwind），UI 为苹果玻璃风。

## 特性

- 🤖 **智能导师交互**：流式对话，大模型按「审题→建模→推演→验证→复盘→沉淀」门禁流程引导。
- 🔑 **API Key 自填、无需登录**：Key 只存在你自己浏览器，仅本次请求发给后端代理，部署端零密钥。
- 🔄 **模型可切换**：DeepSeek（默认）/ OpenAI / Claude / 通义千问 / 自定义，一键切换。
- 💾 **学习飞轮本地存储**：每个访问用户的模式都存在自己浏览器（localStorage）。
- 🧠 **自动识别同类题**：每次对话自动把你的飞轮注入上下文（替代 `/learn:advise`）。
- ⚡ **自动沉淀经验**：导师在对话中调用 `savePattern` 工具，把经验写入本地飞轮（替代 `/learn:retro`）。
- 📄 **Markdown 同步**：飞轮可导出/导入 `LEARNING_REGISTRY.md`，与你现有知识库双向同步。
- 🎚️ **Profile 自适应**：小学 / 初中 / 高中 / 大学 / 自学 / 竞赛，改变「怎么教」。
- 🖼️ **题目图片识别**：聊天区可直接上传或粘贴题目截图，导师读取图片后引导。

## 🌐 网页入口：部署后直接打开网址使用（无需命令行）

本项目是 Next.js 全栈应用（含一个轻量服务端代理 `/api/chat`）。只需从 GitHub 仓库一键部署到 **Vercel / Netlify**，即可获得一个网址，浏览器打开就能用——全程不用敲命令。

> ⚠️ 项目在仓库的 **`learn-mentor-web/` 子目录**，部署时 **Root/Base Directory 务必选 `learn-mentor-web`**。

### 方式一：Vercel 一键部署（推荐，对 Next.js 最友好）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sqqs/study&root-directory=learn-mentor-web)

或在 Vercel 网页手动操作：
1. 登录 vercel.com → New Project → Import Git Repository → 选 `sqqs/study`。
2. **Root Directory 选 `learn-mentor-web`**。
3. Framework 自动识别为 Next.js，**无需填任何环境变量**（API Key 在你浏览器本地）。
4. Deploy，约 1 分钟后得到 `https://xxx.vercel.app`，打开即用。

### 方式二：Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sqqs/study)

网页操作：导入仓库 → Build command 填 `npm run build` → Publish directory 填 `.next` → **Base directory 填 `learn-mentor-web`** → Deploy。

### 使用

打开部署好的网址 → 右上角「设置」填你的大模型 API Key（DeepSeek / OpenAI / Claude 等，图片题需选支持视觉的模型）→ 开始对话。所有数据与密钥只存你浏览器，不落服务器。

> 注：因保留服务端代理，需部署到支持 Serverless 函数的平台（Vercel / Netlify 均可），不能直接用纯静态托管（如 GitHub Pages）。若希望做成「纯静态、浏览器直连大模型」版本（可放 GitHub Pages），需要时可告诉我重构。

## 快速开始（本地开发）

```bash
cd learn-mentor-web
npm install
npm run dev
```

打开 http://localhost:3000 ，点击右上角「设置」填写你的大模型 API Key（例如 DeepSeek 的 `sk-...`），即可开始对话。

> 说明：后端 `/api/chat` 仅做「安全转发」，不在服务端保存任何密钥。若公网部署，他人可借用你的代理接口，建议在本地或可信网络运行。

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
    api/chat/route.ts     LLM 代理（读用户密钥，流式返回）
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
