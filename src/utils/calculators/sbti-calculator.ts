import type { Answer } from '../../types'

interface SBTIDimension {
  name: string
  score: number
  percentage: number
  preference: string
  preferenceName: string
  color: string
  description: string
}

interface SBTIResult extends Record<string, any> {
  typeCode: string
  typeName: string
  typeDescription: string
  dimensions: SBTIDimension[]
  strengths: string[]
  blindSpots: string[]
  careerSuggestions: string[]
  overall: string
  title: string
  subtitle: string
  summary: string
  detailedAnalysis: string
  compatibility: string
  famousPeople: string[]
  score: number
}

const DIMENSION_NAMES = {
  extraversion: '能量来源',
  sensing: '信息获取',
  thinking: '决策方式',
  judging: '生活态度',
}

const PREFERENCE_NAMES = {
  E: '外向',
  I: '内向',
  S: '实感',
  N: '直觉',
  T: '思考',
  F: '情感',
  J: '判断',
  P: '感知',
}

const TYPE_NAMES: Record<string, string> = {
  INTJ: '建筑师',
  INTP: '逻辑学家',
  ENTJ: '指挥官',
  ENTP: '辩论家',
  INFJ: '提倡者',
  INFP: '调停者',
  ENFJ: '主人公',
  ENFP: '竞选者',
  ISTJ: '物流师',
  ISFJ: '守卫者',
  ESTJ: '总经理',
  ESFJ: '执政官',
  ISTP: '鉴赏家',
  ISFP: '探险家',
  ESTP: '企业家',
  ESFP: '表演者',
}

function getTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
    INTJ: '富有想象力和战略性的思想家，一切皆在计划之中',
    INTP: '具有创造力的发明家，对知识有着止不住的渴望',
    ENTJ: '大胆、富有想象力且意志强大的领导者',
    ENTP: '聪明好奇的思想者，不会放弃任何智力上的挑战',
    INFJ: '安静而神秘，同时鼓舞人心且不知疲倦的理想主义者',
    INFP: '诗意、善良的利他主义者，总是热情地为正当理由提供帮助',
    ENFJ: '富有魅力且鼓舞人心的领导者',
    ENFP: '热情、有创造力、社交自由的人',
    ISTJ: '实际且注重事实的个人，可靠性不容怀疑',
    ISFJ: '非常专注且热情的保护者',
    ESTJ: '出色的管理者',
    ESFJ: '极有同情心、爱社交的人',
    ISTP: '大胆而实际的实验家',
    ISFP: '灵活且有魅力的艺术家',
    ESTP: '聪明、精力充沛且善于感知的人',
    ESFP: '自发的、精力充沛的表演者',
  }
  return descriptions[type] || '独特而有魅力的人格类型'
}

function getStrengths(type: string): string[] {
  const strengths: Record<string, string[]> = {
    INTJ: ['强大的分析和战略思维能力', '高度的自律和责任感', '出色的抽象思维能力'],
    INTP: ['创新能力和原创性思维', '客观公正的分析能力', '对复杂系统的理解能力'],
    ENTJ: ['强大的领导能力和决断力', '高效的组织管理能力', '长远的战略眼光'],
    ENTP: ['敏捷的思维和机智', '丰富的创造力和想象力', '出色的辩论技巧'],
    INFJ: ['深刻的洞察力和直觉', '强烈的道德感和理想主义', '富有同情心和同理心'],
    INFP: ['高度的创造力和想象力', '强烈的个人价值观', '对他人的深度理解'],
    ENFJ: ['出色的人际交往能力', '强大的感染力和号召力', '对他人成长的关注'],
    ENFP: ['丰富的创造力和热情', '出色的人际交往能力', '灵活和适应性强'],
    ISTJ: ['高度的责任感和可靠', '注重细节和准确性', '强大的组织能力'],
    ISFJ: ['强烈的责任感和奉献精神', '出色的记忆力和观察力', '对他人的关心和照顾'],
    ESTJ: ['出色的组织管理能力', '注重传统和秩序', '高度的责任感'],
    ESFJ: ['出色的社交能力和温暖', '强烈的责任感和服务意识', '善于组织团队活动'],
    ISTP: ['出色的问题解决能力', '冷静和务实的态度', '灵活和适应能力强'],
    ISFP: ['对美学的敏感和欣赏', '强烈的个人价值观', '灵活和适应性强'],
    ESTP: ['活在当下和享受现在', '出色的应变能力', '行动力强和实践导向'],
    ESFP: ['热情和活力四射', '出色的表演和社交能力', '乐观和积极的态度'],
  }
  return strengths[type] || ['独特的人格魅力', '出色的适应能力', '富有创造力']
}

