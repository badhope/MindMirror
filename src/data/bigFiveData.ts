import { Assessment, Question } from '../types';

/**
 * 大五人格理论（Five Factor Model / OCEAN）
 * 
 * O - Openness to Experience （开放性/求新性）
 * C - Conscientiousness       （尽责性/责任感）
 * E - Extraversion            （外向性/乐群性）
 * A - Agreeableness           （宜人性/随和性）
 * N - Neuroticism             （神经质/情绪稳定性）
 */

export const BIG_FIVE_TRAITS = {
  O: { 
    name: '开放性', 
    fullName: 'Openness to Experience',
    description: '富于想象、寻求变化、审美敏感',
    facets: ['想象力', '审美敏感', '情感丰富', '冒险性', '智能', '价值观'],
    detailedDescription: '开放性反映了一个人对新经验、新想法、新价值观的接受程度，以及想象力的丰富程度和智力好奇心。'
  },
  C: { 
    name: '尽责性', 
    fullName: 'Conscientiousness',
    description: '有条理、可靠、自律',
    facets: ['胜任感', '条理性', '责任感', '追求成就', '自律', '深思熟虑'],
    detailedDescription: '尽责性衡量一个人的组织能力、责任感、自律能力和目标导向性。高尽责性的人通常可靠、有条理、有自制力。'
  },
  E: { 
    name: '外向性', 
    fullName: 'Extraversion',
    description: '好社交、活跃、乐观',
    facets: ['热情', '乐群性', '独断性', '活跃性', '刺激寻求', '积极情绪'],
    detailedDescription: '外向性描述个体与外界互动的程度，包括社交性、活力水平、支配性和积极情感体验。'
  },
  A: { 
    name: '宜人性', 
    fullName: 'Agreeableness',
    description: '热心、信任、利他',
    facets: ['信任', '坦率', '利他', '依从', '谦虚', '同理心'],
    detailedDescription: '宜人性衡量个体的合作性、同情心、信任度和对他人的关注度。高宜人性的人通常友善、合作、有同情心。'
  },
  N: { 
    name: '情绪稳定性', 
    fullName: 'Emotional Stability (Reverse of Neuroticism)',
    description: '平静、安全、适应力强',
    facets: ['焦虑', '愤怒敌意', '抑郁', '自我意识', '冲动性', '脆弱性'],
    detailedDescription: '情绪稳定性（反向为神经质）测量情绪稳定性和对压力的反应。高情绪稳定性意味着情绪稳定、冷静、不容易焦虑或情绪化。'
  }
};

/**
 * 标准60题大五人格测验
 * 每个特质12题（6正向，6反向）
 */
