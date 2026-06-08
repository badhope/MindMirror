# MindMirror(心镜)

> 一个安静的自测小工具,整个跑在你浏览器里。
> 没账号、没埋点、没服务器。就是一张网页加一个 `localStorage`。

🌐 **在线试用:** <https://badhope.github.io/MindMirror/>
📖 **[用户指南](USER_GUIDE.zh-CN.md)** (English: [USER_GUIDE.md](USER_GUIDE.md))
🪟 **想自托管带后端的版本?** 去 [`server` 分支](https://github.com/badhope/mindmirror/tree/server)
看 FastAPI + PostgreSQL 的那个。两个分支并列存在、**不合并** —— 选一个适合你用法的。

---

## 一段话讲清楚这是什么

单页 React 应用。打开它,答完题,看到报告。整个东西就是一个
静态 bundle;你的答案**唯一**会存在的地方,是你自己浏览器的
`localStorage`。你关掉标签、换台设备、清掉站点数据,**全部
归零** —— 这是 feature,不是 bug。我们没有数据库。没有服务器。
没有那种写 4000 字"我们如何珍视你的隐私"、最后还是坦白在收
47 类埋点的页面。没什么可收集的。

开箱 7 个**正经做过信效度**的心理量表:

| 量表 | 测什么 | 题数 |
|---|---|---|
| **BFI** (大五 / OCEAN) | 现代心理研究用得最多的人格五因素 | 60 |
| **PSS-10** | 上个月里你被事情压住的频率 | 33 |
| **GAD-7** | 广泛性焦虑,带标准临床切点 | 28 |
| **SSRS** (肖水源 1986) | 主观 / 客观 / 利用度三维度社会支持 | 43 |
| **MBI-GS** (Maslach) | 职业倦怠:情绪耗竭 / 去人格化 / 成就感降低 | 40 |
| **SWLS** (Diener) | 生活满意度,带子主题分 | 40 |
| **CD-RISC-10** (Connor-Davidson) | 心理韧性,带子维度 | 40 |

长版本量表用的是**维度对齐的题库** + **行为锚定的扩展题**,
把那些"在抽象自评上很像、但实际生活不一样"的人区分开。
做完题你会拿到一份多轴报告(雷达图 + 通俗解释 + 行为锚定
原型),结果存进你的私人历史里,几周几个月后能看到自己在变。

量表之外,还有一个每日心情日志、CBT 风格的训练计划生成器、
成就系统。**没有一项是必用的** —— 你只想做个量表,其它都关掉就行。

## 这东西**不是**什么

边边角角说清楚比较重要:

- **不是临床诊断工具。** GAD-7 拿到 17 分,是筛查提示,不是
  诊断。哪个量表说的事让你担心,带着结果去找一个认识你的临床
  工作者。
- **不是研究工具。** 长版本量表没有按原始样本重新做信效度;
  它们存在的目的是让你看到自己更丰富的画像,不是让你发论文。
  原始作者和引用在 [CITATION.cff](CITATION.cff) —— 引用他们,
  不是我们。
- **不是同步服务。** 没云、没账号。换个浏览器,从零开始。这是
  隐私保证的代价。
- **不是付费产品。** 协议是 [PolyForm Noncommercial 1.0.0](LICENSE):
  个人、学术、非营利免费。把它包成付费咨询产品、卖给企业做员工
  筛查、收订阅费 —— 这些都需要单独签协议(在仓库里提 issue)。
- **不是 [16Personalities](https://www.16personalities.com/)、[MindGarden](https://www.mindgarden.com/)
  或任何具体测评厂商的克隆。** 我们跟他们都没关系。

## 怎么用

### 当一个普通用户

1. 打开 <https://badhope.github.io/MindMirror/>
2. 选一个量表,大部分 5-15 分钟。每题不限时,但页面会在你答得太
   快的时候提醒(因为"全都同意"那种 acquiescent responding 会毁掉
   结果)。
3. 看报告:数字分数 + 切点、雷达图、行为锚定原型,三部分。
4. **可选:** 注册一个本地账号(PBKDF2 20 万轮,完全在浏览器里,
   不发往任何地方)。这样可以跨量表保留历史,看自己几个月的变化。
   想清掉就 DevTools 里跑 `localStorage.clear()`。

也可以完全匿名用游客模式。本地账号只是为了把你自己的历史组织起来。

### 当一个想自己部署的人

不需要我们,build 出来就是纯静态文件。

```bash
git clone https://github.com/badhope/mindmirror.git
cd mindmirror
npm install
npm run build           # 部署在根路径
# 或者
npm run build:pages     # 部署在 /MindMirror/ 子路径(GitHub Pages)
```

`dist/` 目录就是完整应用。扔到任何能托管静态文件的地方。不需要写
`nginx.conf`、不需要设 `DATABASE_URL`、不需要 `docker compose up`
去盯着。页面加载、页面工作、页面不打电话回家。

CI workflow (`.github/workflows/deploy-pages.yml`) 会在每次 push 到
`main` 的时候自动发到 GitHub Pages。如果你 fork 了,把 workflow 里
的 `VITE_BASE_PATH` 改成你的仓库名,Pages 源对应改一下就行。

### 当一个临床工作者或研究者

量表题目和评分算法在 `src/data/` 和 `src/services/`。每个量表
是一个独立模块,从头读到尾不用学应用其它部分:

- `src/data/bfiData.ts`、`pss10Data.ts`、…、`resilienceData.ts` —
  原题库,含反向量标记
- `src/services/{量表名}Scoring.ts` — 每个量表的评分服务,有原始
  作者切点的都保留了
- `src/types/index.ts` — `UnifiedAssessmentResult` 类型,dashboard
  / history / share 都消费这个

整个代码库就是文档。没有 API 可以对接,但如果你想要某个人的历史
CSV,`Personal Data Center` 页面有一个按钮,跑在客户端。

## 怎么扩展

三层,按从轻到重排。

### 1. 加翻译

`src/i18n/en.ts` 和 `src/i18n/zh.ts` 是平铺的 key-value 表。找
个缺失的 key,填上翻译,跑 `npm run typecheck`。不需要改其它文件,
应用运行时读它。

### 2. 加新量表("长路")

大约一天的工作,大部分时间在敲题目。看 `src/data/resilienceData.ts`
当模板 —— 这是仓库里结构最干净的一份。需要做的事:

1. 新建 `src/data/<你的量表>Data.ts`,导出题库、维度元数据、
   严重程度分档、原型定义。反向题在题目层标记,不要在评分时打补丁。
2. 新建 `src/services/<你的量表>Scoring.ts`,导出一个函数,接收
   原始答案,返回 `UnifiedAssessmentResult`。
3. 在 `src/App.tsx` 加一个新页面路由,在
   `src/components/AssessmentList.tsx` 加一个入口。
4. i18n 字符串(中英)给出量表名、描述、维度标签。
5. `tests/unit/` 至少加一个单测,覆盖反向、分数范围、级别边界。

如果你是移植一份已发表的量表,**先开 issue** 带上量表的引用和你对
授权的理解。我们不收自己没有权利的量表。

### 3. 加插件("短路")

插件系统在 `src/services/plugin/`。插件是一个普通的 TypeScript 对象,
符合 `PluginManifest` 形态(见 `src/types/dataAbstraction.ts`),
以 JS 文件形式由用户在运行时加载。这是给不想 fork 仓库又想加自
己量表的重度用户的。功能有,易用性一般 —— 你大概率得读源码。
插件文档(TODO,还没写)会和系统放在一起。

## 架构,一张图

```
                       ┌─────────────────────────────────────┐
                       │  React 18 + TypeScript + Vite 6     │
                       │  (一个 bundle,无 SSR,无 hydration)  │
                       └────────────────┬────────────────────┘
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            │                           │                           │
   ┌────────▼─────────┐       ┌─────────▼─────────┐       ┌─────────▼─────────┐
   │   量表模块       │       │  心情 / 训练 / 成就 │       │     插件          │
   │  data + scoring  │       │                   │       │ (运行时加载)       │
   └────────┬─────────┘       └─────────┬─────────┘       └─────────┬─────────┘
            │                           │                           │
            └───────────────────────────┼───────────────────────────┘
                                        │
                            ┌───────────▼───────────┐
                            │  localStorage         │
                            │  (而且只有这个)        │
                            └───────────────────────┘
```

没有箭头指向外面。这就是重点。

## 跑测试

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run format:check # Prettier
npm run build        # Vite build
for f in tests/unit/*.mjs; do node --import tsx "$f"; done
```

`tests/unit/` 里的 887 个断言是纯 Node 脚本,直接 import 应用用的同
一份评分模块。不需要浏览器,不需要数据库。重构要是把哪个量表的
评分改崩了,10 秒之内你就知道。

## 协议 & 联系方式

PolyForm Noncommercial 1.0.0 —— 见 [LICENSE](LICENSE)。商用需
单独签协议。

Bug、翻译、UI 建议:提 issue。
安全:见 [SECURITY.md](SECURITY.md),先走私下通道再公开披露。

## 致谢

量表不是我们做的。大五的题目来自 IPIP-NEO 项目([Oliver P. John &
Sanjay Srivastava](https://ipip.ori.org/));PSS-10 是
[Sheldon Cohen 等 (1983)](https://doi.org/10.2307/2136404);
GAD-7 是 [Spitzer, Kroenke, Williams & Löwe (2006)](https://doi.org/10.1001/archinte.166.10.1092);
SSRS 是 [肖水源 (1986)](https://doi.org/10.1002/da.10113);
MBI-GS 是 [Schaufeli, Leiter, Maslach & Jackson (1996)](https://doi.org/10.1111/j.2044-8325.1996.tb00625.x);
SWLS 是 [Diener, Emmons, Larsen & Griffin (1985)](https://doi.org/10.1207/s15327752jpa4901_13);
CD-RISC-10 是 [Connor & Davidson (2003)](https://doi.org/10.1002/da.10113)。
bug 是我们自己的。
