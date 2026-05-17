import { normalizeResult } from './normalizeResult'
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
      const { calculateProfessionalResult } = await import('../professionalCalculators')
      return await calculateProfessionalResult(assessmentId, answers, mode)
    }

    const assessmentModule = await this.loadAssessmentModule(assessmentId)
    if (assessmentModule?.resultCalculator) {
      return assessmentModule.resultCalculator(answers)
    }

    const { calculateProfessionalResult } = await import('../professionalCalculators')
    return await calculateProfessionalResult(assessmentId, answers, mode)
  }

  private async loadAssessmentModule(assessmentId: string): Promise<any> {
    try {
      // 核心测评模块注册表
      const coreModuleMap: Record<string, () => Promise<any>> = {
        'ocean-bigfive': () => import('../../data/assessments/ocean-bigfive'),
        'dark-triad': () => import('../../data/assessments/dark-triad'),
        'eq-goleman': () => import('../../data/assessments/eq-goleman'),
        'ecr-attachment': () => import('../../data/assessments/ecr-attachment'),
        'scl90': () => import('../../data/assessments/scl90-symptoms'),
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
        'slacking-purity': () => import('../../data/assessments/slacking-purity'),
        'sexual-experience': () => import('../../data/assessments/sexual-experience'),
        'onepiece-bounty': () => import('../../data/assessments/onepiece-bounty'),
        'abm-love-animal': () => import('../../data/assessments/abm-love-animal'),
        'color-subconscious': () => import('../../data/assessments/color-subconscious'),
        'sds-standard': () => import('../../data/assessments/sds-standard'),
        'lacan-diagnosis': () => import('../../data/assessments/lacan-diagnosis'),
        'pss-stress': () => import('../../data/assessments/pss-stress'),
        'pss-standard': () => import('../../data/assessments/pss-standard'),
        'foodie-level': () => import('../../data/assessments/foodie-level'),
        'internet-addiction': () => import('../../data/assessments/internet-addiction'),
        'mindset-standard': () => import('../../data/assessments/mindset-standard'),
        'metacognition-standard': () => import('../../data/assessments/metacognition-standard'),
        'ocb-standard': () => import('../../data/assessments/ocb-standard'),
        'pcq-standard': () => import('../../data/assessments/pcq-standard'),
        'philo-spectrum': () => import('../../data/assessments/philo-spectrum'),
        'life-meaning': () => import('../../data/assessments/life-meaning'),
        'pua-resistance': () => import('../../data/assessments/pua-resistance'),
        'officialdom-dream': () => import('../../data/assessments/officialdom-dream'),
        'patriotism-purity': () => import('../../data/assessments/patriotism-purity'),
        'mlq-standard': () => import('../../data/assessments/mlq-standard'),
        'fubao-index': () => import('../../data/assessments/fubao-index'),
        'kolb-standard': () => import('../../data/assessments/kolb-standard'),
        'hardiness-standard': () => import('../../data/assessments/hardiness-standard'),
        'els-standard': () => import('../../data/assessments/els-standard'),
        'asi-standard': () => import('../../data/assessments/asi-standard'),
        'attention-test': () => import('../../data/assessments/attention-test'),
        'mft-standard': () => import('../../data/assessments/mft-standard'),
        'love-languages': () => import('../../data/entertainment/love-languages'),
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
