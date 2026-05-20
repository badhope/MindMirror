import type { Assessment } from '../../../types'
import { enneagramQuestions } from './enneagram-questions'
import { calculateEnneagram } from './enneagram-calculator'

export const enneagramAssessment: Assessment = {
  id: 'enneagram',
  title: '九型人格测试',
  subtitle: '发现你的真实性格密码',
  description: '九型人格是一种深受欢迎的人格分类系统，将人分为九种基本类型。这个古老的智慧系统帮助我们理解人类性格的多样性，揭示每个人独特的核心恐惧和渴望。通过这个测评，你将发现自己的主要人格类型，获得关于职场、爱情和人际关系的深入洞察。',
  category: '性格特质',
  subcategory: '人格类型',
  difficulty: 'lite',
  duration: 8,
  quality: '娱乐',
  icon: '🔮',
  questionCount: 300,
  questions: enneagramQuestions,
  resultCalculator: calculateEnneagram,
  tag: '九型人格',
}
