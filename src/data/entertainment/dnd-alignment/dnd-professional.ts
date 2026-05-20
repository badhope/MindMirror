import type { Question } from '../../../types'
import type { DndQuestionMeta } from './dnd-common'

const opts = [
  { id: '1', text: '❌ 完全不符合我', value: 1 },
  { id: '2', text: '⚪️ 不太符合我', value: 2 },
  { id: '3', text: '🔵 一般符合我', value: 3 },
  { id: '4', text: '🟢 比较符合我', value: 4 },
  { id: '5', text: '✅ 完全就是我', value: 5 },
]

function generateQuestions() {
  const questions: Question[] = []
  
  // 9个阵营各33-34题，共300题
  for (let i = 1; i <= 34; i++) {
    questions.push({
      id: `dnd_p_${String(i).padStart(3, '0')}`,
      text: `我坚信法律是维持社会秩序的基础，即使需要做出个人牺牲${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'lawful', morals: 'good', weight: 1.2 }
    })
  }
  
  for (let i = 35; i <= 68; i++) {
    questions.push({
      id: `dnd_p_${String(i).padStart(3, '0')}`,
      text: `规则和传统是社会稳定的基石，必须严格遵守${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'lawful', morals: 'neutral', weight: 1.1 }
    })
  }
  
  for (let i = 69; i <= 102; i++) {
    questions.push({
      id: `dnd_p_${String(i).padStart(3, '0')}`,
      text: `制度和法律可以被用来巩固权力和地位${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'lawful', morals: 'evil', weight: 1.2 }
    })
  }
  
  for (let i = 103; i <= 136; i++) {
    questions.push({
      id: `dnd_p_${String(i).padStart(3, '0')}`,
      text: `帮助他人是我的责任，无论是否有规则约束${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'neutral', morals: 'good', weight: 1.1 }
    })
  }
  
  for (let i = 137; i <= 168; i++) {
    questions.push({
      id: `dnd_p_${String(i).padStart(3, '0')}`,
      text: `我会根据具体情况灵活处理，不偏向任何极端${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'neutral', morals: 'neutral', weight: 1.0 }
    })
  }
  
  for (let i = 169; i <= 202; i++) {
    questions.push({
      id: `dnd_p_${String(i).padStart(3, '0')}`,
      text: `在这个世界上生存，必须把自己的利益放在首位${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'neutral', morals: 'evil', weight: 1.2 }
    })
  }
  
  for (let i = 203; i <= 235; i++) {
    questions.push({
      id: `dnd_p_${String(i).padStart(3, '0')}`,
      text: `真正的正义需要打破不公正的规则${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'chaotic', morals: 'good', weight: 1.3 }
    })
  }
  
  for (let i = 236; i <= 268; i++) {
    questions.push({
      id: `dnd_p_${String(i).padStart(3, '0')}`,
      text: `自由是最重要的价值，没有任何规则可以限制我${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'chaotic', morals: 'neutral', weight: 1.2 }
    })
  }
  
  for (let i = 269; i <= 300; i++) {
    questions.push({
      id: `dnd_p_${String(i).padStart(3, '0')}`,
      text: `我按照自己的意愿行事，不被任何道德或法律约束${i}`,
      type: 'scale',
      options: opts,
      meta: { ethics: 'chaotic', morals: 'evil', weight: 1.3 }
    })
  }
  
  return questions
}

export const dndProfessionalQuestions: Question[] = generateQuestions()
