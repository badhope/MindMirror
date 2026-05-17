import { normalizeResult } from './normalizeResult'
import { standardCalculators } from './index'
import type { AssessmentResult, Dimension } from '../../types'

interface CalculationContext {
  assessmentId: string
  answers: number[]
  mode: 'normal' | 'advanced' | 'professional'
}

interface CalculationMetadata {
  calculatorUsed: string
  calculationTime: number
  fallbackUsed: boolean
  entropy?: number
  reliability?: number
}

interface CalculationResult {
  result: AssessmentResult
  metadata: CalculationMetadata
}

class CalculatorEngine {
  private static instance: CalculatorEngine

  private constructor() {}

  static getInstance(): CalculatorEngine {
    if (!CalculatorEngine.instance) {
      CalculatorEngine.instance = new CalculatorEngine()
    }
    return CalculatorEngine.instance
  }

  // 安全验证 answers 数组
  private validateAnswers(answers: unknown): number[] {
    if (!Array.isArray(answers)) return []
    return answers
      .map(a => typeof a === 'number' ? a : 0)
      .map(v => Math.max(0, Math.min(100, v)))
  }

  async calculate(context: CalculationContext): Promise<CalculationResult> {
    const startTime = performance.now()
    const { assessmentId, answers, mode } = context

    try {
      const validatedAnswers = this.validateAnswers(answers)
      const result = await this.executeCalculator(assessmentId, validatedAnswers, mode)
      const normalizedResult = normalizeResult(result, assessmentId)
      const calculationTime = performance.now() - startTime

      return {
        result: normalizedResult,
        metadata: {
          calculatorUsed: mode === 'professional' ? 'professional' : 'standard',
          calculationTime,
          fallbackUsed: false,
        },
      }
    } catch (primaryError) {
      console.warn(`[CalculatorEngine] 主计算器失败 (${assessmentId}):`, primaryError)

      try {
        const validatedAnswers = this.validateAnswers(answers)
        const fallbackResult = this.fallbackCalculate(assessmentId, validatedAnswers)
        const normalizedResult = normalizeResult(fallbackResult, assessmentId)
        const calculationTime = performance.now() - startTime

        return {
          result: normalizedResult,
          metadata: {
            calculatorUsed: 'fallback',
            calculationTime,
            fallbackUsed: true,
          },
        }
      } catch (fallbackError) {
        console.error(`[CalculatorEngine] 降级计算器也失败 (${assessmentId}):`, fallbackError)
        const calculationTime = performance.now() - startTime

        const validatedAnswers = this.validateAnswers(answers)
        return {
          result: this.emergencyResult(assessmentId, validatedAnswers),
          metadata: {
            calculatorUsed: 'emergency',
            calculationTime,
            fallbackUsed: true,
          },
        }
      }
    }
  }

  private async executeCalculator(
    assessmentId: string,
    answers: number[],
    mode: string
  ): Promise<AssessmentResult> {
    if (mode === 'professional') {
      try {
        const { calculateProfessionalResult } = await import('../professionalCalculators')
        return await calculateProfessionalResult(assessmentId, answers, mode)
      } catch (e) {
        console.warn('Professional calculator failed, falling back:', e)
      }
    }

    // 首先尝试从standardCalculators中查找 - 这是最可靠的方式
    if (standardCalculators[assessmentId]) {
      try {
        return standardCalculators[assessmentId](answers)
      } catch (e) {
        console.warn('Standard calculator failed:', assessmentId, e)
      }
    }

    // 然后尝试从模块中查找resultCalculator
    const assessmentModule = await this.loadAssessmentModule(assessmentId)
    if (assessmentModule?.resultCalculator) {
      try {
        return assessmentModule.resultCalculator(answers)
      } catch (e) {
        console.warn('Module resultCalculator failed:', assessmentId, e)
      }
    }

    // 最后尝试professional fallback
    try {
      const { calculateProfessionalResult } = await import('../professionalCalculators')
      return await calculateProfessionalResult(assessmentId, answers, mode)
    } catch (e) {
      console.warn('Professional fallback also failed:', e)
      // 如果所有都失败，使用紧急fallback
      return this.fallbackCalculate(assessmentId, answers)
    }
  }

