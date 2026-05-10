import type { Answer } from '../../types'

export interface SCL90Result extends Record<string, any> {
  rawScore: number
  generalSymptomIndex: number
  level: 'normal' | 'mild' | 'moderate' | 'severe'
  levelText: string
  dimensions: {
    somatization: { score: number; level: string; items: number }
    obsessiveCompulsive: { score: number; level: string; items: number }
    interpersonalSensitivity: { score: number; level: string; items: number }
    depression: { score: number; level: string; items: number }
    anxiety: { score: number; level: string; items: number }
    hostility: { score: number; level: string; items: number }
    phobicAnxiety: { score: number; level: string; items: number }
    paranoidIdeation: { score: number; level: string; items: number }
    psychoticism: { score: number; level: string; items: number }
  }
  radarData: { dimension: string; score: number; fullMark: number }[]
  interpretation: string
  recommendations: string[]
  warning: string
}

const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const dimensionNames: Record<string, string> = {
  somatization: '躯体化',
  obsessiveCompulsive: '强迫症状',
  interpersonalSensitivity: '人际关系敏感',
  depression: '抑郁',
  anxiety: '焦虑',
  hostility: '敌对',
  phobicAnxiety: '恐怖',
  paranoidIdeation: '偏执',
  psychoticism: '精神病性',
}

const dimensionMap: Record<string, string[]> = {
  somatization: ['scl90-1', 'scl90-2', 'scl90-3', 'scl90-4'],
  obsessiveCompulsive: ['scl90-5', 'scl90-6', 'scl90-7', 'scl90-8'],
  interpersonalSensitivity: ['scl90-9', 'scl90-10', 'scl90-11', 'scl90-12'],
  depression: ['scl90-13', 'scl90-14', 'scl90-15', 'scl90-16'],
  anxiety: ['scl90-17', 'scl90-18', 'scl90-19', 'scl90-20'],
  hostility: ['scl90-21', 'scl90-22', 'scl90-23'],
  phobicAnxiety: ['scl90-24', 'scl90-25', 'scl90-26'],
  paranoidIdeation: ['scl90-27', 'scl90-28', 'scl90-29'],
  psychoticism: ['scl90-30', 'scl90-31', 'scl90-32'],
}

function getLevel(percentage: number): string {
  if (percentage >= 75) return '重度'
  if (percentage >= 60) return '中度'
  if (percentage >= 50) return '轻度'
  return '正常'
}

