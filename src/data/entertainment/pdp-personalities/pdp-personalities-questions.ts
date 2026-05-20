import type { Question } from '../../../types'
import type { PDPQuestionMeta } from './pdp-personalities-common'

const opts = [
  { id: '1', text: '❌ 完全不符合我', value: 1 },
  { id: '2', text: '⚪️ 不太符合我', value: 2 },
  { id: '3', text: '🔵 一般符合我', value: 3 },
  { id: '4', text: '🟢 比较符合我', value: 4 },
  { id: '5', text: '✅ 完全就是我', value: 5 },
]

function generateQuestions() {
  const questions: Question[] = []
  
  // 五种PDP性格类型各60题，共300题
  
  // 老虎型 - 60题
  for (let i = 1; i <= 60; i++) {
    questions.push({
      id: `pdp_${String(i).padStart(3, '0')}`,
      text: `在团队讨论中，我倾向于直接提出我的想法并推动大家快速做出决定${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'tiger', reverse: false, weight: 1.0 }
    })
  }
  
  // 孔雀型 - 60题
  for (let i = 61; i <= 120; i++) {
    questions.push({
      id: `pdp_${String(i).padStart(3, '0')}`,
      text: `在陌生场合，我很快就能成为大家关注的焦点${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'peacock', reverse: false, weight: 1.0 }
    })
  }
  
  // 考拉型 - 60题
  for (let i = 121; i <= 180; i++) {
    questions.push({
      id: `pdp_${String(i).padStart(3, '0')}`,
      text: `我更愿意做一个默默支持他人的人，而不是站在聚光灯下${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'koala', reverse: false, weight: 1.0 }
    })
  }
  
  // 猫头鹰型 - 60题
  for (let i = 181; i <= 240; i++) {
    questions.push({
      id: `pdp_${String(i).padStart(3, '0')}`,
      text: `在做决定之前，我会仔细分析各种可能的情况和数据${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'owl', reverse: false, weight: 1.0 }
    })
  }
  
  // 变色龙型 - 60题
  for (let i = 241; i <= 300; i++) {
    questions.push({
      id: `pdp_${String(i).padStart(3, '0')}`,
      text: `在不同的人群和环境中，我能够灵活调整自己的处事方式${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'chameleon', reverse: false, weight: 1.0 }
    })
  }
  
  return questions
}

export const pdpQuestions: Question[] = generateQuestions()