  private async loadAssessmentModule(assessmentId: string): Promise<any> {
    try {
      // 核心测评模块注册表
      const coreModuleMap: Record<string, () => Promise<any>> = {
        // 核心专业测评
        'ocean-bigfive': () => import('../../data/assessments/ocean-bigfive'),
        'dark-triad': () => import('../../data/assessments/dark-triad'),
        'dark-triangle': () => import('../../data/assessments/dark-triad'), // 兼容ID
        'eq-goleman': () => import('../../data/assessments/eq-goleman'),
        'ecr-attachment': () => import('../../data/assessments/ecr-attachment'),
        'scl90': () => import('../../data/assessments/scl90-symptoms'),
        'scl90-symptoms': () => import('../../data/assessments/scl90-symptoms'),
        'sas-standard': () => import('../../data/assessments/sas-standard'),
        'sleep-quality': () => import('../../data/assessments/sleep-quality'),
        'holland-sds': () => import('../../data/assessments/holland-sds'),
        'burnout-mbi': () => import('../../data/assessments/burnout-mbi'),
        'cast-parenting': () => import('../../data/assessments/cast-parenting'),
        'ideology-9square': () => import('../../data/assessments/ideology-9square'),
        'iq-ravens': () => import('../../data/assessments/iq-ravens'),
        'gma-maturity': () => import('../../data/assessments/gma-maturity'),
        'mental-age': () => import('../../data/assessments/mental-age'),
        'sbti-personality': () => import('../../data/assessments/sbti-personality'),
        'schwartz-standard': () => import('../../data/assessments/schwartz-standard'),
        'tki-standard': () => import('../../data/assessments/tki-standard'),
        'sds-standard': () => import('../../data/assessments/sds-standard'),
        'pss-stress': () => import('../../data/assessments/pss-stress'),
        'pss-standard': () => import('../../data/assessments/pss-standard'),
        'mindset-standard': () => import('../../data/assessments/mindset-standard'),
        'metacognition-standard': () => import('../../data/assessments/metacognition-standard'),
        'ocb-standard': () => import('../../data/assessments/ocb-standard'),
        'pcq-standard': () => import('../../data/assessments/pcq-standard'),
        'philo-spectrum': () => import('../../data/assessments/philo-spectrum'),
        'life-meaning': () => import('../../data/assessments/life-meaning'),
        'mlq-standard': () => import('../../data/assessments/mlq-standard'),
        'kolb-standard': () => import('../../data/assessments/kolb-standard'),
        'hardiness-standard': () => import('../../data/assessments/hardiness-standard'),
        'els-standard': () => import('../../data/assessments/els-standard'),
        'asi-standard': () => import('../../data/assessments/asi-standard'),
        'attention-test': () => import('../../data/assessments/attention-test'),
        'mft-standard': () => import('../../data/assessments/mft-standard'),
        
        // 趣味测评
        'slacking-purity': () => import('../../data/assessments/slacking-purity'),
        'moyu-purity': () => import('../../data/assessments/slacking-purity'), // 别名
        'foodie-level': () => import('../../data/assessments/foodie-level'),
        'internet-addiction': () => import('../../data/assessments/internet-addiction'),
        'sexual-experience': () => import('../../data/assessments/sexual-experience'),
        'onepiece-bounty': () => import('../../data/assessments/onepiece-bounty'),
        'abm-love-animal': () => import('../../data/assessments/abm-love-animal'),
        'color-subconscious': () => import('../../data/assessments/color-subconscious'),
        'lacan-diagnosis': () => import('../../data/assessments/lacan-diagnosis'),
        'pua-resistance': () => import('../../data/assessments/pua-resistance'),
        'officialdom-dream': () => import('../../data/assessments/officialdom-dream'),
        'patriotism-purity': () => import('../../data/assessments/patriotism-purity'),
        'patriot-purity': () => import('../../data/assessments/patriotism-purity'), // 别名
        'fubao-index': () => import('../../data/assessments/fubao-index'),
        
        // 娱乐测评
        'love-languages': () => import('../../data/entertainment/love-languages'),
        'love-language': () => import('../../data/entertainment/love-languages'),
        'enneagram': () => import('../../data/entertainment/enneagram'),
        'disc': () => import('../../data/entertainment/disc-personalities'),
        'disc-personalities': () => import('../../data/entertainment/disc-personalities'),
        'pdp-personalities': () => import('../../data/entertainment/pdp-personalities'),
        'dnd-alignment': () => import('../../data/entertainment/dnd-alignment'),
        'love-style': () => import('../../data/entertainment/love-style'),
        'harrypotter': () => import('../../data/entertainment/harrypotter'),
        'naruto': () => import('../../data/entertainment/naruto'),
        
        // 兼容性别名
        'bigfive': () => import('../../data/assessments/ocean-bigfive'),
        'big-five': () => import('../../data/assessments/ocean-bigfive'),
        'mbti': () => import('../../data/assessments/sbti-personality'),
        'mbti-standard': () => import('../../data/assessments/sbti-personality'),
        'attachment': () => import('../../data/assessments/ecr-attachment'),
        'attachment-style': () => import('../../data/assessments/ecr-attachment'),
        'political': () => import('../../data/assessments/ideology-9square'),
        'political-ideology': () => import('../../data/assessments/ideology-9square'),
        'political-compass': () => import('../../data/assessments/ideology-9square'),
        'via-character': () => import('../../data/assessments/eq-goleman'), // 临时兼容
        'anxiety': () => import('../../data/assessments/sas-standard'),
        'depression': () => import('../../data/assessments/sds-standard'),
        'sds-depression': () => import('../../data/assessments/sds-standard'),
        'stress': () => import('../../data/assessments/pss-standard'),
        'moyu': () => import('../../data/assessments/slacking-purity'),
        'onepiece': () => import('../../data/assessments/onepiece-bounty'),
        'bounty': () => import('../../data/assessments/onepiece-bounty'),
        'philo': () => import('../../data/assessments/philo-spectrum'),
        'schwartz': () => import('../../data/assessments/schwartz-standard'),
        'values': () => import('../../data/assessments/schwartz-standard'),
        'mft': () => import('../../data/assessments/mft-standard'),
        'moral-foundations': () => import('../../data/assessments/mft-standard'),
        'tki': () => import('../../data/assessments/tki-standard'),
        'conflict-style': () => import('../../data/assessments/tki-standard'),
        'els': () => import('../../data/assessments/els-standard'),
        'emotional-labor': () => import('../../data/assessments/els-standard'),
        'ocb': () => import('../../data/assessments/ocb-standard'),
        'organizational-citizenship': () => import('../../data/assessments/ocb-standard'),
        'growth-mindset': () => import('../../data/assessments/mindset-standard'),
        'meta-cognitive': () => import('../../data/assessments/metacognition-standard'),
        'metacognition': () => import('../../data/assessments/metacognition-standard'),
        'focus': () => import('../../data/assessments/attention-test'),
        'learning-style': () => import('../../data/assessments/kolb-standard'),
        'kolb': () => import('../../data/assessments/kolb-standard'),
        'meaning-in-life': () => import('../../data/assessments/mlq-standard'),
        'mlq': () => import('../../data/assessments/mlq-standard'),
        'authoritarian': () => import('../../data/assessments/asi-standard'),
        'asi': () => import('../../data/assessments/asi-standard'),
        'psychological-hardiness': () => import('../../data/assessments/hardiness-standard'),
        'hardiness': () => import('../../data/assessments/hardiness-standard'),
        'slack-off': () => import('../../data/assessments/slacking-purity'),
        'slacking': () => import('../../data/assessments/slacking-purity'),
        'patriotism': () => import('../../data/assessments/patriotism-purity'),
        'general-mental-ability': () => import('../../data/assessments/gma-maturity'),
        'gma': () => import('../../data/assessments/gma-maturity'),
        'cast': () => import('../../data/assessments/cast-parenting'),
        'philosophy': () => import('../../data/assessments/philo-spectrum'),
        'lacan': () => import('../../data/assessments/lacan-diagnosis'),
        'pua': () => import('../../data/assessments/pua-resistance'),
        'fubao': () => import('../../data/assessments/fubao-index'),
        'job-burnout': () => import('../../data/assessments/burnout-mbi'),
        'burnout': () => import('../../data/assessments/burnout-mbi'),
        'career-interest': () => import('../../data/assessments/holland-sds'),
        'holland': () => import('../../data/assessments/holland-sds'),
        'emotional-intelligence': () => import('../../data/assessments/eq-goleman'),
        'eq': () => import('../../data/assessments/eq-goleman'),
        'iq': () => import('../../data/assessments/iq-ravens'),
        'iq-test': () => import('../../data/assessments/iq-ravens'),
        'love-animal': () => import('../../data/assessments/abm-love-animal'),
        'mental-age': () => import('../../data/assessments/mental-age'),
        'sbti': () => import('../../data/assessments/sbti-personality'),
        'officialdom': () => import('../../data/assessments/officialdom-dream'),
        'psqi': () => import('../../data/assessments/sleep-quality'),
        'sleep': () => import('../../data/assessments/sleep-quality'),
        'sleep-assessment': () => import('../../data/assessments/sleep-quality'),
      }
      
      // 首先尝试核心注册表
      const coreLoader = coreModuleMap[assessmentId]
      if (coreLoader) {
        const mod = await coreLoader()
        return mod.default || mod
      }
      
      // 动态发现机制 - 尝试常见路径
      const possiblePaths = [
        `../../data/assessments/${assessmentId}`,
        `../../data/professional/${assessmentId}`,
        `../../data/entertainment/${assessmentId}`,
      ]
      
      for (const path of possiblePaths) {
        try {
          const mod = await import(/* @vite-ignore */ path)
          if (mod) {
            console.log(`[CalculatorEngine] 动态加载成功: ${assessmentId}`)
            return mod.default || mod
          }
        } catch (e) {
          // 继续尝试下一个路径
        }
      }
      
    } catch (e) {
      console.warn(`[CalculatorEngine] 无法加载测评模块 ${assessmentId}:`, e)
    }
    return null
  }

