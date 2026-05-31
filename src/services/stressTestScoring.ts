import { Question, TraitResult } from '../types';
import { 
  STRESS_LEVELS,
  COPING_STRATEGIES,
  STRESS_STAGES,
  PERFORMANCE_CURVE,
  RELAXATION_TECHNIQUES,
  HEALTHY_HABITS,
  PROFESSIONAL_RESOURCES
} from '../data/stressTestData';

/**
 * 压力测试评分算法
 * 
 * 基于PSS (Perceived Stress Scale) 标准：
 * - 负向题目：直接计分 (0-4)
 * - 正向题目：反向计分 (4 - response)
 * - 总分范围：0-40
 * 
 * 评分解释：
 * - 0-13分：低压力
 * - 14-26分：中等压力
 * - 27-40分：高压力
 */

/**
 * 计算单个题目的得分（考虑反向计分）
 */
function calculateQuestionScore(response: number, isReverse: boolean): number {
  if (isReverse) {
    return 4 - response; // 反向计分
  }
  return response; // 直接计分
}

/**
 * 计算压力测试总分和详细分析
 */
export function calculateStressTestScore(
  answers: Record<string, number>,
  questions: Question[]
) {
  let totalScore = 0;
  let negativeScore = 0;
  let positiveScore = 0;
  const questionDetails = [];

  // 计算各维度得分
  for (const question of questions) {
    const response = answers[question.id];
    if (response !== undefined) {
      const score = calculateQuestionScore(response, !!question.reverse);
      totalScore += score;
      
      const detail = {
        id: question.id,
        text: question.text,
        trait: question.trait,
        response: response,
        score: score
      };
      
      questionDetails.push(detail);
      
      if (question.trait === 'negative') {
        negativeScore += score;
      } else if (question.trait === 'positive') {
        positiveScore += score;
      }
    }
  }

  // 确定压力水平
  let level: keyof typeof STRESS_LEVELS;
  if (totalScore <= 13) {
    level = 'low';
  } else if (totalScore <= 26) {
    level = 'medium';
  } else {
    level = 'high';
  }

  const levelInfo = STRESS_LEVELS[level];

  // 分析压力阶段（基于GAS理论）
  let stage;
  if (totalScore <= 8) {
    stage = STRESS_STAGES.alarm;
  } else if (totalScore <= 20) {
    stage = STRESS_STAGES.resistance;
  } else {
    stage = STRESS_STAGES.exhaustion;
  }

  // 分析表现曲线位置
  let performancePoint;
  if (totalScore <= 10) {
    performancePoint = PERFORMANCE_CURVE.tooLow;
  } else if (totalScore <= 20) {
    performancePoint = PERFORMANCE_CURVE.optimal;
  } else {
    performancePoint = PERFORMANCE_CURVE.tooHigh;
  }

  // 推荐个性化的应对策略
  const recommendedStrategies = {
    problemFocused: COPING_STRATEGIES.problemFocused.slice(0, 2),
    emotionFocused: COPING_STRATEGIES.emotionFocused.slice(0, 2),
    avoidance: COPING_STRATEGIES.avoidance.slice(0, 2)
  };

  // 推荐放松技术
  const recommendedRelaxation = {
    breathing: RELAXATION_TECHNIQUES.breathing[0],
    body: RELAXATION_TECHNIQUES.body[0],
    mental: RELAXATION_TECHNIQUES.mental[0]
  };

  return {
    totalScore,
    level,
    levelInfo,
    stage,
    performancePoint,
    details: {
      negativeScore,
      positiveScore,
      negativePercentage: Math.round((negativeScore / 28) * 100), // 7题×4分
      positivePercentage: Math.round((positiveScore / 28) * 100),
      questionDetails
    },
    recommendations: {
      strategies: recommendedStrategies,
      relaxation: recommendedRelaxation,
      healthyHabits: HEALTHY_HABITS,
      professionalResources: level === 'high' ? PROFESSIONAL_RESOURCES : null
    }
  };
}

/**
 * 生成压力测试特质结果（用于展示）
 */
export function calculateStressTestTraits(
  answers: Record<string, number>,
  questions: Question[]
): TraitResult[] {
  const result = calculateStressTestScore(answers, questions);
  
  return [
    {
      name: '压力水平',
      score: result.totalScore,
      description: `${result.levelInfo.name} (0-40分量表)`
    },
    {
      name: '压力感受',
      score: Math.round((result.details.negativeScore / 28) * 100),
      description: '负向情绪和压力感受程度'
    },
    {
      name: '应对能力',
      score: Math.round((result.details.positiveScore / 28) * 100),
      description: '应对压力和保持平静的能力'
    }
  ];
}

/**
 * 获取压力水平信息（简单版）
 */
export function getStressLevelInfo(totalScore: number) {
  let level: keyof typeof STRESS_LEVELS;
  if (totalScore <= 13) {
    level = 'low';
  } else if (totalScore <= 26) {
    level = 'medium';
  } else {
    level = 'high';
  }
  return STRESS_LEVELS[level];
}

/**
 * 生成详细分析报告
 */
export function generateDetailedStressReport(
  answers: Record<string, number>,
  questions: Question[]
) {
  const result = calculateStressTestScore(answers, questions);
  
  return {
    summary: {
      title: `${result.levelInfo.name}`,
      score: result.totalScore,
      description: result.levelInfo.description,
      color: result.levelInfo.color
    },
    detailedAnalysis: {
      signs: result.levelInfo.detailed,
      stage: result.stage,
      performance: result.performancePoint
    },
    recommendations: {
      immediate: result.levelInfo.recommendations,
      dailyPractices: result.levelInfo.dailyPractices,
      strategies: result.recommendations.strategies,
      relaxation: result.recommendations.relaxation,
      healthyHabits: result.recommendations.healthyHabits,
      professional: result.recommendations.professionalResources
    },
    resources: {
      available: result.levelInfo.resources,
      professional: result.recommendations.professionalResources
    }
  };
}
