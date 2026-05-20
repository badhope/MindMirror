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
  
  // 五种查克拉属性各60题，共300题
  const chakraTypes = ['fire', 'wind', 'lightning', 'earth', 'water']
  
  for (let i = 1; i <= 300; i++) {
    const chakraType = chakraTypes[(i - 1) % 5]
    
    questions.push({
      id: `chakra_n_${String(i).padStart(3, '0')}`,
      text: `我相信每个人都有独特的查克拉性质${i}`,
      type: 'scale',
      options: opts,
      meta: { chakra: chakraType, weight: 1.0 }
    })
  }
  
  return questions
}

export const chakraNormalQuestions: Question[] = generateQuestions()
