import { Question, TraitResult } from '../types';
import { 
  BIG_FIVE_TRAITS, 
  TRAIT_INTERPRETATIONS,
  PERSONALITY_COMBINATIONS,
  CAREER_RECOMMENDATIONS
} from '../data/bigFiveData';

/**
 * 大五人格评分算法
 * 
 * 计分规则：
 * 1. 每个特质12题（6正向 + 6反向）
 * 2. 正向题直接计分：1-5
 * 3. 反向题反向计分：6 - score
 * 4. 计算原始分总和
 * 5. 转换为标准T分数（均值50，标准差10）
 */

// 标准大五人格常模（基于大量样本统计）
const NORMS = {
  O: { mean: 36, sd: 7 },  // 开放性
  C: { mean: 38, sd: 6 },  // 尽责性
  E: { mean: 34, sd: 8 },  // 外向性
  A: { mean: 37, sd: 6 },  // 宜人性
  N: { mean: 28, sd: 8 }   // 神经质/情绪稳定性
};

// 特质简写映射
const TRAIT_KEYS = ['O', 'C', 'E', 'A', 'N'] as const;

/**
 * 原始分转T分数
 * T = 50 + 10 * (X - μ) / σ
 */
function rawToTScore(raw: number, mean: number, sd: number): number {
  const tScore = Math.round(50 + 10 * (raw - mean) / sd);
  return Math.max(10, Math.min(90, tScore)); // 限制在10-90之间
}

/**
 * 计算单个题目的得分（考虑反向题）
 */
function calculateQuestionScore(response: number, isReverse: boolean): number {
  if (isReverse) {
    return 6 - response; // 反向计分: 1→5, 2→4, 3→3, 4→2, 5→1
  }
  return response;
}

/**
 * 计算所有特质的得分
 */
export function calculateBigFiveScores(
  answers: Record<string, number>,
  questions: Question[]
): TraitResult[] {
  // 初始化各特质原始分
  const traitRawScores: Record<string, number> = {
    O: 0, C: 0, E: 0, A: 0, N: 0
  };
  
  // 统计各特质题数
  const traitCounts: Record<string, number> = {
    O: 0, C: 0, E: 0, A: 0, N: 0
  };
  
  // 遍历所有题目计算得分
  for (const question of questions) {
    const response = answers[question.id];
    if (response && question.trait) {
      const score = calculateQuestionScore(response, !!question.reverse);
      traitRawScores[question.trait] += score;
      traitCounts[question.trait]++;
    }
  }
  
  // 计算最终结果
  const results: TraitResult[] = TRAIT_KEYS.map((traitKey) => {
    const rawScore = traitRawScores[traitKey];
    const norm = NORMS[traitKey];
    const traitInfo = BIG_FIVE_TRAITS[traitKey];
    
    // 转换为T分数
    const tScore = rawToTScore(rawScore, norm.mean, norm.sd);
    
    // 确定得分层次（高/中/低）
    let interpretation;
    if (tScore >= 60) {
      interpretation = TRAIT_INTERPRETATIONS[traitKey].high;
    } else if (tScore <= 40) {
      interpretation = TRAIT_INTERPRETATIONS[traitKey].low;
    } else {
      // 中等得分
      interpretation = {
        title: `${traitInfo.name}中等`,
        description: `你在${traitInfo.name}方面表现中等，有一定的${traitInfo.description}，但没有特别突出的倾向。`
      };
    }
    
    return {
      name: traitInfo.name,
      score: tScore,
      description: interpretation.description
    };
  });
  
  return results;
}

/**
 * 计算综合得分（基于所有特质）
 */
export function calculateOverallScore(traits: TraitResult[]): number {
  // 简单平均，但对情绪稳定性加倍权重（因为更重要）
  let total = 0;
  let weightSum = 0;
  
  traits.forEach((trait) => {
    const weight = trait.name.includes('情绪') ? 2 : 1;
    total += trait.score * weight;
    weightSum += weight;
  });
  
  return Math.round(total / weightSum);
}

/**
 * 生成详细的大五人格分析报告
 */
