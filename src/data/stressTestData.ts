import { Assessment, Question } from '../types';

/**
 * 压力水平测试 (基于PSS - Perceived Stress Scale)
 * 
 * 理论基础：
 * - 知觉压力量表 (PSS-10/PSS-14) 是目前使用最广泛的压力评估工具
 * - 测量个体在过去一个月内对生活情境的主观压力感受
 * - 包含负向和正向题目，全面评估压力感受和应对能力
 * 
 * 评分系统：
 * - 0-13分：低压力水平
 * - 14-26分：中等压力水平
 * - 27-40分：高压力水平
 * 
 * 心理理论参考：
 * - 拉扎勒斯的压力与应对理论
 * - 塞里的一般适应综合征（GAS）
 * - 霍姆斯和拉赫的社会再适应量表
 */

export const STRESS_TEST_ASSESSMENT: Assessment = {
  id: 'stress-test',
  title: '压力水平测试',
  description: '了解你当前的压力状态，获得专业的分析和建议。基于心理学界广泛使用的知觉压力量表(PSS)。',
  category: '健康',
  totalQuestions: 14,
  icon: '😌',
  difficulty: '简单',
  estimatedTime: '3分钟'
};

export const STRESS_TEST_QUESTIONS: Question[] = [
  // 第1部分：负向题目（直接计分，压力来源）
  { 
    id: 's1', 
    text: '在过去一个月里，你有多少时间感到无法控制生活中的重要事情？', 
    trait: 'negative',
    reverse: false
  },
  { 
    id: 's2', 
    text: '在过去一个月里，你有多少时间感到紧张和有压力？', 
    trait: 'negative',
    reverse: false
  },
  { 
    id: 's3', 
    text: '在过去一个月里，你有多少时间感到神经紧张或焦虑？', 
    trait: 'negative',
    reverse: false
  },
  { 
    id: 's4', 
    text: '在过去一个月里，你有多少时间感到事情的发展超出了你的控制？', 
    trait: 'negative',
    reverse: false
  },
  { 
    id: 's5', 
    text: '在过去一个月里，你有多少时间感到你无法应付所有必须做的事情？', 
    trait: 'negative',
    reverse: false
  },
  { 
    id: 's6', 
    text: '在过去一个月里，你有多少时间感到困难堆积如山，无法克服？', 
    trait: 'negative',
    reverse: false
  },
  { 
    id: 's7', 
    text: '在过去一个月里，你有多少时间感到烦躁不安？', 
    trait: 'negative',
    reverse: false
  },
  
  // 第2部分：正向题目（反向计分，应对资源）
  { 
    id: 's8', 
    text: '在过去一个月里，你有多少时间感到能够成功应对生活中的重要变化？', 
    trait: 'positive',
    reverse: true
  },
  { 
    id: 's9', 
    text: '在过去一个月里，你有多少时间感到有信心处理好自己的问题？', 
    trait: 'positive',
    reverse: true
  },
  { 
    id: 's10', 
    text: '在过去一个月里，你有多少时间感到事情进展顺利？', 
    trait: 'positive',
    reverse: true
  },
  { 
    id: 's11', 
    text: '在过去一个月里，你有多少时间感到能够控制自己的情绪？', 
    trait: 'positive',
    reverse: true
  },
  { 
    id: 's12', 
    text: '在过去一个月里，你有多少时间感到生活中的事情都在掌控之中？', 
    trait: 'positive',
    reverse: true
  },
  { 
    id: 's13', 
    text: '在过去一个月里，你有多少时间感到能够有效应对困难？', 
    trait: 'positive',
    reverse: true
  },
  { 
    id: 's14', 
    text: '在过去一个月里，你有多少时间感到保持着内心的平静？', 
    trait: 'positive',
    reverse: true
  }
];

export const STRESS_RESPONSE_OPTIONS = [
  { value: 0, label: '从未' },
  { value: 1, label: '偶尔' },
  { value: 2, label: '有时' },
  { value: 3, label: '经常' },
  { value: 4, label: '总是' }
];

