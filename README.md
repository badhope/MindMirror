<!-- MindMirror - Professional Psychological Growth Platform -->

# 🪞 MindMirror

**See Yourself Clearly, Become Your Best Self**

[![Version](https://img.shields.io/badge/version-v3.0.0-8B5CF6?style=for-the-badge)](https://github.com/badhope/MindMirror)
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue?style=for-the-badge)](https://creativecommons.org/licenses/by-nc/4.0/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Build Status](https://img.shields.io/github/actions/workflow/status/badhope/MindMirror/deploy.yml?style=for-the-badge)](https://github.com/badhope/MindMirror/actions)
[![Last Commit](https://img.shields.io/github/last-commit/badhope/MindMirror/main?style=for-the-badge)](https://github.com/badhope/MindMirror/commits/main)

[🇨🇳 中文说明](README_zh.md) · [📖 Documentation](documents/) · [🚀 Quick Start](#-quick-start) · [🎯 Features](#-key-features) · [🛠️ Tech Stack](#️-tech-stack)

**Live Demo**: 👉 **[https://mindmirror.dpdns.org](https://mindmirror.dpdns.org)**

---

## 🎯 Key Features

### 🎮 43+ Professional Assessments

Explore various psychological dimensions with scientifically validated assessments:

| Category | Count | Examples |
|:--------:|:-----:|:---------|
| 🧠 **Personality** | 12+ | Big Five, MBTI, DISC, Dark Triad, Enneagram |
| 😌 **Mental Health** | 8+ | Anxiety (SAS), Depression (SDS), Stress (PSS), Burnout |
| ❤️ **Relationships** | 6+ | Attachment (ECR), Love Languages, Relationship Satisfaction |
| 💼 **Career** | 7+ | Career Anchors, VIA Strengths, Metacognition, PsyCap |
| 🧩 **Entertainment** | 10+ | One Piece, Naruto, Harry Potter, Genshin Impact |

### 🏋️ Training System 2.0

Like how **Keep** helps you shape your body, MindMirror helps you explore your inner self and improve psychological wellness.

```
Assessment → Recommendation → Training → Progress Tracking → Growth
    ↑                                                           ↓
    └────────────────── Closed-Loop Growth System ───────────────┘
```

#### 8 Growth Tracks × 41 Training Programs

| Track | Programs | Focus | Example |
|:-----:|:--------:|:------|:--------|
| 🧠 **Cognitive** | 10 | Big Five Calibration | "Perfectism Detox Training" |
| 😌 **Emotional** | 5 | Anxiety/Stress/Burnout | "Emotional Storm Calming" |
| ❤️ **Attachment** | 6 | 4 Attachment Types | "Self-Sufficiency Security" |
| 🎭 **Social** | 5 | DISC/Dark Triad | "People-Pleasing Boundaries" |
| 💼 **Career** | WIP | Procrastination/Habits | Coming Soon |
| 💎 **Values** | Planned | Value Clarification | Coming Soon |
| 🧘 **Mindfulness** | Planned | Present Awareness | Coming Soon |
| 🎮 **ACG Theme** | 8 | Immersive Role-Play | See Below ⬇️ |

### 🎨 ACG-Themed Training Library

| Series | Training | Theme |
|:-------|:---------|:------|
| 🏴‍☠️ **One Piece** | Second Gear · Willpower Training | Fight like the Straw Hats! |
| 🍃 **Naruto** | Chakra Control · Breath Focus | The ninja's meditation |
| 🧿 **Jujutsu Kaisen** | Domain Expansion · Gojo Mindset | "The one who stands alone" |
| ⭐ **JOJO** | Golden Spirit · Human Courage | Joestar bloodline! |
| 🗡️ **Attack on Titan** | Wings of Freedom · Courage | "Tataque! Tataque!" |
| 🌟 **Genshin** | Seven Elements · Teyvat Journey | Rest at the Archon statues |

### 🔌 Full-Stack Architecture

MindMirror now features a complete backend API for scalable deployment:

- **FastAPI Backend**: RESTful APIs for all features
- **SQLite Database**: Persistent data storage
- **7 Calculator Engines**: Assessment algorithms ported to Python
- **Frontend + Backend**: Full separation of concerns
- **Offline Fallback**: Local IndexedDB cache when backend unavailable

---

## 🚀 Quick Start

### 🌐 Online Version

👉 **Visit**: [https://mindmirror.dpdns.org](https://mindmirror.dpdns.org)

### 💻 Local Development

#### Option 1: Frontend Only (Simplest)

```bash
# 1. Clone the repository
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Visit http://localhost:5173
```

#### Option 2: Full Stack (Frontend + Backend)

```bash
# 1. Clone the repository
git clone https://github.com/badhope/MindMirror.git
cd MindMirror

# 2. Start with Docker Compose
docker-compose up -d

# 3. Open in browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# Backend Docs: http://localhost:8000/docs
```

#### Manual Setup (Frontend)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

#### Manual Setup (Backend)

```bash
# 1. Navigate to backend
cd backend

# 2. Create venv and install
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or .\venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start server
uvicorn main:app --reload --port 8000
```

---

## 🎮 How to Use

### Step 1: Choose Your Assessment

Navigate to the **Discover** page to browse available assessments by category:

- 🧠 Personality & Character
- 😌 Mental Health & Wellness
- ❤️ Relationships & Social
- 💼 Career & Professional
- 🎮 Entertainment & Fun

### Step 2: Complete the Assessment

1. Select an assessment you're interested in
2. Read the introduction and instructions
3. Answer all questions honestly
4. Submit your responses

### Step 3: View Your Results

- 📊 View detailed analysis and charts
- 🎯 Get personalized recommendations
- 📚 Explore related knowledge base
- 🔄 Compare with others (anonymized)

### Step 4: Start Your Growth Journey

1. 📋 Receive training recommendations based on your results
2. 🏋️ Choose training programs that interest you
3. 📈 Track your progress over time
4. 🎖️ Unlock achievements and badges

---

## 🛠️ Tech Stack

### Frontend

| Layer | Technology | Version |
|:-----:|:-----------|:-------:|
| ⚛️ **Framework** | React | 18.2 |
| 📘 **Language** | TypeScript | 5.2 |
| 💨 **Styling** | Tailwind CSS | 3.4 |
| ✨ **Animation** | Framer Motion | 11.0 |
| 📊 **Charts** | Recharts | 2.12 |
| 🛠️ **Build** | Vite | 5.4 |
| 📱 **PWA** | Vite PWA | 0.19 |
| 🧭 **Routing** | React Router | 6.22 |
| 📦 **State** | Zustand | 4.5 |

### Backend

| Layer | Technology | Version |
|:-----:|:-----------|:-------:|
| 🐍 **Framework** | FastAPI | 0.104 |
| 🗄️ **Database** | SQLAlchemy + SQLite | 2.0 |
| 📋 **Validation** | Pydantic | 2.5 |
| 🔐 **Security** | Passlib, python-jose | 1.7, 3.3 |

---

## 📁 Project Structure

```
MindMirror/
├── 📁 backend/           # FastAPI backend (Python)
│   ├── main.py          # FastAPI app entry
│   ├── requirements.txt # Dependencies
│   ├── app/
│   │   ├── core/       # Config, DB, security
│   │   ├── models/     # SQLAlchemy models
│   │   ├── schemas/    # Pydantic validation
│   │   ├── services/   # Business logic & calculators
│   │   └── api/v1/     # API routes
│   └── app/data/       # Assessment data (JSON)
├── 📁 configs/           # Configuration files
├── 📁 documents/         # Detailed documentation
├── 📁 public/            # Static assets
├── 📁 src/               # Frontend source
│   ├── 📁 app/          # v3.0 app structure
│   ├── 📁 api/          # API clients
│   ├── 📁 components/   # UI components
│   ├── 📁 store/        # Zustand state
│   └── 📁 utils/        # Utilities
├── 📄 docker-compose.yml
├── 📄 package.json
└── 📄 README.md
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: Submit issues with detailed descriptions
- 💡 **Suggest Features**: Share your ideas for new assessments or features
- 📝 **Improve Documentation**: Help us make docs clearer
- 🔧 **Submit Code**: Fix bugs or implement new features

### Development Workflow

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/MindMirror.git

# 3. Create feature branch
git checkout -b feature/amazing-feature

# 4. Make changes and test
npm run quality

# 5. Commit and push
git add .
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature

# 6. Open Pull Request
```

---

## 📄 License

This project is licensed under **CC BY-NC 4.0** (Creative Commons Attribution-NonCommercial 4.0)

**You are free to:**
- 📤 Share — copy and redistribute the material
- 🔄 Adapt — remix, transform, and build upon the material

**Under the following terms:**
- 🏷️ **Attribution** — You must give appropriate credit
- 🚫 **NonCommercial** — You may not use the material for commercial purposes

**For Commercial Use:**
Contact: 📧 **contact@guanxinjie.dev**

---

## ⭐ Show Your Support

If MindMirror helps you, please give us a ⭐!

[![Star History Chart](https://api.star-history.com/svg?repos=badhope/MindMirror&type=Timeline)](https://star-history.com/#badhope/MindMirror&Timeline)

---

## 📞 Contact & Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/badhope/MindMirror/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/badhope/MindMirror/discussions)
- 📧 **Email**: contact@guanxinjie.dev

---

**Made with ❤️ by the MindMirror Team**

🪞 *See Yourself Clearly, Become Your Best Self*