function getBlindSpots(type: string): string[] {
  const blindSpots: Record<string, string[]> = {
    INTJ: ['可能过度分析而忽略情感', '对他人的期望可能过高', '完美主义倾向'],
    INTP: ['可能忽略实际应用和执行', '社交互动相对薄弱', '过于理论化'],
    ENTJ: ['可能显得过于强势和不妥协', '对他人的感受可能不够敏感', '缺乏耐心'],
    ENTP: ['可能缺乏执行力和跟进', '容易感到无聊和分心', '决策可能反复'],
    INFJ: ['可能过于理想化和完美主义', '过度承担他人的问题', '容易感到疲惫'],
    INFP: ['可能过于理想化和敏感', '难以接受批评', '缺乏执行力'],
    ENFJ: ['可能过度照顾他人而忽略自己', '过于理想化他人', '难以处理冲突'],
    ENFP: ['可能缺乏专注力和持续性', '过度承诺而难以兑现', '难以做决定'],
    ISTJ: ['可能过于传统和固执', '对新事物接受较慢', '缺乏灵活性'],
    ISFJ: ['可能过于牺牲自己', '难以拒绝他人', '对变化感到不安'],
    ESTJ: ['可能过于严格和缺乏灵活性', '对情感不够敏感', '过于强调效率'],
    ESFJ: ['可能过于在意他人看法', '过度照顾他人', '难以做不受欢迎的决定'],
    ISTP: ['可能显得冷漠和疏离', '长期规划能力较弱', '对情感表达不自在'],
    ISFP: ['可能过于敏感和内向', '长期规划较弱', '难以面对冲突'],
    ESTP: ['可能缺乏长期规划', '容易感到无聊', '对理论学习缺乏耐心'],
    ESFP: ['可能难以专注和持久', '对未来规划较弱', '容易受到外界影响'],
  }
  return blindSpots[type] || ['需要更好地平衡工作生活', '持续学习和成长', '保持开放心态']
}

function getCareers(type: string): string[] {
  const careers: Record<string, string[]> = {
    INTJ: ['科学研究', '系统架构', '战略规划', '投资分析'],
    INTP: ['软件开发', '数据分析', '科学研究', '学术研究'],
    ENTJ: ['企业管理', '投资银行', '创业', '战略咨询'],
    ENTP: ['产品设计', '创业', '咨询', '市场营销'],
    INFJ: ['心理咨询', '非营利组织', '教育', '作家'],
    INFP: ['艺术创作', '写作', '心理咨询', '非营利组织'],
    ENFJ: ['人力资源', '培训发展', '非营利组织', '教育'],
    ENFP: ['市场营销', '创业', '教育', '媒体'],
    ISTJ: ['会计审计', '项目管理', '法律', '医疗保健'],
    ISFJ: ['医疗护理', '教育', '社会工作', '行政管理'],
    ESTJ: ['企业管理', '金融', '法律', '军队'],
    ESFJ: ['医疗护理', '教育', '销售', '社会工作'],
    ISTP: ['工程技术', '飞行员', '消防员', '运动员'],
    ISFP: ['艺术设计', '音乐表演', '摄影', '厨艺'],
    ESTP: ['销售', '运动', '创业', '应急服务'],
    ESFP: ['表演艺术', '活动策划', '销售', '旅游'],
  }
  return careers[type] || ['多种职业可能性']
}

