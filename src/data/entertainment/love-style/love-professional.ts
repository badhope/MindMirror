import type { Question } from '../../../types'
import type { LoveStyleQuestionMeta } from './love-common'

const opts = [
  { id: '1', text: '❌ 完全不符合我', value: 1 },
  { id: '2', text: '⚪️ 不太符合我', value: 2 },
  { id: '3', text: '🔵 一般符合我', value: 3 },
  { id: '4', text: '🟢 比较符合我', value: 4 },
  { id: '5', text: '✅ 完全就是我', value: 5 },
]

function generateQuestions() {
  const questions: Question[] = []
  
  for (let i = 1; i <= 300; i++) {
    const dimensions = ['eros', 'ludus', 'storge', 'pragma', 'mania', 'agape']
    const dimension = dimensions[i % 6]
    
    questions.push({
      id: `love_p_${String(i).padStart(3, '0')}`,
      text: `我认为健康的恋爱关系需要建立在相互理解和尊重的基础上${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension, reverse: false, weight: 1.0 }
    })
  }
  
  return questions
}

export const loveProfessionalQuestions: Question[] = generateQuestions()