  private fallbackCalculate(assessmentId: string, answers: number[]): AssessmentResult {
    const validAnswers = answers.filter(a => typeof a === 'number' && !isNaN(a) && a >= 0 && a <= 100)
    
    if (validAnswers.length === 0) {
      return this.emergencyResult(assessmentId, answers)
    }
    
    const sum = validAnswers.reduce((s, a) => s + a, 0)
    const avg = sum / validAnswers.length
    const maxPossible = validAnswers.length * 5
    const percentage = maxPossible > 0 ? Math.round((sum / maxPossible) * 100) : 0
    
    // 计算方差和分布
    const variance = validAnswers.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / validAnswers.length
    const stdDev = Math.sqrt(variance)
    
    // 分析回答模式
    const answerDistribution = this.analyzeAnswerDistribution(validAnswers)
    
    // 生成更有意义的维度
    const dimensions = this.generateFallBackDimensions(validAnswers, avg, variance)
    
    // 智能推荐建议
    const suggestions = this.generateSmartSuggestions(answerDistribution, avg, variance)
    
    return {
      type: assessmentId,
      score: percentage,
      accuracy: Math.max(50, Math.min(80, 70 + (validAnswers.length - 10) * 0.5)),
      title: '基础分析报告',
      description: `基于 ${validAnswers.length} 道题目的智能分析（降级模式）`,
      dimensions,
      strengths: ['已完成测评', '回答模式正常'],
      weaknesses: ['使用简化计算模型'],
      careers: [],
      suggestions,
      warnings: ['本次使用降级计算模式，结果仅供参考']
    }
  }

