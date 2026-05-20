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
  
  // 300道题，涵盖守护神特性
  for (let i = 1; i <= 300; i++) {
    const meta: any = {}
    if (i % 5 === 0) meta.patronus = 'stag'
    else if (i % 5 === 1) meta.patronus = 'otter'
    else if (i % 5 === 2) meta.patronus = 'wolf'
    else if (i % 5 === 3) meta.patronus = 'fox'
    else meta.patronus = 'phoenix'
    
    questions.push({
      id: `patronus_n_${String(i).padStart(3, '0')}`,
      text: `我相信快乐和积极的回忆是对抗黑暗的武器${i}`,
      type: 'scale',
      options: opts,
      meta: meta
    })
  }
  
  return questions
}

export const patronusNormalQuestions: Question[] = generateQuestions()
