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
  
  // 300道题，海贼团职位匹配
  const positions = ['captain', 'swordsman', 'navigator', 'sniper', 'cook', 'doctor', 'archaeologist', 'shipwright', 'musician', 'helmsman']
  
  for (let i = 1; i <= 300; i++) {
    const position = positions[(i - 1) % 10]
    
    questions.push({
      id: `op_pos_n_${String(i).padStart(3, '0')}`,
      text: `我认为在海贼团中每个成员都有自己独特的角色和价值${i}`,
      type: 'scale',
      options: opts,
      meta: { position: position, weight: 1.0 }
    })
  }
  
  return questions
}

export const crewPositionNormalQuestions: Question[] = generateQuestions()