export const BIG_FIVE_QUESTIONS: Question[] = [
  // 开放性 (O) - 12题
  { id: 'O1', text: '我喜欢尝试新的和不同的事物。', trait: 'O', reverse: false },
  { id: 'O2', text: '我经常思考事物的本质和意义。', trait: 'O', reverse: false },
  { id: 'O3', text: '我对艺术和美学很敏感。', trait: 'O', reverse: false },
  { id: 'O4', text: '我喜欢挑战传统观念。', trait: 'O', reverse: false },
  { id: 'O5', text: '我对各种文化和生活方式都很感兴趣。', trait: 'O', reverse: false },
  { id: 'O6', text: '我喜欢想象和幻想。', trait: 'O', reverse: false },
  { id: 'O7', text: '我认为大多数事情都有固定的对错标准。', trait: 'O', reverse: true },
  { id: 'O8', text: '我对抽象的概念或想法不太感兴趣。', trait: 'O', reverse: true },
  { id: 'O9', text: '我更愿意做熟悉的事情，而不是尝试新的。', trait: 'O', reverse: true },
  { id: 'O10', text: '我很少注意到自己的情感变化。', trait: 'O', reverse: true },
  { id: 'O11', text: '艺术和诗歌对我来说没什么意义。', trait: 'O', reverse: true },
  { id: 'O12', text: '我经常质疑权威和传统。', trait: 'O', reverse: false },

  // 尽责性 (C) - 12题
  { id: 'C1', text: '我总是努力完成我开始的事情。', trait: 'C', reverse: false },
  { id: 'C2', text: '我喜欢有条理和有组织的。', trait: 'C', reverse: false },
  { id: 'C3', text: '我是一个可靠的人，别人可以依靠我。', trait: 'C', reverse: false },
  { id: 'C4', text: '我为自己的工作设定高标准。', trait: 'C', reverse: false },
  { id: 'C5', text: '我总是提前计划，然后再行动。', trait: 'C', reverse: false },
  { id: 'C6', text: '我很自律。', trait: 'C', reverse: false },
  { id: 'C7', text: '我经常把事情拖到最后一分钟。', trait: 'C', reverse: true },
  { id: 'C8', text: '我的东西经常是乱七八糟的。', trait: 'C', reverse: true },
  { id: 'C9', text: '我有时不够可靠。', trait: 'C', reverse: true },
  { id: 'C10', text: '我容易分心。', trait: 'C', reverse: true },
  { id: 'C11', text: '我做事经常半途而废。', trait: 'C', reverse: true },
  { id: 'C12', text: '我总是三思而后行。', trait: 'C', reverse: false },

  // 外向性 (E) - 12题
  { id: 'E1', text: '我是一个精力充沛的人。', trait: 'E', reverse: false },
  { id: 'E2', text: '我喜欢和别人在一起。', trait: 'E', reverse: false },
  { id: 'E3', text: '我在社交场合感到自信和舒适。', trait: 'E', reverse: false },
  { id: 'E4', text: '我喜欢成为关注的焦点。', trait: 'E', reverse: false },
  { id: 'E5', text: '我对生活充满热情。', trait: 'E', reverse: false },
  { id: 'E6', text: '我喜欢说话和交流。', trait: 'E', reverse: false },
  { id: 'E7', text: '我更喜欢独处而不是和别人在一起。', trait: 'E', reverse: true },
  { id: 'E8', text: '我是一个比较安静的人。', trait: 'E', reverse: true },
  { id: 'E9', text: '我经常感到精力不足。', trait: 'E', reverse: true },
  { id: 'E10', text: '我不喜欢太多的刺激和兴奋。', trait: 'E', reverse: true },
  { id: 'E11', text: '在社交场合我经常感到紧张。', trait: 'E', reverse: true },
  { id: 'E12', text: '我很容易和陌生人交谈。', trait: 'E', reverse: false },

  // 宜人性 (A) - 12题
  { id: 'A1', text: '我信任他人，并愿意给他人机会。', trait: 'A', reverse: false },
  { id: 'A2', text: '我尽量对遇到的每个人都礼貌。', trait: 'A', reverse: false },
  { id: 'A3', text: '我喜欢帮助别人。', trait: 'A', reverse: false },
  { id: 'A4', text: '我对他人的感受很敏感。', trait: 'A', reverse: false },
  { id: 'A5', text: '我尽量避免与人发生冲突。', trait: 'A', reverse: false },
  { id: 'A6', text: '我对人很随和。', trait: 'A', reverse: false },
  { id: 'A7', text: '我有时对人不太友好或不客气。', trait: 'A', reverse: true },
  { id: 'A8', text: '我倾向于质疑别人的动机。', trait: 'A', reverse: true },
  { id: 'A9', text: '我有时会和别人争论或抬杠。', trait: 'A', reverse: true },
  { id: 'A10', text: '我认为大多数人主要是为自己着想。', trait: 'A', reverse: true },
  { id: 'A11', text: '我不是特别有同情心。', trait: 'A', reverse: true },
  { id: 'A12', text: '我喜欢和人合作。', trait: 'A', reverse: false },

  // 情绪稳定性 (N反向) - 12题
  { id: 'N1', text: '我经常感到焦虑或担心。', trait: 'N', reverse: true },
  { id: 'N2', text: '我很容易生气。', trait: 'N', reverse: true },
  { id: 'N3', text: '我经常感到悲伤或沮丧。', trait: 'N', reverse: true },
  { id: 'N4', text: '我在社交场合感到紧张或不自在。', trait: 'N', reverse: true },
  { id: 'N5', text: '我有时会冲动行事。', trait: 'N', reverse: true },
  { id: 'N6', text: '我在压力下容易崩溃。', trait: 'N', reverse: true },
  { id: 'N7', text: '我大多数时候感到平静和放松。', trait: 'N', reverse: false },
  { id: 'N8', text: '我很少担心事情。', trait: 'N', reverse: false },
  { id: 'N9', text: '我能很好地应对压力。', trait: 'N', reverse: false },
  { id: 'N10', text: '我的情绪一般都很稳定。', trait: 'N', reverse: false },
  { id: 'N11', text: '我不容易烦躁。', trait: 'N', reverse: false },
  { id: 'N12', text: '我经常感到情绪低落。', trait: 'N', reverse: true }
];

