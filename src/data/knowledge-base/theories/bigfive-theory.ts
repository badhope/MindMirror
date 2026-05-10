export interface BigFiveDimension {
  code: string
  name: string
  alias: string
  description: string
  highScoreDescription: string
  lowScoreDescription: string
  facets: {
    name: string
    description: string
  }[]
  strengths: string[]
  growthAreas: string[]
  careerMatches: string[]
  relationships: string
  developmentTips: string[]
}

export interface BigFiveTheoryContent {
  introduction: string
  history: string
  scientificBasis: {
    reliability: string
    validity: string
    crossCultural: string
  }
  dimensions: Record<string, BigFiveDimension>
  interpretationGuide: {
    scoreRanges: { range: string; label: string; description: string }[]
    importantNotes: string[]
  }
  selfReflection: {
    questions: string[]
    actionableSteps: string[]
  }
  relatedAssessments: { id: string; name: string; description: string }[]
}

export const BIG_FIVE_THEORY: BigFiveTheoryContent = {
  introduction: `大五人格理论（Big Five Personality Traits），也被称为五因素模型（Five-Factor Model, FFM），是目前人格心理学领域最具影响力的理论框架。它将人格特质归纳为五个核心维度：开放性、尽责性、外向性、宜人性和神经质。这五个维度被认为能够相对全面地描述人类人格的基本结构，每个维度都描述了一个人在某个心理领域相对稳定的倾向。`,

  history: `大五人格模型的形成经历了漫长的学术探索。20世纪30年代，Gordon Allport 和 Henry Odbert 开始从英语词典中收集描述人格的词汇。1981年，Paul Costa 和 Robert McCrae 在系统研究的基础上正式提出了五因素模型。此后，大量跨文化研究证实了这五个维度的普适性，使得大五人格成为当代人格评估的黄金标准。`,

  scientificBasis: {
    reliability: '大五人格量表（NEO-PI-R）经过数十年发展和验证，内部一致性信度系数普遍在0.8以上，重测信度也表现出良好的稳定性。',
    validity: '大量研究表明大五人格能够有效预测重要的生活结果，包括职业成就（尽责性）、人际关系（宜人性）、主观幸福感（神经质）等。',
    crossCultural: '从英语词汇研究起步的大五模型，在超过50个国家和不同文化背景下都得到了验证，证明其具有相当程度的跨文化普适性。'
  },

  dimensions: {
    'O': {
      code: 'O',
      name: '开放性',
      alias: 'Openness to Experience',
      description: '开放性描述的是一个人对新鲜体验、艺术创造力和抽象思维的好奇程度与接受度。高开放性的人思维活跃、富有想象力；低开放性的人则更倾向于脚踏实地、遵循传统。',
      highScoreDescription: '你是一个充满好奇心的人，对新想法、新体验和不同的生活方式抱有强烈的兴趣。你富有想象力，喜欢思考抽象概念，艺术和文化对你有很强的吸引力。你倾向于接受变化而非抗拒它。',
      lowScoreDescription: '你更偏好熟悉和稳定的环境，倾向于遵循传统和已被验证的方法。你脚踏实地、务实可靠，对艺术和抽象思维的兴趣可能不如他人强烈，但你在执行和落地方面往往表现出色。',
      facets: [
        { name: '想象力', description: '对内心世界的丰富程度和幻想倾向' },
        { name: '审美感受', description: '对艺术和美的欣赏能力' },
        { name: "情感觉察", description: '对自己内在感受的敏感程度' },
        { name: '好奇心', description: '对不同观点和经验的探索欲' },
        { name: '尝鲜精神', description: '对陌生情境的接受度和冒险意愿' },
        { name: '智识探索', description: '对复杂思想讨论的兴趣程度' }
      ],
      strengths: [
        '创造性思维，能够产生新颖独特的想法',
        '求知欲强，学习能力强',
        '思维灵活，适应变化的能力强',
        '审美能力强，对美有敏锐的感知',
        '思想开放，不易偏见'
      ],
      growthAreas: [
        '可能过于理想化而脱离现实',
        '对细节和日常事务的耐心不足',
        '有时过于追求新颖而忽视实用性'
      ],
      careerMatches: ['艺术家/设计师', '科研人员', '战略顾问', '作家/创意总监', '哲学家'],
      relationships: '高开放性的你在关系中往往愿意尝试新事物、共同探索未知领域，这能为关系带来新鲜感和成长空间。',
      developmentTips: [
        '尝试学习一门新技能或了解一个完全陌生的领域',
        '在安全范围内主动走出舒适区，拥抱适度的变化',
        '将创意想法与实际行动相结合，学会落地执行',
        '欣赏传统智慧，从经典中汲取养分'
      ]
    },
    'C': {
      code: 'C',
      name: '尽责性',
      alias: 'Conscientiousness',
      description: '尽责性反映了一个人的自律程度、计划性和对目标的坚持程度。高尽责性的人做事有条理、可靠、有目标感；低尽责性的人则更灵活、随性、自发。',
      highScoreDescription: '你是一个高度负责、有条理的人。你设定目标后会坚持努力完成，注重细节，做事可靠。你有很强的自律能力，能够抵制即时满足的诱惑，为长远目标而努力。',
      lowScoreDescription: '你更加随性和灵活，不喜欢被严格的规则和时间表束缚。你倾向于顺其自然，适应性强，在需要快速反应和灵活应变的情境中往往表现更好。',
      facets: [
        { name: '能力', description: '对自己能力的自信程度和追求卓越的倾向' },
        { name: '条理性', description: '对生活和工作有序组织的程度' },
        { name: '责任感', description: '对承诺和职责的认真程度' },
        { name: '追求成就', description: '设定目标并努力达成的驱动力' },
        { name: '自律性', description: '延迟满足、控制冲动的能力' },
        { name: '审慎性', description: '在做决定前的深思熟虑程度' }
      ],
      strengths: [
        '高度可靠，值得信赖',
        '目标导向，善于规划和执行',
        '自律性强，能够坚持完成任务',
        '注重质量，追求卓越',
        '守时守信，尊重承诺'
      ],
      growthAreas: [
        '可能过于追求完美和细节',
        '有时对他人要求过高',
        '需要学会放松，避免工作狂倾向'
      ],
      careerMatches: ['项目经理', '财务/审计', '医生', '律师', '工程师', '管理者'],
      relationships: '高尽责性的你通常是关系中可靠的支柱——约会准时、承诺会做到。但你也需要学会接受伴侣的随性，以及容忍关系中"不完美"的存在。',
      developmentTips: [
        '学会设置优先级，接受"足够好"的结果',
        '给关系留出"无计划"的空间，享受当下',
        '对他人表现出更多的耐心和宽容',
        '培养一些不需要目标和产出的爱好'
      ]
    },
    'E': {
      code: 'E',
      name: '外向性',
      alias: 'Extraversion',
      description: '外向性衡量的是一个人对外部世界的关注程度和从中获得能量的方式。高外向性的人从社交互动中获取能量，喜欢成为焦点；内向的人则从独处中获得能量，偏好深度而非广度的社交。',
      highScoreDescription: '你是一个充满活力、善于社交的人。你喜欢与人互动，在人群中感到自在和充满能量。你乐观开朗、热情主动，容易与陌生人建立联系，喜欢参与各种活动。',
      lowScoreDescription: '你更享受独处或与少数亲密朋友的深度交流。你倾向于内敛和沉思，在做决定前会仔细思考。虽然社交场合可能让你感到疲惫，但你的人际关系往往更有深度。',
      facets: [
        { name: '热情', description: '社交互动的活跃程度和热情程度' },
        { name: '合群性', description: '对群体活动和社交场合的偏好' },
        { name: '主导性', description: '在社交中寻求主导地位的倾向' },
        { name: '活力', description: '日常活动中的精力和活力水平' },
        { name: '积极情绪', description: '体验和表达积极情绪的倾向' },
        { name: '刺激追求', description: '对高刺激环境和活动的偏好' }
      ],
      strengths: [
        '善于社交，容易建立人脉',
        '积极乐观，能够感染他人',
        '沟通能力强，善于表达',
        '领导力强，善于组织活动',
        '充满活力，带动力强'
      ],
      growthAreas: [
        '可能过于依赖外部刺激',
        '有时说话过多而倾听不足',
        '需要学会独处和内省'
      ],
      careerMatches: ['销售/商务', '外交/公共关系', '主持人/演员', '教师/培训师', '管理者'],
      relationships: '外向的你喜欢与伴侣一起探索世界、结交朋友。但你也需要理解内向伴侣对独处空间的需求，并学会享受两人安静的相处时光。',
      developmentTips: [
        '培养深度倾听的能力，不只是等待说话的机会',
        '学会享受独处的时光，进行内省和自我探索',
        '在社交场合中给自己留一些观察的时间',
        '理解内向者对人际的需求，与伴侣坦诚沟通'
      ]
    },
    'A': {
      code: 'A',
      name: '宜人性',
      alias: 'Agreeableness',
      description: '宜人性反映了一个人的合作倾向和对人际和谐的重视程度。高宜人性的人信任他人、乐于助人、富有同理心；低宜人性的人则更倾向于怀疑、竞争、甚至操控。',
      highScoreDescription: '你是一个温暖、体贴、富有同理心的人。你真诚地关心他人，愿意为他人付出，对人际关系中的和谐有很高的需求。你倾向于信任他人，假设最好的意图。',
      lowScoreDescription: '你更倾向于独立思考，不轻易相信他人，对人保持适度的怀疑。你务实、理性，在需要做困难决定或面对人际冲突时能够保持冷静。',
      facets: [
        { name: '信任', description: '对他人的善意和可靠的相信程度' },
        { name: '坦诚', description: '真实直接与委婉圆滑的倾向' },
        { name: '利他主义', description: '主动帮助他人的意愿程度' },
        { name: '合作性', description: '对冲突和竞争的回避程度' },
        { name: '谦逊', description: '对自己的能力和成就的谦逊程度' },
        { name: '同理心', description: '理解和感受他人情绪的能力' },
        { name: '顺从性', description: '在人际互动中顺从他人的倾向' }
      ],
      strengths: [
        '富有同理心，理解他人感受',
        '值得信赖，是可靠的朋友和伙伴',
        '善于协调和化解冲突',
        '乐于助人，不求回报',
        '善于团队合作'
      ],
      growthAreas: [
        '可能过于顺从，难以坚持自己的立场',
        '有时难以说"不"，导致被利用',
        '需要学会在必要时接受人际冲突'
      ],
      careerMatches: ['心理咨询师', '护士/护理', '人力资源', '社会工作者', '教师', '客户服务'],
      relationships: '高宜人性的你在关系中通常是温柔的倾听者和耐心的陪伴者。但你需要在亲密关系中保持独立的自我认知，学会在必要时表达不满和设立边界。',
      developmentTips: [
        '学会在重要议题上表达不同的观点',
        '练习说"不"，不必为每一次请求找借口',
        '接受"不是所有人都喜欢你"这一事实',
        '在帮助他人前先确保自己的需求已满足'
      ]
    },
    'N': {
      code: 'N',
      name: '神经质',
      alias: 'Neuroticism',
      description: '神经质（有时也称为情绪稳定性）衡量的是一个人情绪波动的程度和对负面情绪的敏感程度。低神经质代表更高的情绪稳定性；高神经质则意味着更容易感受到焦虑、抑郁、愤怒等负面情绪。',
      highScoreDescription: '你是一个对情绪敏感、感受深刻的人。你可能更容易体验到焦虑、担忧、悲伤或愤怒等情绪。你的感受性让你能够更深入地体验生活的丰富性。',
      lowScoreDescription: '你情绪稳定，不易被生活中的波折所困扰。你冷静、平和，面对压力时能够保持镇定。这种稳定性让你成为身边人可靠的情感支柱。',
      facets: [
        { name: '焦虑', description: '对潜在威胁和危险的担忧程度' },
        { name: '愤怒/敌意', description: '容易感到沮丧和被冒犯的程度' },
        { name: '抑郁', description: '体验悲伤、绝望和无价值感的倾向' },
        { name: '自我意识', description: '在社交场合的尴尬和自我意识程度' },
        { name: '冲动性', description: '抵抗诱惑和控制冲动欲望的困难' },
        { name: '脆弱性', description: '面对压力时的脆弱和崩溃倾向' }
      ],
      strengths: [
        '感受性丰富，能够深刻体验情感',
        '对他人的情绪敏感，善于察觉需求',
        '危机意识强，做事谨慎',
        '具有高度的艺术创造力和审美力',
        '自我反省能力强'
      ],
      growthAreas: [
        '需要学习情绪调节策略',
        '可能过度担忧和胡思乱想',
        '需要建立更客观的自我认知'
      ],
      careerMatches: ['心理咨询师', '作家/艺术家', '危机处理专家', '护士', '神职人员'],
      relationships: '高神经质的你可能对关系中的波动更敏感，有时候一个小争执可能引发大的情绪反应。学习情绪自我调节，建立安全的依恋关系，会帮助你建立更稳定的亲密关系。',
      developmentTips: [
        '建立规律的运动和冥想习惯，科学研究证明这些能有效降低神经质',
        '学习认知行为疗法中的技巧：识别和挑战不合理的思维',
        '与信任的朋友或专业人士谈论你的担忧',
        '培养"安全基地"感——理解过去不等于现在，也不决定未来'
      ]
    }
  },

  interpretationGuide: {
    scoreRanges: [
      { range: '81-100', label: '非常高', description: '这一特质在你身上非常突出，是你人格的核心特征之一。它深刻影响着你看待世界和做出反应的方式。' },
      { range: '61-80', label: '高', description: '这一特质在你身上比较明显，是你的优势特质之一。你倾向于在大多数情况下表现出这一特质。' },
      { range: '41-60', label: '中等', description: '这一特质在你身上表现适中，既有展现的时候，也有不展现的时候。这是最常见的分布区间。' },
      { range: '21-40', label: '低', description: '这一特质在你身上表现较弱，但不是你的短板。你可能在某些情境下展现这一特质。' },
      { range: '1-20', label: '非常低', description: '这一特质几乎不是你的特征，但这不意味着是缺陷。每个人格维度都有其价值。' }
    ],
    importantNotes: [
      '人格特质是连续的，没有"好"或"坏"之分',
      '每个维度都有其适应性和局限性，关键在于情境匹配',
      '你的得分反映的是倾向而非能力',
      '情境因素会显著影响行为的表达',
      '人格是可以在一生中发展和改变的'
    ]
  },

  selfReflection: {
    questions: [
      '你的最高分和最低分维度如何相互作用？比如，高开放性+低尽责性意味着什么？',
      '你的核心特质如何在工作、亲密关系和友谊中表现出来？',
      '有没有一些情境让你的特质表现与平时不同？',
      '你想发展和改变哪些特质？改变的可能路径是什么？'
    ],
    actionableSteps: [
      '基于你的开放性得分：每周尝试一件新的事物，从小步开始',
      '基于你的尽责性得分：如果得分高，学会给自己一些"无目的"的时间；如果得分低，建立简单的日常仪式',
      '基于你的外向性得分：尊重你获取能量的方式，内向者不需要变成外向者',
      '基于你的宜人性得分：学会在需要时说"不"，保护你的时间和精力',
      '基于你的神经质得分：建立情绪觉察日记，记录触发情绪波动的事件'
    ]
  },

  relatedAssessments: [
    { id: 'mbti', name: 'MBTI职业性格测试', description: '了解你的能量来源、信息接收、处理信息和做决定的方式' },
    { id: 'eq', name: '情商测评', description: '深入了解你的情绪觉察、理解和调节能力' },
    { id: 'attachment', name: '依恋风格测评', description: '了解你在亲密关系中的依恋模式及其形成原因' }
  ]
}

export function getBigFiveDimension(code: string): BigFiveDimension | null {
  return BIG_FIVE_THEORY.dimensions[code.toUpperCase()] || null
}

export default BIG_FIVE_THEORY
