import type { Assessment } from '../../types'
import { calculateSCL90 } from '../../utils/calculators/scl90-calculator'

export const scl90Assessment: Omit<Assessment, 'id'> & { id: string } = {
  id: 'scl90-symptoms',
  title: 'SCL-90 症状自评量表',
  subtitle: '心理健康筛查',
  description: '评估你的心理健康状态，识别潜在的心理困扰',
  icon: '🧠',
  category: '心理健康',
  subcategory: '症状筛查',
  difficulty: 'standard',
  duration: 10,
  questionCount: 30,
  quality: '专业',
  resultCalculator: calculateSCL90,
  questions: [
    // 躯体化 - 1
    { id: 'psqi_n01', type: 'likert-5', text: '头痛', reverseScored: false, dimension: 'somatization', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 强迫症状 - 2
    { id: 'psqi_n02', type: 'likert-5', text: '头脑中有不必要的想法或字句盘旋', reverseScored: false, dimension: 'obsessiveCompulsive', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 人际关系敏感 - 3
    { id: 'psqi_n03', type: 'likert-5', text: '对旁人责备求全', reverseScored: false, dimension: 'interpersonalSensitivity', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 抑郁 - 4
    { id: 'psqi_n04', type: 'likert-5', text: '感到自己的精力下降，活动减慢', reverseScored: false, dimension: 'depression', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 焦虑 - 5
    { id: 'psqi_n05', type: 'likert-5', text: '感到紧张或容易紧张', reverseScored: false, dimension: 'anxiety', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 敌对 - 6
    { id: 'psqi_n06', type: 'likert-5', text: '容易烦恼和激动', reverseScored: false, dimension: 'hostility', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 恐怖 - 7
    { id: 'psqi_n07', type: 'likert-5', text: '怕单独出门', reverseScored: false, dimension: 'phobicAnxiety', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 偏执 - 8
    { id: 'psqi_n08', type: 'likert-5', text: '感到大多数人都不可信任', reverseScored: false, dimension: 'paranoidIdeation', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 精神病性 - 9
    { id: 'psqi_n09', type: 'likert-5', text: '感到别人能控制你的思想', reverseScored: false, dimension: 'psychoticism', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 躯体化 - 10
    { id: 'psqi_n10', type: 'likert-5', text: '胸痛', reverseScored: false, dimension: 'somatization', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 强迫症状 - 11
    { id: 'psqi_n11', type: 'likert-5', text: '忘性大', reverseScored: false, dimension: 'obsessiveCompulsive', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 人际关系敏感 - 12
    { id: 'psqi_n12', type: 'likert-5', text: '感到人们对你不友好，不喜欢你', reverseScored: false, dimension: 'interpersonalSensitivity', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 抑郁 - 13
    { id: 'psqi_n13', type: 'likert-5', text: '对事物不感兴趣', reverseScored: false, dimension: 'depression', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 焦虑 - 14
    { id: 'psqi_n14', type: 'likert-5', text: '手抖', reverseScored: false, dimension: 'anxiety', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 敌对 - 15
    { id: 'psqi_n15', type: 'likert-5', text: '有想打人或伤害他人的冲动', reverseScored: false, dimension: 'hostility', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 恐怖 - 16
    { id: 'psqi_n16', type: 'likert-5', text: '怕空旷的场所或街道', reverseScored: false, dimension: 'phobicAnxiety', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 偏执 - 17
    { id: 'psqi_n17', type: 'likert-5', text: '感到有人在监视你，谈论你', reverseScored: false, dimension: 'paranoidIdeation', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 精神病性 - 18
    { id: 'psqi_n18', type: 'likert-5', text: '听到旁人听不到的声音', reverseScored: false, dimension: 'psychoticism', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 躯体化 - 19
    { id: 'psqi_n19', type: 'likert-5', text: '背痛', reverseScored: false, dimension: 'somatization', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 强迫症状 - 20
    { id: 'psqi_n20', type: 'likert-5', text: '担心自己的衣饰整齐及仪态的端正', reverseScored: false, dimension: 'obsessiveCompulsive', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 人际关系敏感 - 21
    { id: 'psqi_n21', type: 'likert-5', text: '感情容易受到伤害', reverseScored: false, dimension: 'interpersonalSensitivity', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 抑郁 - 22
    { id: 'psqi_n22', type: 'likert-5', text: '感到自己没有什么价值', reverseScored: false, dimension: 'depression', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 焦虑 - 23
    { id: 'psqi_n23', type: 'likert-5', text: '感到害怕', reverseScored: false, dimension: 'anxiety', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 敌对 - 24
    { id: 'psqi_n24', type: 'likert-5', text: '经常与人争论', reverseScored: false, dimension: 'hostility', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 恐怖 - 25
    { id: 'psqi_n25', type: 'likert-5', text: '怕某些东西、场所或处境', reverseScored: false, dimension: 'phobicAnxiety', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 偏执 - 26
    { id: 'psqi_n26', type: 'likert-5', text: '责怪别人制造麻烦', reverseScored: false, dimension: 'paranoidIdeation', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 精神病性 - 27
    { id: 'psqi_n27', type: 'likert-5', text: '有一些不属于你自己的想法', reverseScored: false, dimension: 'psychoticism', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 躯体化 - 28
    { id: 'psqi_n28', type: 'likert-5', text: '肌肉酸痛', reverseScored: false, dimension: 'somatization', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 强迫症状 - 29
    { id: 'psqi_n29', type: 'likert-5', text: '做事必须做得很慢以保证做得正确', reverseScored: false, dimension: 'obsessiveCompulsive', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
    // 人际关系敏感 - 30
    { id: 'psqi_n30', type: 'likert-5', text: '感到害羞不自在', reverseScored: false, dimension: 'interpersonalSensitivity', options: [
      { id: '1', text: '从无', value: 1 },
      { id: '2', text: '轻度', value: 2 },
      { id: '3', text: '中度', value: 3 },
      { id: '4', text: '偏重', value: 4 },
      { id: '5', text: '严重', value: 5 },
    ]},
  ],
}
