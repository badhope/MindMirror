---
name: 报 bug
about: 镜心 / 添薪 · 映照有误 / 跑不起来
title: "[bug] <一句话症状>"
labels: ["bug"]
assignees: []
---

> 提交前请先读 [`CONTRIBUTING.md`](../../CONTRIBUTING.md) 第九节（提交前自检）。
> **安全 / 隐私类问题请走 [`SECURITY.md`](../../SECURITY.md)，勿公开贴日志。**

## 一 · 现象（一句话）

> 哪一页 / 哪个交互出问题？

## 二 · 复现步骤

> 越具体越好；附最小可复现路径。

1. 打开 `https://<host>/<path>` / 本地 `npm run dev` / `npm run preview` / ……
2. 入镜（Prologue → Path）
3. 选域： `<east-literati / east-statesman / ...>`
4. 答 N 题： N = `__`
5. 出镜（Way → Reflection）
6. 触发 bug 的最后一步：

## 三 · 期望行为

> 你期望它做什么？

## 四 · 实际行为

> 它实际做了什么？哪里错位 / 报错 / 越界 / 越级 / 越屏？

## 五 · 截图 / 录屏

> 拖图或贴图；视频请贴 `https://` 链接。

- 屏 1：路径 / 状态：
- 屏 2：
- 屏 3（视口 320 / 375 / 768 / 1280 任一）：

## 六 · 环境

### 6.1 浏览器 / 系统

- 浏览器：`Chrome / Edge / Firefox / Safari / 其它` `__`（版本号）
- 系统：`macOS / Windows / Linux / iOS / Android` `__`
- 部署：[ ] GitHub Pages / [ ] 本地 `npm run preview` / [ ] 自建 / [ ] 其它

### 6.2 视口与主题

- 视口宽 × 高：`__ × __`
- 主题：[ ] 昼（默认） / [ ] 夜（待 C7 之后）
- 语言：[ ] zh / [ ] en
- 减动效偏好：[ ] 开 / [ ] 关

### 6.3 项目版本

- 提交 hash / tag：`git rev-parse HEAD` 输出：
- 浏览器 `localStorage` 键 `mindmirror-v1` 内容（脱敏后）：

## 七 · 控制台 / 网络错误

> DevTools → Console / Network 的关键错误；保留 stack。

```
（粘贴）
```

## 八 · 复现脚本（可选）

> 若有 Playwright / curl / 命令片段，贴此处。

```bash
# 例
E2E_BASE=http://127.0.0.1:4173/ node tests/e2e.mjs
```

## 九 · 关联

- 关联 Issue / PR：
- 关联任务（refactor-plan §C）：（如 C9 / C12 / C21）
- 关联人物条目 / 题目 id / 组件：

## 十 · 优先级自评

> 自行标注（维护者会复核）：

- [ ] 阻断：核心流程（Prologue / Path / Way / Reflection）走不通
- [ ] 严重：主镜 / 12 维雷达 / 同道错乱
- [ ] 中：单题文案 / 视觉破版 / 动效跳变
- [ ] 轻：typo / 字号 / 1px 偏移

## 十一 · 提案

> 是否有修法建议？可贴 patch / 想法；勿必修复。
