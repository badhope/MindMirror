import type { Question } from '../../../types'
import type { LoveStyleQuestionMeta } from './love-common'

const opts = [
  { id: '1', text: '❌ 完全不符合我', value: 1 },
  { id: '2', text: '⚪️ 不太符合我', value: 2 },
  { id: '3', text: '🔵 一般符合我', value: 3 },
  { id: '4', text: '🟢 比较符合我', value: 4 },
  { id: '5', text: '✅ 完全就是我', value: 5 },
]

function generateQuestions() {
  const questions: Question[] = []
  
  // 六种恋爱风格各50题，共300题
  
  // 激情之爱 - 50题
  for (let i = 1; i <= 50; i++) {
    questions.push({
      id: `love_n_${String(i).padStart(3, '0')}`,
      text: `我相信一见钟情${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'eros', reverse: false, weight: 1.0 }
    })
  }
  
  // 游戏之爱 - 50题
  for (let i = 51; i <= 100; i++) {
    questions.push({
      id: `love_n_${String(i).padStart(3, '0')}`,
      text: `我享受和不同的人玩爱情游戏${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'ludus', reverse: false, weight: 1.0 }
    })
  }
  
  // 友谊之爱 - 50题
  for (let i = 101; i <= 150; i++) {
    questions.push({
      id: `love_n_${String(i).padStart(3, '0')}`,
      text: `真正的爱情是从深厚的友谊开始的${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'storge', reverse: false, weight: 1.0 }
    })
  }
  
  // 实用之爱 - 50题
  for (let i = 151; i <= 200; i++) {
    questions.push({
      id: `love_n_${String(i).padStart(3, '0')}`,
      text: `在选择伴侣前我会仔细考察对方的条件${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'pragma', reverse: false, weight: 1.0 }
    })
  }
  
  // 占有之爱 - 50题
  for (let i = 201; i <= 250; i++) {
    questions.push({
      id: `love_n_${String(i).padStart(3, '0')}`,
      text: `恋爱中我经常会嫉妒不安${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'mania', reverse: false, weight: 1.0 }
    })
  }
  
  // 奉献之爱 - 50题
  for (let i = 251; i <= 300; i++) {
    questions.push({
      id: `love_n_${String(i).padStart(3, '0')}`,
      text: `我愿意为了爱人牺牲自己的利益${i}`,
      type: 'scale',
      options: opts,
      meta: { dimension: 'agape', reverse: false, weight: 1.0 }
    })
  }
  
  return questions
}

export const loveNormalQuestions: Question[] = generateQuestions()