/**
 * 答题选项
 * 李克特5点量表
 */
export const RESPONSE_OPTIONS = [
  { value: 1, label: '非常不同意' },
  { value: 2, label: '不同意' },
  { value: 3, label: '中立' },
  { value: 4, label: '同意' },
  { value: 5, label: '非常同意' }
];

/**
 * 大五人格测评配置
 */
export const BIG_FIVE_ASSESSMENT: Assessment = {
  id: 'big-five',
  title: '完整大五人格测评',
  description: '基于大五人格理论的60题专业性格测评，全面了解你的性格特质。',
  category: '性格',
  totalQuestions: 60,
  icon: '🧠',
  difficulty: '中等',
  estimatedTime: '15分钟'
};

/**
 * 详细的特质解释（高分和低分）
 */
export const TRAIT_INTERPRETATIONS = {
  O: {
    high: {
      title: '高度开放性',
      description: '你富有想象力和创造力，对新想法和经历持开放态度。你喜欢挑战传统，追求多样性。',
      detailed: {
        strengths: ['富有创造力', '思维开阔', '审美敏感', '好奇心强', '接受新事物'],
        potentialChallenges: ['可能过于理想主义', '对实际细节关注不足', '有时难以做出决定', '容易感到无聊'],
        workStyle: '适合创新型、需要创造性思维的工作环境，喜欢多样化和挑战性的任务。',
        relationships: '在关系中寻求智力和情感的深度交流，喜欢有共同兴趣和开放态度的伴侣。',
        growthAreas: ['平衡创意与务实', '培养耐心关注细节', '建立决策策略'],
        careerSuggestions: ['艺术家', '设计师', '科学家', '作家', '咨询师', '创意总监'],
        famousPeople: ['阿尔伯特·爱因斯坦', '达芬奇', '乔布斯'],
        quote: '想象力比知识更重要，因为知识是有限的，而想象力概括着世界的一切。'
      },
      suggestions: ['适合创意领域工作', '多接触不同文化和艺术', '探索新的兴趣爱好', '参与文化活动', '尝试新的生活方式']
    },
    low: {
      title: '偏传统务实',
      description: '你更偏好熟悉的事物，做事较为传统和务实。你看重稳定性和实用性。',
      detailed: {
        strengths: ['务实可靠', '脚踏实地', '传统价值观', '专注实用', '稳定性强'],
        potentialChallenges: ['可能抗拒改变', '想象力相对受限', '有时过于保守', '对新想法持怀疑态度'],
        workStyle: '在稳定、结构化的环境中表现最佳，喜欢清晰的规则和明确的期望。',
        relationships: '喜欢传统和稳定的关系模式，重视忠诚和可靠。',
        growthAreas: ['逐步接受新体验', '培养好奇心', '尝试新事物（从小开始）'],
        careerSuggestions: ['会计师', '律师', '工程师', '医生', '项目经理', '金融分析师'],
        famousPeople: ['沃伦·巴菲特', '安吉拉·默克尔'],
        quote: '把小事做好就是伟大的开始。'
      },
      suggestions: ['在熟悉领域深耕', '逐步接受新变化', '重视传统价值观', '尝试小幅创新', '保持稳定节奏']
    }
  },
  C: {
    high: {
      title: '高度尽责性',
      description: '你非常有条理、可靠、自律。你做事有计划，追求卓越，值得他人信赖。',
      detailed: {
        strengths: ['高度可靠', '组织能力强', '自律专注', '追求卓越', '责任感强'],
        potentialChallenges: ['可能过于完美主义', '工作狂倾向', '难以放松', '对自己和他人要求过高'],
        workStyle: '是团队中最可靠的成员，喜欢有目标和计划的工作，做事有始有终。',
        relationships: '在关系中可靠负责，重视承诺，但需要注意不要过度控制。',
        growthAreas: ['学会接受不完美', '平衡工作与生活', '授权他人'],
        careerSuggestions: ['管理顾问', '项目经理', '医生', '工程师', '会计师', '企业高管'],
        famousPeople: ['埃隆·马斯克', '比尔·盖茨'],
        quote: '成功是99%的汗水加1%的灵感。'
      },
      suggestions: ['适合管理和执行岗位', '设定明确目标', '注意不要过度完美主义', '学会授权', '平衡工作和生活']
    },
    low: {
      title: '更随性灵活',
      description: '你比较随性，喜欢顺其自然。你适应性强，不过分追求完美。',
      detailed: {
        strengths: ['灵活应变', '适应性强', '不钻牛角尖', '享受当下', '不太焦虑'],
        potentialChallenges: ['可能缺乏自律', '容易拖延', '不够有条理', '目标不够明确'],
        workStyle: '在宽松、灵活的环境中表现最好，不喜欢太多限制和结构。',
        relationships: '给对方很大空间，但需要注意承诺的兑现。',
        growthAreas: ['建立简单的日常习惯', '设定小目标', '培养时间管理'],
        careerSuggestions: ['创意工作者', '自由职业者', '艺术家', '咨询师', '灵活的项目制工作'],
        famousPeople: ['约翰尼·德普', '鲍勃·迪伦'],
        quote: '生活就像骑自行车，想保持平衡就得往前走。'
      },
      suggestions: ['尝试建立简单的日常习惯', '设定小目标逐步完成', '善用灵活优势', '培养基本的条理性', '找到适合自己的节奏']
    }
  },
  E: {
    high: {
      title: '高度外向性',
      description: '你精力充沛，喜爱社交，乐观向上。你在人群中感到自在，喜欢成为焦点。',
      detailed: {
        strengths: ['社交能力强', '充满活力', '积极乐观', '表达能力强', '喜欢挑战'],
        potentialChallenges: ['可能过度寻求刺激', '独处困难', '有时说话太快', '过度投入社交'],
        workStyle: '在团队和互动多的环境中表现出色，喜欢领导和展示自己。',
        relationships: '在关系中主动热情，喜欢频繁互动和共同活动。',
        growthAreas: ['学会享受独处', '培养倾听能力', '平衡内外刺激'],
        careerSuggestions: ['销售', '公关', '演艺', '企业高管', '教师', '政治家'],
        famousPeople: ['奥普拉·温弗瑞', '理查德·布兰森', '唐纳德·特朗普'],
        quote: '你的影响力越大，你的责任就越大。'
      },
      suggestions: ['多参与社交活动', '适合需要与人打交道的工作', '培养领导力', '学习倾听', '适当保留独处时间']
    },
    low: {
      title: '偏内向',
      description: '你比较安静内敛，享受独处时间。你深思熟虑，做事专注。',
      detailed: {
        strengths: ['深度思考', '专注认真', '善于内省', '独立工作能力强', '深刻观察'],
        potentialChallenges: ['社交场合可能感到焦虑', '被误解为冷漠', '过度自我反思', '有时过于谨慎'],
        workStyle: '在安静、专注的环境中表现最佳，擅长需要深度思考的工作。',
        relationships: '在关系中重视深度胜过广度，有一小群非常亲密的朋友。',
        growthAreas: ['逐步扩大舒适圈', '社交技能练习', '表达内心想法'],
        careerSuggestions: ['程序员', '研究员', '作家', '设计师', '图书管理员', '数据分析'],
        famousPeople: ['爱因斯坦', '比尔·盖茨', 'J.K.罗琳'],
        quote: '我不是一个人，我只是喜欢一个人待着。'
      },
      suggestions: ['寻找需要深度思考的工作', '珍惜独处时光', '发展深度关系', '小步扩展社交圈', '保护自己的能量']
    }
  },
  A: {
    high: {
      title: '高度宜人性',
      description: '你友善、合作、有同理心。你信任他人，乐于助人，容易相处。',
      detailed: {
        strengths: ['富有同理心', '合作性强', '乐于助人', '信任他人', '和谐导向'],
        potentialChallenges: ['可能过度取悦他人', '难以拒绝', '容易被利用', '回避冲突'],
        workStyle: '团队合作的优秀伙伴，善于调解矛盾，创造和谐氛围。',
        relationships: '体贴温暖的伴侣/朋友，总是为他人着想。',
        growthAreas: ['学会设定边界', '培养健康的冲突处理', '平衡自我与他人'],
        careerSuggestions: ['心理咨询师', '教师', '护士', '人力资源', '社会工作者', '调解员'],
        famousPeople: ['达赖喇嘛', '特蕾莎修女', '纳尔逊·曼德拉'],
        quote: '友善一点，因为你遇到的每个人都在打一场硬仗。'
      },
      suggestions: ['适合助人型工作', '建立和谐关系', '注意保护自己边界', '学会说不', '平衡自我关怀和帮助他人']
    },
    low: {
      title: '更竞争性',
      description: '你比较有竞争力，倾向于质疑和挑战。你实事求是，直接坦率。',
      detailed: {
        strengths: ['分析能力强', '直接坦率', '有竞争意识', '批判性思维', '实事求是'],
        potentialChallenges: ['可能显得冷漠', '容易引起冲突', '缺乏耐心', '有时过于强硬'],
        workStyle: '在竞争环境中表现出色，善于发现问题和挑战现状。',
        relationships: '直接、实际的关系风格，重视诚实和真实。',
        growthAreas: ['培养同理心', '练习耐心', '学习温和表达'],
        careerSuggestions: ['律师', '金融交易员', '企业家', '工程师', '程序员', '战略顾问'],
        famousPeople: ['史蒂夫·乔布斯', '戈登·拉姆齐', '埃隆·马斯克'],
        quote: '如果你不能承受压力，就不要进厨房。'
      },
      suggestions: ['培养耐心和同理心', '练习倾听技巧', '在竞争中寻求合作', '学习温和沟通', '关注他人感受']
    }
  },
  N: {
    high: {
      title: '高情绪稳定性',
      description: '你情绪稳定，冷静自信，能很好地应对压力。你不容易焦虑或沮丧。',
      detailed: {
        strengths: ['情绪稳定', '抗压力强', '冷静从容', '适应力强', '不容易焦虑'],
        potentialChallenges: ['可能低估情感重要性', '对他人情绪不敏感', '过于理性化', '有时缺乏共情'],
        workStyle: '在压力环境中表现出色，是团队的稳定器。',
        relationships: '稳定可靠的伴侣，在危机时刻保持冷静。',
        growthAreas: ['培养情感表达', '学习感受更深', '增强情感共鸣'],
        careerSuggestions: ['外科医生', '飞行员', '危机管理', '企业高管', '军人', '警察'],
        famousPeople: ['尼尔逊·曼德拉', '英女王伊丽莎白二世', '德怀特·艾森豪威尔'],
        quote: '保持冷静，继续前进。'
      },
      suggestions: ['承担高压力职责', '成为他人的稳定支持者', '保持健康的压力管理', '培养情感表达能力', '关注自己和他人的情绪需求']
    },
    low: {
      title: '情感更丰富',
      description: '你情感比较丰富，对事物有强烈感受。你可能更容易感到焦虑或压力。',
      detailed: {
        strengths: ['情感丰富细腻', '深刻的感受力', '强共情能力', '艺术感知', '内省深刻'],
        potentialChallenges: ['容易焦虑', '情绪波动大', '压力应对困难', '易受负面影响'],
        workStyle: '在支持性强、压力适中的环境中表现最好。',
        relationships: '情感深刻，有强烈的情感连接，但需要安全感。',
        growthAreas: ['学习情绪管理', '建立支持网络', '培养应对策略'],
        careerSuggestions: ['艺术家', '作家', '音乐家', '治疗师', '咨询师', '创意工作者'],
        famousPeople: ['弗吉尼亚·伍尔夫', '科特·柯本', '西尔维娅·普拉斯'],
        quote: '不要因为结束而哭泣，要因为发生过而微笑。'
      },
      suggestions: ['学习情绪管理技巧', '寻求支持网络', '练习冥想和放松', '建立健康的应对机制', '找到情感表达的渠道']
    }
  }
};

