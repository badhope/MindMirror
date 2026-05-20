import type { Question } from '../../../types'
import type { DndQuestionMeta } from './dnd-common'

const opts = [
  { id: '1', text: '❌ 完全不符合我', value: 1 },
  { id: '2', text: '⚪️ 不太符合我', value: 2 },
  { id: '3', text: '🔵 一般符合我', value: 3 },
  { id: '4', text: '🟢 比较符合我', value: 4 },
  { id: '5', text: '✅ 完全就是我', value: 5 },
]

// 生成 300 道题目的基础模板
function generateQuestions() {
  const questions: Question[] = []
  
  // 守序善良 - 40题
  for (let i = 1; i <= 40; i++) {
    questions.push({
      id: `dnd_a_${String(i).padStart(3, '0')}`,
      text: `我认为法律和道德同样重要，即使需要付出代价也要做正确的事${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'lawful', morals: 'good', weight: 1.2 }
    })
  }
  
  // 守序中立 - 40题
  for (let i = 41; i <= 80; i++) {
    questions.push({
      id: `dnd_a_${String(i).padStart(3, '0')}`,
      text: `规则就是规则，无论结果如何都必须遵守${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'lawful', morals: 'neutral', weight: 1.1 }
    })
  }
  
  // 守序邪恶 - 40题
  for (let i = 81; i <= 120; i++) {
    questions.push({
      id: `dnd_a_${String(i).padStart(3, '0')}`,
      text: `我会利用法律和制度来实现自己的目标${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'lawful', morals: 'evil', weight: 1.2 }
    })
  }
  
  // 中立善良 - 40题
  for (let i = 121; i <= 160; i++) {
    questions.push({
      id: `dnd_a_${String(i).padStart(3, '0')}`,
      text: `我会做善事，但不会被规则束缚${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'neutral', morals: 'good', weight: 1.1 }
    })
  }
  
  // 绝对中立 - 20题
  for (let i = 161; i <= 180; i++) {
    questions.push({
      id: `dnd_a_${String(i).padStart(3, '0')}`,
      text: `我相信保持平衡和中立是最好的选择${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'neutral', morals: 'neutral', weight: 1.0 }
    })
  }
  
  // 中立邪恶 - 40题
  for (let i = 181; i <= 220; i++) {
    questions.push({
      id: `dnd_a_${String(i).padStart(3, '0')}`,
      text: `为了自己的利益，我可以做任何事${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'neutral', morals: 'evil', weight: 1.2 }
    })
  }
  
  // 混乱善良 - 30题
  for (let i = 221; i <= 250; i++) {
    questions.push({
      id: `dnd_a_${String(i).padStart(3, '0')}`,
      text: `我会按照自己的良心做事，即使违反法律${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'chaotic', morals: 'good', weight: 1.3 }
    })
  }
  
  // 混乱中立 - 25题
  for (let i = 251; i <= 275; i++) {
    questions.push({
      id: `dnd_a_${String(i).padStart(3, '0')}`,
      text: `我只追随自己的内心，不被任何规则束缚${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'chaotic', morals: 'neutral', weight: 1.2 }
    })
  }
  
  // 混乱邪恶 - 25题
  for (let i = 276; i <= 300; i++) {
    questions.push({
      id: `dnd_a_${String(i).padStart(3, '0')}`,
      text: `我享受破坏和混乱，没有任何道德束缚${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'chaotic', morals: 'evil', weight: 1.3 }
    })
  }
  
  return questions
}

export const dndAdvancedQuestions: Question[] = generateQuestions()
