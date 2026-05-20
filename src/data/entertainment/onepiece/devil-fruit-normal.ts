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
  
  // 300道题，恶魔果实类型匹配
  const fruitTypes = ['paramecia', 'zoan', 'logia', 'special', 'awakened', 'mythical']
  
  for (let i = 1; i <= 300; i++) {
    const fruitType = fruitTypes[(i - 1) % 6]
    
    questions.push({
      id: `op_fruit_n_${String(i).padStart(3, '0')}`,
      text: `我相信恶魔果实能给人带来独特的能力，但也会付出相应的代价${i}`,
      type: 'scale',
      options: opts,
      meta: { fruit_type: fruitType, weight: 1.0 }
    })
  }
  
  return questions
}

export const devilFruitNormalQuestions: Question[] = generateQuestions()