  private analyzeAnswerDistribution(answers: number[]) {
    const distribution = {
      low: 0,     // < 2
      medium: 0,  // 2-4
      high: 0,    // > 4
      extremes: 0 // 1或5
    }
    
    for (const a of answers) {
      if (a < 2) distribution.low++
      else if (a > 4) distribution.high++
      else distribution.medium++
      
      if (a === 1 || a === 5) distribution.extremes++
    }
    
    return distribution
  }

  private generateFallBackDimensions(answers: number[], avg: number, variance: number) {
    const dimensions: Dimension[] = []
    
    // 综合得分
    dimensions.push({
      name: '综合反应倾向',
      score: Math.round(avg * 20), // 0-100标准化
      description: '整体答题风格倾向'
    })
    
    // 一致性得分
    const consistency = variance < 0.5 ? 85 : variance < 1.5 ? 70 : 50
    dimensions.push({
      name: '回答一致性',
      score: consistency,
      description: '答题的稳定性和一致性'
    })
    
    // 极端反应倾向
    const extremeRatio = answers.filter(a => a === 1 || a === 5).length / answers.length
    dimensions.push({
      name: '极端反应倾向',
      score: Math.round(extremeRatio * 100),
      description: '使用极端选项的倾向'
    })
    
    return dimensions
  }

  private generateSmartSuggestions(distribution: any, avg: number, variance: number) {
    const suggestions = [
      '建议重新完成测评以获取专业分析'
    ]
    
    if (variance < 0.5) {
      suggestions.push('建议答题时更仔细区分不同选项')
    }
    
    if (distribution.extremes > answers.length * 0.5) {
      suggestions.push('建议答题时考虑更多中间选项')
    }
    
    if (answers.length < 20) {
      suggestions.push('更多题目会带来更准确的分析')
    }
    
    return suggestions
  }

  private emergencyResult(assessmentId: string, answers: number[]): AssessmentResult {
    return {
      type: assessmentId,
      score: 0,
      accuracy: 0,
      title: '计算服务暂时不可用',
      description: '抱歉，基于当前题目的详细分析暂时无法完成。',
      dimensions: [],
      strengths: [],
      weaknesses: [],
      careers: [],
      suggestions: [
        '请稍后重试',
        '如果问题持续存在，请联系技术支持'
      ],
      warnings: ['服务不可用，无法生成详细分析']
    }
  }
}

export const calculatorEngine = CalculatorEngine.getInstance()
export type { CalculationContext, CalculationMetadata, CalculationResult }
