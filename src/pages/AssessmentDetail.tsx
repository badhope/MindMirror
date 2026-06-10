import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { getTranslation } from '../i18n';
import { mockAssessments, getQuestionsForAssessment } from '../data/mockData';
import { RESPONSE_OPTIONS, BIG_FIVE_TRAITS } from '../data/bigFiveData';
import { Question } from '../types';
import { STRESS_RESPONSE_OPTIONS, STRESS_LEVELS } from '../data/stressTestData';
import { GAD7_RESPONSE_OPTIONS, ANXIETY_LEVELS } from '../data/anxietyGad7Data';
import {
  SSRS_RESPONSE_OPTIONS,
  SSRS_SOURCES_OPTIONS,
  SSRS_LEVELS,
  SSRS_DIMENSIONS,
} from '../data/ssrsData';
import { MBI_RESPONSE_OPTIONS, MBI_LEVELS } from '../data/mbiData';
import { SWLS_RESPONSE_OPTIONS, SWLS_LEVELS } from '../data/swlsData';
import { RESILIENCE_RESPONSE_OPTIONS, RESILIENCE_LEVELS } from '../data/resilienceData';
import { calculateProgress, generateBigFiveReport } from '../services/bigFiveScoring';
import { getStressLevelInfo, generateDetailedStressReport } from '../services/stressTestScoring';
import { getAnxietyLevelInfo, generateDetailedGAD7Report } from '../services/anxietyGad7Scoring';
import { getSSRSLevelInfo, generateDetailedSSRSReport } from '../services/ssrsScoring';
import { getMBITotalLevel, generateDetailedMBIReport } from '../services/mbiScoring';
import { getSWLSLevelInfo, generateDetailedSWLSReport } from '../services/swlsScoring';
import {
  getResilienceLevelInfo,
  generateDetailedResilienceReport,
} from '../services/resilienceScoring';
import { exportService, shareService } from '../services/share/ExportShareService';
import { useToasts } from '../store/toastStore';
import { cn } from '../lib/utils';
import { Skeleton, SkeletonText } from '../components/Loading';
import { useDelayedReveal, useReducedMotion } from '../hooks/useMotion';

// ====================== Shared result-page sub-components ======================
// Lives at the top of the module so every Result*Detail (Big Five,
// Stress, GAD-7) can compose the same look. Kept inline because the
// assessment results are the only place they're used; if a second
// surface ever needs them we'll lift them into /components.

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <header className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed">{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  );
}

