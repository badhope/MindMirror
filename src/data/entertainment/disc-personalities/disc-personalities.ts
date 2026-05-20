import type { Assessment } from '../../../types'
import { discQuestions } from './disc-personalities-questions'
import { calculateDISC } from './disc-personalities-calculator'

export const discAssessment: Assessment = {
  id: 'disc-personalities',
  title: 'DISC 性格测试',
  subtitle: '发现你的行为风格密码',
  description: 'DISC性格测试是全球最广泛使用的人格评估工具之一，将人格分为支配型(D)、影响型(I)、稳定型(S)和遵从型(C)四种基本类型。通过这个测评，你将了解自己的行为风格、沟通偏好以及在团队中的最佳角色。',
  category: '性格特质',
  subcategory: '行为风格',
  difficulty: 'lite',
  duration: 8,
  quality: '娱乐',
  icon: '🎯',
  questionCount: 300,
  questions: discQuestions,
  resultCalculator: calculateDISC,
  tag: 'DISC',
}
