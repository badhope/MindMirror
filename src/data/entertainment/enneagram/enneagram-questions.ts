import type { Question } from '../../../types'
import type { EnneagramQuestionMeta } from './enneagram-common'

const opts = [
  { id: '1', text: '❌ 完全不符合我', value: 1 },
  { id: '2', text: '⚪️ 不太符合我', value: 2 },
  { id: '3', text: '🔵 一般符合我', value: 3 },
  { id: '4', text: '🟢 比较符合我', value: 4 },
  { id: '5', text: '✅ 完全就是我', value: 5 },
]

function generateQuestions() {
  const questions: Question[] = []
  
  // 九型人格每型约33-34题，共300题
  
  // 1号：完美主义者 - 34题
  for (let i = 1; i <= 34; i++) {
    questions.push({
      id: `enn_${String(i).padStart(3, '0')}`,
      text: `我有很高的原则和标准，总是努力把事情做到完美${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'type1', reverse: false, weight: 1.0 }
    })
  }
  
  // 2号：助人者 - 33题
  for (let i = 35; i <= 67; i++) {
    questions.push({
      id: `enn_${String(i).padStart(3, '0')}`,
      text: `我总是关注别人的需要，愿意主动帮助他人${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'type2', reverse: false, weight: 1.1 }
    })
  }
  
  // 3号：成就者 - 33题
  for (let i = 68; i <= 100; i++) {
    questions.push({
      id: `enn_${String(i).padStart(3, '0')}`,
      text: `我非常重视成就和表现，希望在我所做的事情上取得成功${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'type3', reverse: false, weight: 1.0 }
    })
  }
  
  // 4号：个人主义者 - 33题
  for (let i = 101; i <= 133; i++) {
    questions.push({
      id: `enn_${String(i).padStart(3, '0')}`,
      text: `我觉得自己与众不同，有独特的感受和体验${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'type4', reverse: false, weight: 1.1 }
    })
  }
  
  // 5号：探索者 - 33题
  for (let i = 134; i <= 166; i++) {
    questions.push({
      id: `enn_${String(i).padStart(3, '0')}`,
      text: `我喜欢独立思考和研究，收集知识和信息${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'type5', reverse: false, weight: 1.0 }
    })
  }
  
  // 6号：怀疑论者 - 33题
  for (let i = 167; i <= 199; i++) {
    questions.push({
      id: `enn_${String(i).padStart(3, '0')}`,
      text: `我会为可能出现的最坏情况做准备，感到焦虑和不安${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'type6', reverse: false, weight: 1.1 }
    })
  }
  
  // 7号：热情者 - 34题
  for (let i = 200; i <= 233; i++) {
    questions.push({
      id: `enn_${String(i).padStart(3, '0')}`,
      text: `我热爱尝试新事物，总是计划下一个令人兴奋的体验${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'type7', reverse: false, weight: 1.0 }
    })
  }
  
  // 8号：挑战者 - 33题
  for (let i = 234; i <= 266; i++) {
    questions.push({
      id: `enn_${String(i).padStart(3, '0')}`,
      text: `当有人试图控制或利用我时，我会立即站出来反抗${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'type8', reverse: false, weight: 1.2 }
    })
  }
  
  // 9号：和平者 - 34题
  for (let i = 267; i <= 300; i++) {
    questions.push({
      id: `enn_${String(i).padStart(3, '0')}`,
      text: `我尽量避免与他人发生冲突，宁愿退一步以维持和谐${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'type9', reverse: false, weight: 1.0 }
    })
  }
  
  return questions
}

export const enneagramQuestions: Question[] = generateQuestions()
