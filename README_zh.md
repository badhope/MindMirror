<!-- MindMirror - 专业心理成长平台 -->

# 🪞 心镜 MindMirror

**照见自己，成为更好的自己。**

[![版本](https://img.shields.io/badge/version-v3.0.0-8B5CF6?style=for-the-badge)](https://github.com/badhope/MindMirror)
[![许可](https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue?style=for-the-badge)](https://creativecommons.org/licenses/by-nc/4.0/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![构建状态](https://img.shields.io/github/actions/workflow/status/badhope/MindMirror/deploy.yml?style=for-the-badge)](https://github.com/badhope/MindMirror/actions)

[🇺🇸 English](README.md) · [📖 文档](documents/) · [🚀 快速开始](#-快速开始) · [🎯 功能特性](#-核心功能) · [🛠️ 技术栈](#️-技术栈)

**在线演示**: 👉 **[https://mindmirror.dpdns.org](https://mindmirror.dpdns.org)**

---

## 🎯 核心功能

### 🎮 43+ 专业测评

通过科学验证的测评探索各种心理维度：

| 分类 | 数量 | 举例 |
|:----:|:----:|:------|
| 🧠 **人格** | 12+ | 大五人格、MBTI、DISC、黑暗三角、九型人格 |
| 😌 **心理健康** | 8+ | 焦虑量表(SAS)、抑郁量表(SDS)、压力量表(PSS)、职业倦怠 |
| ❤️ **人际关系** | 6+ | 依恋风格、爱的语言、关系满意度 |
| 💼 **职业发展** | 7+ | 职业锚、VIA品格优势、元认知、心理资本 |
| 🧩 **趣味娱乐** | 10+ | 海贼王、火影忍者、哈利波特、原神 |

### 🏋️ 训练系统 2.0

就像 **Keep** 帮你塑造身体一样，心镜帮你探索内心世界，提升心理健康。

```
测评 → 推荐 → 训练 → 进度追踪 → 成长
    ↑                                          ↓
    └────────────── 闭环成长系统 ──────────────┘
```

#### 8 个成长方向 × 41 个训练项目

| 方向 | 项目 | 重点 | 例子 |
|:----:|:----:|:-----|:------|
| 🧠 **认知** | 10 | 大五人格校准 | "完美主义解毒训练" |
| 😌 **情绪** | 5 | 焦虑/压力/倦怠 | "情绪风暴平复" |
| ❤️ **依恋** | 6 | 4种依恋类型 | "自我充足安全感" |
| 🎭 **社交** | 5 | DISC/黑暗三角 | "取悦症边界建立" |
| 💼 **职业** | WIP | 拖延/习惯 | 即将上线 |
| 💎 **价值观** | 规划中 | 价值澄清 | 即将上线 |
| 🧘 **正念** | 规划中 | 当下觉察 | 即将上线 |
| 🎮 **ACG主题** | 8 | 沉浸式角色扮演 | 查看下方 ⬇️ |

### 🎨 ACG 主题训练库

| 系列 | 训练 | 主题 |
|:----|:------|:------|
| 🏴‍☠️ **海贼王** | 二档 · 意志力训练 | 像草帽海贼团一样战斗！ |
| 🍃 **火影忍者** | 查克拉控制 · 呼吸专注 | 忍者的冥想 |
| 🧿 **咒术回战** | 领域展开 · 五条悟心态 | "立于万人之上的人" |
| ⭐ **JOJO** | 黄金精神 · 人类勇气 | Joestar 家族血脉！ |
| 🗡️ **进击的巨人** | 自由之翼 · 勇气 | "Tataque! Tataque!" |
| 🌟 **原神** | 七元素 · 提瓦特之旅 | 在七天神像旁休息 |

### 🔌 全栈架构

心镜现在拥有完整的后端 API，支持可扩展的部署：

- **FastAPI 后端**: 所有功能的 RESTful API
- **SQLite 数据库**: 持久化数据存储
- **7 个计算器引擎**: 移植到 Python 的测评算法
- **前后端分离**: 完整的关注点分离
- **离线降级**: 后端不可用时使用 IndexedDB 本地缓存

---

## 🚀 快速开始

### 🌐 在线版本

👉 **访问**: [https://mindmirror.dpdns.org](https://mindmirror.dpdns.org)

### 💻 本地开发

#### 选项 1: 仅前端（最简单）

```bash
# 1. 克隆仓库
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器中打开
# 访问 http://localhost:5173
```

#### 选项 2: 全栈（前端 + 后端）

```bash
# 1. 克隆仓库
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

# 2. 使用 Docker Compose 启动
docker-compose up -d

# 3. 在浏览器中打开
# 前端: http://localhost:5173
# 后端 API: http://localhost:8000
# 后端文档: http://localhost:8000/docs
```

#### 手动设置（前端）

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 生产构建
npm run build
```

#### 手动设置（后端）

```bash
# 1. 进入后端目录
cd backend

# 2. 创建虚拟环境并安装
python -m venv venv
source venv/bin/activate  # Linux/macOS
# 或 .\venv\Scripts\activate  # Windows

# 3. 安装依赖
pip install -r requirements.txt

# 4. 启动服务器
uvicorn main:app --reload --port 8000
```

---

## 🎮 使用指南

### 步骤 1: 选择您的测评

导航到 **发现** 页面，按分类浏览可用的测评：

- 🧠 人格与性格
- 😌 心理健康与保健
- ❤️ 人际关系与社交
- 💼 职业与专业发展
- 🎮 娱乐与趣味

### 步骤 2: 完成测评

1. 选择您感兴趣的测评
2. 阅读介绍和说明
3. 诚实回答所有问题
4. 提交您的答案

### 步骤 3: 查看结果

- 📊 查看详细分析和图表
- 🎯 获取个性化建议
- 📚 探索相关知识库
- 🔄 与他人比较（匿名）

### 步骤 4: 开始成长之旅

1. 📋 根据结果接收训练推荐
2. 🏋️ 选择您感兴趣的训练项目
3. 📈 随着时间追踪进度
4. 🎖️ 解锁成就和徽章

---

## 🛠️ 技术栈

### 前端

| 层级 | 技术 | 版本 |
|:---:|:-------|:-----:|
| ⚛️ **框架** | React | 18.2 |
| 📘 **语言** | TypeScript | 5.2 |
| 💨 **样式** | Tailwind CSS | 3.4 |
| ✨ **动画** | Framer Motion | 11.0 |
| 📊 **图表** | Recharts | 2.12 |
| 🛠️ **构建** | Vite | 5.4 |
| 📱 **PWA** | Vite PWA | 0.19 |
| 🧭 **路由** | React Router | 6.22 |
| 📦 **状态** | Zustand | 4.5 |

### 后端

| 层级 | 技术 | 版本 |
|:---:|:-------|:-----:|
| 🐍 **框架** | FastAPI | 0.104 |
| 🗄️ **数据库** | SQLAlchemy + SQLite | 2.0 |
| 📋 **验证** | Pydantic | 2.5 |
| 🔐 **安全** | Passlib, python-jose | 1.7, 3.3 |

---

## 📁 项目结构

```
MindMirror/
├── 📁 backend/           # FastAPI 后端 (Python)
│   ├── main.py          # FastAPI 应用入口
│   ├── requirements.txt # 依赖
│   ├── app/
│   │   ├── core/       # 配置、数据库、安全
│   │   ├── models/     # SQLAlchemy 模型
│   │   ├── schemas/    # Pydantic 验证
│   │   ├── services/   # 业务逻辑和计算器
│   │   └── api/v1/     # API 路由
│   └── app/data/       # 测评数据 (JSON)
├── 📁 configs/           # 配置文件
├── 📁 documents/         # 详细文档
├── 📁 public/            # 静态资源
├── 📁 src/               # 前端源码
│   ├── 📁 app/          # v3.0 应用结构
│   ├── 📁 api/          # API 客户端
│   ├── 📁 components/   # UI 组件
│   ├── 📁 store/        # Zustand 状态
│   └── 📁 utils/        # 工具函数
├── 📄 docker-compose.yml
├── 📄 package.json
└── 📄 README_zh.md
```

---

## 🤝 贡献代码

欢迎贡献！以下是帮助方式：

### 贡献方式

- 🐛 **报告错误**: 提交带有详细描述的 issue
- 💡 **建议功能**: 分享新测评或功能的想法
- 📝 **改进文档**: 帮助我们使文档更清晰
- 🔧 **提交代码**: 修复错误或实现新功能

### 开发流程

```bash
# 1. Fork 仓库
# 2. 克隆您的 fork
git clone https://github.com/YOUR_USERNAME/MindMirror.git

# 3. 创建功能分支
git checkout -b feature/amazing-feature

# 4. 进行更改并测试
npm run quality

# 5. 提交和推送
git add .
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature

# 6. 打开 Pull Request
```

---

## 📄 许可协议

本项目采用 **CC BY-NC 4.0**（Creative Commons 署名-非商业性使用 4.0）许可

**您可以自由：**
- 📤 分享 — 复制和重新分发材料
- 🔄 修改 — 重新混合、转换和构建材料

**须遵守以下条款：**
- 🏷️ **署名** — 必须注明原作者
- 🚫 **非商业** — 不得将材料用于商业目的

**商业使用：**
联系: 📧 **contact@guanxinjie.dev**

---

## ⭐ 支持我们

如果心镜对您有帮助，请给我们 ⭐！

[![Star History Chart](https://api.star-history.com/svg?repos=badhope/MindMirror&type=Timeline)](https://star-history.com/#badhope/MindMirror&Timeline)

---

## 📞 联系与支持

- 🐛 **错误报告**: [GitHub Issues](https://github.com/badhope/MindMirror/issues)
- 💡 **功能请求**: [GitHub Discussions](https://github.com/badhope/MindMirror/discussions)
- 📧 **邮件**: contact@guanxinjie.dev

---

**心镜团队 ❤️ 制作**

🪞 *照见自己，成为更好的自己。*