// 压力来源分析
export const STRESS_SOURCES = [
  { type: 'work', name: '工作压力', examples: ['工作量过大', '时间压力', '工作冲突', '职业发展'] },
  { type: 'relationship', name: '关系压力', examples: ['家庭矛盾', '朋友关系', '亲密关系', '社交压力'] },
  { type: 'health', name: '健康压力', examples: ['自身健康', '家人健康', '睡眠问题', '疲劳'] },
  { type: 'financial', name: '财务压力', examples: ['经济压力', '债务问题', '未来担忧'] },
  { type: 'lifeChange', name: '生活变化', examples: ['搬家', '工作变动', '失去亲友', '重大决策'] }
];

// 压力应对策略
export const COPING_STRATEGIES = {
  problemFocused: [
    { name: '制定计划', description: '将大问题分解成小步骤，制定具体行动计划' },
    { name: '时间管理', description: '学习优先级管理，使用时间管理工具' },
    { name: '寻求支持', description: '向朋友、家人或专业人士寻求帮助' },
    { name: '问题解决', description: '直接面对问题，寻找解决方案' }
  ],
  emotionFocused: [
    { name: '冥想放松', description: '正念冥想、深呼吸、渐进式肌肉放松' },
    { name: '运动锻炼', description: '有氧运动、瑜伽、跑步等，释放压力激素' },
    { name: '艺术创作', description: '绘画、音乐、写作等表达性艺术' },
    { name: '自然接触', description: '接触自然、散步、户外活动' }
  ],
  avoidance: [
    { name: '健康回避', description: '暂时分散注意力，但不过度逃避' },
    { name: '设定边界', description: '学会说不，保护自己的时间和能量' },
    { name: '休息恢复', description: '给自己时间充电和恢复' }
  ]
};