// 行为分歧画像展示组件 (适用于 4 个新量表)
// 数据结构:
//   {
//     title, subtitle, archetype, archetypeDesc, items: [{id, question, choice, label}]
//   }
function BehavioralProfileSection({
  profile,
}: {
  profile: {
    title: string;
    subtitle: string;
    archetype: string;
    archetypeDesc: string;
    items: { id: string; question: string; choice: number; label: string }[];
  } | null;
}) {
  if (!profile) return null;

  // 根据 archetype 选择配色
  const archetypeColorMap: Record<string, { bg: string; text: string; ring: string }> = {
    高投入成长型: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-200' },
    弹性务实型: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    压抑消耗型: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
    犬儒耗竭型: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
    独立内敛型: { bg: 'bg-slate-50', text: 'text-slate-700', ring: 'ring-slate-200' },
    弹性平衡型: { bg: 'bg-cyan-50', text: 'text-cyan-700', ring: 'ring-cyan-200' },
    主动连接型: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-200' },
    深度依赖型: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', ring: 'ring-fuchsia-200' },
    超越满足型: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    稳定满足型: { bg: 'bg-cyan-50', text: 'text-cyan-700', ring: 'ring-cyan-200' },
    不满修正型: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
    大失所望型: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-200' },
    高韧性行动型: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    反思恢复型: { bg: 'bg-cyan-50', text: 'text-cyan-700', ring: 'ring-cyan-200' },
    逃避转移型: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
    迷茫崩溃型: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-200' },
  };
  const color = archetypeColorMap[profile.archetype] || {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    ring: 'ring-indigo-200',
  };

  return (
    <Section title={profile.title} subtitle={profile.subtitle}>
      <div className={`rounded-2xl ${color.bg} ring-1 ${color.ring} p-5 sm:p-6`}>
        <div className="flex items-start gap-3">
          <div className="text-3xl shrink-0">🎭</div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${color.text} mb-1`}>你的行为画像</div>
            <div className={`text-xl sm:text-2xl font-extrabold ${color.text} mb-2`}>
              {profile.archetype}
            </div>
            <p className={`text-sm sm:text-base ${color.text} leading-relaxed opacity-90`}>
              {profile.archetypeDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          你的具体选择 ({profile.items.length} 题)
        </div>
        {profile.items.map(item => (
          <div key={item.id} className="rounded-xl bg-white border border-slate-200 p-3 sm:p-4">
            <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-2">
              <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                {item.id}
              </span>
              行为分歧题 · 选项 {item.choice}
            </div>
            <div className="text-sm text-slate-700 mb-2 leading-relaxed">{item.question}</div>
            <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function AnxietyGauge({
  score,
  max,
  color,
  reduce,
}: {
  score: number;
  max: number;
  color: string;
  reduce: boolean;
}) {
  const pct = Math.max(0, Math.min(1, score / max));
  const start = -Math.PI;
  const end = 0;
  const r = 88;
  const cx = 120;
  const cy = 120;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  // Background arc
  const bgPath = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  // Foreground arc
  const angle = start + pct * (end - start);
  const fx = cx + r * Math.cos(angle);
  const fy = cy + r * Math.sin(angle);
  const large = pct > 0.5 ? 1 : 0;
  const fgPath = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${fx} ${fy}`;

  const colorMap: Record<string, [string, string]> = {
    green: ['#10b981', '#34d399'],
    yellow: ['#f59e0b', '#fbbf24'],
    orange: ['#f97316', '#fb923c'],
    red: ['#e11d48', '#fb7185'],
  };
  const [c1, c2] = colorMap[color] ?? colorMap.green;
  const gradId = `gauge-grad-${color}`;

  return (
    <div className="relative w-56 h-36 sm:w-64 sm:h-40 mx-auto">
      <svg viewBox="0 0 240 140" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <path
          d={bgPath}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <motion.path
          d={fgPath}
          stroke={`url(#${gradId})`}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-5xl sm:text-7xl font-black tracking-tight"
        >
          {score}
        </motion.div>
        <div className="text-xs sm:text-sm text-white/80 font-medium -mt-1">/ {max} 分</div>
      </div>
    </div>
  );
}

function SymptomCard({
  gradient,
  icon,
  title,
  items,
}: {
  gradient: string;
  icon: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`bg-gradient-to-br ${gradient} p-4 sm:p-5`}>
        <div className="text-3xl mb-1">{icon}</div>
        <h5 className="text-base sm:text-lg font-bold text-white">{title}</h5>
      </div>
      <ul className="p-4 sm:p-5 space-y-2.5">
        {items.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700 leading-relaxed"
          >
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const toneMap: Record<string, { bg: string; iconBg: string; text: string }> = {
  rose: { bg: 'bg-rose-50', iconBg: 'bg-rose-100', text: 'text-rose-700' },
  blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-700' },
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', text: 'text-emerald-700' },
  amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', text: 'text-amber-700' },
  purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-100', text: 'text-purple-700' },
};

function ActionCard({
  tone,
  icon,
  title,
  items,
}: {
  tone: keyof typeof toneMap;
  icon: string;
  title: string;
  items: string[];
}) {
  const t = toneMap[tone] ?? toneMap.blue;
  return (
    <div className={`rounded-2xl ${t.bg} p-5 border border-slate-100`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${t.iconBg} ${t.text} flex items-center justify-center text-xl`}
        >
          {icon}
        </div>
        <h4 className={`text-base sm:text-lg font-bold ${t.text}`}>{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm sm:text-base text-slate-700 leading-relaxed"
          >
            <span className={`mt-1 ${t.text} text-lg leading-none`}>·</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LifestyleCard({
  icon,
  title,
  tone,
  items,
}: {
  icon: string;
  title: string;
  tone: keyof typeof toneMap;
  items: string[];
}) {
  const t = toneMap[tone] ?? toneMap.blue;
  return (
    <div className="group rounded-2xl bg-white border border-slate-100 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-12 h-12 rounded-xl ${t.iconBg} flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
        <h4 className={`text-lg sm:text-xl font-bold ${t.text}`}>{title}</h4>
      </div>
      <ul className="space-y-1.5">
        {items.map((h, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm sm:text-base text-slate-600 leading-relaxed"
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 介绍页面组件
function IntroPage({ onStart }: { onStart: () => void }) {
  const { currentAssessment } = useAppStore();
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);

  if (!currentAssessment) return null;

  return (
    <div className="space-y-8 text-center">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg border border-slate-100">
        <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">{currentAssessment.icon}</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 sm:mb-4">
          {currentAssessment.title}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
          {currentAssessment.description}
        </p>

        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600">
              {currentAssessment.totalQuestions}
            </div>
            <div className="text-slate-600">{i18n.quiz.intro.questions}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600">{currentAssessment.difficulty}</div>
            <div className="text-slate-600">{i18n.quiz.intro.difficulty}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600">
              {currentAssessment.estimatedTime}
            </div>
            <div className="text-slate-600">{i18n.quiz.intro.estimatedTime}</div>
          </div>
        </div>

        {currentAssessment.id === 'big-five' && (
          <div className="bg-blue-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-blue-800 mb-3">{i18n.assessments.title}</h3>
            <p className="text-blue-700 text-sm leading-relaxed">{i18n.results.bigFiveIntro}</p>
            <div className="mt-4 grid sm:grid-cols-5 gap-2">
              {Object.entries(BIG_FIVE_TRAITS).map(([key, trait]) => (
                <div key={key} className="bg-white rounded-lg p-2 text-center">
                  <div className="font-medium text-blue-700 text-sm">{trait.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentAssessment.id === 'stress-test' && (
          <div className="bg-purple-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-purple-800 mb-3">{i18n.assessments.title}</h3>
            <p className="text-purple-700 text-sm leading-relaxed">{i18n.results.stressIntro}</p>
            <div className="mt-4 grid sm:grid-cols-3 gap-2">
              {Object.entries(STRESS_LEVELS).map(([key, level]) => (
                <div key={key} className="bg-white rounded-lg p-2 text-center">
                  <div className="font-medium text-purple-700 text-sm">{level.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(currentAssessment.id === 'anxiety-gad7' || currentAssessment.id === '3') && (
          <div className="bg-teal-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-teal-800 mb-3">{i18n.assessments.title}</h3>
            <p className="text-teal-700 text-sm leading-relaxed">{i18n.results.anxietyIntro}</p>
            <div className="mt-4 grid sm:grid-cols-4 gap-2">
              {Object.entries(ANXIETY_LEVELS).map(([key, level]) => (
                <div key={key} className="bg-white rounded-lg p-2 text-center">
                  <div className="font-medium text-teal-700 text-sm">{level.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(currentAssessment.id === 'social-support' || currentAssessment.id === '4') && (
          <div className="bg-cyan-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-cyan-800 mb-3">{i18n.assessments.title}</h3>
            <p className="text-cyan-700 text-sm leading-relaxed">{i18n.results.ssrsIntro}</p>
            <div className="mt-4 grid sm:grid-cols-4 gap-2">
              {Object.values(SSRS_LEVELS).map(level => (
                <div key={level.label} className="bg-white rounded-lg p-2 text-center">
                  <div className="font-medium text-cyan-700 text-sm">{level.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(currentAssessment.id === 'mbi-burnout' || currentAssessment.id === '5') && (
          <div className="bg-orange-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-orange-800 mb-3">{i18n.assessments.title}</h3>
            <p className="text-orange-700 text-sm leading-relaxed">{i18n.results.mbiIntro}</p>
            <div className="mt-4 grid sm:grid-cols-4 gap-2">
              {Object.values(MBI_LEVELS).map(level => (
                <div key={level.label} className="bg-white rounded-lg p-2 text-center">
                  <div className="font-medium text-orange-700 text-sm">{level.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(currentAssessment.id === 'life-satisfaction' || currentAssessment.id === '6') && (
          <div className="bg-emerald-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-emerald-800 mb-3">{i18n.assessments.title}</h3>
            <p className="text-emerald-700 text-sm leading-relaxed">{i18n.results.swlsIntro}</p>
            <div className="mt-4 grid sm:grid-cols-3 gap-2">
              {Object.values(SWLS_LEVELS).map(level => (
                <div key={level.label} className="bg-white rounded-lg p-2 text-center">
                  <div className="font-medium text-emerald-700 text-sm">{level.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(currentAssessment.id === 'resilience-cdrisc' || currentAssessment.id === '7') && (
          <div className="bg-lime-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-lime-800 mb-3">{i18n.assessments.title}</h3>
            <p className="text-lime-700 text-sm leading-relaxed">{i18n.results.resilienceIntro}</p>
            <div className="mt-4 grid sm:grid-cols-3 gap-2">
              {Object.values(RESILIENCE_LEVELS).map(level => (
                <div key={level.label} className="bg-white rounded-lg p-2 text-center">
                  <div className="font-medium text-lime-700 text-sm">{level.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-amber-50 rounded-xl p-6 text-left mb-8">
          <h3 className="font-semibold text-amber-800 mb-2">💡 {i18n.quiz.intro.tips.title}</h3>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>• {i18n.quiz.intro.tips.noRightWrong}</li>
            <li>• {i18n.quiz.intro.tips.firstInstinct}</li>
            <li>• {i18n.quiz.intro.tips.privacy}</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base sm:text-xl font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {i18n.quiz.start}
        </button>
      </div>
    </div>
  );
}

// 答题页面组件
function QuizPage() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    setCurrentQuestionIndex,
    setAnswer,
    calculateResult,
    currentAssessment,
  } = useAppStore();
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = calculateProgress(answers, questions.length);
  const currentAnswer = answers[currentQuestion.id];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // 根据测评类型选择选项 (SSRS items 6/7 改用来源数 0-9 选项)
  const isSSRSSourceQuestion =
    (currentAssessment?.id === 'social-support' || currentAssessment?.id === '4') &&
    (currentQuestion?.id === 'ssrs6' || currentQuestion?.id === 'ssrs7');

  const options = isSSRSSourceQuestion
    ? SSRS_SOURCES_OPTIONS
    : currentAssessment?.id === 'stress-test' || currentAssessment?.id === '2'
      ? STRESS_RESPONSE_OPTIONS
      : currentAssessment?.id === 'anxiety-gad7' || currentAssessment?.id === '3'
        ? GAD7_RESPONSE_OPTIONS
        : currentAssessment?.id === 'social-support' || currentAssessment?.id === '4'
          ? SSRS_RESPONSE_OPTIONS
          : currentAssessment?.id === 'mbi-burnout' || currentAssessment?.id === '5'
            ? MBI_RESPONSE_OPTIONS
            : currentAssessment?.id === 'life-satisfaction' || currentAssessment?.id === '6'
              ? SWLS_RESPONSE_OPTIONS
              : currentAssessment?.id === 'resilience-cdrisc' || currentAssessment?.id === '7'
                ? RESILIENCE_RESPONSE_OPTIONS
                : RESPONSE_OPTIONS;

  const handleAnswer = (value: number) => {
    setAnswer(currentQuestion.id, value);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const totalQuestions = questions.length;
      const answeredCount = Object.keys(answers).length;
      if (answeredCount < totalQuestions) {
        const firstUnanswered = questions.find(q => !answers[q.id]);
        if (firstUnanswered) {
          setCurrentQuestionIndex(questions.indexOf(firstUnanswered));
        }
        return;
      }
      if (currentAssessment) {
        calculateResult(currentAssessment.id, currentAssessment.title);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 进度条宽度
  const progressWidth = `${progress.percentage}%`;

  // 根据测评类型选择标签颜色
  const tagColor =
    currentAssessment?.id === 'stress-test' || currentAssessment?.id === '2'
      ? 'bg-purple-100 text-purple-700'
      : currentAssessment?.id === 'anxiety-gad7' || currentAssessment?.id === '3'
        ? 'bg-teal-100 text-teal-700'
        : currentAssessment?.id === 'social-support' || currentAssessment?.id === '4'
          ? 'bg-cyan-100 text-cyan-700'
          : currentAssessment?.id === 'mbi-burnout' || currentAssessment?.id === '5'
            ? 'bg-orange-100 text-orange-700'
            : currentAssessment?.id === 'life-satisfaction' || currentAssessment?.id === '6'
              ? 'bg-emerald-100 text-emerald-700'
              : currentAssessment?.id === 'resilience-cdrisc' || currentAssessment?.id === '7'
                ? 'bg-lime-100 text-lime-700'
                : 'bg-blue-100 text-blue-700';

  return (
    <div className="max-w-2xl mx-auto">
      {/* 题目卡片 */}
      <div
        key={currentQuestion?.id}
        className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg border border-slate-100 animate-slide-in"
      >
        {/* 题号导航器 */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-4 sm:mb-6 justify-center">
          {questions.map((_, idx) => {
            const qId = questions[idx].id;
            const isAnswered = !!answers[qId];
            return (
              <button
                key={idx}
                onClick={() => {
                  if (isAnswered || idx <= currentQuestionIndex + 1) {
                    setCurrentQuestionIndex(idx);
                  }
                }}
                className={cn(
                  'w-6 h-6 sm:w-7 sm:h-7 rounded text-[10px] sm:text-xs font-medium transition-all',
                  idx === currentQuestionIndex
                    ? 'bg-blue-600 text-white scale-110'
                    : isAnswered
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-400',
                  idx > currentQuestionIndex + 1 && !isAnswered && 'opacity-40 cursor-not-allowed'
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="text-center mb-4 sm:mb-6">
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          {currentQuestion.trait && (
            <span
              className={cn(
                'inline-block px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4',
                tagColor
              )}
            >
              {currentQuestion.trait === 'negative'
                ? i18n.results.pressureFeel
                : currentQuestion.trait === 'positive'
                  ? i18n.results.copingAbility
                  : BIG_FIVE_TRAITS[currentQuestion.trait as keyof typeof BIG_FIVE_TRAITS]?.name ||
                    currentQuestion.trait}
            </span>
          )}
          <h3 className="text-lg sm:text-2xl font-bold text-slate-800 leading-relaxed">
            {currentQuestion.text}
          </h3>
        </div>

        {/* 选项 */}
        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={cn(
                'w-full p-3 sm:p-4 rounded-xl text-left transition-all border-2',
                currentAnswer === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm sm:text-base">{option.label}</span>
                <span
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                    currentAnswer === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300'
                  )}
                >
                  {currentAnswer === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* 导航按钮 */}
        <div className="flex gap-3 sm:gap-4">
          {!isFirstQuestion && (
            <button
              onClick={handlePrevious}
              className="flex-1 py-3 sm:py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm sm:text-base"
            >
              {i18n.quiz.previous}
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className={cn(
              'flex-1 py-3 sm:py-4 rounded-xl font-semibold transition-all text-sm sm:text-base',
              currentAnswer
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            )}
          >
            {isLastQuestion ? i18n.quiz.finish : i18n.quiz.next}
          </button>
        </div>
      </div>
    </div>
  );
}

// 大五人格详细结果组件
function BigFiveResultDetail({
  result,
  questions,
  answers,
}: {
  result: {
    totalScore: number;
    traits: Array<{ name: string; score: number; description: string }>;
  };
  questions?: unknown[];
  answers?: Record<string, number>;
}) {
  void { questions, answers };
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'growth' | 'career' | 'relationships'>('growth');

  const report = useMemo(() => generateBigFiveReport(result.traits), [result.traits]);

  // 5 个特质的视觉 token
  const traitTokens: Record<
    string,
    { icon: string; gradient: string; soft: string; ring: string; text: string; bg: string }
  > = {
    O: {
      icon: '🎨',
      gradient: 'from-violet-500 to-purple-500',
      soft: 'bg-violet-50',
      ring: 'ring-violet-400',
      text: 'text-violet-700',
      bg: 'bg-violet-100',
    },
    C: {
      icon: '📋',
      gradient: 'from-blue-500 to-indigo-500',
      soft: 'bg-blue-50',
      ring: 'ring-blue-400',
      text: 'text-blue-700',
      bg: 'bg-blue-100',
    },
    E: {
      icon: '🎉',
      gradient: 'from-amber-500 to-orange-500',
      soft: 'bg-amber-50',
      ring: 'ring-amber-400',
      text: 'text-amber-700',
      bg: 'bg-amber-100',
    },
    A: {
      icon: '💝',
      gradient: 'from-rose-500 to-pink-500',
      soft: 'bg-rose-50',
      ring: 'ring-rose-400',
      text: 'text-rose-700',
      bg: 'bg-rose-100',
    },
    N: {
      icon: '🌊',
      gradient: 'from-emerald-500 to-teal-500',
      soft: 'bg-emerald-50',
      ring: 'ring-emerald-400',
      text: 'text-emerald-700',
      bg: 'bg-emerald-100',
    },
  };

  const overallTone =
    report.summary.overallScore >= 65
      ? { from: 'from-amber-500', to: 'to-orange-500', label: '✨ 充满活力' }
      : report.summary.overallScore >= 45
        ? { from: 'from-blue-500', to: 'to-indigo-500', label: '⚖️ 平衡稳定' }
        : { from: 'from-emerald-500', to: 'to-teal-500', label: '🌿 沉稳内敛' };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-10 sm:space-y-14">
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${overallTone.from} ${overallTone.to} text-white p-6 sm:p-12 shadow-2xl`}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 text-sm font-medium">
            <span>🎉</span> {i18n.results.completed}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {i18n.results.yourPersonality}
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            {i18n.results.basedOnAnswers}
          </p>
          <div className="inline-flex flex-col items-center">
            <div className="text-7xl sm:text-8xl font-extrabold tracking-tighter drop-shadow-lg">
              {report.summary.overallScore}
            </div>
            <div className="text-sm sm:text-base text-white/80 -mt-1 mb-3">综合得分 (0–100)</div>
            <div className="text-xl sm:text-2xl font-bold">{overallTone.label}</div>
          </div>
          {report.summary.personalityType && (
            <div className="mt-6 mx-auto max-w-2xl bg-white/15 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/20">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/80 mb-1">
                🎯 你的性格画像
              </div>
              <div className="text-lg sm:text-xl font-bold mb-1">
                {report.summary.personalityType.typeName}
              </div>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                {report.summary.personalityType.description}
              </p>
            </div>
          )}
        </div>
      </motion.section>

      <div className="bg-blue-50 rounded-2xl p-4 sm:p-5 border border-blue-100 flex items-start gap-3">
        <span className="text-blue-600 text-lg sm:text-xl mt-0.5" aria-hidden="true">
          📊
        </span>
        <div>
          <h4 className="font-semibold text-blue-800 mb-1 text-sm sm:text-base">
            {i18n.results.aboutTScoreTitle}
          </h4>
          <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
            {i18n.results.aboutTScoreDesc}
          </p>
        </div>
      </div>

      <Section title="五大维度画像" subtitle="每个特质从 0 到 100,查看你在五个核心维度的位置">
        <div className="grid gap-4">
          {report.traitAnalyses.map(
            (
              analysis: {
                key: string;
                name: string;
                score: number;
                description: string;
                fullInterpretation?: {
                  high?: { name: string; description: string };
                  low?: { name: string; description: string };
                };
                scoreLevel: string;
              },
              idx: number
            ) => {
              const token = traitTokens[analysis.key] || traitTokens.O;
              const isHigh = analysis.score >= 50;
              const interp = isHigh
                ? analysis.fullInterpretation?.high
                : analysis.fullInterpretation?.low;
              return (
                <motion.div
                  key={analysis.key}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-2xl bg-white p-4 sm:p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${token.gradient} flex items-center justify-center text-3xl text-white shadow-md`}
                    >
                      {token.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h4 className="text-lg sm:text-xl font-bold text-slate-800">
                          {analysis.name}
                        </h4>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${token.soft} ${token.text}`}
                        >
                          {isHigh ? '高' : '低'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mb-2">
                        {interp?.name || analysis.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            initial={reduce ? false : { width: 0 }}
                            whileInView={{ width: `${analysis.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.08 + 0.1 }}
                            className={`h-full rounded-full bg-gradient-to-r ${token.gradient}`}
                          />
                        </div>
                        <div
                          className={`shrink-0 text-xl sm:text-2xl font-extrabold ${token.text}`}
                        >
                          {analysis.score}
                        </div>
                      </div>
                    </div>
                  </div>
                  {interp?.description && (
                    <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                      {interp.description}
                    </p>
                  )}
                </motion.div>
              );
            }
          )}
        </div>
      </Section>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 sm:p-6 border-2 border-emerald-200"
        >
          <h3 className="text-lg sm:text-xl font-bold text-emerald-800 mb-3 flex items-center gap-2">
            <span className="text-2xl">💪</span> {i18n.results.strengths}
          </h3>
          <div className="space-y-2">
            {report.strengths.map((s: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm sm:text-base text-slate-700">
                <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 sm:p-6 border-2 border-amber-200"
        >
          <h3 className="text-lg sm:text-xl font-bold text-amber-800 mb-3 flex items-center gap-2">
            <span className="text-2xl">🔍</span> {i18n.results.blindspots}
          </h3>
          <div className="space-y-2">
            {report.blindSpots.map((s: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm sm:text-base text-slate-700">
                <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Section title="应用与建议" subtitle="了解你的特质在不同生活场景中的体现">
        <div role="tablist" className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'growth', label: '🌱 个人成长' },
            { id: 'career', label: '💼 职业推荐' },
            { id: 'relationships', label: '💞 关系风格' },
          ].map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id as 'growth' | 'career' | 'relationships')}
              className={cn(
                'shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all',
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'growth' && (
          <motion.div
            key="growth"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5 sm:p-6">
              <h4 className="text-base sm:text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🌱</span> 个人成长方向
              </h4>
              <div className="space-y-2">
                {report.recommendations.personalGrowth.map((tip: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm sm:text-base text-slate-700"
                  >
                    <span className="shrink-0 mt-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
            {report.recommendations.workStyle && (
              <div className="rounded-2xl bg-violet-50 border border-violet-100 p-5 sm:p-6">
                <h4 className="text-base sm:text-lg font-bold text-violet-800 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span> 工作风格
                </h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {report.recommendations.workStyle}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'career' && (
          <motion.div
            key="career"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {report.recommendations.career.map((career: string, i: number) => (
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mb-1">💼</div>
                  <div className="text-sm sm:text-base font-semibold text-blue-800">{career}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'relationships' && (
          <motion.div
            key="relationships"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-rose-50 border border-rose-100 p-5 sm:p-6"
          >
            <h4 className="text-base sm:text-lg font-bold text-rose-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">💞</span> 关系风格
            </h4>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {report.recommendations.relationships || '持续探索你在亲密关系、友谊中的互动模式。'}
            </p>
          </motion.div>
        )}
      </Section>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 text-center"
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-2">下一步,试试这些</h3>
        <p className="text-sm sm:text-base text-slate-300 mb-5">
          把报告带走,或基于特质选择合适的训练
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/training"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 font-semibold transition-colors"
          >
            💪 心理训练
          </Link>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 font-semibold transition-colors"
          >
            🔁 再测一次
          </Link>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 font-semibold transition-colors"
          >
            📈 查看历史
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// 压力测试详细结果组件
function StressTestResultDetail({
  result,
  questions,
  answers,
}: {
  result: {
    totalScore: number;
    traits: Array<{ name: string; score: number; description: string }>;
  };
  questions: Question[];
  answers: Record<string, number>;
}) {
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'strategies' | 'lifestyle' | 'professional'>(
    'strategies'
  );

  const report = useMemo(
    () => generateDetailedStressReport(answers, questions),
    [answers, questions]
  );
  const stressLevelInfo = getStressLevelInfo(result.totalScore);

  // 4 个压力等级的颜色 token (与焦虑模板同款色板)
  const levelTokens = {
    green: {
      bg: 'from-emerald-500 to-teal-500',
      text: 'text-emerald-700',
      soft: 'bg-emerald-50',
      ring: 'ring-emerald-400',
      label: '🟢 正常',
    },
    yellow: {
      bg: 'from-amber-500 to-yellow-500',
      text: 'text-amber-700',
      soft: 'bg-amber-50',
      ring: 'ring-amber-400',
      label: '🟡 轻度',
    },
    orange: {
      bg: 'from-orange-500 to-red-400',
      text: 'text-orange-700',
      soft: 'bg-orange-50',
      ring: 'ring-orange-400',
      label: '🟠 中度',
    },
    red: {
      bg: 'from-rose-600 to-red-600',
      text: 'text-rose-700',
      soft: 'bg-rose-50',
      ring: 'ring-rose-500',
      label: '🔴 重度',
    },
  } as const;
  const tok = levelTokens[stressLevelInfo.color as keyof typeof levelTokens] ?? levelTokens.green;

  const levelRanges = {
    green: { range: '0–30', label: '低压力' },
    yellow: { range: '31–60', label: '中等压力' },
    orange: { range: '61–90', label: '高压力' },
    red: { range: '91–120', label: '极高压力' },
  } as const;

  // 维度 icons
  const dimIcons: Record<string, string> = {
    工作压力: '💼',
    关系压力: '💞',
    健康压力: '🏃',
    财务压力: '💰',
    压力感受: '💭',
    应对能力: '🛡️',
  };
  const dimColors: Record<string, string> = {
    工作压力: 'from-blue-500 to-indigo-500',
    关系压力: 'from-rose-500 to-pink-500',
    健康压力: 'from-emerald-500 to-teal-500',
    财务压力: 'from-amber-500 to-orange-500',
    压力感受: 'from-violet-500 to-purple-500',
    应对能力: 'from-cyan-500 to-blue-500',
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-10 sm:space-y-14">
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${tok.bg} text-white p-6 sm:p-12 shadow-2xl`}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 text-sm font-medium">
            <span>🎉</span> {i18n.results.completed}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {i18n.results.yourStress}
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            {i18n.results.basedOnAnswers}
          </p>
          <div className="inline-flex flex-col items-center">
            <div className="text-7xl sm:text-8xl font-extrabold tracking-tighter drop-shadow-lg">
              {report.summary.score}
            </div>
            <div className="text-sm sm:text-base text-white/80 -mt-1 mb-3">/ 120 分</div>
            <div className="text-xl sm:text-2xl font-bold">{stressLevelInfo.name}</div>
          </div>
          <p className="mt-3 text-base sm:text-lg text-white/90 max-w-xl mx-auto">
            {stressLevelInfo.description}
          </p>
        </div>
      </motion.section>

      <Section title="压力等级解读" subtitle="识别你目前所处的压力等级及含义">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(levelRanges).map(([key, info]) => {
            const t = levelTokens[key as keyof typeof levelTokens];
            const active = key === stressLevelInfo.color;
            return (
              <div
                key={key}
                className={cn(
                  'rounded-2xl p-4 sm:p-5 border-2 transition-all',
                  active
                    ? `${t.soft} ${t.ring} ring-2 shadow-lg scale-[1.02]`
                    : 'bg-white border-slate-200 hover:border-slate-300'
                )}
              >
                <div
                  className={`text-2xl sm:text-3xl font-extrabold ${active ? t.text : 'text-slate-700'}`}
                >
                  {info.range}
                </div>
                <div
                  className={`mt-1 text-sm sm:text-base font-semibold ${active ? t.text : 'text-slate-600'}`}
                >
                  {t.label} {info.label}
                </div>
                {active && <div className="mt-2 text-xs sm:text-sm text-slate-700">← 你在这里</div>}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="压力详细表现" subtitle="压力在身体、情绪、认知、社交四个层面的体现">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {report.detailedAnalysis.signs.physicalSigns && (
            <SymptomCard
              gradient="from-teal-400 to-emerald-500"
              icon="🏃"
              title="身体症状"
              items={report.detailedAnalysis.signs.physicalSigns}
            />
          )}
          {report.detailedAnalysis.signs.emotionalSigns && (
            <SymptomCard
              gradient="from-cyan-400 to-blue-500"
              icon="💭"
              title="情绪症状"
              items={report.detailedAnalysis.signs.emotionalSigns}
            />
          )}
          {report.detailedAnalysis.signs.cognitiveSigns && (
            <SymptomCard
              gradient="from-violet-400 to-purple-500"
              icon="🧠"
              title="认知症状"
              items={report.detailedAnalysis.signs.cognitiveSigns}
            />
          )}
          {report.detailedAnalysis.signs.socialSigns && (
            <SymptomCard
              gradient="from-rose-400 to-pink-500"
              icon="👫"
              title="社交影响"
              items={report.detailedAnalysis.signs.socialSigns}
            />
          )}
        </div>
      </Section>

      <Section title="各维度得分" subtitle="查看你在压力、应对、感受等维度的具体表现">
        <div className="space-y-3">
          {result.traits.map(
            (trait: { name: string; score: number; description: string }, idx: number) => {
              const icon = dimIcons[trait.name] || '📊';
              const color = dimColors[trait.name] || 'from-slate-400 to-slate-500';
              const isOverall = trait.name === '总体压力水平' || trait.name === '压力水平';
              const pct = isOverall
                ? Math.min((trait.score / 120) * 100, 100)
                : Math.min(trait.score, 100);
              return (
                <motion.div
                  key={trait.name}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl sm:text-2xl text-white`}
                    >
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base sm:text-lg font-bold text-slate-800">
                          {trait.name}
                        </span>
                        <span className="text-xl sm:text-2xl font-extrabold text-slate-700">
                          {trait.score}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
                    <motion.div
                      initial={reduce ? false : { width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.06 + 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${color}`}
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {trait.description}
                  </p>
                </motion.div>
              );
            }
          )}
        </div>
      </Section>

      {report.detailedAnalysis.topDimensions &&
        report.detailedAnalysis.topDimensions.length > 0 && (
          <Section title="主要压力维度" subtitle="识别对你影响最大的压力来源,针对性调整">
            <div className="grid gap-4">
              {report.detailedAnalysis.topDimensions.map(
                (
                  dim: {
                    dimension: string;
                    info?: { name: string; description: string; tips: string[] };
                    score: number;
                    weight?: number;
                  },
                  i: number
                ) => {
                  const icon = dimIcons[dim.dimension] || '📌';
                  const color = dimColors[dim.dimension] || 'from-blue-500 to-indigo-500';
                  return (
                    <motion.div
                      key={i}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${color} text-white p-5 sm:p-6 shadow-md`}
                    >
                      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                            {icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg sm:text-xl font-bold">
                              {dim.info?.name || dim.dimension}
                            </h4>
                            {dim.weight !== undefined && (
                              <div className="text-xs sm:text-sm text-white/80">
                                权重 {Math.round(dim.weight * 100)}%
                              </div>
                            )}
                          </div>
                          <div className="text-2xl sm:text-3xl font-extrabold">{dim.score}</div>
                        </div>
                        {dim.info?.description && (
                          <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-3">
                            {dim.info.description}
                          </p>
                        )}
                        {dim.info?.tips && dim.info.tips.length > 0 && (
                          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/80 mb-2">
                              💡 针对性建议
                            </div>
                            <ul className="space-y-1.5">
                              {dim.info.tips.map((tip: string, j: number) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-sm sm:text-base text-white"
                                >
                                  <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-white" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          </Section>
        )}

      <Section title="建议与资源" subtitle="针对你的压力等级,提供分层、可操作的建议">
        <div role="tablist" className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'strategies', label: '🛠️ 应对策略' },
            { id: 'lifestyle', label: '🌿 健康习惯' },
            { id: 'professional', label: '🆘 专业资源' },
          ].map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id as 'strategies' | 'lifestyle' | 'professional')}
              className={cn(
                'shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all',
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'strategies' && (
          <motion.div
            key="strategies"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-3 gap-4"
          >
            <ActionCard
              tone="blue"
              icon="🎯"
              title={i18n.results.problemFocused}
              items={report.recommendations.strategies.problemFocused.map(
                (s: { name: string; description: string }) => `${s.name}: ${s.description}`
              )}
            />
            <ActionCard
              tone="purple"
              icon="💭"
              title={i18n.results.emotionFocused}
              items={report.recommendations.strategies.emotionFocused.map(
                (s: { name: string; description: string }) => `${s.name}: ${s.description}`
              )}
            />
            <ActionCard
              tone="amber"
              icon="🌿"
              title={i18n.results.avoidanceStrategy}
              items={report.recommendations.strategies.avoidance.map(
                (s: { name: string; description: string }) => `${s.name}: ${s.description}`
              )}
            />
          </motion.div>
        )}

        {activeTab === 'lifestyle' && (
          <motion.div
            key="lifestyle"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            <LifestyleCard
              icon="😴"
              title="睡眠"
              tone="amber"
              items={report.recommendations.healthyHabits.sleep}
            />
            <LifestyleCard
              icon="🥗"
              title="饮食"
              tone="emerald"
              items={report.recommendations.healthyHabits.nutrition}
            />
            <LifestyleCard
              icon="🏃"
              title="运动"
              tone="blue"
              items={report.recommendations.healthyHabits.movement}
            />
            <LifestyleCard
              icon="👫"
              title="社交"
              tone="purple"
              items={report.recommendations.healthyHabits.social}
            />
          </motion.div>
        )}

        {activeTab === 'professional' && (
          <motion.div
            key="professional"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {report.recommendations.professional ? (
              <>
                <div className="rounded-2xl bg-rose-50 border-2 border-rose-200 p-5 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-bold text-rose-700 mb-3 flex items-center gap-2">
                    <span className="text-2xl">⏰</span> 何时寻求帮助
                  </h4>
                  <ul className="space-y-2">
                    {report.recommendations.professional.whenToSeekHelp.map(
                      (r: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm sm:text-base text-rose-900 leading-relaxed"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span>{r}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="rounded-2xl bg-blue-50 border-2 border-blue-200 p-5 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">
                    <span className="text-2xl">👨‍⚕️</span> 可咨询的专业人士
                  </h4>
                  <ul className="space-y-2">
                    {report.recommendations.professional.professionals.map(
                      (r: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm sm:text-base text-blue-900 leading-relaxed"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>{r}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="rounded-2xl bg-violet-50 border-2 border-violet-200 p-5 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-bold text-violet-700 mb-3 flex items-center gap-2">
                    <span className="text-2xl">💊</span> 推荐疗法
                  </h4>
                  <ul className="space-y-2">
                    {report.recommendations.professional.therapyTypes.map(
                      (r: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm sm:text-base text-violet-900 leading-relaxed"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                          <span>{r}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 text-center">
                <p className="text-sm sm:text-base text-slate-600">
                  你目前的压力水平在可控范围内,继续保持健康习惯即可。
                </p>
              </div>
            )}
          </motion.div>
        )}
      </Section>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 text-center"
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-2">下一步,试试这些</h3>
        <p className="text-sm sm:text-base text-slate-300 mb-5">
          把报告带走、分享给信任的人、或者直接进入心理训练
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/training"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 font-semibold transition-colors"
          >
            💪 心理训练
          </Link>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 font-semibold transition-colors"
          >
            🔁 再测一次
          </Link>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 font-semibold transition-colors"
          >
            📈 查看历史
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function GAD7ResultDetail({
  result,
  questions,
  answers,
}: {
  result: {
    totalScore: number;
    traits: Array<{ name: string; score: number; description: string }>;
  };
  questions: Question[];
  answers: Record<string, number>;
}) {
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'coping' | 'lifestyle' | 'crisis'>('coping');

  const report = useMemo(
    () => generateDetailedGAD7Report(answers, questions),
    [answers, questions]
  );
  const anxietyLevelInfo = getAnxietyLevelInfo(result.totalScore);
  const maxScore = questions.length * 3;

  const perQuestion = useMemo(
    () =>
      questions
        .map(q => ({ id: q.id, text: q.text, score: answers[q.id] ?? 0, trait: q.trait }))
        .sort((a, b) => b.score - a.score),
    [questions, answers]
  );
  const topIds = new Set(perQuestion.slice(0, 3).map(q => q.id));

  const levelTokens = {
    green: {
      bg: 'from-emerald-500 to-teal-500',
      text: 'text-emerald-700',
      soft: 'bg-emerald-50',
      ring: 'ring-emerald-400',
      label: '🟢 正常',
    },
    yellow: {
      bg: 'from-amber-500 to-yellow-500',
      text: 'text-amber-700',
      soft: 'bg-amber-50',
      ring: 'ring-amber-400',
      label: '🟡 轻度',
    },
    orange: {
      bg: 'from-orange-500 to-red-400',
      text: 'text-orange-700',
      soft: 'bg-orange-50',
      ring: 'ring-orange-400',
      label: '🟠 中度',
    },
    red: {
      bg: 'from-rose-600 to-red-600',
      text: 'text-rose-700',
      soft: 'bg-rose-50',
      ring: 'ring-rose-500',
      label: '🔴 重度',
    },
  } as const;
  const tok = levelTokens[anxietyLevelInfo.color as keyof typeof levelTokens] ?? levelTokens.green;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-10 sm:space-y-14">
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${tok.bg} text-white p-6 sm:p-12 shadow-2xl`}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 text-sm font-medium">
            <span>🎉</span> {i18n.results.completed}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {i18n.results.yourAnxiety}
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            {i18n.results.basedOnAnswers}
          </p>
          <AnxietyGauge
            score={result.totalScore}
            max={maxScore}
            color={anxietyLevelInfo.color}
            reduce={reduce}
          />
          <div className="mt-4 text-2xl sm:text-3xl font-bold">{anxietyLevelInfo.name}</div>
          <p className="mt-2 text-base sm:text-lg text-white/90 max-w-xl mx-auto">
            {anxietyLevelInfo.description}
          </p>
        </div>
      </motion.section>

      <Section title="焦虑等级解读" subtitle="了解四个等级的含义,识别自己目前所处的位置">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries({
            green: { range: '0–16', label: '正常范围' },
            yellow: { range: '17–33', label: '轻度焦虑' },
            orange: { range: '34–50', label: '中度焦虑' },
            red: { range: '51–84', label: '重度焦虑' },
          }).map(([key, info]) => {
            const t = levelTokens[key as keyof typeof levelTokens];
            const active = key === anxietyLevelInfo.color;
            return (
              <div
                key={key}
                className={cn(
                  'rounded-2xl p-4 sm:p-5 border-2 transition-all',
                  active
                    ? `${t.soft} ${t.ring} ring-2 shadow-lg scale-[1.02]`
                    : 'bg-white border-slate-200 hover:border-slate-300'
                )}
              >
                <div
                  className={`text-2xl sm:text-3xl font-extrabold ${active ? t.text : 'text-slate-700'}`}
                >
                  {info.range}
                </div>
                <div
                  className={`mt-1 text-sm sm:text-base font-semibold ${active ? t.text : 'text-slate-600'}`}
                >
                  {t.label} {info.label}
                </div>
                {active && <div className="mt-2 text-xs sm:text-sm text-slate-700">← 你在这里</div>}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="题目得分热力图" subtitle="从单题层面看哪些想法或感受在近 2 周最困扰你">
        <div className="space-y-2 sm:space-y-3">
          {perQuestion.map((q, idx) => {
            const pct = (q.score / 3) * 100;
            const isTop = topIds.has(q.id);
            const tone =
              q.score === 0
                ? 'bg-slate-300'
                : q.score === 1
                  ? 'bg-amber-400'
                  : q.score === 2
                    ? 'bg-orange-500'
                    : 'bg-rose-600';
            return (
              <motion.div
                key={q.id}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className={cn(
                  'group rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 border-2 transition-all hover:shadow-md',
                  isTop ? 'border-rose-300' : 'border-slate-100'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white',
                      isTop ? tone : 'bg-slate-400'
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {isTop && (
                        <span className="text-[10px] sm:text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          TOP {idx < 3 ? idx + 1 : ''}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm font-semibold text-slate-500">
                        {q.score} / 3
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 line-clamp-2 group-hover:line-clamp-none transition-all">
                      {q.text}
                    </p>
                    <div className="mt-2 h-2 sm:h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={reduce ? false : { width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.04 }}
                        className={cn('h-full rounded-full', tone)}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {report.detailedAnalysis.signs && (
        <Section title="主要症状分析" subtitle="焦虑在身体、情绪、认知三个层面的具体表现">
          <div className="grid sm:grid-cols-3 gap-4">
            {report.detailedAnalysis.signs.physicalSigns && (
              <SymptomCard
                gradient="from-teal-400 to-emerald-500"
                icon="🏃"
                title="身体症状"
                items={report.detailedAnalysis.signs.physicalSigns}
              />
            )}
            {report.detailedAnalysis.signs.emotionalSigns && (
              <SymptomCard
                gradient="from-cyan-400 to-blue-500"
                icon="💭"
                title="情绪症状"
                items={report.detailedAnalysis.signs.emotionalSigns}
              />
            )}
            {report.detailedAnalysis.signs.cognitiveSigns && (
              <SymptomCard
                gradient="from-violet-400 to-purple-500"
                icon="🧠"
                title="认知症状"
                items={report.detailedAnalysis.signs.cognitiveSigns}
              />
            )}
          </div>
        </Section>
      )}

      {report.detailedAnalysis.primarySymptom && (
        <motion.div
          initial={reduce ? false : { scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 p-6 sm:p-8 text-white shadow-xl"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="text-5xl sm:text-6xl">🔍</div>
            <div className="flex-1">
              <div className="text-sm sm:text-base font-semibold uppercase tracking-wider text-white/80 mb-1">
                你最突出的表现
              </div>
              <div className="text-xl sm:text-2xl font-bold leading-snug">
                {report.detailedAnalysis.primarySymptom}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <Section title="建议与资源" subtitle="根据你的焦虑等级,提供分层、可操作的建议">
        <div role="tablist" className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'coping', label: '🛠️ 应对策略' },
            { id: 'lifestyle', label: '🌿 健康习惯' },
            { id: 'crisis', label: '🆘 专业资源' },
          ].map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id as 'coping' | 'lifestyle' | 'crisis')}
              className={cn(
                'shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all',
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'coping' && (
          <motion.div
            key="coping"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.recommendations.immediate && (
                <ActionCard
                  tone="rose"
                  icon="⚡"
                  title="立即行动"
                  items={report.recommendations.immediate}
                />
              )}
              {report.recommendations.cognitive && (
                <ActionCard
                  tone="blue"
                  icon="💭"
                  title="认知调整"
                  items={report.recommendations.cognitive}
                />
              )}
              {report.recommendations.lifestyle && (
                <ActionCard
                  tone="emerald"
                  icon="🌿"
                  title="生活方式"
                  items={report.recommendations.lifestyle}
                />
              )}
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                🧘 立即可用的放松技术
              </h4>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    color: 'from-sky-400 to-blue-500',
                    icon: '🌬️',
                    label: '呼吸练习',
                    name: report.recommendations.relaxation.breathing.name,
                    desc: report.recommendations.relaxation.breathing.description,
                  },
                  {
                    color: 'from-violet-400 to-purple-500',
                    icon: '🤸',
                    label: '身体放松',
                    name: report.recommendations.relaxation.muscle.name,
                    desc: report.recommendations.relaxation.muscle.description,
                  },
                  {
                    color: 'from-emerald-400 to-teal-500',
                    icon: '🧠',
                    label: '正念练习',
                    name: report.recommendations.relaxation.mindfulness.name,
                    desc: report.recommendations.relaxation.mindfulness.description,
                  },
                ].map(t => (
                  <div
                    key={t.label}
                    className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} text-2xl text-white mb-3`}
                    >
                      {t.icon}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      {t.label}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-800 mb-1.5">
                      {t.name}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'lifestyle' && (
          <motion.div
            key="lifestyle"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {[
              {
                icon: '😴',
                title: '睡眠',
                tone: 'amber',
                items: report.recommendations.healthyHabits.sleep,
              },
              {
                icon: '🥗',
                title: '饮食',
                tone: 'emerald',
                items: report.recommendations.healthyHabits.nutrition,
              },
              {
                icon: '🏃',
                title: '运动',
                tone: 'blue',
                items: report.recommendations.healthyHabits.movement,
              },
              {
                icon: '👫',
                title: '社交',
                tone: 'purple',
                items: report.recommendations.healthyHabits.connection,
              },
            ].map(c => (
              <LifestyleCard key={c.title} {...c} />
            ))}
          </motion.div>
        )}

        {activeTab === 'crisis' && (
          <motion.div
            key="crisis"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {report.resources.professional && (
              <div className="rounded-2xl bg-rose-50 border-2 border-rose-200 p-5 sm:p-6">
                <h4 className="text-lg sm:text-xl font-bold text-rose-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🆘</span> 寻求专业帮助
                </h4>
                <ul className="space-y-2">
                  {report.resources.professional.map((r: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm sm:text-base text-rose-900 leading-relaxed"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </Section>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 text-center"
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-2">下一步,试试这些</h3>
        <p className="text-sm sm:text-base text-slate-300 mb-5">
          把报告带走、分享给信任的人、或者直接进入心理训练
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/training"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 font-semibold transition-colors"
          >
            💪 心理训练
          </Link>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 font-semibold transition-colors"
          >
            🔁 再测一次
          </Link>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 font-semibold transition-colors"
          >
            📈 查看历史
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ====================== SSRS 社会支持 ======================
function SSRSResultDetail({
  result,
  questions,
  answers,
}: {
  result: {
    totalScore: number;
    traits: Array<{ name: string; score: number; description: string }>;
  };
  questions: Question[];
  answers: Record<string, number>;
}) {
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);
  const reduce = useReducedMotion();
  const report = useMemo(
    () => generateDetailedSSRSReport(answers, questions),
    [answers, questions]
  );
  const level = getSSRSLevelInfo(result.totalScore);

  const gradientMap: Record<string, string> = {
    red: 'from-rose-500 to-red-600',
    orange: 'from-orange-500 to-amber-500',
    emerald: 'from-emerald-500 to-cyan-500',
    green: 'from-green-500 to-emerald-600',
  };
  const gradient = gradientMap[level.color] || gradientMap.emerald;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-10 sm:space-y-14">
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} text-white p-6 sm:p-12 shadow-2xl`}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 text-sm font-medium">
            <span>🤝</span> {i18n.results.completed}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {i18n.results.yourSSRS}
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-6">
            {i18n.results.basedOnAnswers}
          </p>
          <div className="text-6xl sm:text-8xl font-black tracking-tight">{result.totalScore}</div>
          <div className="text-base sm:text-lg text-white/80">/ 50 分</div>
          <div className="mt-4 text-2xl sm:text-3xl font-bold">{level.label}</div>
          <p className="mt-2 text-base sm:text-lg text-white/90 max-w-xl mx-auto">
            {level.description}
          </p>
        </div>
      </motion.section>

      <Section title="各维度得分" subtitle="客观支持、主观支持与利用度三方面">
        <div className="grid sm:grid-cols-3 gap-4">
          {report.dimensions.map(d => (
            <div key={d.name} className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5">
              <div className="text-sm text-slate-500 mb-1">{d.name}</div>
              <div className="text-3xl font-extrabold text-cyan-700">
                {d.score}
                <span className="text-base font-medium text-cyan-500 ml-0.5">%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-cyan-100 overflow-hidden">
                <div
                  className="h-full bg-cyan-500"
                  style={{ width: `${Math.min(100, d.score)}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-600">{d.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="最强与最弱维度" subtitle="你最擅长和最需要加强的支持面">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 sm:p-5">
            <div className="text-xs font-medium text-emerald-700 mb-1">💪 你的强项</div>
            <div className="text-lg font-bold text-emerald-800 mb-1">
              {report.strongest.name} · {report.strongest.score}
              <span className="text-sm font-medium text-emerald-600 ml-1">%</span>
            </div>
            <p className="text-sm text-emerald-700">
              {
                SSRS_DIMENSIONS[
                  report.strongest.name === '客观支持'
                    ? 'objective'
                    : report.strongest.name === '主观支持'
                      ? 'subjective'
                      : 'utilization'
                ].highTip
              }
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:p-5">
            <div className="text-xs font-medium text-amber-700 mb-1">🔍 提升空间</div>
            <div className="text-lg font-bold text-amber-800 mb-1">
              {report.weakest.name} · {report.weakest.score}
              <span className="text-sm font-medium text-amber-600 ml-1">%</span>
            </div>
            <p className="text-sm text-amber-700">
              {
                SSRS_DIMENSIONS[
                  report.weakest.name === '客观支持'
                    ? 'objective'
                    : report.weakest.name === '主观支持'
                      ? 'subjective'
                      : 'utilization'
                ].lowTip
              }
            </p>
          </div>
        </div>
      </Section>

      <Section title="建议与提示" subtitle="基于你的结果,以下是几点可行的方向">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <ul className="space-y-2.5">
            {level.advice.map((a, i) => (
              <li key={i} className="flex items-start gap-2.5 text-slate-700">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="专业资源" subtitle="什么时候以及如何寻求专业帮助">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 sm:p-5">
            <div className="text-sm font-semibold text-rose-800 mb-3">📞 何时寻求专业帮助</div>
            <ul className="space-y-2 text-sm text-rose-700">
              {report.resources.whenToSeekHelp.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 sm:p-5">
            <div className="text-sm font-semibold text-sky-800 mb-3">🌐 支持渠道</div>
            <ul className="space-y-2 text-sm text-sky-700">
              {report.resources.channels.map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <BehavioralProfileSection profile={report.behavioralProfile} />
    </div>
  );
}

// ====================== MBI 职业倦怠 ======================
function MBIResultDetail({
  result,
  questions,
  answers,
}: {
  result: {
    totalScore: number;
    traits: Array<{ name: string; score: number; description: string }>;
  };
  questions: Question[];
  answers: Record<string, number>;
}) {
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);
  const reduce = useReducedMotion();
  const report = useMemo(() => generateDetailedMBIReport(answers, questions), [answers, questions]);
  const level = getMBITotalLevel(result.totalScore);

  const gradientMap: Record<string, string> = {
    green: 'from-green-500 to-emerald-600',
    yellow: 'from-amber-500 to-yellow-500',
    orange: 'from-orange-500 to-red-400',
    red: 'from-rose-600 to-red-600',
  };
  const gradient = gradientMap[level.color] || gradientMap.green;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-10 sm:space-y-14">
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} text-white p-6 sm:p-12 shadow-2xl`}
      >
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 text-sm font-medium">
            <span>🔥</span> {i18n.results.completed}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {i18n.results.yourMBI}
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-6">
            {i18n.results.basedOnAnswers}
          </p>
          <div className="text-6xl sm:text-8xl font-black tracking-tight">
            {result.totalScore.toFixed(1)}
          </div>
          <div className="text-base sm:text-lg text-white/80">/ 30 分</div>
          <div className="mt-4 text-2xl sm:text-3xl font-bold">{level.label}</div>
          <p className="mt-2 text-base sm:text-lg text-white/90 max-w-xl mx-auto">
            {level.description}
          </p>
        </div>
      </motion.section>

      <Section title="三维倦怠分" subtitle="情感耗竭、犬儒主义、职业效能 (反向)">
        <div className="grid sm:grid-cols-3 gap-4">
          {report.dimensions.map(d => {
            const colorMap: Record<
              string,
              { bg: string; border: string; text: string; badge: string }
            > = {
              green: {
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                text: 'text-emerald-800',
                badge: 'bg-emerald-100 text-emerald-700',
              },
              yellow: {
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                text: 'text-amber-800',
                badge: 'bg-amber-100 text-amber-700',
              },
              orange: {
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                text: 'text-orange-800',
                badge: 'bg-orange-100 text-orange-700',
              },
              red: {
                bg: 'bg-rose-50',
                border: 'border-rose-200',
                text: 'text-rose-800',
                badge: 'bg-rose-100 text-rose-700',
              },
            };
            const cm = colorMap[d.level.color] || colorMap.green;
            // PE (职业效能) 是反向: 高分=健康 (用 highTip), 低分=问题 (用 lowTip)
            // EX / CY: 高分=倦怠 (用 highTip), 低分=健康 (用 lowTip)
            // 规则: green/yellow 是相对好的一端, orange/red 是相对差的一端
            // 对 PE 来说 "好的一端" = highTip, "差的一端" = lowTip
            // 对 EX/CY 来说 "好的一端" = lowTip, "差的一端" = highTip
            const isPE = d.name.includes('PE') || d.name.includes('职业效能');
            const isHealthy = d.level.color === 'green' || d.level.color === 'yellow';
            const tip = isPE
              ? isHealthy
                ? d.highTip
                : d.lowTip
              : isHealthy
                ? d.lowTip
                : d.highTip;
            return (
              <div key={d.name} className={`rounded-2xl ${cm.bg} border ${cm.border} p-4 sm:p-5`}>
                <div className="text-sm text-slate-600 mb-1">{d.name}</div>
                <div className={`text-2xl font-extrabold ${cm.text}`}>{d.raw}</div>
                <div className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${cm.badge}`}>
                  {d.level.label}
                </div>
                <p className="mt-2 text-sm text-slate-700">{d.description}</p>
                <p className="mt-2 text-sm text-slate-600 italic border-t border-slate-200 pt-2">
                  💡 {tip}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="最需要关注的维度" subtitle="优先从最严重的方向入手">
        {(() => {
          const worst = [...report.dimensions].sort((a, b) => {
            const order: Record<string, number> = { green: 0, yellow: 1, orange: 2, red: 3 };
            return (order[b.level.color] || 0) - (order[a.level.color] || 0);
          })[0];
          if (!worst || worst.level.color === 'green') {
            return (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 sm:p-5">
                <div className="text-sm text-emerald-700">✅ 三维都在健康范围,继续保持</div>
              </div>
            );
          }
          const isCon = worst.level.color === 'red' || worst.level.color === 'orange';
          // PE 反向: 红/橙 = 低 PE = 应显示 lowTip
          // EX/CY: 红/橙 = 高倦怠 = 应显示 highTip
          const isWorstPE = worst.name.includes('PE') || worst.name.includes('职业效能');
          const worstTip = isWorstPE
            ? isCon
              ? worst.lowTip
              : worst.highTip
            : isCon
              ? worst.highTip
              : worst.lowTip;
          return (
            <div
              className={`rounded-2xl p-4 sm:p-5 ${
                worst.level.color === 'red'
                  ? 'bg-rose-50 border border-rose-200'
                  : 'bg-orange-50 border border-orange-200'
              }`}
            >
              <div
                className={`text-xs font-medium mb-1 ${
                  worst.level.color === 'red' ? 'text-rose-700' : 'text-orange-700'
                }`}
              >
                {isCon ? '⚠️ 优先关注' : '📌 持续留意'}
              </div>
              <div
                className={`text-lg font-bold mb-1 ${
                  worst.level.color === 'red' ? 'text-rose-800' : 'text-orange-800'
                }`}
              >
                {worst.name} · {worst.raw} 分 · {worst.level.label}
              </div>
              <p
                className={`text-sm ${
                  worst.level.color === 'red' ? 'text-rose-700' : 'text-orange-700'
                }`}
              >
                {worstTip}
              </p>
            </div>
          );
        })()}
      </Section>

      <Section title="应对策略" subtitle="从立即行动到长期调整">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: '立即行动', items: report.advice.immediate, icon: '⏱️' },
            { title: '工作层面', items: report.advice.work, icon: '🧰' },
            { title: '认知调整', items: report.advice.cognitive, icon: '🧠' },
            { title: '专业支持', items: report.advice.professional, icon: '🩺' },
          ].map(card => (
            <div key={card.title} className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{card.icon}</span>
                <h4 className="font-semibold text-slate-800">{card.title}</h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                {card.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <BehavioralProfileSection profile={report.behavioralProfile} />
    </div>
  );
}

// ====================== SWLS 生活满意度 ======================
function SWLSResultDetail({
  result,
  questions,
  answers,
}: {
  result: {
    totalScore: number;
    traits: Array<{ name: string; score: number; description: string }>;
  };
  questions: Question[];
  answers: Record<string, number>;
}) {
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);
  const reduce = useReducedMotion();
  const report = useMemo(
    () => generateDetailedSWLSReport(answers, questions),
    [answers, questions]
  );
  const level = getSWLSLevelInfo(result.totalScore);

  const gradientMap: Record<string, string> = {
    red: 'from-rose-500 to-red-600',
    orange: 'from-orange-500 to-amber-500',
    yellow: 'from-amber-500 to-yellow-500',
    emerald: 'from-emerald-500 to-cyan-500',
    green: 'from-green-500 to-emerald-600',
  };
  const gradient = gradientMap[level.color] || gradientMap.emerald;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-10 sm:space-y-14">
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} text-white p-6 sm:p-12 shadow-2xl`}
      >
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 text-sm font-medium">
            <span>🌅</span> {i18n.results.completed}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {i18n.results.yourSWLS}
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-6">
            {i18n.results.basedOnAnswers}
          </p>
          <div className="text-6xl sm:text-8xl font-black tracking-tight">{result.totalScore}</div>
          <div className="text-base sm:text-lg text-white/80">/ 35 分</div>
          <div className="mt-4 text-2xl sm:text-3xl font-bold">{level.label}</div>
          <p className="mt-2 text-base sm:text-lg text-white/90 max-w-xl mx-auto">
            {level.description}
          </p>
        </div>
      </motion.section>

      <Section title="详细解读" subtitle="基于你的分数区间">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 sm:p-5">
          <h4 className="text-base font-semibold text-emerald-800 mb-2">{level.label}</h4>
          <p className="text-sm text-emerald-700 mb-3">{level.description}</p>
          {report.interpretation.strengths?.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-emerald-800 mb-1">💪 你的优势</div>
              <ul className="space-y-1.5 text-sm text-emerald-700">
                {report.interpretation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(report.interpretation as any).challenges?.length > 0 && (
            <div>
              <div className="text-xs font-medium text-amber-800 mb-1">🔍 值得关注</div>
              <ul className="space-y-1.5 text-sm text-amber-700">
                {(report.interpretation as any).challenges.map((c: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      {report.advice && report.advice.length > 0 && (
        <Section title="针对性建议" subtitle="基于你当前分数区间的行动指引">
          <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5">
            <ul className="space-y-2 text-sm text-slate-700">
              {report.advice.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <Section title="提升策略" subtitle="关系、心流、意义、健康四个方向">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: '关系', items: report.boost.relationships, icon: '🤝' },
            { title: '心流', items: report.boost.flow, icon: '🌊' },
            { title: '意义', items: report.boost.meaning, icon: '🧭' },
            { title: '健康', items: report.boost.health, icon: '🌿' },
          ].map(card => (
            <div key={card.title} className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{card.icon}</span>
                <h4 className="font-semibold text-slate-800">{card.title}</h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                {card.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <BehavioralProfileSection profile={report.behavioralProfile} />
    </div>
  );
}

// ====================== CD-RISC-10 心理韧性 ======================
function ResilienceResultDetail({
  result,
  questions,
  answers,
}: {
  result: {
    totalScore: number;
    traits: Array<{ name: string; score: number; description: string }>;
  };
  questions: Question[];
  answers: Record<string, number>;
}) {
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);
  const reduce = useReducedMotion();
  const report = useMemo(
    () => generateDetailedResilienceReport(answers, questions),
    [answers, questions]
  );
  const level = getResilienceLevelInfo(result.totalScore);

  const gradientMap: Record<string, string> = {
    red: 'from-rose-500 to-red-600',
    orange: 'from-orange-500 to-amber-500',
    yellow: 'from-amber-500 to-yellow-500',
    emerald: 'from-emerald-500 to-cyan-500',
    green: 'from-green-500 to-emerald-600',
  };
  const gradient = gradientMap[level.color] || gradientMap.emerald;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-10 sm:space-y-14">
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} text-white p-6 sm:p-12 shadow-2xl`}
      >
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 text-sm font-medium">
            <span>🌱</span> {i18n.results.completed}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {i18n.results.yourResilience}
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-6">
            {i18n.results.basedOnAnswers}
          </p>
          <div className="text-6xl sm:text-8xl font-black tracking-tight">{result.totalScore}</div>
          <div className="text-base sm:text-lg text-white/80">/ 40 分</div>
          <div className="mt-4 text-2xl sm:text-3xl font-bold">{level.label}</div>
          <p className="mt-2 text-base sm:text-lg text-white/90 max-w-xl mx-auto">
            {level.description}
          </p>
        </div>
      </motion.section>

      <Section title="各维度得分" subtitle="适应性、关系、意义、自我效能、乐观五维">
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {report.dimensions.map(d => (
            <div key={d.name} className="rounded-2xl bg-white border border-slate-200 p-3 sm:p-4">
              <div className="text-xs text-slate-500 mb-1">{d.name}</div>
              <div className="text-2xl font-extrabold text-lime-700">
                {d.score}
                <span className="text-sm font-medium text-lime-500 ml-0.5">%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-lime-100 overflow-hidden">
                <div
                  className="h-full bg-lime-500"
                  style={{ width: `${Math.min(100, d.score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="最强与最弱维度" subtitle="你最擅长和最需要加强的韧性面">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 sm:p-5">
            <div className="text-xs font-medium text-emerald-700 mb-1">💪 你的强项</div>
            <div className="text-lg font-bold text-emerald-800 mb-1">
              {report.strongest.name} · {report.strongest.score}
              <span className="text-sm font-medium text-emerald-600 ml-1">%</span>
            </div>
            <p className="text-sm text-emerald-700">
              {report.dimensions.find(d => d.name === report.strongest.name)?.highTip}
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:p-5">
            <div className="text-xs font-medium text-amber-700 mb-1">🔍 提升空间</div>
            <div className="text-lg font-bold text-amber-800 mb-1">
              {report.weakest.name} · {report.weakest.score}
              <span className="text-sm font-medium text-amber-600 ml-1">%</span>
            </div>
            <p className="text-sm text-amber-700">
              {report.dimensions.find(d => d.name === report.weakest.name)?.lowTip}
            </p>
          </div>
        </div>
      </Section>

      <Section title="韧性提升路径" subtitle="从今天 / 本周 / 本月 / 长期分层推进">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: '今天', items: report.boost.immediate, icon: '☀️' },
            { title: '本周', items: report.boost.weekly, icon: '🗓️' },
            { title: '本月', items: report.boost.monthly, icon: '📆' },
            { title: '长期', items: report.boost.longTerm, icon: '🏔️' },
          ].map(card => (
            <div
              key={card.title}
              className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{card.icon}</span>
                <h4 className="font-semibold text-slate-800">{card.title}</h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                {card.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-lime-500 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <BehavioralProfileSection profile={report.behavioralProfile} />
    </div>
  );
}

// 结果页面主组件
function ResultPage() {
  const { result, resetAssessment, currentAssessment, questions, answers } = useAppStore();
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);
  const addToast = useToasts(s => s.addToast);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  if (!result) return null;

  const isStressTest = currentAssessment?.id === 'stress-test' || currentAssessment?.id === '2';
  const isGAD7 = currentAssessment?.id === 'anxiety-gad7' || currentAssessment?.id === '3';
  const isSSRS = currentAssessment?.id === 'social-support' || currentAssessment?.id === '4';
  const isMBI = currentAssessment?.id === 'mbi-burnout' || currentAssessment?.id === '5';
  const isSWLS = currentAssessment?.id === 'life-satisfaction' || currentAssessment?.id === '6';
  const isResilience =
    currentAssessment?.id === 'resilience-cdrisc' || currentAssessment?.id === '7';

  // 类型断言
  const displayResult = result as {
    id: string;
    totalScore: number;
    traits: Array<{ name: string; score: number; description: string }>;
    title?: string;
    assessmentId?: string;
    timestamp?: number;
    report?: any;
    rawAnswers?: Record<string, number>;
  };
  const displayQuestions = questions as Question[];

  const handleExport = async (format: 'pdf' | 'html' | 'markdown' | 'text' | 'json') => {
    try {
      await exportService.download(displayResult, format, { language: locale });
      setShowExportMenu(false);
      const msg =
        format === 'pdf'
          ? locale === 'zh'
            ? '已导出 HTML 报告（可用浏览器"打印 → 另存为 PDF"）'
            : 'Exported HTML report (use browser "Print → Save as PDF")'
          : locale === 'zh'
            ? '报告已导出'
            : 'Report exported';
      addToast(msg, 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast(locale === 'zh' ? '导出失败，请重试' : 'Export failed. Please try again.', 'error');
    }
  };

  const handleShare = async () => {
    try {
      const url = await shareService.createShareLink(displayResult, { language: locale });
      setShareUrl(url);
      const qr = await shareService.generateQRCode(url);
      setQrCode(qr || null);
      addToast(locale === 'zh' ? '分享链接已生成' : 'Share link generated', 'success');
    } catch (error) {
      console.error('Share failed:', error);
      addToast(locale === 'zh' ? '生成分享链接失败' : 'Failed to generate share link', 'error');
    }
  };

  const copyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(
        () => addToast(i18n.results.linkCopied, 'success'),
        () => addToast(locale === 'zh' ? '复制失败' : 'Copy failed', 'error')
      );
    }
  };

  return (
    <div className="pb-12">
      {isGAD7 ? (
        <GAD7ResultDetail result={displayResult} questions={displayQuestions} answers={answers} />
      ) : isStressTest ? (
        <StressTestResultDetail
          result={displayResult}
          questions={displayQuestions}
          answers={answers}
        />
      ) : isSSRS ? (
        <SSRSResultDetail result={displayResult} questions={displayQuestions} answers={answers} />
      ) : isMBI ? (
        <MBIResultDetail result={displayResult} questions={displayQuestions} answers={answers} />
      ) : isSWLS ? (
        <SWLSResultDetail result={displayResult} questions={displayQuestions} answers={answers} />
      ) : isResilience ? (
        <ResilienceResultDetail
          result={displayResult}
          questions={displayQuestions}
          answers={answers}
        />
      ) : (
        <BigFiveResultDetail
          result={displayResult}
          questions={displayQuestions}
          answers={answers}
        />
      )}

      {/* 操作工具栏 */}
      <div className="max-w-4xl mx-auto mt-8 sm:mt-12">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
            📋 {i18n.results.reportActions}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 导出按钮 */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full py-2.5 sm:py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm"
              >
                📥 {i18n.results.export}
              </button>
              {showExportMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10 overflow-hidden">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <span>📄</span> {i18n.results.pdfFormat}
                  </button>
                  <button
                    onClick={() => handleExport('html')}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <span>🌐</span> {locale === 'zh' ? 'HTML 网页' : 'HTML Page'}
                  </button>
                  <button
                    onClick={() => handleExport('markdown')}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <span>📝</span> {i18n.results.markdownFormat}
                  </button>
                  <button
                    onClick={() => handleExport('text')}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <span>📃</span> {i18n.results.textFormat}
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <span>📊</span> {i18n.results.jsonFormat}
                  </button>
                </div>
              )}
            </div>

            {/* 分享按钮 */}
            <button
              onClick={handleShare}
              className="w-full py-2.5 sm:py-3 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm"
            >
              🔗 {i18n.results.share}
            </button>

            {/* 训练推荐 */}
            <Link
              to="/training"
              className="w-full py-2.5 sm:py-3 bg-orange-100 text-orange-700 rounded-xl font-semibold hover:bg-orange-200 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-center text-sm"
            >
              💪 {i18n.nav.training}
            </Link>
          </div>

          {/* 分享链接显示 */}
          {shareUrl && (
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-green-700 font-medium whitespace-nowrap">
                  {i18n.results.shareLink}
                </span>
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm text-slate-700 min-w-0"
                  onFocus={e => e.currentTarget.select()}
                />
                <button
                  onClick={copyShareUrl}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  {i18n.results.copy}
                </button>
              </div>
              {qrCode && (
                <div className="flex items-center gap-3 pt-3 border-t border-green-200">
                  <img
                    src={qrCode}
                    alt="QR code"
                    width={120}
                    height={120}
                    className="rounded-lg border border-green-200 bg-white"
                  />
                  <p className="text-xs text-green-700 flex-1">
                    {locale === 'zh'
                      ? '扫描二维码可在手机上打开此分享链接'
                      : 'Scan the QR code to open this share link on your phone'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 行动按钮 */}
      <div className="max-w-4xl mx-auto mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          to="/assessments"
          onClick={resetAssessment}
          className="flex-1 py-3 sm:py-4 bg-white text-blue-600 border-2 border-blue-200 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-center text-sm sm:text-base"
        >
          {i18n.results.retake}
        </Link>
        <Link
          to="/history"
          className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all text-center shadow-lg text-sm sm:text-base"
        >
          {i18n.results.viewHistory}
        </Link>
      </div>
    </div>
  );
}

export default function AssessmentDetail() {
  const { id } = useParams();
  const {
    currentStep,
    setCurrentStep,
    setCurrentAssessment,
    setQuestions,
    resetAssessment,
    assessments,
    setAssessments,
  } = useAppStore();

  // 初始化数据
  useEffect(() => {
    if (assessments.length === 0) {
      setAssessments(mockAssessments);
    }

    if (id) {
      const assessment = mockAssessments.find(a => a.id === id) || mockAssessments[0];
      setCurrentAssessment(assessment);

      const questions = getQuestionsForAssessment(id);
      setQuestions(questions);

      // Don't clobber a result that was just injected by the History page
      // (or that the user already loaded from storage). Only reset when
      // we're landing on the intro for a fresh quiz.
      const state = useAppStore.getState();
      const hasActiveResult = state.result !== null && state.currentStep === 'result';
      if (!hasActiveResult) {
        resetAssessment();
      }
    }
  }, [id, assessments.length, setAssessments, setCurrentAssessment, setQuestions, resetAssessment]);

  const handleStart = () => {
    setCurrentStep('quiz');
  };

  // 根据步骤渲染对应页面
  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return <IntroPage onStart={handleStart} />;
      case 'quiz':
        return <QuizPage />;
      case 'result':
        return <ResultPage />;
      default:
        return <IntroPage onStart={handleStart} />;
    }
  };

  // Brief reveal pause so the user sees a skeleton flash on first
  // mount — same trick as the other data pages. Without this, the
  // store-backed data lands on screen before the route-change
  // animation finishes, which reads as a glitch instead of a
  // transition.
  const ready = useDelayedReveal(500);
  if (!ready) {
    return (
      <div className="space-y-8 text-center" aria-busy="true">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg border border-slate-100 space-y-4">
          <Skeleton shape="circle" className="mx-auto h-16 w-16" />
          <Skeleton className="mx-auto h-8 w-64" />
          <SkeletonText className="mx-auto max-w-2xl" lines={2} />
        </div>
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-2">
              <Skeleton className="h-7 w-12 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
        <Skeleton className="mx-auto h-12 w-40" />
      </div>
    );
  }

  return renderStep();
}