function getFamousPeople(type: string): string[] {
  const famousPeople: Record<string, string[]> = {
    INTJ: ['尼古拉·特斯拉', '爱因斯坦', '马克·扎克伯格', '马斯克'],
    INTP: ['爱因斯坦', '比尔·盖茨', '伽利略', '达尔文'],
    ENTJ: ['拿破仑', '朱利叶斯·凯撒', '史蒂夫·乔布斯'],
    ENTP: ['爱迪生', '马克·吐温', '乔布斯', '王健林'],
    INFJ: ['马丁·路德·金', '曼德拉', '特蕾莎修女'],
    INFP: ['莎士比亚', 'J.R.R.托尔金', '梵高'],
    ENFJ: ['奥巴马', '马丁·路德·金', '奥普拉'],
    ENFP: ['罗宾·威廉姆斯', '威尔·史密斯', '爱因斯坦'],
    ISTJ: ['华盛顿', '乔治·沃克·布什', '沃伦·巴菲特'],
    ISFJ: ['威廉王子', '碧昂斯', '卡戴珊'],
    ESTJ: ['希拉里·克林顿', '亨利·福特', '约翰·D·洛克菲勒'],
    ESFJ: ['泰勒·斯威夫特', '詹妮弗·洛佩兹'],
    ISTP: ['迈克尔·乔丹', '布鲁斯·李', '乔布斯'],
    ISFP: ['迈克尔·杰克逊', '科比·布莱恩特', '贾斯汀·汀布莱克'],
    ESTP: ['迈克尔·乔丹', '唐纳德·特朗普', '约翰·F·肯尼迪'],
    ESFP: ['贾斯汀·比伯', '碧昂斯', 'Lady Gaga'],
  }
  return famousPeople[type] || ['各个领域的杰出人物']
}

function getDimensionDescription(dimension: string, preference: string, score: number): string {
  const descriptions: Record<string, Record<string, string>> = {
    extraversion: {
      E: '你从与他人交往中获得能量，喜欢社交活动，善于表达自己',
      I: '你从独处中获得能量，喜欢深度思考，享受内心世界',
    },
    sensing: {
      S: '你注重现实和细节，通过感官获取信息，喜欢具体明确的事物',
      N: '你注重未来和可能性，通过直觉获取信息，喜欢抽象的概念',
    },
    thinking: {
      T: '你做决定时注重逻辑和分析，客观公正，重视真理和原则',
      F: '你做决定时注重情感和价值观，关心他人，重视和谐',
    },
    judging: {
      J: '你喜欢有条理和计划，喜欢有结论和确定性，倾向于决策和完成',
      P: '你喜欢灵活和随机应变，保持开放，喜欢探索和适应变化',
    },
  }
  return descriptions[dimension]?.[preference] || '这是你的独特之处'
}

function getCompatibility(type: string): string {
  const compatibility: Record<string, string> = {
    INTJ: '与 ENTJ, INFP, INFJ 有较好的兼容性',
    INTP: '与 ENTJ, ENTP, INFP 有较好的兼容性',
    ENTJ: '与 ENTJ, INTJ, ENTP 有较好的兼容性',
    ENTP: '与 ENTP, ENFP, INTP 有较好的兼容性',
    INFJ: '与 INFJ, INTJ, ENFJ 有较好的兼容性',
    ENFJ: '与 ENFJ, INFJ, ENFP 有较好的兼容性',
    ENFP: '与 ENFP, ENTP, INFP 有较好的兼容性',
    ISTJ: '与 ISFJ, ISTJ, ESTJ 有较好的兼容性',
    ISFJ: '与 ISFJ, ESFJ, ESFJ 有较好的兼容性',
    ESTJ: '与 ESTJ, ISTJ, ESFJ 有较好的兼容性',
    ESFJ: '与 ESFJ, ESTJ, ESFJ 有较好的兼容性',
    ISTP: '与 ISTP, ESTP, ISFP 有较好的兼容性',
    ISFP: '与 ISFP, ESFP, ISFP 有较好的兼容性',
    ESTP: '与 ESTP, ISTP, ESTP 有较好的兼容性',
    ESFP: '与 ESFP, ESTP, ESFP 有较好的兼容性',
  }
  return compatibility[type] || '与多种人格类型都有良好的兼容性'
}