/**
 * 人格类型组合分析（基于最高的3个特质）
 */
export const PERSONALITY_COMBINATIONS: Record<string, { 
  typeName: string, 
  description: string,
  strengths: string[],
  blindSpots: string[],
  workEnvironment: string,
  loveLanguage: string[],
  friendshipStyle: string
}> = {
  'O_C_E': {
    typeName: '领导力创新者',
    description: '你既有创新思维，又有组织能力和社交魅力，是天生的领导者和创新者。',
    strengths: ['愿景与执行力兼备', '能把创意变成现实', '激励他人的能力', '既有大局观又关注细节'],
    blindSpots: ['可能同时启动太多项目', '有时过度乐观', '可能忽视他人感受'],
    workEnvironment: '创业公司、创新部门、领导岗位',
    loveLanguage: ['共同成长', '智力对话', '一起做有意义的事'],
    friendshipStyle: '喜欢有趣、有追求的朋友，一起探索和成长'
  },
  'O_C_A': {
    typeName: '温暖创造者',
    description: '你有创造力、有责任心、又友善，是团队中稳定又有创意的贡献者。',
    strengths: ['既能创新又能落地', '温和而坚定', '可靠的伙伴', '兼顾创意和他人感受'],
    blindSpots: ['可能过度妥协创意', '有时过于谨慎', '可能为和谐牺牲效率'],
    workEnvironment: '创意工作室、教育、非营利组织',
    loveLanguage: ['稳定的陪伴', '深度对话', '一起创造美好事物'],
    friendshipStyle: '忠诚、体贴，是可以长期深交的朋友'
  },
  'C_E_A': {
    typeName: '温暖实干家',
    description: '你既有组织能力，又善于社交，还友善合作，是完美的团队骨干。',
    strengths: ['优秀的组织能力', '善于人际协调', '可靠的执行者', '团队的黏合剂'],
    blindSpots: ['可能过于照顾他人而忽视自己', '有时不敢打破常规', '可能过度维持和谐'],
    workEnvironment: '管理咨询、人力资源、项目管理',
    loveLanguage: ['一起参与活动', '稳定的承诺', '日常的体贴'],
    friendshipStyle: '靠谱、热心，朋友们都喜欢找你'
  },
  'E_A_N': {
    typeName: '社交稳定器',
    description: '你外向、友善又情绪稳定，是朋友圈中的定海神针。',
    strengths: ['社交达人', '温暖可靠', '情绪稳定', '给人安全感'],
    blindSpots: ['可能过于关注外界认可', '有时逃避独处', '可能过度照顾他人'],
    workEnvironment: '公关、销售、培训师、团队协调',
    loveLanguage: ['共同社交', '频繁联系', '一起参加活动'],
    friendshipStyle: '聚会组织者，大家都喜欢和你在一起'
  },
  'O_E_N': {
    typeName: '魅力创新者',
    description: '你开放、外向又情绪稳定，是充满魅力的创新人物。',
    strengths: ['创意无限', '魅力四射', '抗压强', '有冒险精神'],
    blindSpots: ['可能过度追求刺激', '有时不够踏实', '可能忽视细节'],
    workEnvironment: '创业、演艺、创意总监、探险相关',
    loveLanguage: ['新奇体验', '冒险约会', '保持新鲜感'],
    friendshipStyle: '有趣、刺激，带你体验人生各种可能性'
  },
  'C_A_N': {
    typeName: '可靠支持者',
    description: '你尽责、友善又稳定，是最值得信赖的伙伴。',
    strengths: ['极度可靠', '温暖体贴', '情绪稳定', '有责任心'],
    blindSpots: ['可能过于保守', '有时不敢冒险', '可能过度照顾他人'],
    workEnvironment: '医疗、教育、社会工作、行政支持',
    loveLanguage: ['稳定承诺', '日常照顾', '长期陪伴'],
    friendshipStyle: '最靠谱的朋友，永远在那里'
  }
};

/**
 * 职业推荐数据库
 */
export const CAREER_RECOMMENDATIONS = {
  O: ['创意总监', '艺术家', '设计师', '科学家', '作家', '顾问', '研究员', '编辑', '产品经理', '策略规划'],
  C: ['项目经理', '管理顾问', '会计师', '律师', '工程师', '医生', '企业高管', '金融分析师', '质量控制', '运营管理'],
  E: ['销售经理', '公关专家', '演艺人员', '企业高管', '教师', '政治家', '培训师', '营销专员', '人力资源', '活动策划'],
  A: ['心理咨询师', '教师', '护士', '人力资源', '社会工作者', '调解员', '辅导员', '志愿者协调', '客户服务', '健康顾问'],
  N_high: ['外科医生', '飞行员', '危机管理', '军人', '警察', '消防员', '交易员', '高管', '投资银行家', '战略顾问'],
  N_low: ['艺术家', '作家', '音乐家', '治疗师', '咨询师', '创意工作者', '心理学家', '社工', '冥想导师', '自然疗愈']
};
