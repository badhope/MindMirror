# MindMirror - Professional Psychological Assessment Platform

<div align="center">

![MindMirror](https://img.shields.io/badge/MindMirror-Psychological%20Assessment-4F46E5?style=for-the-badge&logo=psychology)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-19A974?style=flat-square&logo=license)

**An open-source professional psychological assessment platform featuring comprehensive personality tests, cognitive evaluations, and mental health tracking.**

[Features](#features) • [Getting Started](#getting-started) • [Project Structure](#project-structure) • [Tech Stack](#tech-stack) • [Contributing](#contributing) • [License](#license)

</div>

---

## ✨ Features

### 🧠 Comprehensive Assessment Tools

- **Big Five Personality Test (BFF)**
  - 60 scientifically validated questions
  - Five-dimension analysis: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
  - Detailed trait interpretations with personalized recommendations
  - Career suggestions based on personality profile

- **Perceived Stress Scale (PSS)**
  - 14-item validated stress assessment
  - Multi-dimensional analysis: physical, emotional, cognitive signs
  - Personalized coping strategies
  - Relaxation techniques and healthy habits recommendations

### 📊 Detailed Analysis & Reporting

- **Personality Analysis**
  - Comprehensive trait scoring with T-score standardization
  - Personality type classification
  - Strengths and blind spots identification
  - Career recommendation engine
  - Personal growth suggestions

- **Stress Management**
  - Real-time stress level evaluation
  - Stage identification (alarm, resistance, exhaustion)
  - Performance curve analysis
  - Professional resources for high-stress individuals

### 🎨 Beautiful & User-Friendly Interface

- Modern, responsive design optimized for all devices
- Smooth animations and transitions
- Intuitive questionnaire flow
- Clear visualization of results
- Mobile-first approach

### 🔒 Privacy & Security

- All assessments are anonymous
- No data collection or tracking
- Local storage for history
- Completely client-side processing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/badhope/badhope.git
cd badhope

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

```bash
# Run type checking
npm run check

# Run linter
npm run lint
```

---

## 📁 Project Structure

```
badhope/
├── public/
│   └── vite.svg
├── src/
│   ├── components/          # React components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Home.tsx
│   │   ├── Assessments.tsx
│   │   ├── AssessmentDetail.tsx
│   │   ├── History.tsx
│   │   └── Settings.tsx
│   ├── data/                # Assessment data
│   │   ├── bigFiveData.ts
│   │   ├── stressTestData.ts
│   │   └── mockData.ts
│   ├── services/            # Business logic
│   │   ├── bigFiveScoring.ts
│   │   └── stressTestScoring.ts
│   ├── store/               # State management
│   │   └── index.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── lib/                 # Utilities
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 6.3** - Build tool
- **Tailwind CSS 3.4** - Styling
- **React Router DOM 7** - Routing
- **Zustand 5** - State management

### Development

- **ESLint 9** - Code linting
- **TypeScript ESLint** - TypeScript linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefixes

---

## 🎯 Assessment Theories

### Big Five Personality (OCEAN)

The Five-Factor Model is the most widely accepted personality theory in psychology:

| Factor | Description |
|--------|-------------|
| **O - Openness** | Imagination, creativity, and willingness to try new things |
| **C - Conscientiousness** | Organization, dependability, and self-discipline |
| **E - Extraversion** | Sociability, energy, and positive emotions |
| **A - Agreeableness** | Trust, altruism, and cooperation |
| **N - Neuroticism** | Emotional stability and tendency to experience negative emotions |

### Perceived Stress Scale (PSS)

The PSS measures the perception of stress:

| Score Range | Stress Level | Description |
|------------|-------------|-------------|
| 0-13 | Low | Good stress management |
| 14-26 | Moderate | Average stress levels |
| 27-40 | High | Elevated stress requiring attention |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**badhope**

- GitHub: [@badhope](https://github.com/badhope)

---

## 🙏 Acknowledgments

- [Big Five personality theory](https://en.wikipedia.org/wiki/Big_Five_personality_traits)
- [Perceived Stress Scale](https://en.wikipedia.org/wiki/Perceived_Stress_Scale)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**If you find this project helpful, please give it a ⭐️**

Made with ❤️ and psychology 🧠

</div>
