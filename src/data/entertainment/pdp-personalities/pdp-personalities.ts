import type { Assessment } from '../../../types'
import { pdpQuestions } from './pdp-personalities-questions'
import { calculatePDP } from './pdp-personalities-calculator'

export const pdpAssessment: Assessment = {
  id: 'pdp-personalities',
  title: 'PDP 性格测试',
  subtitle: '发现你的职场性格密码',
  description: 'PDP性格测试将你的性格分为五种动物类型：老虎、孔雀、考拉、猫头鹰和变色龙。通过这个测评，你将了解自己的性格优势、适合的职业发展方向以及人际相处之道。',
  category: '性格特质',
  subcategory: '职场性格',
  difficulty: 'lite',
  duration: 5,
  quality: '娱乐',
  icon: '🦁',
  questionCount: 300,
  questions: pdpQuestions,
  resultCalculator: calculatePDP,
  tag: 'PDP',
}
