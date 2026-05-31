import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { mockAssessments, getQuestionsForAssessment } from '../data/mockData';
import { RESPONSE_OPTIONS, BIG_FIVE_TRAITS } from '../data/bigFiveData';
import { 
  STRESS_RESPONSE_OPTIONS, 
  STRESS_LEVELS
} from '../data/stressTestData';
import { calculateProgress, generateBigFiveReport } from '../services/bigFiveScoring';
import { getStressLevelInfo, generateDetailedStressReport } from '../services/stressTestScoring';
import { cn } from '../lib/utils';

// 介绍页面组件
function IntroPage({ onStart }: { onStart: () => void }) {
  const { currentAssessment } = useAppStore();
  
  if (!currentAssessment) return null;
  
  return (
    <div className="space-y-8 text-center">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <div className="text-6xl mb-6">{currentAssessment.icon}</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{currentAssessment.title}</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          {currentAssessment.description}
        </p>
        
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600">{currentAssessment.totalQuestions}</div>
            <div className="text-slate-600">道题目</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600">{currentAssessment.difficulty}</div>
            <div className="text-slate-600">难度等级</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-600">{currentAssessment.estimatedTime}</div>
            <div className="text-slate-600">预计时间</div>
          </div>
        </div>
        
        {currentAssessment.id === 'big-five' && (
          <div className="bg-blue-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-blue-800 mb-3">测评介绍</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              大五人格测评（Five Factor Model）是当今心理学界最权威的性格测评工具之一。
              本测评从<span className="font-semibold">开放性、尽责性、外向性、宜人性、情绪稳定性</span>五个维度
              全面分析你的性格特点。
            </p>
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
            <h3 className="font-semibold text-purple-800 mb-3">测评介绍</h3>
            <p className="text-purple-700 text-sm leading-relaxed">
              压力水平测试基于PSS（知觉压力量表），是心理学界广泛使用的压力评估工具。
              本测评将从<span className="font-semibold">压力感受、应对能力、情绪状态</span>等方面
              全面评估你当前的压力水平。
            </p>
            <div className="mt-4 grid sm:grid-cols-3 gap-2">
              {Object.entries(STRESS_LEVELS).map(([key, level]) => (
                <div key={key} className="bg-white rounded-lg p-2 text-center">
                  <div className="font-medium text-purple-700 text-sm">{level.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-amber-50 rounded-xl p-6 text-left mb-8">
          <h3 className="font-semibold text-amber-800 mb-2">💡 测评提示</h3>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>• 没有对错之分，请根据真实情况选择</li>
            <li>• 第一反应往往最准确，不要过度思考</li>
            <li>• 答案仅用于自我了解，完全保密</li>
          </ul>
        </div>
        
        <button
          onClick={onStart}
          className="px-12 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          开始测评 →
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
    currentAssessment
  } = useAppStore();
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = calculateProgress(answers, questions.length);
  const currentAnswer = answers[currentQuestion.id];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // 根据测评类型选择选项
  const options = (currentAssessment?.id === 'stress-test' || currentAssessment?.id === '2') 
    ? STRESS_RESPONSE_OPTIONS 
    : RESPONSE_OPTIONS;
  
  const handleAnswer = (value: number) => {
    setAnswer(currentQuestion.id, value);
  };
  
  const handleNext = () => {
    if (isLastQuestion) {
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
  const tagColor = (currentAssessment?.id === 'stress-test' || currentAssessment?.id === '2')
    ? 'bg-purple-100 text-purple-700'
    : 'bg-blue-100 text-blue-700';
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* 进度条 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-slate-600">
            第 {currentQuestionIndex + 1} / {questions.length} 题
          </span>
          <span className="text-blue-600 font-medium">
            {progress.percentage}% 已完成
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
      
      {/* 题目卡片 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <div className="text-center mb-8">
          {currentQuestion.trait && (
            <span className={cn("inline-block px-4 py-1 rounded-full text-sm font-medium mb-4", tagColor)}>
              {currentQuestion.trait === 'negative' ? '压力感受' : 
               currentQuestion.trait === 'positive' ? '应对能力' :
               BIG_FIVE_TRAITS[currentQuestion.trait as keyof typeof BIG_FIVE_TRAITS]?.name || 
               currentQuestion.trait}
            </span>
          )}
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed">
            {currentQuestion.text}
          </h3>
        </div>
        
        {/* 选项 */}
        <div className="space-y-3 mb-8">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={cn(
                "w-full p-4 rounded-xl text-left transition-all border-2",
                currentAnswer === option.value
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option.label}</span>
                <span className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                  currentAnswer === option.value
                    ? "border-blue-500 bg-blue-500"
                    : "border-slate-300"
                )}>
                  {currentAnswer === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        {/* 导航按钮 */}
        <div className="flex gap-4">
          {!isFirstQuestion && (
            <button
              onClick={handlePrevious}
              className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              ← 上一题
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className={cn(
              "flex-1 py-4 rounded-xl font-semibold transition-all",
              currentAnswer
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {isLastQuestion ? "完成测评 ✓" : "下一题 →"}
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
  answers
}: { 
  result: {
    totalScore: number;
    traits: Array<{ name: string; score: number; description: string }>;
  };
  questions?: unknown[];
  answers?: Record<string, number>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void { questions, answers };
  
  const report = useMemo(() => generateBigFiveReport(result.traits), [result.traits]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 头部 */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-6 py-2 mb-4">
          <span className="font-semibold text-yellow-700">🎉 测评完成！</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">你的性格分析报告</h2>
        <p className="text-lg text-slate-600">基于你的回答，这是你的详细分析</p>
      </div>

      {/* 综合得分 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 text-center">
        <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          {report.summary.overallScore}
        </div>
        <div className="text-slate-600 mb-4">综合得分</div>
        {report.summary.personalityType && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4">
            <h4 className="font-bold text-lg text-blue-800 mb-2">
              🎯 {report.summary.personalityType.typeName}
            </h4>
            <p className="text-slate-700">{report.summary.personalityType.description}</p>
          </div>
        )}
        <p className="text-lg text-slate-700 max-w-xl mx-auto leading-relaxed">
          你最突出的特质是【{report.summary.topTraits[0].name}】，{report.summary.topTraits[0].description}
        </p>
      </div>

      {/* 优势与盲点 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">💪 你的优势</h3>
          <div className="space-y-2">
            {report.strengths.map((strength: string, index: number) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-xl">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-slate-700">{strength}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">🔍 注意事项</h3>
          <div className="space-y-2">
            {report.blindSpots.map((spot: string, index: number) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
                <span className="text-amber-600 font-bold">!</span>
                <p className="text-slate-700">{spot}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 五维度详细分析 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">五维度详细分析</h3>
        <div className="space-y-8">
          {report.traitAnalyses.map((analysis: { 
            name: string; 
            score: number; 
            description: string; 
            fullInterpretation?: { 
              detailed?: { 
                strengths?: string[]; 
                potentialChallenges?: string[]; 
              } 
            } 
          }, index: number) => {
            if (!analysis) return null;
            
            const isHigh = analysis.score >= 60;
            const isLow = analysis.score <= 40;
            
            const colorClass = isHigh 
              ? 'from-green-400 to-emerald-500' 
              : isLow 
                ? 'from-red-400 to-rose-500' 
                : 'from-yellow-400 to-orange-500';
            
            return (
              <div key={index} className="space-y-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-slate-800">{analysis.name}</span>
                  <span className="text-2xl font-bold text-slate-700">{analysis.score}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4">
                  <div 
                    className={cn("h-4 rounded-full bg-gradient-to-r transition-all duration-1000", colorClass)}
                    style={{ width: `${Math.min(analysis.score, 90)}%` }}
                  />
                </div>
                
                {analysis.fullInterpretation?.detailed && (
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {analysis.fullInterpretation.detailed.strengths && (
                      <div className="bg-green-50 rounded-xl p-4">
                        <h5 className="font-semibold text-green-800 mb-2">优势表现</h5>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {analysis.fullInterpretation.detailed.strengths.slice(0, 3).map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">•</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.fullInterpretation.detailed.potentialChallenges && (
                      <div className="bg-amber-50 rounded-xl p-4">
                        <h5 className="font-semibold text-amber-800 mb-2">需要注意</h5>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {analysis.fullInterpretation.detailed.potentialChallenges.slice(0, 3).map((c: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-600 mt-0.5">•</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-slate-600">{analysis.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 职业推荐 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">💼 适合的职业方向</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {report.recommendations.career.map((career: string, index: number) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 text-center">
              <span className="font-medium text-blue-800">{career}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 个人成长建议 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">🌱 个人成长建议</h3>
        <div className="space-y-3">
          {report.recommendations.personalGrowth.map((tip: string, index: number) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <span className="text-blue-600 font-bold">→</span>
              <p className="text-slate-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 压力测试详细结果组件
function StressTestResultDetail({ 
  result, 
  questions, 
  answers 
}: { 
  result: {
    totalScore: number;
    traits: Array<{ name: string; score: number; description: string }>;
  };
  questions: unknown[];
  answers: Record<string, number>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const report = useMemo(() => generateDetailedStressReport(answers, questions as any), [answers, questions]);
  const stressLevelInfo = getStressLevelInfo(result.totalScore);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 头部 */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-6 py-2 mb-4">
          <span className="font-semibold text-blue-700">🎉 测评完成！</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">你的压力分析报告</h2>
        <p className="text-lg text-slate-600">基于你的回答，这是你的压力状态分析</p>
      </div>

      {/* 压力水平总体评估 */}
      <div className={`bg-white rounded-3xl p-8 shadow-lg border-2 ${stressLevelInfo.color === 'green' ? 'border-green-200' : stressLevelInfo.color === 'yellow' ? 'border-yellow-200' : 'border-red-200'}`}>
        <div className="text-center">
          <div className="text-6xl font-bold mb-2" style={{ color: stressLevelInfo.color === 'green' ? '#10b981' : stressLevelInfo.color === 'yellow' ? '#f59e0b' : '#ef4444' }}>
            {report.summary.score}
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{report.summary.title}</h3>
          <p className="text-lg text-slate-600 mb-4">{report.summary.description}</p>
        </div>
      </div>

      {/* 详细表现分析 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">📊 你的压力表现</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {report.detailedAnalysis.signs.physicalSigns && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h5 className="font-semibold text-blue-800 mb-3">🏃 身体表现</h5>
              <ul className="text-sm text-slate-700 space-y-2">
                {report.detailedAnalysis.signs.physicalSigns.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.detailedAnalysis.signs.emotionalSigns && (
            <div className="bg-purple-50 rounded-xl p-4">
              <h5 className="font-semibold text-purple-800 mb-3">💭 情绪表现</h5>
              <ul className="text-sm text-slate-700 space-y-2">
                {report.detailedAnalysis.signs.emotionalSigns.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.detailedAnalysis.signs.cognitiveSigns && (
            <div className="bg-green-50 rounded-xl p-4">
              <h5 className="font-semibold text-green-800 mb-3">🧠 思维表现</h5>
              <ul className="text-sm text-slate-700 space-y-2">
                {report.detailedAnalysis.signs.cognitiveSigns.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 三维度分析 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">压力详细分析</h3>
        <div className="space-y-6">
          {result.traits.map((trait: { name: string; score: number; description: string }, index: number) => {
            let colorClass = 'from-green-400 to-emerald-500';
            if (trait.name === '压力水平') {
              colorClass = trait.score <= 13 ? 'from-green-400 to-emerald-500' :
                          trait.score <= 26 ? 'from-yellow-400 to-orange-500' :
                          'from-red-400 to-rose-500';
            } else if (trait.name === '压力感受') {
              colorClass = trait.score >= 50 ? 'from-yellow-400 to-orange-500' : 'from-green-400 to-emerald-500';
            } else if (trait.name === '应对能力') {
              colorClass = trait.score >= 50 ? 'from-green-400 to-emerald-500' : 'from-yellow-400 to-orange-500';
            }
            
            return (
              <div key={index} className="space-y-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-slate-800">{trait.name}</span>
                  <span className="text-2xl font-bold text-slate-700">{trait.score}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4">
                  <div 
                    className={cn("h-4 rounded-full bg-gradient-to-r transition-all duration-1000", colorClass)}
                    style={{ width: `${Math.min(trait.score, 90)}%` }}
                  />
                </div>
                <p className="text-slate-600">{trait.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 应对策略 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">🛠️ 应对策略</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-3">问题导向</h4>
            <ul className="text-sm text-slate-700 space-y-2">
              {report.recommendations.strategies.problemFocused.map((s: { name: string; description: string }, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  {s.name}: {s.description}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <h4 className="font-semibold text-purple-800 mb-3">情绪导向</h4>
            <ul className="text-sm text-slate-700 space-y-2">
              {report.recommendations.strategies.emotionFocused.map((s: { name: string; description: string }, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  {s.name}: {s.description}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <h4 className="font-semibold text-amber-800 mb-3">回避策略</h4>
            <ul className="text-sm text-slate-700 space-y-2">
              {report.recommendations.strategies.avoidance.map((s: { name: string; description: string }, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  {s.name}: {s.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 放松技术 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">🧘 放松技术</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">🌬️ 呼吸练习</h4>
            <p className="text-sm text-slate-700">{(report.recommendations.relaxation.breathing as { name: string; description: string }).name}: {(report.recommendations.relaxation.breathing as { name: string; description: string }).description}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">🤸 身体放松</h4>
            <p className="text-sm text-slate-700">{(report.recommendations.relaxation.body as { name: string; description: string }).name}: {(report.recommendations.relaxation.body as { name: string; description: string }).description}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <h4 className="font-semibold text-purple-800 mb-2">🧠 心理调节</h4>
            <p className="text-sm text-slate-700">{(report.recommendations.relaxation.mental as { name: string; description: string }).name}: {(report.recommendations.relaxation.mental as { name: string; description: string }).description}</p>
          </div>
        </div>
      </div>

      {/* 健康习惯 */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">🌿 健康习惯</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-amber-50 rounded-xl p-4">
            <h4 className="font-semibold text-amber-800 mb-2">😴 睡眠</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              {report.recommendations.healthyHabits.sleep.map((h: string, i: number) => (
                <li key={i}>• {h}</li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">🥗 饮食</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              {report.recommendations.healthyHabits.nutrition.map((h: string, i: number) => (
                <li key={i}>• {h}</li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">🏃 运动</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              {report.recommendations.healthyHabits.movement.map((h: string, i: number) => (
                <li key={i}>• {h}</li>
              ))}
            </ul>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <h4 className="font-semibold text-purple-800 mb-2">👫 社交</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              {report.recommendations.healthyHabits.social.map((h: string, i: number) => (
                <li key={i}>• {h}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 结果页面主组件
function ResultPage() {
  const { result, resetAssessment, currentAssessment, questions, answers } = useAppStore();
  
  if (!result) return null;
  
  const isStressTest = currentAssessment?.id === 'stress-test' || currentAssessment?.id === '2';
  
  // 类型断言
  const displayResult = result as { 
    totalScore: number; 
    traits: Array<{ name: string; score: number; description: string }>; 
  };
  const displayQuestions = questions as unknown[];
  
  return (
    <div className="pb-12">
      {isStressTest ? (
        <StressTestResultDetail result={displayResult} questions={displayQuestions} answers={answers} />
      ) : (
        <BigFiveResultDetail result={displayResult} questions={displayQuestions} answers={answers} />
      )}
      
      {/* 行动按钮 */}
      <div className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row gap-4">
        <Link
          to="/assessments"
          onClick={resetAssessment}
          className="flex-1 py-4 bg-white text-blue-600 border-2 border-blue-200 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-center"
        >
          再测一次
        </Link>
        <Link
          to="/history"
          className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all text-center shadow-lg"
        >
          查看历史记录
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
    setAssessments
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
      
      resetAssessment();
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
  
  return renderStep();
}
