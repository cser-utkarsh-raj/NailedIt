# 🎯 NailedIt

> **A browser-based thumbnail and social-graphic studio for getting the visual right, fast.**

`NailedIt` is a lightweight creative tool for producing polished graphics directly in the browser — especially **YouTube thumbnails, blog/Open Graph images, and vertical social content**.

It is one of the standalone public tools in the **.dot** ecosystem.

## ✨ What It Does

- 🎨 **Professional templates** designed for strong visual hierarchy rather than generic blank canvases.
- 📺 **YouTube formats** for thumbnail creation.
- 🌐 **Blog / Open Graph formats** for link previews and articles.
- 📱 **Vertical formats** for Reels and social content.
- ✍️ **Custom typography/content** — title, subtitle, category, keywords, logo, and speaker imagery.
- 🖼️ **Image positioning** with scale and pan controls.
- 🖥️ **High-DPI Canvas rendering** for crisp exports.
- 📤 **PNG and WebP export** plus clipboard image copying.
- 🔒 **Client-side image processing** so local assets can be handled in the browser without unnecessary uploads.

## 🧩 Workflow

```text
Choose format
     ↓
Choose / customize template
     ↓
Add text + imagery
     ↓
Scale / pan / compose
     ↓
High-DPI render
     ↓
Export or copy
```

## 🛠️ Tech Stack

React · TypeScript · Vite · Tailwind CSS · HTML5 Canvas · Lucide React

## 🚀 Run Locally

```bash
git clone https://github.com/cser-utkarsh-raj/NailedIt.git
cd NailedIt
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## 🎯 Design & Engineering Principles

NailedIt treats visual quality and rendering architecture as first-class concerns.

- Preserve component contracts and reusable template logic.
- Keep preview rendering responsive.
- Use deliberate composition, typography, and spacing.
- Handle asynchronous image loading safely.
- Prefer meaningful design systems over collections of arbitrary rectangles and magic numbers.
- Keep the browser-first workflow fast and private.

## 🌐 Part of .dot

NailedIt is a standalone .dot tool: small enough to use immediately, but polished enough to solve a real creative task.

> **NailedIt · Make the first impression count.**
>
> **Presented by .dot**