export function generateBigFiveReport(
  traits: TraitResult[]
) {
  // 获取各特质的详细解释
  const traitAnalyses = TRAIT_KEYS.map((traitKey) => {
    const trait = traits.find(t => t.name === BIG_FIVE_TRAITS[traitKey].name);
    if (!trait) return null;
    
    const interpretation = trait.score >= 60 
      ? TRAIT_INTERPRETATIONS[traitKey].high
      : trait.score <= 40 
        ? TRAIT_INTERPRETATIONS[traitKey].low
        : {
            title: `${BIG_FIVE_TRAITS[traitKey].name}中等`,
            description: trait.description,
            detailed: null
          };
    
    return {
      key: traitKey,
      ...trait,
      fullInterpretation: interpretation,
      traitInfo: BIG_FIVE_TRAITS[traitKey]
    };
  }).filter(Boolean);

  // 找出最高的3个特质，生成组合分析
  const sortedTraits = [...traits].sort((a, b) => b.score - a.score);
  const topTraits = sortedTraits.slice(0, 3);
  
  // 映射特质名到简写
  const getTraitKey = (name: string) => {
    for (const key of TRAIT_KEYS) {
      if (BIG_FIVE_TRAITS[key].name === name) return key;
    }
    return null;
  };
  
  const topTraitKeys = topTraits.map(t => getTraitKey(t.name)).filter(Boolean) as string[];
  const combinationKey = topTraitKeys.slice(0, 3).join('_');
  const personalityType = PERSONALITY_COMBINATIONS[combinationKey as keyof typeof PERSONALITY_COMBINATIONS];

  // 生成职业推荐（基于高分特质）
  const careerRecommendations = [];
  topTraitKeys.forEach(key => {
    if (key) {
      if (key === 'N') {
        const trait = traits.find(t => t.name === BIG_FIVE_TRAITS.N.name);
        if (trait && trait.score >= 60) {
          careerRecommendations.push(...CAREER_RECOMMENDATIONS.N_high);
        } else if (trait) {
          careerRecommendations.push(...CAREER_RECOMMENDATIONS.N_low);
        }
      } else if (CAREER_RECOMMENDATIONS[key as keyof typeof CAREER_RECOMMENDATIONS]) {
        careerRecommendations.push(...CAREER_RECOMMENDATIONS[key as keyof typeof CAREER_RECOMMENDATIONS]);
      }
    }
  });

  // 去重并限制数量
  const uniqueCareers = [...new Set(careerRecommendations)].slice(0, 8);

  return {
    summary: {
      overallScore: calculateOverallScore(traits),
      topTraits,
      lowestTrait: sortedTraits[sortedTraits.length - 1],
      personalityType
    },
    traitAnalyses,
    recommendations: {
      career: uniqueCareers,
      personalGrowth: traitAnalyses.filter(a => a && a.fullInterpretation?.detailed?.growthAreas)
        .flatMap(a => a?.fullInterpretation?.detailed?.growthAreas || []).slice(0, 6),
      relationships: traitAnalyses.filter(a => a && a.fullInterpretation?.detailed?.relationships)
        .map(a => a?.fullInterpretation?.detailed?.relationships)[0],
      workStyle: traitAnalyses.filter(a => a && a.fullInterpretation?.detailed?.workStyle)
        .map(a => a?.fullInterpretation?.detailed?.workStyle)[0]
    },
    strengths: traitAnalyses.filter(a => a && a.fullInterpretation?.detailed?.strengths)
      .flatMap(a => a?.fullInterpretation?.detailed?.strengths || []).slice(0, 8),
    blindSpots: traitAnalyses.filter(a => a && a.fullInterpretation?.detailed?.potentialChallenges)
      .flatMap(a => a?.fullInterpretation?.detailed?.potentialChallenges || []).slice(0, 6)
  };
}

/**
 * 生成人格画像描述
 */
export function generatePersonalityProfile(traits: TraitResult[]): string {
  // 找到最高和最低的特质
  const sortedTraits = [...traits].sort((a, b) => b.score - a.score);
  const highestTrait = sortedTraits[0];
  const lowestTrait = sortedTraits[4];
  
  const profileParts: string[] = [];
  
  profileParts.push(`你最突出的特质是【${highestTrait.name}】。`);
  
  if (lowestTrait.score < 45) {
    profileParts.push(`相对较弱的是【${lowestTrait.name}】。`);
  }
  
  // 根据组合特点生成描述
  if (traits.find(t => t.name.includes('外向') && t.score > 60)) {
    profileParts.push('你善于社交，喜欢与人交流。');
  } else if (traits.find(t => t.name.includes('外向') && t.score < 40)) {
    profileParts.push('你比较内敛，喜欢安静独处的时间。');
  }
  
  if (traits.find(t => t.name.includes('尽责') && t.score > 60)) {
    profileParts.push('你做事认真负责，值得信赖。');
  }
  
  return profileParts.join(' ');
}

/**
 * 计算答题进度
 */
export function calculateProgress(
  answers: Record<string, number>,
  totalQuestions: number
): { completed: number; percentage: number } {
  const completed = Object.keys(answers).length;
  const percentage = Math.round((completed / totalQuestions) * 100);
  return { completed, percentage };
}
