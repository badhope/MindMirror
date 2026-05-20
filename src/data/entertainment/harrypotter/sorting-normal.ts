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
  
  // 四个学院各75题，共300题
  
  // 格兰芬多 - 75题
  for (let i = 1; i <= 75; i++) {
    questions.push({
      id: `sort_n_${String(i).padStart(3, '0')}`,
      text: `我喜欢成为团队的领导者，面对危险会勇敢面对${i}`,
      type: 'scale',
      options: opts,
      meta: { house: 'gryffindor', weight: 1.0 }
    })
  }
  
  // 赫奇帕奇 - 75题
  for (let i = 76; i <= 150; i++) {
    questions.push({
      id: `sort_n_${String(i).padStart(3, '0')}`,
      text: `我非常重视忠诚和友谊，喜欢努力工作不走捷径${i}`,
      type: 'scale',
      options: opts,
      meta: { house: 'hufflepuff', weight: 1.0 }
    })
  }
  
  // 拉文克劳 - 75题
  for (let i = 151; i <= 225; i++) {
    questions.push({
      id: `sort_n_${String(i).padStart(3, '0')}`,
      text: `我总是渴望学习新知识，喜欢用智慧解决问题${i}`,
      type: 'scale',
      options: opts,
      meta: { house: 'ravenclaw', weight: 1.0 }
    })
  }
  
  // 斯莱特林 - 75题
  for (let i = 226; i <= 300; i++) {
    questions.push({
      id: `sort_n_${String(i).padStart(3, '0')}`,
      text: `为了成功我可以不惜一切代价，喜欢结交有地位和影响力的朋友${i}`,
      type: 'scale',
      options: opts,
      meta: { house: 'slytherin', weight: 1.0 }
    })
  }
  
  return questions
}

export const sortingNormalQuestions: Question[] = generateQuestions()
