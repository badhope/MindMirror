export interface EIDimension {
  code: string
  name: string
  description: string
  detailedExplanation: string
  examples: {
    high: string
    low: string
  }
  developmentTips: string[]
}

export interface EmotionalIntelligenceTheoryContent {
  introduction: string
  history: {
    origin: string
    golemanModel: string
    mayersalovey: string
  }
  importance: {
    personal: string[]
    professional: string[]
    relationships: string[]
  }
  dimensions: Record<string, EIDimension>
  commonMisconceptions: { misconception: string; truth: string }[]
  assessmentGuide: {
    whatItMeasures: string
    scoreInterpretation: { range: string; description: string }[]
    limitations: string[]
  }
  selfImprovement: {
    foundational: string[]
    dimensionSpecific: { dimension: string; tips: string[] }[]
  }
  relatedAssessments: { id: string; name: string; description: string }[]
}

export const EMOTIONAL_INTELLIGENCE_THEORY: EmotionalIntelligenceTheoryContent = {
  introduction: `情商（Emotional Intelligence, EI 或 EQ）是指一个人感知、理解、管理和有效运用情绪的能力。与单纯的智商（IQ）不同，情商关注的是我们与自己和他人情绪的关系——它决定了我们如何理解自己内心的感受，如何与他人建立连接，以及如何在情绪波动时保持有效的功能。情商不是软技能，而是真正影响人生质量的核心能力。研究表明，在预测人生成功方面，情商往往比智商更重要。`,

  history: {
    origin: `情商概念的最早雏形可以追溯到1920年，Thorndike提出了"社会智力"的概念。1990年，Salovey和Mayer正式提出了"情绪智力"的概念和理论框架。1995年，心理学记者Daniel Goleman出版了《情商：为什么情商比智商更重要》一书，将情商概念普及到大众视野。`,
    golemanModel: `Goleman提出了更广泛的情商模型，包含五大领域：自我觉察、自我调节、内驱力、同理心和社交技能。他的模型强调，情商不是固定的，而是可以通过刻意练习来提升的。`,
    mayersalovey: `Mayer和Salovey的情商模型更加聚焦于四个核心能力：觉察情绪、理解情绪、调节情绪和运用情绪。这个模型更学术化，也更易于测量和评估。`
  },

  importance: {
    personal: [
      '更高的主观幸福感：情商高的人更能体验到积极情绪，更少被负面情绪困扰',
      '更强的心理韧性：面对挫折和压力时能更好地恢复',
      '更清晰的自我认知：了解自己的优势和局限',
      '更好的决策质量：能够在情绪状态下做出更理性的决定',
      '更高的生活满意度：人际关系更和谐，生活更充实'
    ],
    professional: [
      '领导力更强：能够激励和影响他人',
      '团队协作更高效：理解并回应他人的需求',
      '冲突管理更好：在紧张情境中保持冷静并找到解决方案',
      '职业适应性更强：面对变化时能够灵活调整',
      '更有可能获得晋升：研究表明，高管的情商普遍高于平均'
    ],
    relationships: [
      '更深的亲密关系：能够理解和回应伴侣的情绪需求',
      '更广的社交网络：建立和维护有意义的人际关系',
      '更强的亲子连接：成为孩子情感发展的安全基地',
      '更少的关系冲突：能够以建设性方式处理分歧',
      '更高的关系满意度：双方都感到被理解和被珍视'
    ]
  },

  dimensions: {
    'SELF_AWARENESS': {
      code: 'SELF_AWARENESS',
      name: '情绪觉察',
      description: '识别和理解自己情绪的能力，包括意识到情绪产生的原因及其对自己行为的影响。',
      detailedExplanation: '情绪觉察是情商的基础。缺乏情绪觉察的人往往被情绪"劫持"而不自知——他们可能在愤怒中说了伤害人的话，或者在沮丧中放弃了重要的机会，却不知道为什么。情绪觉察让你能够"命名你的情绪"，研究表明，仅仅给情绪命名就能减少其强度。高情绪觉察的人能够准确识别自己的感受，并且理解这些情绪背后的需求和价值观。',
      examples: {
        high: '当感到烦躁时，你能够意识到这可能是因为连续加班导致的身心疲惫，而不是伴侣"做错了什么"。你能够区分情绪和事实。',
        low: '你经常在情绪爆发后才意识到自己生气了，有时候不知道为什么突然心情不好，或者把自己的情绪归咎于外部因素。'
      },
      developmentTips: [
        '开始使用"情绪日记"，每天记录自己的情绪变化和可能的触发因素',
        '练习身体扫描：情绪往往先通过身体表现出来，注意胸闷、肩紧、胃部不适等信号',
        '学习情绪词汇，使用更精确的词汇描述自己的感受（如区分"愤怒"和"失望"）',
        '在情绪平稳时回顾自己的情绪模式，增加元认知能力'
      ]
    },
    'EMPATHY': {
      code: 'EMPATHY',
      name: '同理心',
      description: '感知和理解他人情绪的能力，即"站在他人角度思考"的能力。',
      detailedExplanation: '同理心包含三个层次：认知同理心（理解他人的观点）、情感同理心（感受他人的情绪）和同理心关怀（关心他人的福祉）。研究表明，同理心不仅让我们成为更好的朋友和伴侣，也是道德行为和亲社会行为的基础。同理心不是软弱，而是连接人类的核心能力。',
      examples: {
        high: '你很容易"感同身受"，看到别人难过自己也会动容。你能够准确理解伴侣没有说出口的需求，在朋友需要支持时提供恰当的帮助。',
        low: '你更倾向于关注事情本身而非他人的感受，有时候会惊讶于别人的"过度反应"，难以理解为什么对方会有那样的情绪。'
      },
      developmentTips: [
        '在对话中练习"镜像"：复述对方的感受，确认自己理解正确',
        '主动询问他人的感受和想法，而不只是关注事件本身',
        '阅读小说或观看电影时，刻意关注角色的情绪体验',
        '在争论或分歧时，先暂停，试图理解对方的立场和感受',
        '培养好奇心：对他人的内在世界保持真诚的兴趣'
      ]
    },
    'EMOTION_REGULATION': {
      code: 'EMOTION_REGULATION',
      name: '情绪调节',
      description: '管理和调整自己情绪的能力，包括在适当的时候以适当的方式表达情绪。',
      detailedExplanation: '情绪调节不是压抑情绪或假装没有情绪，而是能够选择何时、如何表达情绪。情绪调节能力强的人能够在激动时保持冷静，在悲伤时允许自己哭泣，在愤怒时控制冲动的行为。他们懂得情绪是信号而不是指令。',
      examples: {
        high: '当收到令人愤怒的消息时，你能够深呼吸，先让自己冷静下来再回复。你能够在需要时调整自己的情绪状态，而不是被情绪控制。',
        low: '你经常在情绪的驱使下做出反应，事后后悔；或者你倾向于压抑情绪，直到忍无可忍时爆发。'
      },
      developmentTips: [
        '学习"暂停"技术：在强烈情绪出现时，给自己一个物理空间或时间窗口',
        '练习腹式呼吸和渐进式肌肉放松，这些技巧能快速降低生理唤醒',
        '认知重评：重新审视让你产生情绪的事件，改变解读方式',
        '情绪ABC理论：理解Activating event（触发事件）、Belief（信念）和Consequence（结果）之间的关系',
        '建立情绪"安全阀"：找到健康的方式释放情绪，如运动、写作、艺术创作'
      ]
    },
    'SELF_MOTIVATION': {
      code: 'SELF_MOTIVATION',
      name: '自我激励',
      description: '利用情绪来驱动自己达成目标的内在能力，包括延迟满足和保持积极心态。',
      detailedExplanation: '自我激励是情商的重要组成部分，因为它涉及如何利用情绪能量而非被情绪消耗。自我激励能力强的人能够设定目标、保持专注、克服挫折，并且在过程中管理好自己的情绪。他们懂得如何让自己保持"状态"。',
      examples: {
        high: '你能保持对长期目标的热情，即使过程中遇到挫折也能快速调整心态。你能够为了更大的满足而放弃眼前的享受。',
        low: '你经常三分钟热度，容易被即时的满足吸引而偏离长期目标。遇到挫折时容易陷入消极情绪，难以自拔。'
      },
      developmentTips: [
        '设定SMART目标：具体（Specific）、可衡量（Measurable）、可达成（Achievable）、相关（Relevant）、有时限（Time-bound）',
        '将大目标分解为可管理的小步骤，每完成一步都给自己正向反馈',
        '创建"激励板"：视觉化你的目标，强化内在动机',
        '学习成长型思维：把挫折视为学习机会而非失败',
        '培养"刻意练习"的心态，关注过程而非只是结果'
      ]
    },
    'RELATIONSHIP_SKILLS': {
      code: 'RELATIONSHIP_SKILLS',
      name: '人际技能',
      description: '建立和管理健康人际关系的能力，包括有效沟通、冲突解决和影响力。',
      detailedExplanation: '人际技能是情商在关系中的应用。它包括清晰地表达自己的需求和感受，倾听和理解他人，有效解决分歧，以及在需要时给予和寻求支持。人际技能不是讨好所有人，而是建立真诚、有深度、互相支持的关系。',
      examples: {
        high: '你善于在关系中创造开放和信任的氛围，即使面对敏感话题也能坦诚沟通。你能够在冲突中保持建设性，找到双方都满意的解决方案。',
        low: '你可能在沟通中过于直接或过于委婉，不擅长处理关系中的张力。有时候会回避冲突，有时候又会在冲突中伤害关系。'
      },
      developmentTips: [
        '学习"非暴力沟通"（NVC）四步法：观察、感受、需求、请求',
        '练习"主动倾听"：全神贯注地听，不打断，先理解再回应',
        '学习冲突脱敏：理解健康的冲突是关系成长的机会',
        '定期进行"关系维护"：主动表达感激，进行深度对话',
        '建立支持性人际网络：投资于高质量的关系'
      ]
    }
  },

  commonMisconceptions: [
    { misconception: '情商高就是会讨好别人', truth: '情商高不是没有原则，而是能够在维护自己需求的同时理解他人。他们会说"不"，也会说"是"。' },
    { misconception: '情商是天生的，无法改变', truth: '虽然人格特质有一定稳定性，但情商确实可以通过学习和练习来提升。研究表明，情商培训是有效的。' },
    { misconception: '情商高意味着没有负面情绪', truth: '情商高的人同样会有愤怒、悲伤、焦虑等情绪，但他们能够觉察、理解并管理这些情绪。' },
    { misconception: '情商和智商是对立的', truth: '情商和智商是独立的维度，可以同时高或低。高情商不是以牺牲智力为代价的。' },
    { misconception: '外向者情商更高', truth: '内向者可能更擅长深度的人际理解和自我反思。情商与外向性是不同的维度。' }
  ],

  assessmentGuide: {
    whatItMeasures: '情商测评通常评估你在情绪觉察、同理心、情绪调节、自我激励和人际技能这五个维度的表现。注意，不同的测评工具可能使用不同的框架和量表。',
    scoreInterpretation: [
      { range: '高于130', description: '你在这个维度上有很强的能力，是你的人格优势。继续发展并寻找能够发挥这些能力的情境。' },
      { range: '110-130', description: '你在这个维度上表现良好，有一定的基础。继续练习和反思可以进一步提升。' },
      { range: '90-110', description: '你的得分处于中等水平，这是最常见的分布。继续学习和发展可以提升这些能力。' },
      { range: '70-90', description: '你在这个维度上有提升空间。识别具体的发展领域并采取针对性行动会有帮助。' },
      { range: '低于70', description: '这可能是一个需要重点发展的领域。考虑寻求专业支持或系统学习相关技能。' }
    ],
    limitations: [
      '自我报告式测评可能受到社会期望偏差的影响，人们倾向于夸大自己的正面特质',
      '测评测量的是倾向和能力，不等于实际行为表现',
      '情境因素会显著影响情绪智力的实际展现',
      '情商测评不应该成为给人贴标签的工具'
    ]
  },

  selfImprovement: {
    foundational: [
      '从自我觉察开始：没有觉察就没有改变',
      '接受自己当下的状态：成长需要耐心',
      '刻意练习：把情商圈进你的日常生活',
      '寻求反馈：询问信任的人对你情绪反应的看法',
      '考虑专业支持：如果某些情绪模式根深蒂固，心理咨询可能有帮助'
    ],
    dimensionSpecific: [
      {
        dimension: '情绪觉察',
        tips: [
          '每天进行3次"情绪检查"：早上、中午、晚上',
          '使用情绪词典，丰富你的情绪词汇',
          '注意情绪和身体感受的连接'
        ]
      },
      {
        dimension: '同理心',
        tips: [
          '在对话中练习复述对方的感受',
          '每周主动与一个不太熟悉的人深入交流',
          '尝试从你不认同的人的角度思考问题'
        ]
      },
      {
        dimension: '情绪调节',
        tips: [
          '学习至少两种快速冷静技术',
          '建立"情绪急救箱"：列出当你情绪激动时可以做的事情',
          '练习"延迟反应"：在回复前等待10秒'
        ]
      },
      {
        dimension: '自我激励',
        tips: [
          '设定内在动机目标：关注成长而非外在奖励',
          '庆祝小胜利，建立正向反馈循环',
          '找到你的"为什么"：理解你做事的深层原因'
        ]
      },
      {
        dimension: '人际技能',
        tips: [
          '每周进行至少一次深度对话',
          '学习给予和接受反馈',
          '在冲突后主动修复关系'
        ]
      }
    ]
  },

  relatedAssessments: [
    { id: 'mbti', name: 'MBTI职业性格测试', description: '了解你的性格倾向如何影响你与他人的互动方式' },
    { id: 'bigfive', name: '大五人格测评', description: '了解你人格特质的整体结构，包括情绪稳定性等维度' },
    { id: 'attachment', name: '依恋风格测评', description: '了解你在亲密关系中的情感模式及其形成原因' }
  ]
}

export function getEIDimension(code: string): EIDimension | null {
  return EMOTIONAL_INTELLIGENCE_THEORY.dimensions[code] || null
}

export default EMOTIONAL_INTELLIGENCE_THEORY
