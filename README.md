# 镜心 · Jingxin · MindMirror

> **一面问己之镜。**  
> **A mirror for asking yourself — in the style of a Chinese literati.**

[🌐 **在线站点**](https://badhope.github.io/MindMirror/) ·
[📦 **仓库**](https://github.com/badhope/MindMirror) ·
[📜 **变更日志**](./CHANGELOG.md) ·
[🛡 **许可 (PolyForm NC)**](./LICENSE)

**镜心 (Jingxin · MindMirror)** 是一面**纯前端、纯本地**的问己之镜。
汝以**六十问**答之，镜心以**十二维特征空间**度之，复以**加权欧氏 + 余弦**之合，**映汝于千古一人**。

- 🪞 **第一域**：东方文人墨客 · 30 人
- 🪞 **第二域**：东方治国名臣 · 30 人
- 🪞 **第三域**：东方科技先驱 · 30 人
- 🪞 **第四域**：西方哲学大家 · 30 人
- 🪞 **第五域**：西方科学巨擘 · 30 人

合 **5 域 · 151 人 · 240 题**。
汝所答仅存汝之本地 (`localStorage`)。镜心不联网。

---

## ✒ 理念

- **问己而已** — 不评汝之高下，不为汝贴标签，不存汝一丝一毫于云端。
- **以算法为骨** — 12 维特征空间为正交连续区间；匹配为加权欧氏 (0.6) + 余弦 (0.4)。
- **以美为皮** — 宣纸为底，霞鹜文楷为字，朱砂为印；不与"AI 量产审美"为伍。
- **以汝为度** — 答毕即得一位主镜与四位同道，余皆镜外之影。

---

## 🪞 玩法

1. **入镜** — 三道随机启语之一
2. **选域** — 五域任择其一
3. **行** — 60 问（每域 48 题共享题库 + 域内 12 题）。每问六选一；汝可来去
4. **映照** — 出镜。主镜一人 + 同道四人。12 维之差、古今之合皆列其下

---

## 🔢 算法

- **12 维特征空间**：思辨 · 情感 · 行动 · 革新 · 群我 · 审美 ·
  意志 · 学识 · 处世 · 时间 · 风险 · 表达
- **答题 → 向量** — 每题 6 选项；主维度贡献 + 副维度小幅加和；sigmoid 归一至 [0,1]
- **匹配** — `0.6 × 加权欧氏相似 + 0.4 × 余弦相似`
- **置信度** — `0.6 × 完成度 + 0.4 × 决断度`（向量方差越大，答案越分明）
- **金样例** — [`tests/golden.spec.mjs`](./tests/golden.spec.mjs) 18 条样例

详见 [`src/domain/traits/trait.dimensions.ts`](./src/domain/traits/trait.dimensions.ts) 与
[`src/domain/matching/`](./src/domain/matching/)。

---

## 🛠 技术栈

| 类别 | 选型                                      |
| ---- | ----------------------------------------- |
| 框架 | React 18 + TypeScript 5.5                 |
| 构建 | Vite 5                                    |
| 状态 | Zustand 4                                 |
| 路由 | 无（单页 + localStorage 状态机）          |
| 样式 | 原生 CSS + 主题变量 (`src/index.css`)     |
| 字体 | 霞鹜文楷 / 思源宋体（系统回落）           |
| PWA  | 原生 Service Worker（无 Workbox）         |
| 部署 | GitHub Pages (Actions)                    |
| 许可 | [PolyForm Noncommercial 1.0.0](./LICENSE) |

无第三方追踪 SDK。无埋点。无后端。

---

## 🚀 部署 / 开发

```sh
npm install           # 安装依赖
npm run dev           # 本地开发 (http://localhost:5173)
npm run build         # 产物在 dist/
npm run build:pages   # GitHub Pages 专用构建（base = /MindMirror/）
npm run typecheck     # tsc --noEmit
npm test              # 跑金样例 (golden.spec.mjs)
npm run format        # prettier --write
```

**GitHub Pages 自动部署**：`.github/workflows/pages.yml` 在 `main` 推送时构建并通过
`actions/deploy-pages@v5` 部署至 `https://badhope.github.io/MindMirror/`。

**CI 流水线**：`.github/workflows/ci.yml` — `npm ci → typecheck → prettier → build → test`。

---

## 🗂 目录结构

```
.
├── .github/
│   ├── ISSUE_TEMPLATE/         # bug-report / feature-add-figure
│   ├── workflows/              # ci.yml / pages.yml
│   └── FUNDING.yml             # 赞助
├── .trae/documents/            # 产品 / 技术文档
│   ├── prd.md
│   ├── tech-arch.md
│   ├── refactor-plan.md
│   └── golden-cases.md         # 18 条金样例
├── public/
│   ├── 404.html                # SPA 404 兜底
│   ├── favicon.svg
│   ├── manifest.webmanifest    # PWA
│   ├── robots.txt
│   ├── sw.js                   # Service Worker
│   ├── patterns/               # 宣纸底纹
│   └── portraits/              # 5 域 × 30 张手绘水墨 SVG (共 151 张)
│       ├── east-literati/      # 东方文人墨客
│       ├── east-statesman/     # 东方治国名臣
│       ├── east-scientist/     # 东方科技先驱
│       ├── west-philosopher/   # 西方哲学大家
│       └── west-scientist/     # 西方科学巨擘
├── scripts/                    # 生成肖像脚本 (gen-portraits / render-portraits)
├── src/
│   ├── components/             # 通用组件 (TopBar / BrushButton / Portrait / Progress / TraitRadar / Verse)
│   ├── domain/
│   │   ├── traits/             # 12 维定义 + 类型
│   │   ├── items/              # 5 域 × 48 题 = 240 题
│   │   ├── figures/            # 5 域 × 30 人 = 151 人 (含 1 跨域)
│   │   └── matching/           # 向量化 / 评分 / 置信度 / 文案 / 报告
│   ├── i18n/                   # zh / en 双语
│   ├── pages/                  # Prologue / Path / Way / Reflection
│   ├── App.tsx
│   ├── main.tsx
│   ├── share.ts                # 答卷导入/导出 (Base64 + URL)
│   ├── store.ts                # Zustand 全局态
│   └── index.css               # 主题（墨黑/朱砂/青玉/宣纸 + 霞鹜文楷）
├── tests/                      # axe / e2e / golden / link-check / 多视口截图
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .gitleaks.toml
├── .lighthouserc.json
├── .node-version               # 20
├── .prettierrc / .prettierignore
├── .size-limit.json
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE                     # PolyForm Noncommercial 1.0.0
├── README.md                   ← 你在这里
├── SECURITY.md
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🌍 国际化

- `zh-CN`（默认）— 古风文言
- `en-US` — 英文白话

UI 文案在 [`src/i18n/zh.ts`](./src/i18n/zh.ts) 与 [`src/i18n/en.ts`](./src/i18n/en.ts)。

---

## 🧪 质量保证

| 工具           | 范围                             | 配置                    |
| -------------- | -------------------------------- | ----------------------- |
| `tsc --noEmit` | 类型                             | `tsconfig.json`         |
| `prettier`     | 格式                             | `.prettierrc`           |
| `npm test`     | 金样例 5/5                       | `tests/golden.spec.mjs` |
| Lighthouse CI  | perf ≥ 85 / a11y ≥ 95 / seo ≥ 90 | `.lighthouserc.json`    |
| axe-core       | a11y (WCAG AA)                   | `tests/axe.mjs`         |
| Playwright E2E | 4 视口 (320/375/768/1280)        | `tests/e2e.mjs`         |
| size-limit     | 体积预算 ≤ 280 KB gzip           | `.size-limit.json`      |
| link-check     | 站内 .md 引用                    | `tests/link-check.mjs`  |

---

## 🤝 贡献

请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 与 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)。

**添域步骤**（详见 [CONTRIBUTING.md](./CONTRIBUTING.md)）：

1. 在 `src/domain/figures/figures.<your-domain>.ts` 写 30+ 人
2. 在 `src/domain/items/items.<your-domain>.ts` 写 48 题
3. 在两个 `*.index.ts` 注册新域
4. 在 `src/pages/Path.tsx` 把对应卡片 `ready: true`
5. 在 `scripts/gen-portraits.mjs` 加占位肖像，再交设计师替换

**安全**：[SECURITY.md](./SECURITY.md) — 私密报告方式。

---

## 📜 许可

[PolyForm Noncommercial 1.0.0](./LICENSE) — 非商用自由使用，商用需另行授权。
Copyright © 2024-2026 badhope（镜心 · Jingxin · MindMirror）。

---

## 🙏 致

凡所问，凡所选，凡所行，皆汝之自由。镜心不立标准答案，
不评分，不存档，唯映射耳。

愿汝入镜而得己。
