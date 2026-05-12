# 🧠 MindMirror × ThinkCheck — 水晶之心

> 为心理测评智能体 [MindMirror](https://github.com/badhope/MindMirror) 装上自我审视的“逻辑之眼”。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![ThinkCheck](https://img.shields.io/badge/ThinkCheck-3.0-orange.svg)](https://github.com/luoxuejian000/-thinkcheck-lib-)
[![Forked from MindMirror](https://img.shields.io/badge/forked%20from-badhope%2FMindMirror-green.svg)](https://github.com/badhope/MindMirror)

本项目是 [MindMirror](https://github.com/badhope/MindMirror) 的增强分支。它在保留原项目所有功能的基础上，集成了自研的 **ThinkCheck 3.0 推理评估引擎**，为心理测评报告提供 **U/D/A/H 四维诊断**。

**它的独特之处在于**：在生成心理测评报告时，可自动调用ThinkCheck进行“逻辑体检”，精准定位文本内部的逻辑矛盾、概念漂移等问题，并给出通俗的优化建议。这使得测评报告不再只是数据呈现，更是一份经过逻辑质量验证的专业文档。

---

## ✨ 与官方版本的核心区别

| 能力维度 | 官方 MindMirror | 🧠 本仓库 |
| :--- | :--- | :--- |
| **心理测评** | ✅ 支持 | ✅ 支持 |
| **逻辑健康度评估** | ❌ 不支持 | ✅ 提供 U/D/A/H 四维诊断报告 |
| **内容逻辑自检** | ❌ 不支持 | ✅ 自动发现并标注逻辑矛盾 |
| **优化建议生成** | ❌ 不支持 | ✅ 根据评估结果自动生成改进建议 |

---

## 🚀 快速体验

1.  **克隆仓库**
    ```bash
    git clone https://github.com/luoxuejian000/MindMirror.git
    cd MindMirror
    ```

2.  **安装依赖**
    ```bash
    npm install
    pip install sentence-transformers scikit-learn numpy
    ```

3.  **启动应用**
    ```bash
    npm run dev
    ```

4.  **完成测评**：进行任意心理测评，报告末尾会自动显示「报告逻辑健康度评估」面板。

---

## 🔗 相关项目

| 项目 | 说明 | 链接 |
| :--- | :--- | :--- |
| ThinkCheck 主仓库 | 包含 1.0 ~ 4.0 完整演进史 | [查看](https://github.com/luoxuejian000/-thinkcheck-lib-) |
| ThinkCheck Lite | 轻量版 AI 矛盾检测工具 | [查看](https://github.com/luoxuejian000/thinkcheck-lite) |
| 水晶之心 (Hermes集成) | Hermes Agent 增强版 | [查看](https://github.com/luoxuejian000/hermes-agent) |
| ThinkCheck 3.0 SDK | 通用谐振评估 SDK | [查看](https://github.com/luoxuejian000/-thinkcheck-lib-/tree/3.0-harmony-sdk) |

---

## 📄 开源许可

本项目遵循 [MIT License](LICENSE)。
核心心理测评能力由 [MindMirror](https://github.com/badhope/MindMirror) 驱动。
集成的评估引擎为独立自研的 [ThinkCheck 产品家族](https://github.com/luoxuejian000/-thinkcheck-lib-)。
```