export function calculateSCL90(answers: Answer[]): SCL90Result {
  const answerMap: Record<string, number> = {}
  answers.forEach(a => {
    answerMap[a.questionId] = typeof a.value === 'number' ? a.value : parseInt(String(a.value || 1))
  })

  const dimensions: SCL90Result['dimensions'] = {} as SCL90Result['dimensions']
  let totalRaw = 0

  Object.entries(dimensionMap).forEach(([dim, ids]) => {
    const score = ids.reduce((sum, id) => sum + (answerMap[id] || 1), 0)
    const itemCount = ids.length
    const averageScore = score / itemCount
    dimensions[dim as keyof SCL90Result['dimensions']] = {
      score: Math.round(averageScore * 100) / 100,
      level: getLevel((averageScore / 5) * 100),
      items: itemCount,
    }
    totalRaw += score
  })

  const generalSymptomIndex = Math.round((totalRaw / 32) * 100) / 100

  let level: SCL90Result['level'] = 'normal'
  let levelText = '心理健康'
  if (generalSymptomIndex >= 2.5) { level = 'severe'; levelText = '心理健康状况需重点关注' }
  else if (generalSymptomIndex >= 2.0) { level = 'moderate'; levelText = '存在中等程度心理困扰' }
  else if (generalSymptomIndex >= 1.5) { level = 'mild'; levelText = '存在轻微心理症状' }

  const radarData = [
    { dimension: '躯体化', score: (dimensions.somatization.score / 5) * 100, fullMark: 100 },
    { dimension: '强迫症状', score: (dimensions.obsessiveCompulsive.score / 5) * 100, fullMark: 100 },
    { dimension: '人际关系', score: (dimensions.interpersonalSensitivity.score / 5) * 100, fullMark: 100 },
    { dimension: '抑郁', score: (dimensions.depression.score / 5) * 100, fullMark: 100 },
    { dimension: '焦虑', score: (dimensions.anxiety.score / 5) * 100, fullMark: 100 },
    { dimension: '敌对', score: (dimensions.hostility.score / 5) * 100, fullMark: 100 },
    { dimension: '恐怖', score: (dimensions.phobicAnxiety.score / 5) * 100, fullMark: 100 },
    { dimension: '偏执', score: (dimensions.paranoidIdeation.score / 5) * 100, fullMark: 100 },
    { dimension: '精神病性', score: (dimensions.psychoticism.score / 5) * 100, fullMark: 100 },
  ]

  let interpretation = `### SCL-90 测评结果

总症状指数：**${generalSymptomIndex}**（${levelText}）

**各维度得分详情：**

| 维度 | 均分 | 等级 |
|------|------|------|
| 躯体化 | ${dimensions.somatization.score} | ${dimensions.somatization.level} |
| 强迫症状 | ${dimensions.obsessiveCompulsive.score} | ${dimensions.obsessiveCompulsive.level} |
| 人际关系敏感 | ${dimensions.interpersonalSensitivity.score} | ${dimensions.interpersonalSensitivity.level} |
| 抑郁 | ${dimensions.depression.score} | ${dimensions.depression.level} |
| 焦虑 | ${dimensions.anxiety.score} | ${dimensions.anxiety.level} |
| 敌对 | ${dimensions.hostility.score} | ${dimensions.hostility.level} |
| 恐怖 | ${dimensions.phobicAnxiety.score} | ${dimensions.phobicAnxiety.level} |
| 偏执 | ${dimensions.paranoidIdeation.score} | ${dimensions.paranoidIdeation.level} |
| 精神病性 | ${dimensions.psychoticism.score} | ${dimensions.psychoticism.level} |

`

  const normalInterpretations = [
    '你的心理健康状况良好，各维度得分均在正常范围内。继续保持良好的生活习惯和积极的心态。',
    '恭喜！测评结果显示你的心理状态非常健康。请继续保持规律作息和适度运动。',
    '你的心理健康指数处于理想水平，说明你有着良好的心理调适能力和社会适应能力。',
  ]

  const mildInterpretations = [
    '测评显示你存在轻微的心理困扰，这在现代生活中较为常见。建议适当关注自己的情绪变化，必要时寻求专业支持。',
    '你有一些轻微的心理症状提示，但仍在可控范围内。可以通过运动、休息和社交来缓解。',
    '轻微的心理波动是正常的应激反应。建议保持觉察，给自己一些放松的时间。',
  ]

  const moderateInterpretations = [
    '测评显示你存在中等程度的心理困扰，建议认真对待这个信号。考虑寻求专业的心理咨询帮助。',
    '你的某些心理维度得分偏高，可能正在经历较大的心理压力。现在是时候采取行动来改善了。',
    '中等程度的心理症状可能已经影响到你的日常生活。建议优先照顾好自己，必要时寻求专业帮助。',
  ]

  const severeInterpretations = [
    '测评结果显示你的心理健康需要重点关注。请务必寻求专业心理咨询或精神科医生的帮助。',
    '你的心理困扰程度较重，请不要独自承受。专业的心理支持真的可以带来帮助。',
    '强烈建议你就近就医或联系心理咨询师。你值得获得专业的帮助和支持。',
  ]

  if (level === 'normal') {
    interpretation += randomPick(normalInterpretations)
  } else if (level === 'mild') {
    interpretation += randomPick(mildInterpretations)
  } else if (level === 'moderate') {
    interpretation += randomPick(moderateInterpretations)
  } else {
    interpretation += randomPick(severeInterpretations)
  }

  const recommendationPools = [
    [
      '保持规律作息和适度运动',
      '每天给自己留出放松时间',
      '与信任的朋友或家人交流',
      '练习深呼吸或正念冥想',
    ],
    [
      '增加有氧运动（每周3-5次）',
      '建立规律的睡眠习惯',
      '尝试记录情绪日记',
      '必要时寻求心理咨询',
    ],
    [
      '优先保证充足睡眠',
      '减少不必要的压力源',
      '寻求专业心理支持',
      '建立支持性社交网络',
    ],
    [
      '建议寻求专业心理咨询',
      '考虑预约精神科医生',
      '告知信任的人你的状态',
      '必要时拨打心理援助热线',
    ],
  ]

  const levelIndex = level === 'normal' ? 0 : level === 'mild' ? 1 : level === 'moderate' ? 2 : 3
  const recommendations = randomPick([recommendationPools[levelIndex], recommendationPools[levelIndex]])

  const warning = level !== 'normal'
    ? '⚠️ 本测评仅作为初步筛查工具，不能替代专业诊断。如有需要，请及时就医或寻求专业心理咨询。'
    : '✓ 本测评结果仅供参考，保持健康的生活方式是维持心理健康的关键。'

  return {
    rawScore: totalRaw,
    generalSymptomIndex,
    level,
    levelText,
    dimensions,
    radarData,
    interpretation,
    recommendations,
    warning,
  }
}
