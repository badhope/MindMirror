<div align="center">

# 🧠 MindMirror

**你在看的是 `main` 分支 —— 静态版。** 这是一个纯前端 React 应用,
所有回答、心情、结果都只存在你自己的浏览器 `localStorage` 里,
没有后端、没有账号、没有服务器。打开页面做完就走,数据是你的。

如果你想要多人自托管版本(FastAPI + Postgres、OAuth、可以挂在
反向代理后面),请切到 `server` 分支。两个分支共用量表内容,
**不会合并** —— 选一个最符合你用法的。

[**🌐 在线试用**](https://badhope.github.io/MindMirror/) · [**📖 用户指南**](USER_GUIDE.zh-CN.md) · [**English**](README.md)

</div>

---

> **协议:** PolyForm Noncommercial 1.0.0。个人、学术、非营利使用免费。
> 如果你要做付费咨询、企业内筛、托管 SaaS 等任何带营收的事情,
> 需要单独签协议。详见 [LICENSE](LICENSE)。

## 👋 这是什么

七个国际通用量表 —— 大五人格 (BFI)、PSS-10 压力、GAD-7 焦虑、
肖水源 SSRS 社会支持、MBI-GS 职业倦怠、Diener SWLS 生活满意度、
Connor-Davidson CD-RISC-10 心理韧性 —— 装在一个简单、安静的应用里。

每个量表 5-15 分钟,完成后会给你一份多维度的解读(雷达图 + 通俗解释 + 行为档案原型),
结果会自动保存到你的私人"历史"里,可以看到自己这段时间的变化。

另外还有每日心情、成就系统、CBT 风格的训练计划生成器。

## 🚀 怎么开始

```bash
git clone https://github.com/badhope/mindmirror.git
cd mindmirror
npm install
npm run dev
```

打开 <http://localhost:5173/> 就行。**没有 Docker、没有 `.env`、没有 Postgres**。
数据只在你浏览器的 `localStorage` 里。

## 📦 部署

最省事是 GitHub Pages:推 `main` 分支,`deploy-pages` workflow 会
自动构建静态 bundle 并发布到 <https://badhope.github.io/MindMirror/>。

任何静态托管都行(Netlify、Cloudflare Pages、S3 + CloudFront、
你自己的 nginx)。子路径部署用 `npm run build:pages`,根路径用 `npm run build`。

## 🛡️ 你的数据怎么用

| 模式                          | 数据存在哪                | 我们看得到吗 |
| ----------------------------- | ------------------------- | ------------ |
| **GitHub Pages 在线版**       | 你浏览器的 `localStorage` | 看不到       |
| **自托管**(`server` 分支)     | 你的 PostgreSQL           | 看不到       |

代码里**没有任何**第三方追踪、广告、统计。运行时**没有任何**对外网络请求 —— 它就是一个静态 bundle。
要看具体威胁模型,见 [SECURITY.md](SECURITY.md)。

## ⚠️ 这个分支**不包含**什么

`main` 分支故意**不**带:

- FastAPI 后端(在 `server` 分支)
- OAuth、邮箱多用户认证、连服务器版的游客模式(本地游客模式保留,因为就是一条 localStorage 记录)
- Docker / docker-compose / nginx 配置
- 数据库

需要这些的话,切到 `server` 分支。

## 🛠️ 技术栈

| 层级   | 选型                                              |
| ------ | ------------------------------------------------- |
| 前端   | React 18 · TypeScript 5 · Vite 6 · Tailwind 3     |
| 存储   | `window.localStorage`(不依赖 IndexedDB / cookies) |
| 认证   | 无(单设备、本地)                                 |
| CI     | GitHub Actions: typecheck + lint + build + 单测   |

## 📁 项目结构

```
mindmirror/
├── src/                  # React + TypeScript 前端
│   ├── components/       # UI 组件(Sidebar, ErrorBoundary…)
│   ├── data/             # 内置测评题库
│   ├── hooks/
│   ├── i18n/             # en.ts / zh.ts 翻译表
│   ├── lib/              # 会话存储、工具
│   ├── pages/            # 路由级页面
│   ├── services/         # 评分、本地认证、心情、训练、插件
│   ├── store/            # Zustand 全局状态
│   ├── types/
│   ├── App.tsx / main.tsx
├── public/               # 静态资源
├── .github/              # CI + Pages 部署
├── scripts/              # 构建辅助
└── README / CHANGELOG / CONTRIBUTING / SECURITY / LICENSE
```

## 🧪 七个量表简介

### 大五人格 (BFI, 60 题)

OCEAN 五维 + 子维度,使用最广泛的人格模型。

| 维度                       | 含义                       |
| -------------------------- | -------------------------- |
| 开放性 Openness            | 想象力、好奇心、审美       |
| 尽责性 Conscientiousness   | 条理性、责任感、自律       |
| 外向性 Extraversion        | 社交性、主动性、积极情绪   |
| 宜人性 Agreeableness       | 合作性、信任感、同理心     |
| 神经质 Neuroticism         | 情绪稳定性、焦虑倾向       |

### PSS-10 感知压力量表

10 题,衡量你"过去一个月里觉得事情压过来"的频率。低 / 中 / 高三档,附循证建议。

### GAD-7 广泛性焦虑量表

7 题,0–21 分,使用标准临床切点。心理咨询师常用的初筛工具。

### SSRS 社会支持评定量表 (43 题)

肖水源 1986 编制的《社会支持评定量表》,10 题核心 + 30 题题库 + 3 道行为情景分歧题。完整范围 29-180 分。

### MBI-GS 职业倦怠量表 (40 题)

Maslach & Leiter 通用版,15 题核心 + 22 题题库 + 3 道行为分歧题。4 种倦怠原型。

### SWLS 生活满意度量表 (40 题)

Diener 1985 编制,5 题核心 + 33 题题库 + 2 道行为分歧题。

### CD-RISC-10 心理韧性量表 (40 题)

Connor & Davidson 2003 编制,10 题核心 + 27 题题库 + 3 道行为分歧题。

## 🤝 参与贡献

Bug、翻译、UI 建议都欢迎。流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

如果你是临床心理学从业者想推荐新量表,**请先开一个 issue 讨论** —— 我们想先聊聊授权、施测常模、文化适配,再决定是否加入。

## 📄 协议与引用

本项目采用 [PolyForm Noncommercial 1.0.0](LICENSE) © 2024–2026 badhope。
商用前请先联系作者。

如果用在学术工作中,请引用底层量表([CITATION.cff](CITATION.cff)):

- **GAD-7**: Spitzer, Kroenke, Williams, Löwe (2006). _A brief measure for assessing generalized anxiety disorder._ [doi:10.1001/archinte.166.10.1092](https://doi.org/10.1001/archinte.166.10.1092)
- **PSS-10**: Cohen, Kamarck & Mermelstein (1983). _A global measure of perceived stress._ [doi:10.2307/2136404](https://doi.org/10.2307/2136404)
- **IPIP / 大五人格**: [ipip.ori.org](https://ipip.ori.org/)

## 🙏 致谢

- 测评方法论基于 [IPIP](https://ipip.ori.org/)(国际人格题库)
- 灵感来自 [MindGarden](https://www.mindgarden.com/) 和 [16Personalities](https://www.16personalities.com/)
- 用 ❤️ 和开源软件构建

---

<div align="center">

_如果 MindMirror 对你有帮助,我们很想听你的故事。_
_如果哪里坏了,请开一个 issue。_

</div>
