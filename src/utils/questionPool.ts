import type { Question } from '../types'

/**
 * 题目版本配置
 */
export interface VersionConfig {
  id: string
  name: string
  questionCount: number
  description: string
}

/**
 * 题库配置
 */
export interface QuestionPoolConfig {
  [key: string]: VersionConfig[]
}

/**
 * 3个版本的题目配置
 */
export const VERSION_CONFIGS: VersionConfig[] = [
  {
    id: 'standard',
    name: '普通版',
    questionCount: 35,
    description: '快速评估，35题，约5-10分钟完成'
  },
  {
    id: 'advanced',
    name: '进阶版',
    questionCount: 75,
    description: '详细评估，75题，约15-20分钟完成'
  },
  {
    id: 'professional',
    name: '专业版',
    questionCount: 150,
    description: '深度评估，150题，约30-45分钟完成'
  }
]

/**
 * 获取版本配置
 */
export function getVersionConfig(version: string): VersionConfig {
  return VERSION_CONFIGS.find(config => config.id === version) || VERSION_CONFIGS[0]
}

/**
 * 洗牌算法 - Fisher-Yates
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 从题库中随机抽取指定数量的题目
 * @param questions - 完整题库
 * @param count - 抽取数量
 * @param seed - 可选的种子值，用于可重复的随机抽取
 */
export function getRandomQuestions(
  questions: Question[],
  count: number,
  seed?: string
): Question[] {
  // 如果题目数量不够，返回所有题目
  if (questions.length <= count) {
    return shuffleArray(questions)
  }

  // 使用种子值（如果提供）来确保可重复性
  let randomizer = Math.random
  if (seed) {
    let seedNum = 0
    for (let i = 0; i < seed.length; i++) {
      seedNum = (seedNum * 31 + seed.charCodeAt(i)) % 2147483647
    }
    let x = seedNum
    randomizer = () => {
      x = (x * 1103515245 + 12345) & 0x7fffffff
      return x / 2147483648
    }
  }

  // 复制并洗牌
  const shuffled = [...questions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(randomizer() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // 取前count个
  return shuffled.slice(0, count)
}

/**
 * 根据维度均衡抽取题目
 * 确保每个维度都有足够的题目
 */
export function getBalancedQuestions(
  questions: Question[],
  count: number,
  dimensionTags: string[] = []
): Question[] {
  if (questions.length <= count) {
    return shuffleArray(questions)
  }

  // 按维度分组
  const groupedByDimension: Record<string, Question[]> = {}
  
  questions.forEach(question => {
    // 尝试从题目中获取维度标签
    let tag = 'default'
    if (dimensionTags.length > 0) {
      // 这里可以根据具体需求解析题目中的维度信息
      // 暂时使用简单的随机分组
      tag = dimensionTags[Math.floor(Math.random() * dimensionTags.length)]
    }
    if (!groupedByDimension[tag]) {
      groupedByDimension[tag] = []
    }
    groupedByDimension[tag].push(question)
  })

  const dimensions = Object.keys(groupedByDimension)
  const questionsPerDimension = Math.ceil(count / dimensions.length)
  const selectedQuestions: Question[] = []

  // 从每个维度抽取题目
  dimensions.forEach(dimension => {
    const dimQuestions = groupedByDimension[dimension]
    const toSelect = Math.min(questionsPerDimension, dimQuestions.length)
    selectedQuestions.push(...getRandomQuestions(dimQuestions, toSelect))
  })

  // 如果还不够，从所有题目中补充
  if (selectedQuestions.length < count) {
    const remaining = questions.filter(q => !selectedQuestions.includes(q))
    selectedQuestions.push(...getRandomQuestions(remaining, count - selectedQuestions.length))
  }

  return shuffleArray(selectedQuestions).slice(0, count)
}

/**
 * 获取测评的题库大小
 */
export function getPoolSize(questions: Question[]): number {
  return questions.length
}

/**
 * 检查题库是否足够大
 */
export function hasEnoughQuestions(questions: Question[], required: number): boolean {
  return questions.length >= required
}
