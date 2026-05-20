import type { Assessment } from '../../types'
import { calculateASI } from '../../utils/calculators/asi-calculator'

const LIKERT_OPTIONS = [
  { id: '1', text: '❌ 完全不同意', value: 1 },
  { id: '2', text: '⚪ 不太同意', value: 2 },
  { id: '3', text: '🔵 中立', value: 3 },
  { id: '4', text: '🟢 比较同意', value: 4 },
  { id: '5', text: '✅ 完全同意', value: 5 },
]

export const asiStandardAssessment: Omit<Assessment, 'id'> & { id: string } = {
  id: 'asi-standard',
  title: 'ASI 归因风格量表',
  description: '塞利格曼习得性无助 | 你的逆商有多高？逆境时你如何解释决定了你的人生',
  icon: '🌊',
  category: '心理健康',
  subcategory: '积极心理学',
  difficulty: 'standard',
  duration: 8,
  quality: '学术级',
  questionCount: 24,
  resultCalculator: calculateASI,
  questions: [
    // 稳定性维度 (6题) - reverse scored
    { id: 'asi1', type: 'likert-5', text: '遇到挫折时我倾向于认为这种情况会一直持续', reverseScored: true, dimension: 'stability', options: LIKERT_OPTIONS },
    { id: 'asi5', type: 'likert-5', text: '好事发生后，我觉得好运会持续很久', reverseScored: true, dimension: 'stability', options: LIKERT_OPTIONS },
    { id: 'asi9', type: 'likert-5', text: '失败后我总是觉得下次还会失败', reverseScored: true, dimension: 'stability', options: LIKERT_OPTIONS },
    { id: 'asi13', type: 'likert-5', text: '我相信困难的时期总会过去的', reverseScored: true, dimension: 'stability', options: LIKERT_OPTIONS },
    { id: 'asi17', type: 'likert-5', text: '一次成功让我觉得以后还会成功', reverseScored: true, dimension: 'stability', options: LIKERT_OPTIONS },
    { id: 'asi21', type: 'likert-5', text: '我认为坏事通常只是暂时的', reverseScored: true, dimension: 'stability', options: LIKERT_OPTIONS },
    
    // 普遍性维度 (6题) - reverse scored
    { id: 'asi2', type: 'likert-5', text: '一件事不顺利，我就觉得什么都不顺利', reverseScored: true, dimension: 'globality', options: LIKERT_OPTIONS },
    { id: 'asi6', type: 'likert-5', text: '在某方面成功，我觉得在其他方面也能成功', reverseScored: true, dimension: 'globality', options: LIKERT_OPTIONS },
    { id: 'asi10', type: 'likert-5', text: '一个领域的失败不会影响我在其他领域的信心', reverseScored: true, dimension: 'globality', options: LIKERT_OPTIONS },
    { id: 'asi14', type: 'likert-5', text: '我倾向于把问题局限在特定领域', reverseScored: true, dimension: 'globality', options: LIKERT_OPTIONS },
    { id: 'asi18', type: 'likert-5', text: '一件好事让我觉得生活整体都变好了', reverseScored: true, dimension: 'globality', options: LIKERT_OPTIONS },
    { id: 'asi22', type: 'likert-5', text: '我不会让一件坏事影响我的整个生活', reverseScored: true, dimension: 'globality', options: LIKERT_OPTIONS },
    
    // 内外因维度 (6题)
    { id: 'asi3', type: 'likert-5', text: '成功时我认为主要是靠自己的努力', dimension: 'internality', options: LIKERT_OPTIONS },
    { id: 'asi7', type: 'likert-5', text: '失败时我倾向于认为是自己的问题', dimension: 'internality', options: LIKERT_OPTIONS },
    { id: 'asi11', type: 'likert-5', text: '好事发生时我觉得运气很重要', dimension: 'internality', options: LIKERT_OPTIONS },
    { id: 'asi15', type: 'likert-5', text: '遇到挫折我会反思自己能改进的地方', dimension: 'internality', options: LIKERT_OPTIONS },
    { id: 'asi19', type: 'likert-5', text: '成功时我会感谢环境和他人的帮助', dimension: 'internality', options: LIKERT_OPTIONS },
    { id: 'asi23', type: 'likert-5', text: '我相信自己的行为决定了大部分结果', dimension: 'internality', options: LIKERT_OPTIONS },
    
    // 可控性维度 (6题)
    { id: 'asi4', type: 'likert-5', text: '我相信自己能够改变大部分事情', dimension: 'control', options: LIKERT_OPTIONS },
    { id: 'asi8', type: 'likert-5', text: '很多事情是我无法控制的', dimension: 'control', options: LIKERT_OPTIONS },
    { id: 'asi12', type: 'likert-5', text: '面对问题时我总能找到解决办法', dimension: 'control', options: LIKERT_OPTIONS },
    { id: 'asi16', type: 'likert-5', text: '我觉得命运掌握在自己手中', dimension: 'control', options: LIKERT_OPTIONS },
    { id: 'asi20', type: 'likert-5', text: '有时候无论怎么做都无法改变结果', dimension: 'control', options: LIKERT_OPTIONS },
    { id: 'asi24', type: 'likert-5', text: '我总是积极寻找改变现状的方法', dimension: 'control', options: LIKERT_OPTIONS },
  ],
}
