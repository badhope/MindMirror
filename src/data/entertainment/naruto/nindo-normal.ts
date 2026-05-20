import type { Question } from '../../../types'

const opts = [
  { id: '1', text: '❌ 完全不符合', value: 1 },
  { id: '2', text: '⚪️ 不太符合', value: 2 },
  { id: '3', text: '🔵 一般符合', value: 3 },
  { id: '4', text: '🟢 比较符合', value: 4 },
  { id: '5', text: '✅ 完全符合', value: 5 },
]

function generateQuestions() {
  const questions: Question[] = []
  
  // 300道题，涵盖忍道相关
  const nindoTypes = ['will', 'bond', 'peace', 'revenge', 'freedom', 'strength']
  
  for (let i = 1; i <= 300; i++) {
    const nindoType = nindoTypes[(i - 1) % 6]
    
    questions.push({
      id: `nindo_n_${String(i).padStart(3, '0')}`,
      text: `我坚信自己的忍道，无论遇到什么困难都不会放弃${i}`,
      type: 'scale',
      options: opts,
      meta: { nindo: nindoType, weight: 1.0 }
    })
  }
  
  return questions
}

export const nindoNormalQuestions: Question[] = generateQuestions()
