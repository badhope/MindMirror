import type { Question } from '../types'

/**
 * 题目难度类型
 */
export type Difficulty = 'easy' | 'medium' | 'hard'

/**
 * 难度配置
 */
export interface DifficultyConfig {
  easy: number    // easy题目标记的比例
  medium: number  // medium题目标记的比例
  hard: number    // hard题目标记的比例
}

/**
 * 版本难度分配
 */
export interface VersionDifficultyConfig {
  version: string
  difficulties: Difficulty[]
  ratios: number[]  // 对应difficulties的比例
}

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
 * 版本难度分配配置
 */
export const VERSION_DIFFICULTY_CONFIGS: VersionDifficultyConfig[] = [
  {
    version: 'standard',
    difficulties: ['easy'],
    ratios: [1.0]
  },
  {
    version: 'advanced',
    difficulties: ['easy', 'medium'],
    ratios: [0.4, 0.6]
  },
  {
    version: 'professional',
    difficulties: ['easy', 'medium', 'hard'],
    ratios: [0.3, 0.4, 0.3]
  }
]

/**
 * 获取版本配置
 */
export function getVersionConfig(version: string): VersionConfig {
  return VERSION_CONFIGS.find(config => config.id === version) || VERSION_CONFIGS[0]
}

/**
 * 获取版本难度配置
 */
export function getVersionDifficultyConfig(version: string): VersionDifficultyConfig {
  return VERSION_DIFFICULTY_CONFIGS.find(config => config.version === version) || VERSION_DIFFICULTY_CONFIGS[0]
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
 * 为题目数组添加难度标记
 * @param questions - 题目数组
 * @param config - 难度配置（可选，默认使用60% easy, 30% medium, 10% hard）
 */
export function addDifficultyTags(
  questions: Question[],
  config: DifficultyConfig = { easy: 0.6, medium: 0.3, hard: 0.1 }
): Question[] {
  const total = questions.length
  const easyCount = Math.floor(total * config.easy)
  const mediumCount = Math.floor(total * config.medium)
  
  return questions.map((q, index) => {
    let difficulty: Difficulty = 'easy'
    if (index >= easyCount + mediumCount) {
      difficulty = 'hard'
    } else if (index >= easyCount) {
      difficulty = 'medium'
    }
    
    // 保留原有的difficulty标记（如果有的话）
    const existingDifficulty = (q as any).difficulty as Difficulty
    if (existingDifficulty) {
      difficulty = existingDifficulty
    }
    
    return {
      ...q,
      difficulty
    }
  })
}

/**
 * 为单个题目添加难度标记
 */
export function addDifficultyTag(
  question: Question,
  difficulty: Difficulty = 'easy'
): Question & { difficulty: Difficulty } {
  return {
    ...question,
    difficulty
  }
}

/**
 * 按难度过滤题目
 */
export function filterQuestionsByDifficulty(
  questions: (Question & { difficulty?: Difficulty })[],
  difficulties: Difficulty[]
): (Question & { difficulty?: Difficulty })[] {
  if (difficulties.length === 0) {
    return questions
  }
  return questions.filter(q => {
    const qDiff = q.difficulty || 'easy'
    return difficulties.includes(qDiff)
  })
}

/**
 * 根据版本配置智能抽取题目（考虑难度）
 */
export function getQuestionsByVersion(
  questions: Question[],
  version: string,
  seed?: string
): Question[] {
  const versionConfig = getVersionConfig(version)
  const difficultyConfig = getVersionDifficultyConfig(version)
  
  // 确保题目有难度标记
  const questionsWithDifficulty = addDifficultyTags(questions)
  
  // 按难度分组
  const questionsByDifficulty: Record<Difficulty, (Question & { difficulty: Difficulty })[]> = {
    easy: [],
    medium: [],
    hard: []
  }
  
  questionsWithDifficulty.forEach(q => {
    const diff = q.difficulty || 'easy'
    questionsByDifficulty[diff].push(q)
  })
  
  // 根据版本配置按比例抽取
  const selectedQuestions: Question[] = []
  const count = versionConfig.questionCount
  
  difficultyConfig.difficulties.forEach((diff, i) => {
    const diffCount = Math.floor(count * difficultyConfig.ratios[i])
    const diffQuestions = questionsByDifficulty[diff]
    if (diffQuestions.length > 0) {
      selectedQuestions.push(...getRandomQuestions(diffQuestions, diffCount, seed))
    }
  })
  
  // 如果抽取的题目不够，从所有题目中补充
  if (selectedQuestions.length < count) {
    const remaining = questionsWithDifficulty.filter(q => !selectedQuestions.includes(q))
    selectedQuestions.push(...getRandomQuestions(remaining, count - selectedQuestions.length, seed))
  }
  
  return shuffleArray(selectedQuestions).slice(0, count)
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