export const STRESS_LEVELS = {
  low: {
    name: '低压力水平',
    range: [0, 13],
    description: '你目前处于良好的压力管理状态，能够很好地应对生活中的各种挑战。保持现在的生活方式，继续关注自己的身心健康。',
    color: 'green',
    detailed: {
      physicalSigns: ['精力充沛', '睡眠良好', '食欲正常', '身体放松'],
      emotionalSigns: ['情绪稳定', '乐观积极', '平静自信', '能享受生活'],
      cognitiveSigns: ['思维清晰', '决策力强', '专注力好', '解决问题能力强'],
      socialSigns: ['社交活跃', '享受人际交往', '有支持网络', '善于沟通']
    },
    recommendations: {
      continue: ['继续保持规律的作息', '维持健康的生活方式', '保持社交联系', '定期放松和娱乐'],
      enhance: ['尝试新的放松技巧', '拓展兴趣爱好', '设定新的个人目标', '帮助他人'],
      watch: ['不过度承担新责任', '关注压力的早期预警信号', '保持工作生活平衡']
    },
    dailyPractices: [
      '每天5-10分钟的感恩日记',
      '保持规律的运动习惯',
      '每周安排放松时间',
      '与朋友家人保持联系'
    ],
    resources: ['冥想应用', '减压音频', '自然环境接触', '爱好活动']
  },
  medium: {
    name: '中等压力水平',
    range: [14, 26],
    description: '你正经历一定程度的压力，但还在可控范围内。适当调整生活节奏，采取一些压力管理措施会对你有帮助。',
    color: 'yellow',
    detailed: {
      physicalSigns: ['偶尔疲劳', '肌肉紧张', '睡眠质量波动', '食欲变化'],
      emotionalSigns: ['有时烦躁', '情绪波动', '担心未来', '偶尔感到不堪重负'],
      cognitiveSigns: ['注意力有时分散', '决策困难', '思虑过多', '记忆力轻微下降'],
      socialSigns: ['社交减少', '有时感到孤独', '沟通困难', '容易不耐烦']
    },
    recommendations: {
      immediate: ['减少工作量/责任', '安排专门的休息时间', '与信任的人交谈', '开始规律运动'],
      medium: ['学习压力管理技巧', '建立健康边界', '改善睡眠习惯', '培养放松爱好'],
      longTerm: ['重新评估优先级', '学习时间管理', '建立健康生活方式', '考虑专业咨询']
    },
    dailyPractices: [
      '每天10分钟的深呼吸或冥想',
      '30分钟的轻度运动',
      '7-8小时的规律睡眠',
      '健康均衡的饮食',
      '与朋友交流15分钟'
    ],
    resources: ['减压书籍', '正念应用', '压力管理课程', '咨询师（可选）']
  },
  high: {
    name: '高压力水平',
    range: [27, 40],
    description: '你目前正经历较高的压力水平，这可能会影响你的身心健康。建议采取积极的应对措施，必要时寻求专业帮助。',
    color: 'red',
    detailed: {
      physicalSigns: ['持续疲劳', '睡眠问题严重', '头痛/肌肉紧张', '消化问题', '免疫系统下降'],
      emotionalSigns: ['持续焦虑', '情绪低落', '易怒', '感到绝望', '失去兴趣'],
      cognitiveSigns: ['难以集中注意力', '决策困难', '消极思维', '记忆力下降', '感到不知所措'],
      socialSigns: ['社交回避', '孤立自己', '关系冲突', '缺乏支持感']
    },
    recommendations: {
      urgent: ['尽快减轻压力源', '寻求专业帮助', '告诉家人/朋友你的状况', '暂停新的责任'],
      medical: ['考虑咨询医生', '心理咨询', '压力管理课程', '可能需要药物支持（医生建议）'],
      lifestyle: ['简化生活', '强制休息', '寻求支持网络', '健康第一'],
      selfCare: ['不要自责', '一步一步来', '寻求帮助不是软弱', '优先照顾自己']
    },
    dailyPractices: [
      '简化日程，只做最重要的事',
      '每天至少放松30分钟',
      '保证充足睡眠',
      '温和的身体活动（散步/瑜伽）',
      '与信任的人交流'
    ],
    resources: ['心理健康专业人士', '压力管理专家', '支持小组', '危机热线（如需要）']
  }
};

// 压力阶段模型（基于塞里的GAS理论）
export const STRESS_STAGES = {
  alarm: {
    name: '警报阶段',
    description: '身体识别压力源，启动"战或逃"反应',
    signs: ['心跳加速', '血压升高', '肌肉紧张', '警觉性提高'],
    coping: '这是正常的保护反应，给你能量应对挑战'
  },
  resistance: {
    name: '抵抗阶段',
    description: '身体持续应对压力，试图恢复平衡',
    signs: ['持续紧张', '疲劳感', '易怒', '睡眠困扰'],
    coping: '需要积极管理压力，避免进入衰竭阶段'
  },
  exhaustion: {
    name: '衰竭阶段',
    description: '长期压力导致身心资源耗尽',
    signs: ['严重疲劳', '免疫力下降', '情绪枯竭', '功能受损'],
    coping: '需要专业干预，严重时请寻求医疗帮助'
  }
};

// 压力-表现曲线（耶基斯-多德森定律）
export const PERFORMANCE_CURVE = {
  tooLow: {
    state: '低压力-低表现',
    description: '压力太低，缺乏动力和刺激，表现不佳',
    tips: ['设定有挑战性的目标', '增加一些变化和刺激', '寻找新的挑战']
  },
  optimal: {
    state: '最佳压力-最佳表现',
    description: '压力适中，动机和表现达到最佳平衡点',
    tips: ['保持这种状态', '继续目前的节奏', '享受高效的状态']
  },
  tooHigh: {
    state: '高压力-低表现',
    description: '压力过大，超过负荷，表现下降',
    tips: ['减压措施', '重新评估任务', '寻求支持']
  }
};

