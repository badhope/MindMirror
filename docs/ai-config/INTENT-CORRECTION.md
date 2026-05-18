# Intent Understanding & Speech Correction

> **Speech-to-Intent Mapping for AI Assistants**
> 
> This file helps AI understand user's true intent when they make speech errors.

---

## 🎯 Core Principles

### 1. Professional Content Assumption
```
The user will not say unprofessional content unrelated to development.
If you hear a "strange" word, assume it's a speech error rather than the true intent.
```

### 2. Context Association
```
Infer true intent based on conversation history.
Example: "牧童" during architecture discussion → likely means "modular"
```

### 3. Proactive Confirmation
```
When uncertain, confirm in a suggestive way rather than asking directly.
"You mentioned '牧童架构', do you mean 'modular architecture'?"
```

---

## 📋 Common Speech Error Mapping

| Speech Error | True Intent | Context Clue |
|--------------|-------------|--------------|
| 牧童 (mùtóng) | Modular (模块化) | Architecture discussion, similar pronunciation |
| 木筒 (mùtǒng) | Module (模块) | Development context, similar pronunciation |
| 卖个 (màige) | MCP | Tool discussion, similar pronunciation |
| 屁眼 (pìyǎn) | API | Interface discussion, similar pronunciation |
| 提子 (tízǐ) | Prompt (提示词) | AI discussion, similar pronunciation |
| 猪手 (zhūshǒu) | Assistant (助手) | Tool discussion, similar pronunciation |
| 鸡手 (jīshǒu) | Skill/Technique (技术/技能) | Development context, similar pronunciation |
| 码农 (mǎnóng) | Module/Function (模块/功能) | Developer slang, similar pronunciation |
| 技能 (jìnéng) | Skill | May be true intent, confirm context |

---

## 🔍 Intent Inference Process

```
User Input (may contain speech errors)
    ↓
[Step 1] Detect Anomalous Words
    - Does it contain common speech errors?
    - Does it fit the current discussion topic?
    ↓
[Step 2] Context Analysis
    - What is the conversation history topic?
    - What was the user focused on before?
    ↓
[Step 3] Intent Inference
    - Infer true intent based on context
    - Generate correction suggestion
    ↓
[Step 4] Confirm or Execute
    - High confidence: Execute directly with correction
    - Medium confidence: Suggestive confirmation
    - Low confidence: Direct question
```

---

## 📊 Confidence Levels

### High Confidence (Execute Directly)
- Similar pronunciation + highly relevant topic + consistent history
- Example: "牧童架构" during architecture discussion → Confidently interpret as "modular architecture"

### Medium Confidence (Suggestive Confirmation)
- Similar pronunciation + relevant topic but uncertain
- Example: "卖个工具" during tool discussion → "Do you mean MCP tools?"

### Low Confidence (Direct Question)
- Cannot infer or completely unrelated
- Example: Suddenly say "apple" with no context → "What do you mean by apple?"

---

## 💬 Correction Templates

### High Confidence
```
Understood you mean [corrected content], proceeding accordingly.
```

### Medium Confidence
```
You mentioned "[speech error]", do you mean "[corrected content]"?
If yes, I will [action].
```

### Learning New Patterns
```
Record new speech patterns to this mapping table.
```

---

## 📝 Real Examples

### Example 1: Architecture Discussion
```
User: "How to design this 牧童 architecture?"

Analysis:
- Current topic: Architecture design
- Speech error: 牧童 (mùtóng)
- Mapping: 牧童 → Modular (模块化)
- Confidence: High

Response:
"Understood you mean modular architecture. For multi-scenario development, 
suggest plugin-based design with core framework + scenario plugins..."
```

### Example 2: Tool Discussion
```
User: "How to call that 卖个 tool?"

Analysis:
- Current topic: Tool usage
- Speech error: 卖个 (màige)
- Mapping: 卖个 → MCP
- Confidence: High

Response:
"You mean MCP tools, right? I can help you clone the needed MCP server 
from Mcp-Market repository..."
```

### Example 3: API Discussion
```
User: "Need to integrate 屁眼 for this project"

Analysis:
- Current topic: Third-party integration
- Speech error: 屁眼 (pìyǎn)
- Mapping: 屁眼 → API
- Confidence: High

Response:
"You mean API integration, right? I can search API-Market for suitable 
APIs for your project..."
```

---

## 🔄 Integration with Memory System

```
After each successful correction:
1. Record to user profile in memory system
2. Update user's common speech patterns
3. Prioritize learned patterns in future conversations
```

---

## 📝 User Profile Template

Save this profile to a JSON file (e.g., `user-profile.json` or `memory/user-profile.json`):

```json
{
  "user": "badhope",
  "common_speech_patterns": [
    {"error": "牧童", "intent": "modular", "frequency": 5},
    {"error": "卖个", "intent": "MCP", "frequency": 3},
    {"error": "屁眼", "intent": "API", "frequency": 2}
  ],
  "preferred_language": "zh",
  "technical_background": ["software_development", "AI_application"],
  "last_updated": "2026-05-18"
}
```

**Storage Location**: 
- If you have file system access: Save to `./user-profile.json` or `./memory/user-profile.json`
- If you don't have file system access: Keep in your context window and reference at the start of each session

---

## 🔄 Update Mechanism

- **Auto-learning**: Record after each successful correction
- **Regular review**: Organize new speech patterns weekly
- **User feedback**: Update when user corrects AI's understanding

---

*Apply these rules to understand user's true intent and improve interaction quality.*
