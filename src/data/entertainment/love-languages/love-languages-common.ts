export type LoveLanguageType = 'words' | 'time' | 'gifts' | 'service' | 'touch'

export interface LoveLanguageQuestionMeta {
  dimension: LoveLanguageType
  reverse: boolean
  weight: number
}

export const loveLanguageProfiles: Record<LoveLanguageType, {
  name: string
  title: string
  description: string
  quote: string
  strength: string
  weakness: string
  tips: string[]
  examples: string[]
}> = {
  words: {
    name: '肯定的言语',
    title: '甜言蜜语型',
    description: '你渴望被真诚的赞美和肯定所打动。一句"你今天真好看"或者"你做得很好"，能让你开心一整天。你重视语言的温度，觉得言语是最直接的爱的表达方式。',
    quote: '"我爱你，因为你懂我。"',
    strength: '善于表达、情感细腻、语言天赋',
    weakness: '过度在意他人的评价',
    tips: [
      '直接告诉伴侣你希望听到什么样的赞美',
      '在特殊日子写一封手写信给对方',
      '每天说一句欣赏对方的话',
    ],
    examples: [
      '每天出门前互相说一句"你今天真好看"',
      '在朋友圈分享你对伴侣的欣赏',
      '记住对方的小成就并及时夸奖',
    ],
  },
  time: {
    name: '精心时刻',
    title: '陪伴至上型',
    description: '你重视高质量的相处时间，比起礼物你更想要对方全情投入的陪伴。和伴侣一起吃饭、散步、聊天，这些平凡的时刻对你来说就是最珍贵的浪漫。',
    quote: '"和你在一起的每一秒，都是礼物。"',
    strength: '重视关系、专注当下、善于倾听',
    weakness: '可能忽略个人空间的需求',
    tips: [
      '设定每周一次的"约会夜"，放下手机',
      '一起尝试新的活动创造共同回忆',
      '认真倾听对方说话，眼神交流很重要',
    ],
    examples: [
      '周末一起去探索城市里的新餐厅',
      '睡前关灯后聊天30分钟',
      '一起做饭，享受合作的过程',
    ],
  },
  gifts: {
    name: '收到礼物',
    title: '仪式感满满型',
    description: '你相信礼物是爱的具象化表达。一份精心挑选的礼物，不仅是一件物品，更代表着"我惦记着你"。你不一定要求贵重的礼物，但一定在意对方的心意。',
    quote: '"礼物不重要，重要的是你在想我。"',
    strength: '懂得感恩、重视仪式感、心思细腻',
    weakness: '可能过度在意礼物的价值',
    tips: [
      '告诉伴侣你喜欢什么类型的礼物',
      '自己也可以主动送出礼物创造惊喜',
      '收到礼物时表达感谢，让对方知道你的开心',
    ],
    examples: [
      '纪念日亲手制作一份礼物',
      '路过对方喜欢的店买个小东西带回家',
      '收集旅行地的纪念品送给对方',
    ],
  },
  service: {
    name: '服务行为',
    title: '行动证明型',
    description: '你觉得爱是做出来的，不是说出来的。帮对方拿快递、做一顿饭、生病时照顾TA，这些实际行动比任何甜言蜜语都更能让你感受到被爱。',
    quote: '"爱在细节里。"',
    strength: '务实、体贴、行动力强',
    weakness: '可能不擅长表达口头情感',
    tips: [
      '主动询问伴侣有什么需要帮忙的',
      '记住对方不喜欢做的事情，主动代劳',
      '偶尔给对方准备一个小惊喜的服务',
    ],
    examples: [
      '早起给对方做一顿爱心早餐',
      '对方加班时送去热腾腾的夜宵',
      '主动承担家务，让对方休息一下',
    ],
  },
  touch: {
    name: '身体接触',
    title: '肢体表达型',
    description: '你是一个需要通过身体接触来感受爱的人。一个拥抱、牵手、过马路时护住对方，这些小动作都能让你感到满满的安全感和被爱。',
    quote: '"想牵着你的手，一直走下去。"',
    strength: '亲密、温暖、直率',
    weakness: '在不熟悉的环境中可能感到不适',
    tips: [
      '主动牵伴侣的手，不要等对方先',
      '每天出门前和回家后给一个拥抱',
      '看电影时自然地依偎在一起',
    ],
    examples: [
      '走在路上自然地十指紧扣',
      '对方难过时给一个安慰的拥抱',
      '一起窝在沙发上看电影',
    ],
  },
}