// 压力自我评估清单
export const STRESS_CHECKLIST = {
  warningSigns: [
    '睡眠质量下降',
    '感到疲惫不堪',
    '情绪波动大',
    '注意力难以集中',
    '逃避社交活动',
    '饮食习惯改变',
    '过度使用手机/娱乐',
    '身体不适（头痛、胃痛等）',
    '对事物失去兴趣',
    '易怒或不耐烦'
  ],
  protectiveFactors: [
    '有可信赖的朋友/家人',
    '规律的运动习惯',
    '充足的睡眠',
    '放松爱好（阅读、音乐等）',
    '信仰或精神实践',
    '明确的生活目标',
    '健康的边界',
    '积极的自我对话'
  ]
};

// 压力日记模板
export const STRESS_DIARY_TEMPLATE = {
  entries: [
    { question: '今天主要的压力源是什么？', key: 'source' },
    { question: '压力的程度（1-10分）？', key: 'level' },
    { question: '你当时的感受是怎样的？', key: 'feelings' },
    { question: '你是如何应对的？', key: 'coping' },
    { question: '现在感觉如何？', key: 'after' }
  ],
  benefits: [
    '识别压力模式',
    '了解个人触发器',
    '发现有效应对策略',
    '监控进步',
    '增强自我觉察'
  ]
};

// 放松技术数据库
export const RELAXATION_TECHNIQUES = {
  breathing: [
    { name: '4-7-8呼吸法', description: '吸气4秒，屏气7秒，呼气8秒，重复4次' },
    { name: '腹式呼吸', description: '深呼吸，用腹部而不是胸部呼吸，每分钟5-8次' },
    { name: '平衡呼吸', description: '吸气和呼气时间相同，如吸气4秒，呼气4秒' }
  ],
  body: [
    { name: '渐进式肌肉放松', description: '从脚趾开始，逐组肌肉紧张再放松' },
    { name: '身体扫描', description: '从上到下，觉察每个身体部位的感觉' },
    { name: '伸展运动', description: '简单的瑜伽动作或伸展，释放肌肉紧张' }
  ],
  mental: [
    { name: '正念冥想', description: '专注于当下，不评判地觉察想法和感受' },
    { name: '引导想象', description: '想象一个平静的场景，调动所有感官' },
    { name: '感恩练习', description: '回想3-5件今天值得感恩的事情' }
  ]
};

// 健康生活方式指南
export const HEALTHY_HABITS = {
  sleep: [
    '保持规律的睡眠时间',
    '创造良好的睡眠环境',
    '睡前1小时避免屏幕',
    '7-9小时睡眠时间'
  ],
  nutrition: [
    '均衡饮食，减少咖啡因和糖',
    '多喝水，保持水分',
    '规律进食，不要跳餐',
    '增加 Omega-3 摄入'
  ],
  movement: [
    '每天30分钟中等强度运动',
    '寻找你喜欢的运动方式',
    '散步、跑步、瑜伽、游泳',
    '每周至少5天'
  ],
  social: [
    '保持社交联系',
    '与支持你的人相处',
    '学会倾诉和倾听',
    '建立健康边界'
  ]
};

// 专业资源
export const PROFESSIONAL_RESOURCES = {
  whenToSeekHelp: [
    '压力持续超过2周',
    '影响日常功能（工作、学习、关系）',
    '出现焦虑或抑郁症状',
    '使用不健康的应对方式（酗酒、滥用药物等）',
    '有自残或自杀想法（立即寻求紧急帮助）'
  ],
  professionals: [
    '心理咨询师/心理治疗师',
    '精神科医生（如需要药物治疗）',
    '压力管理教练',
    '健康教练',
    '全科医生（家庭医生）'
  ],
  therapyTypes: [
    '认知行为疗法(CBT) - 压力管理首选',
    '正念减压疗法(MBSR)',
    '接纳与承诺疗法(ACT)',
    '心理动力学治疗',
    '团体治疗'
  ]
};
