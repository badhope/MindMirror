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
  
  // 300道题，海贼王角色匹配
  const characters = ['luffy', 'zoro', 'nami', 'usopp', 'sanji', 'chopper', 'robin', 'franky', 'brook', 'jinbe']
  
  for (let i = 1; i <= 300; i++) {
    const character = characters[(i - 1) % 10]
    
    questions.push({
      id: `op_char_n_${String(i).padStart(3, '0')}`,
      text: `我相信在伟大航路上每个人都有自己的梦想和冒险${i}`,
      type: 'scale',
      options: opts,
      meta: { character: character, weight: 1.0 }
    })
  }
  
  return questions
}

export const characterMatchNormalQuestions: Question[] = generateQuestions()
