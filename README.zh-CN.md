<div align="center">

# 🧠 MindMirror

**安静、科学、属于你自己的心理测评工具**

三个量表(性格 / 压力 / 焦虑),十几分钟一次。
不用注册、没广告、你的数据你做主。

[**🌐 在线试用**](https://mindmirror.app) · [**📖 用户指南**](USER_GUIDE.zh-CN.md) · [**English**](README.md)

</div>

---

## 👋 这是什么

MindMirror 是一组在心理学里被反复验证过的国际通用量表 —— 大五人格 (BFI)、PSS-10、GAD-7 —— 装进了一个简单、安静的应用里。

每次测评 10–15 分钟,完成后会给你一份多维度的解读(雷达图 + 通俗解释),结果会自动保存到你的私人"历史"里,可以看到自己这段时间的变化。

另外还有每日心情、成就系统、CBT 风格的训练计划生成器 —— 一个人日常自我观察需要的东西,基本都在这里了。

## 👥 适合谁

- **想了解自己的人** — 想看到自己的性格侧写、压力来源、焦虑触发点
- **心理咨询师 / 教练** — 想让来访者先做一个基线测评,带着报告来谈
- **公司 HR / 团队管理者** — 想做一次匿名的整体氛围摸底(默认 GDPR 友好)

## 🌟 为什么选 MindMirror

- **🔒 隐私第一** — 数据存在你自己的浏览器 / 你的服务器上,没有第三方
- **🧪 真量表** — 临床心理学的标准问卷,不是"性格小测试"
- **🌐 完整双语** — 中英文一键切换,新增语言只需要写两个翻译表
- **📦 双模式** — 在线版用 FastAPI + PostgreSQL;离线版只存 `localStorage`,可以部署到任何静态托管
- **🐳 一行启动** — `docker compose up` 就跑起来
- **🧩 插件系统** — 用 JSON 加载自定义测评
- **💯 MIT 协议** — 商用、自部署、改品牌都行

## 🚀 怎么开始

### 只想用用看?

直接打开 **[mindmirror.app](https://mindmirror.app)**,所有数据存在你浏览器的 `localStorage` 里 —— 关闭浏览器、换电脑都不会上传到任何地方。

### 想自己部署?

你需要 Docker,大概 5 分钟:

```bash
git clone https://github.com/badhope/MindMirror.git
cd MindMirror
docker compose up -d
```

打开 `http://localhost` 就用上了。详细说明见 [CONTRIBUTING.md](CONTRIBUTING.md)。如果要部署到自己的服务器(VPS、HTTPS、备份、监控),请看 [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)。

### 想要 GitHub 登录?

代码已经接好了,但 **OAuth 凭据没有打包进仓库**(会泄露)。想开,先去 <https://github.com/settings/developers> 注册一个 GitHub OAuth App,然后给后端配这几个环境变量:

```bash
GITHUB_CLIENT_ID=<你的 OAuth App ID>
GITHUB_CLIENT_SECRET=<你的 OAuth App Secret>
# 必须是 GitHub "Authorization callback URL" 字段里写的那个,一字不差
GITHUB_REDIRECT_URI=https://你的域名.example.com/api/v1/auth/oauth/github/callback
# SPA 部署地址,用来构造 /auth/callback 跳转
FRONTEND_URL=https://你的域名.example.com
# 关键:生产环境必须 unset 或 false。代码在 ENVIRONMENT=production 时
# 会硬禁用 dev shim,但你还是应该显式设成 false
MINDMIRROR_DEV_OAUTH=false
ENVIRONMENT=production
```

配好之后,"使用 GitHub 继续" 按钮就会把浏览器弹到 `github.com/login/oauth/authorize`,然后回到你的 `/auth/callback`。

> **这件事没人替你做。** 仓库不会自动取凭据,也没人会发邮件给你。
> 唯一可信来源是 GitHub OAuth App 控制台。如果你的前端、后端在不同
> 域名,记得 `CORS_ORIGIN` 要精确等于前端源,否则 OAuth 还没开始就
> 在 preflight 阶段失败。

### 想参与贡献?

Bug、翻译、UI 建议都欢迎。流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

如果你是临床心理学从业者想推荐新量表,**请先开一个 issue 讨论** —— 我们想先聊聊授权、施测常模、文化适配,再决定是否加入。

## 🧪 三个量表简介

### 大五人格 (BFI, 50 题)

OCEAN 五维 + 子维度,使用最广泛的人格模型。

| 维度                     | 含义                     |
| ------------------------ | ------------------------ |
| 开放性 Openness          | 想象力、好奇心、审美     |
| 尽责性 Conscientiousness | 条理性、责任感、自律     |
| 外向性 Extraversion      | 社交性、主动性、积极情绪 |
| 宜人性 Agreeableness     | 合作性、信任感、同理心   |
| 神经质 Neuroticism       | 情绪稳定性、焦虑倾向     |

### PSS-10 感知压力量表

10 题,衡量你"过去一个月里觉得事情压过来"的频率。低 / 中 / 高三档,附循证建议。

### GAD-7 广泛性焦虑量表

7 题,0–21 分,使用标准临床切点(轻 / 轻中 / 中重 / 重)。心理咨询师常用的初筛工具。

## 🛡️ 你的数据怎么用

| 模式                         | 数据存在哪                | 我们看得到吗          |
| ---------------------------- | ------------------------- | --------------------- |
| **在线 demo** (GitHub Pages) | 你浏览器的 `localStorage` | ❌ 看不到             |
| **自部署** (你的服务器)      | 你的 PostgreSQL           | ❌ 看不到             |
| **Cloud 版** (未来)          | 我们控制的服务器          | ❌ 看不到(同自部署栈) |

代码库里**没有任何**第三方追踪、广告、统计。详情见 [SECURITY.md](SECURITY.md)。

## 🛠️ 技术栈(给好奇的人)

| 层级   | 选型                                                          |
| ------ | ------------------------------------------------------------- |
| 前端   | React 18 · TypeScript 5 · Vite 6 · Tailwind 3 · Framer Motion |
| 后端   | Python 3.12 · FastAPI 0.115 · SQLAlchemy 2 · Pydantic v2      |
| 认证   | JWT (HS256) · bcrypt · IP 限流 20 次/分钟                     |
| 数据库 | PostgreSQL 15 (Docker) · SQLite (开发兜底)                    |
| 部署   | 静态站 → GitHub Pages;后端 → 任意容器                         |
| CI     | GitHub Actions: typecheck + lint + build + pytest             |

## 🔌 API 速查

所有接口前缀 `/api/v1`,交互式文档在 `/api/v1/docs`。`✅` 表示需 `Authorization: Bearer <jwt>`。

| 方法                                | 路径             | 鉴权 | 说明                 |
| ----------------------------------- | ---------------- | ---- | -------------------- |
| `GET`                               | `/health`        | —    | 健康探针             |
| `POST`                              | `/auth/register` | —    | 注册                 |
| `POST`                              | `/auth/login`    | —    | 登录 → JWT           |
| `POST`                              | `/auth/guest`    | —    | 游客模式             |
| `GET` / `PATCH`                     | `/auth/me`       | ✅   | 当前用户 / 修改资料  |
| `DELETE`                            | `/auth/account`  | ✅   | 删除账号(需密码确认) |
| `GET`                               | `/assessments/`  | —    | 列出所有测评         |
| `GET` / `POST`                      | `/results/`      | ✅   | 测评结果列表 / 提交  |
| `GET` / `POST` / `PATCH` / `DELETE` | `/mood/`         | ✅   | 心情记录             |
| `GET` / `POST` / `DELETE`           | `/achievements/` | ✅   | 成就系统             |
| `GET`                               | `/training/`     | ✅   | 训练计划             |

## 📁 项目结构

```
MindMirror/
├── src/                  # React + TypeScript 前端
│   ├── components/       # UI 组件(Sidebar, ErrorBoundary…)
│   ├── data/             # 内置测评题库
│   ├── hooks/
│   ├── i18n/             # en.ts / zh.ts 翻译表
│   ├── lib/              # apiClient, utils
│   ├── pages/            # 路由级页面
│   ├── services/         # 评分, 认证, 心情, 训练, 插件
│   ├── store/            # Zustand 全局状态
│   ├── types/
│   ├── App.tsx / main.tsx
├── backend/              # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── api/          # 路由处理
│   │   ├── core/         # 安全、日志、限流
│   │   ├── models/       # ORM 模型
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   └── main.py
│   ├── tests/            # pytest 套件
│   ├── .env.example
│   ├── init_db.py
│   ├── requirements.txt
│   └── run.py
├── public/               # 静态资源
├── .github/              # CI + Pages 部署
├── Dockerfile / docker-compose.yml
├── Makefile
└── README / CHANGELOG / CONTRIBUTING / SECURITY / LICENSE
```

## 🔒 安全

> 下面是"代码无法替你做"的事。**全部要自己处理**,漏一项迟早出事。

- **永远不要把密钥 commit 进去。** `.env`、真实数据库文件、`__pycache__/` 都在 `.gitignore` 里 —— 这是有原因的。一旦把 GitHub Personal Access Token、OAuth client secret、`SECRET_KEY`、数据库 URL 之类的粘进了 commit,**立刻轮换**。git history 是删不掉的,`git log -p` 就能抓到。
- **用 fine-grained PAT,不要用 classic。** Classic PAT(`ghp_…` 开头)会拿到你账号所有 scope。你只是为了推自己仓库的话,创建 token 时只勾 `Contents: Read and write` 一个权限、只授给这一个 repo。不要 `repo`、不要 `workflow`、不要 `admin:org`。
- **永远不要把真实 PAT 贴进 AI 助手的对话框。** 即使助手不会回显,对话记录也可能被日志、被索引、被真人读到。生成一个一次性、用完即弃、scope 最小的 token,用一次就 revoke。任何离开过你电脑的 token 都建议轮换。
- **`SECRET_KEY` 一次性生成,放进 secret manager。** 用 `openssl rand -base64 64`。丢了 = 所有 JWT 失效;被偷 = 攻击者可以给任意用户签发 session。
- **`MINDMIRROR_DEV_OAUTH=true` 只在本机用。** 它完全绕过 GitHub,你输什么 login 就接受什么。代码在 `ENVIRONMENT=production` 时会硬禁用,但你也得保证生产 `.env` 或容器 config 里别误开。
- **`CORS_ORIGIN` 必须精确等于前端源。** 后端在 `api.example.com`、前端在 `app.example.com` 的话,设 `CORS_ORIGIN=https://app.example.com` —— 不要通配符,不要列表,要原样。OAuth 失败时往往就是这个错,而且错误信息是"silently fail"。
- **HTTPS 在生产环境不是可选项。** GitHub OAuth 强制 redirect URI 用 HTTPS(只有 `localhost` 例外);`Authorization` 头里的 JWT 否则就是明文传输。前面放 Caddy / Traefik / nginx。
- **GitHub Pages 缓存很凶。** 你推了修复,Pages 还会发旧 bundle 几分钟。测试时 URL 后面加 `?v=2` 或者 `Ctrl+Shift+R` 强刷绕 CDN。
- **Dev shim 会在数据库里建 `*.example` 账号。** 这些账号永久存在;密码哈希是随机串,不能从 SPA 登录。别把 `dev_mindmirror.db` 之类带真实数据的 db 文件 `git push` 出去。
- **邮箱登录和 GitHub 登录可以同时开。** 不是二选一,用户用哪个都行,最终都进同一张 `users` 表。

---

- 生产部署**必须**设置强随机 `SECRET_KEY`:`openssl rand -base64 64`
- 不要把后端或 PostgreSQL 端口暴露公网
- 生产环境请把 nginx 放在 HTTPS 后面(Caddy / Traefik / Cloudflare)
- 怀疑 `SECRET_KEY` 泄露请立即轮换 —— 这会让所有现有会话失效
- 漏洞私下上报 → [SECURITY.md](SECURITY.md)

## 📄 协议与引用

本项目采用 [MIT 协议](LICENSE) © 2024–2026 badhope。

如果用在学术工作中,请引用底层量表([CITATION.cff](CITATION.cff)):

- **GAD-7**: Spitzer, Kroenke, Williams, Löwe (2006). _A brief measure for assessing generalized anxiety disorder._ [doi:10.1001/archinte.166.10.1092](https://doi.org/10.1001/archinte.166.10.1092)
- **PSS-10**: Cohen, Kamarck & Mermelstein (1983). _A global measure of perceived stress._ [doi:10.2307/2136404](https://doi.org/10.2307/2136404)
- **IPIP / 大五人格**: [ipip.ori.org](https://ipip.ori.org/)

## 🙏 致谢

- 测评方法论基于 [IPIP](https://ipip.ori.org/) (国际人格题库)
- 灵感来自 [MindGarden](https://www.mindgarden.com/) 和 [16Personalities](https://www.16personalities.com/)
- 用 ❤️ 和开源软件构建

---

<div align="center">

_如果 MindMirror 对你有帮助,我们很想听你的故事。_
_如果哪里坏了,请开一个 issue。_

</div>
