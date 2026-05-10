import type { Question } from '../../../types'
import type { LoveLanguageQuestionMeta } from './love-languages-common'

const opts = [
  { id: '1', text: '❌ 完全不符合我', value: 1 },
  { id: '2', text: '⚪️ 不太符合我', value: 2 },
  { id: '3', text: '🔵 一般符合我', value: 3 },
  { id: '4', text: '🟢 比较符合我', value: 4 },
  { id: '5', text: '✅ 完全就是我', value: 5 },
]

export const loveLanguagesQuestions: Question[] = [
  { id: 'll01', text: '听到伴侣说"我爱你"或"你真棒"时，我会感到特别幸福', type: 'scale', options: opts, meta: { dimension: 'words', reverse: false, weight: 1.0 } },
  { id: 'll02', text: '我希望伴侣能经常夸赞我的外表或能力', type: 'scale', options: opts, meta: { dimension: 'words', reverse: false, weight: 1.1 } },
  { id: 'll03', text: '我觉得一句暖心的话比任何礼物都珍贵', type: 'scale', options: opts, meta: { dimension: 'words', reverse: false, weight: 1.0 } },

  { id: 'll04', text: '比起收到贵重的礼物，我更想要伴侣陪我逛街一整天', type: 'scale', options: opts, meta: { dimension: 'time', reverse: false, weight: 1.0 } },
  { id: 'll05', text: '约会时我会把手机收起来，专心享受和伴侣在一起的时光', type: 'scale', options: opts, meta: { dimension: 'time', reverse: false, weight: 1.1 } },
  { id: 'll06', text: '即使在家无聊地一起看电影，也比一个人出去玩更开心', type: 'scale', options: opts, meta: { dimension: 'time', reverse: false, weight: 1.0 } },

  { id: 'll07', text: '伴侣送的礼物即使不贵重，我也会珍藏很久', type: 'scale', options: opts, meta: { dimension: 'gifts', reverse: false, weight: 1.0 } },
  { id: 'll08', text: '我很期待生日、纪念日等特殊节日收到礼物', type: 'scale', options: opts, meta: { dimension: 'gifts', reverse: false, weight: 1.1 } },
  { id: 'll09', text: '看到喜欢的东西，我会想和伴侣一起分享或买给对方', type: 'scale', options: opts, meta: { dimension: 'gifts', reverse: false, weight: 1.0 } },

  { id: 'll10', text: '伴侣帮我做家务时，我会感到被爱', type: 'scale', options: opts, meta: { dimension: 'service', reverse: false, weight: 1.0 } },
  { id: 'll11', text: '生病时伴侣照顾我，比任何甜言蜜语都让我感动', type: 'scale', options: opts, meta: { dimension: 'service', reverse: false, weight: 1.1 } },
  { id: 'll12', text: '行动比言语更重要，做出来的爱才是真爱', type: 'scale', options: opts, meta: { dimension: 'service', reverse: false, weight: 1.0 } },

  { id: 'll13', text: '牵手、拥抱等身体接触能让我感到安心', type: 'scale', options: opts, meta: { dimension: 'touch', reverse: false, weight: 1.0 } },
  { id: 'll14', text: '走在街上我希望能和伴侣十指紧扣', type: 'scale', options: opts, meta: { dimension: 'touch', reverse: false, weight: 1.1 } },
  { id: 'll15', text: '吵架后一个拥抱胜过千言万语的解释', type: 'scale', options: opts, meta: { dimension: 'touch', reverse: false, weight: 1.0 } },
]
