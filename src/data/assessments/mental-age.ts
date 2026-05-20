import type { Assessment } from '../../types'
import { calculateMentalAge } from '../../utils/calculators/mental-age-calculator'

export const mentalAgeAssessment: Assessment = {
  id: 'mental-age',
  title: '精神年龄诊断',
  description: '趣味测评，了解你的思维方式和心智成熟度',
  category: '自我认知',
  subcategory: '心智成熟度',
  difficulty: 'standard',
  duration: 5,
  quality: '娱乐',
  questionCount: 18,
  resultCalculator: calculateMentalAge,
  questions: [
    // 认知开放度 - 1
    { id: 'age-1', type: 'single', text: '朋友约你晚上 8 点出去聚餐，你的第一反应是？', dimension: 'cognition', options: [
      { id: '1', value: 1, text: '太好了！通宵都没问题！' },
      { id: '2', value: 2, text: '可以，但 11 点前必须回家' },
      { id: '3', value: 3, text: '能不能改到中午？晚上想早点睡' },
      { id: '4', value: 4, text: '算了吧，在家躺着最舒服' },
      { id: '5', value: 5, text: '别约了，有事微信说吧' },
    ]},
    // 认知开放度 - 2
    { id: 'age-2', type: 'single', text: '对新鲜事物的态度是？', dimension: 'cognition', options: [
      { id: '1', value: 1, text: '非常好奇，第一个尝试' },
      { id: '2', value: 2, text: '感兴趣会尝试' },
      { id: '3', value: 3, text: '看看别人用得怎么样再说' },
      { id: '4', value: 4, text: '不太愿意改变' },
      { id: '5', value: 5, text: '现在这样就很好了' },
    ]},
    // 认知开放度 - 3
    { id: 'age-3', type: 'single', text: '遇到和自己不同的观点，你会？', dimension: 'cognition', options: [
      { id: '1', value: 1, text: '非常好奇，想深入了解' },
      { id: '2', value: 2, text: '听听看，但不一定认同' },
      { id: '3', value: 3, text: '争论一下，看谁对' },
      { id: '4', value: 4, text: '跳过不听' },
      { id: '5', value: 5, text: '直接否定' },
    ]},
    // 情绪稳定性 - 4
    { id: 'age-4', type: 'single', text: '遇到不顺心的事，你会？', dimension: 'emotional', options: [
      { id: '1', value: 1, text: '很快就调整过来，继续前进' },
      { id: '2', value: 2, text: '有点难过，但能控制' },
      { id: '3', value: 3, text: '需要一点时间消化' },
      { id: '4', value: 4, text: '很难受，影响很久' },
      { id: '5', value: 5, text: '会崩溃，不知道怎么办' },
    ]},
    // 情绪稳定性 - 5
    { id: 'age-5', type: 'single', text: '被人误解时，你会？', dimension: 'emotional', options: [
      { id: '1', value: 1, text: '淡定解释，不着急' },
      { id: '2', value: 2, text: '解释一下，信不信由你' },
      { id: '3', value: 3, text: '有点生气，但能控制' },
      { id: '4', value: 4, text: '很委屈，想马上证明自己' },
      { id: '5', value: 5, text: '非常愤怒，必须讨说法' },
    ]},
    // 情绪稳定性 - 6
    { id: 'age-6', type: 'single', text: '面对压力，你的状态是？', dimension: 'emotional', options: [
      { id: '1', value: 1, text: '越压越强，越战越勇' },
      { id: '2', value: 2, text: '能保持冷静应对' },
      { id: '3', value: 3, text: '有点焦虑，但能完成' },
      { id: '4', value: 4, text: '会失眠，效率下降' },
      { id: '5', value: 5, text: '完全无法处理' },
    ]},
    // 社交成熟度 - 7
    { id: 'age-7', type: 'single', text: '和朋友相处，你通常是？', dimension: 'social', options: [
      { id: '1', value: 1, text: '活跃气氛的那一个' },
      { id: '2', value: 2, text: '积极参与，也会照顾他人' },
      { id: '3', value: 3, text: '认真倾听，偶尔发言' },
      { id: '4', value: 4, text: '默默待着，不太说话' },
      { id: '5', value: 5, text: '更喜欢独处' },
    ]},
    // 社交成熟度 - 8
    { id: 'age-8', type: 'single', text: '遇到冲突时，你会？', dimension: 'social', options: [
      { id: '1', value: 1, text: '主动调解，寻找双赢方案' },
      { id: '2', value: 2, text: '理性沟通，解决问题' },
      { id: '3', value: 3, text: '避开正面冲突' },
      { id: '4', value: 4, text: '据理力争' },
      { id: '5', value: 5, text: '直接冷战或绝交' },
    ]},
    // 社交成熟度 - 9
    { id: 'age-9', type: 'single', text: '对社交场合的态度是？', dimension: 'social', options: [
      { id: '1', value: 1, text: '非常享受，认识新朋友很开心' },
      { id: '2', value: 2, text: '可以接受，但不勉强自己' },
      { id: '3', value: 3, text: '偶尔参加，看心情' },
      { id: '4', value: 4, text: '能不去就不去' },
      { id: '5', value: 5, text: '完全不喜欢社交' },
    ]},
    // 责任感 - 10
    { id: 'age-10', type: 'single', text: '答应别人的事情，你会？', dimension: 'responsibility', options: [
      { id: '1', value: 1, text: '一定做到，做不到会提前说' },
      { id: '2', value: 2, text: '尽力去做' },
      { id: '3', value: 3, text: '看情况，忘了就算了' },
      { id: '4', value: 4, text: '有时候会忘记' },
      { id: '5', value: 5, text: '答应得快，做得慢' },
    ]},
    // 责任感 - 11
    { id: 'age-11', type: 'single', text: '犯了错，你的反应是？', dimension: 'responsibility', options: [
      { id: '1', value: 1, text: '主动承担，想办法补救' },
      { id: '2', value: 2, text: '承认错误，道歉' },
      { id: '3', value: 3, text: '有点不好意思，但不会说' },
      { id: '4', value: 4, text: '找借口，推给别人' },
      { id: '5', value: 5, text: '假装不知道' },
    ]},
    // 责任感 - 12
    { id: 'age-12', type: 'single', text: '对自己的未来，你会？', dimension: 'responsibility', options: [
      { id: '1', value: 1, text: '有清晰规划，一步步执行' },
      { id: '2', value: 2, text: '有大致方向，会努力' },
      { id: '3', value: 3, text: '走一步看一步' },
      { id: '4', value: 4, text: '不太想那么远' },
      { id: '5', value: 5, text: '顺其自然' },
    ]},
    // 抗挫力 - 13
    { id: 'age-13', type: 'single', text: '失败了，你会？', dimension: 'resilience', options: [
      { id: '1', value: 1, text: '分析原因，再来一次' },
      { id: '2', value: 2, text: '难过一下，然后继续' },
      { id: '3', value: 3, text: '需要点时间恢复' },
      { id: '4', value: 4, text: '很难再尝试' },
      { id: '5', value: 5, text: '再也不试了' },
    ]},
    // 抗挫力 - 14
    { id: 'age-14', type: 'single', text: '面对困难，你的心态是？', dimension: 'resilience', options: [
      { id: '1', value: 1, text: '这是挑战，我可以的' },
      { id: '2', value: 2, text: '虽然难，但试试吧' },
      { id: '3', value: 3, text: '好麻烦，有点不想做' },
      { id: '4', value: 4, text: '想逃避' },
      { id: '5', value: 5, text: '直接放弃' },
    ]},
    // 抗挫力 - 15
    { id: 'age-15', type: 'single', text: '被否定时，你会？', dimension: 'resilience', options: [
      { id: '1', value: 1, text: '认真听取，有道理就改' },
      { id: '2', value: 2, text: '有点在意，但会反思' },
      { id: '3', value: 3, text: '有点不开心' },
      { id: '4', value: 4, text: '很受伤，很难过' },
      { id: '5', value: 5, text: '完全不能接受' },
    ]},
    // 抗挫力 - 16
    { id: 'age-16', type: 'single', text: '对生活的变化，你会？', dimension: 'resilience', options: [
      { id: '1', value: 1, text: '很期待，拥抱变化' },
      { id: '2', value: 2, text: '可以适应' },
      { id: '3', value: 3, text: '需要点时间' },
      { id: '4', value: 4, text: '不太想变' },
      { id: '5', value: 5, text: '非常抗拒' },
    ]},
    // 抗挫力 - 17
    { id: 'age-17', type: 'single', text: '对自己的期望是？', dimension: 'resilience', options: [
      { id: '1', value: 1, text: '不断成长，成为更好的自己' },
      { id: '2', value: 2, text: '比现在好一点就满足' },
      { id: '3', value: 3, text: '保持现状就好' },
      { id: '4', value: 4, text: '不想那么累' },
      { id: '5', value: 5, text: '怎么舒服怎么来' },
    ]},
    // 抗挫力 - 18
    { id: 'age-18', type: 'single', text: '遇到挫折时，你会想到什么？', dimension: 'resilience', options: [
      { id: '1', value: 1, text: '这是成长的机会' },
      { id: '2', value: 2, text: '会好起来的' },
      { id: '3', value: 3, text: '怎么这么倒霉' },
      { id: '4', value: 4, text: '我怎么这么没用' },
      { id: '5', value: 5, text: '生活太艰难了' },
    ]},
  ],
}
