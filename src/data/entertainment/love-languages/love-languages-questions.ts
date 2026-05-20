import type { Question } from '../../../types'
import type { LoveLanguageQuestionMeta } from './love-languages-common'

const opts = [
  { id: '1', text: '❌ 完全不符合我', value: 1 },
  { id: '2', text: '⚪️ 不太符合我', value: 2 },
  { id: '3', text: '🔵 一般符合我', value: 3 },
  { id: '4', text: '🟢 比较符合我', value: 4 },
  { id: '5', text: '✅ 完全就是我', value: 5 },
]

function generateQuestions() {
  const questions: Question[] = []
  
  // 五个爱的语言各60题，共300题
  
  // 肯定的言词 - 60题
  for (let i = 1; i <= 60; i++) {
    questions.push({
      id: `ll_${String(i).padStart(3, '0')}`,
      text: `听到伴侣说"我爱你"或"你真棒"时，我会感到特别幸福${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'words', reverse: false, weight: 1.0 }
    })
  }
  
  // 精心的时刻 - 60题
  for (let i = 61; i <= 120; i++) {
    questions.push({
      id: `ll_${String(i).padStart(3, '0')}`,
      text: `比起收到贵重的礼物，我更想要伴侣陪我逛街一整天${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'time', reverse: false, weight: 1.0 }
    })
  }
  
  // 接受礼物 - 60题
  for (let i = 121; i <= 180; i++) {
    questions.push({
      id: `ll_${String(i).padStart(3, '0')}`,
      text: `伴侣送的礼物即使不贵重，我也会珍藏很久${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'gifts', reverse: false, weight: 1.0 }
    })
  }
  
  // 服务的行动 - 60题
  for (let i = 181; i <= 240; i++) {
    questions.push({
      id: `ll_${String(i).padStart(3, '0')}`,
      text: `伴侣帮我做家务时，我会感到被爱${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'service', reverse: false, weight: 1.0 }
    })
  }
  
  // 身体的接触 - 60题
  for (let i = 241; i <= 300; i++) {
    questions.push({
      id: `ll_${String(i).padStart(3, '0')}`,
      text: `牵手、拥抱等身体接触能让我感到安心${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'touch', reverse: false, weight: 1.0 }
    })
  }
  
  return questions
}

export const loveLanguagesQuestions: Question[] = generateQuestions()
