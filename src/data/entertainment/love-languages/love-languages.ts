import type { Assessment } from '../../../types'
import { loveLanguagesQuestions } from './love-languages-questions'
import { calculateLoveLanguages } from './love-languages-calculator'

export const loveLanguagesAssessment: Assessment = {
  id: 'love-languages',
  title: '爱情语言测评',
  subtitle: '发现你的爱的表达方式',
  description: '了解你和伴侣之间爱的语言，让感情更加美满',
  category: '社交关系',
  subcategory: '恋爱模式',
  difficulty: 'lite',
  duration: 3,
  quality: '娱乐',
  icon: '💕',
  questionCount: 15,
  questions: loveLanguagesQuestions,
  resultCalculator: calculateLoveLanguages,
  tag: '爱情',
}
