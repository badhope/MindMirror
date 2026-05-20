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
  
  // 300道题，涵盖魔杖特性
  for (let i = 1; i <= 300; i++) {
    const meta: any = {}
    if (i % 4 === 0) meta.core = 'phoenix'
    else if (i % 4 === 1) meta.core = 'dragon'
    else if (i % 4 === 2) meta.core = 'unicorn'
    else meta.core = 'veela'
    
    questions.push({
      id: `wand_n_${String(i).padStart(3, '0')}`,
      text: `我相信我的性格和魔杖之间有特殊的联系${i}`,
      type: 'scale',
      options: opts,
      meta: meta
    })
  }
  
  return questions
}

export const wandNormalQuestions: Question[] = generateQuestions()