export function calculateSBTI(answers: Answer[]): SBTIResult {
  // 创建答案映射
  const answerMap: Record<string, number> = {}
  answers.forEach(a => {
    const qid = typeof a.questionId === 'string' ? a.questionId : `sbti-${a.questionId}`
    const value = typeof a.value === 'number' ? a.value : parseInt(String(a.value || 3))
    answerMap[qid] = value
  })

  // 30题分配到4个维度（每个维度7-8题）
  let eScore = 0, nScore = 0, fScore = 0, pScore = 0
  let eCount = 0, nCount = 0, fCount = 0, pCount = 0

  // 前8题: E-I (能量来源)
  for (let i = 1; i <= 8; i++) {
    const qid = `sbti-${i}`
    if (answerMap[qid]) {
      eScore += answerMap[qid] - 2.5  // 1-4 → -1.5 到 +1.5
      eCount++
    }
  }

  // 9-16题: S-N (信息获取)
  for (let i = 9; i <= 16; i++) {
    const qid = `sbti-${i}`
    if (answerMap[qid]) {
      nScore += answerMap[qid] - 2.5
      nCount++
    }
  }

  // 17-24题: T-F (决策方式)
  for (let i = 17; i <= 24; i++) {
    const qid = `sbti-${i}`
    if (answerMap[qid]) {
      fScore += answerMap[qid] - 2.5
      fCount++
    }
  }

  // 25-32题: J-P (生活态度)
  for (let i = 25; i <= 30; i++) {
    const qid = `sbti-${i}`
    if (answerMap[qid]) {
      pScore += answerMap[qid] - 2.5
      pCount++
    }
  }

  // 计算标准化分数
  const E = Math.min(100, Math.max(0, 50 + (eCount > 0 ? (eScore / eCount) * 25 : 0)))
  const S = Math.min(100, Math.max(0, 50 + (nCount > 0 ? (nScore / nCount) * 25 : 0)))
  const T = Math.min(100, Math.max(0, 50 + (fCount > 0 ? (fScore / fCount) * 25 : 0)))
  const J = Math.min(100, Math.max(0, 50 + (pCount > 0 ? (pScore / pCount) * 25 : 0)))

  const ePref = E >= 50 ? 'E' : 'I'
  const sPref = S >= 50 ? 'S' : 'N'
  const tPref = T >= 50 ? 'T' : 'F'
  const jPref = J >= 50 ? 'J' : 'P'

  const typeCode = ePref + (sPref === 'S' ? 'S' : 'N') + tPref + jPref
  const typeName = TYPE_NAMES[typeCode] || typeCode

  const dimensions: SBTIDimension[] = [
    {
      name: DIMENSION_NAMES.extraversion,
      score: Math.round(E),
      percentage: Math.round(E),
      preference: ePref,
      preferenceName: PREFERENCE_NAMES[ePref],
      color: '#F59E0B',
      description: getDimensionDescription('extraversion', ePref, E),
    },
    {
      name: DIMENSION_NAMES.sensing,
      score: Math.round(S),
      percentage: Math.round(S),
      preference: sPref === 'S' ? 'S' : 'N',
      preferenceName: PREFERENCE_NAMES[sPref === 'S' ? 'S' : 'N'],
      color: '#8B5CF6',
      description: getDimensionDescription('sensing', sPref === 'S' ? 'S' : 'N', S),
    },
    {
      name: DIMENSION_NAMES.thinking,
      score: Math.round(T),
      percentage: Math.round(T),
      preference: tPref,
      preferenceName: PREFERENCE_NAMES[tPref],
      color: '#EC4899',
      description: getDimensionDescription('thinking', tPref, T),
    },
    {
      name: DIMENSION_NAMES.judging,
      score: Math.round(J),
      percentage: Math.round(J),
      preference: jPref,
      preferenceName: PREFERENCE_NAMES[jPref],
      color: '#06B6D4',
      description: getDimensionDescription('judging', jPref, J),
    },
  ]

  const overallScore = Math.round(((100 - Math.abs(50 - E)) + (100 - Math.abs(50 - S)) + (100 - Math.abs(50 - T)) + (100 - Math.abs(50 - J))) / 4)

  return {
    typeCode,
    typeName,
    typeDescription: getTypeDescription(typeCode),
    dimensions,
    strengths: getStrengths(typeCode),
    blindSpots: getBlindSpots(typeCode),
    careerSuggestions: getCareers(typeCode),
    overall: typeName,
    title: `你的人格类型: ${typeCode} - ${typeName}`,
    subtitle: `${typeCode} 人格`,
    summary: `经鉴定，你是 ${typeCode} ${typeName} - ${getTypeDescription(typeCode)}`,
    detailedAnalysis: `${typeCode} ${typeName}是一个独特的人格类型，具有独特的优势和特点。`,
    compatibility: getCompatibility(typeCode),
    famousPeople: getFamousPeople(typeCode),
    score: Math.round(overallScore),
  }
}
