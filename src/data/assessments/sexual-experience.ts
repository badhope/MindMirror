/**
 * ==============================================
 * 🔥 性经验指数测评 - 题目定义文件
 * ==============================================
 * 【测评设计】娱乐向，非专业学术测评
 * - 总题数：40题
 * - 维度：5维度 × 8题/维度
 * - 题型：李克特5点量表
 * 
 * 【五大维度】【⚠️  与计算器严格对应！改了这里要改计算器！】
 * - practical: 实战经验（实际操作经验值）
 * - theoretical: 理论知识（知识库存量）
 * - technique: 技术水平（专业业务能力）
 * - diversity: 涉猎广度（见多识广度）
 * - openness: 观念开放度（接受程度）
 */

import type { Assessment } from '../../types'
import { calculateSexualExperience } from '../../utils/calculators/sexual-experience-calculator'

export const sexualExperienceAssessment: Assessment = {
  id: 'sexual-experience',
  title: '性经验指数测评',
  description: '趣味测评，了解你在情感方面的心态和观念',
  longDescription: '这是一个关于性观念和经验的趣味测评，通过40道题目，从理论知识、实战经验、技术水平、涉猎广度和观念开放度五个维度，全方位了解你的性经验指数。所有数据完全匿名，结果仅供娱乐。',
  category: '娱乐趣味',
  subcategory: '亲密探索',
  difficulty: 'standard',
  duration: 6,
  questionCount: 40,
  quality: '娱乐',
  isFree: true,
  requiresSubscription: false,
  dimensions: ['practical', 'theoretical', 'technique', 'diversity', 'openness'],
  resultCalculator: calculateSexualExperience,
  questions: [
    // practical - 实战经验 (1-8)
    { id: 'sex-1', type: 'likert-5', text: '你有过牵手以外的亲密肢体接触吗？', reverseScored: false, dimension: 'practical', options: [{ id: '1', text: '完全没有', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较多', value: 4 }, { id: '5', text: '非常多', value: 5 }] },
    { id: 'sex-2', type: 'likert-5', text: '你和多少人有过亲密关系？', reverseScored: false, dimension: 'practical', options: [{ id: '1', text: '0人', value: 1 }, { id: '2', text: '1人', value: 2 }, { id: '3', text: '2-3人', value: 3 }, { id: '4', text: '4-6人', value: 4 }, { id: '5', text: '7人以上', value: 5 }] },
    { id: 'sex-3', type: 'likert-5', text: '你的第一次亲密接触发生在什么时候？', reverseScored: false, dimension: 'practical', options: [{ id: '1', text: '还没有', value: 1 }, { id: '2', text: '大学毕业后', value: 2 }, { id: '3', text: '大学期间', value: 3 }, { id: '4', text: '高中时期', value: 4 }, { id: '5', text: '更早', value: 5 }] },
    { id: 'sex-4', type: 'likert-5', text: '你有过主动发起亲密接触的经历吗？', reverseScored: false, dimension: 'practical', options: [{ id: '1', text: '完全没有', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较多', value: 4 }, { id: '5', text: '非常多', value: 5 }] },
    { id: 'sex-5', type: 'likert-5', text: '你能自然地表达自己在亲密关系中的需求吗？', reverseScored: false, dimension: 'practical', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    { id: 'sex-6', type: 'likert-5', text: '你有过过夜的亲密经历吗？', reverseScored: false, dimension: 'practical', options: [{ id: '1', text: '完全没有', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较多', value: 4 }, { id: '5', text: '非常多', value: 5 }] },
    { id: 'sex-7', type: 'likert-5', text: '你能敏锐地感知到对方在亲密关系中的状态变化吗？', reverseScored: false, dimension: 'practical', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    { id: 'sex-8', type: 'likert-5', text: '你有过与不同性格的人建立亲密关系的经历吗？', reverseScored: false, dimension: 'practical', options: [{ id: '1', text: '完全没有', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较多', value: 4 }, { id: '5', text: '非常多', value: 5 }] },
    
    // theoretical - 理论知识 (9-16)
    { id: 'sex-9', type: 'likert-5', text: '你了解基本的生理健康知识吗？', reverseScored: false, dimension: 'theoretical', options: [{ id: '1', text: '完全不了解', value: 1 }, { id: '2', text: '不太了解', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较了解', value: 4 }, { id: '5', text: '非常了解', value: 5 }] },
    { id: 'sex-10', type: 'likert-5', text: '你读过关于亲密关系的书籍或文章吗？', reverseScored: false, dimension: 'theoretical', options: [{ id: '1', text: '完全没有', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较多', value: 4 }, { id: '5', text: '非常多', value: 5 }] },
    { id: 'sex-11', type: 'likert-5', text: '你了解不同的亲密关系类型吗？', reverseScored: false, dimension: 'theoretical', options: [{ id: '1', text: '完全不了解', value: 1 }, { id: '2', text: '不太了解', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较了解', value: 4 }, { id: '5', text: '非常了解', value: 5 }] },
    { id: 'sex-12', type: 'likert-5', text: '你能区分性和爱的不同吗？', reverseScored: false, dimension: 'theoretical', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    { id: 'sex-13', type: 'likert-5', text: '你了解关于性同意的原则吗？', reverseScored: false, dimension: 'theoretical', options: [{ id: '1', text: '完全不了解', value: 1 }, { id: '2', text: '不太了解', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较了解', value: 4 }, { id: '5', text: '非常了解', value: 5 }] },
    { id: 'sex-14', type: 'likert-5', text: '你看过相关的科普视频或课程吗？', reverseScored: false, dimension: 'theoretical', options: [{ id: '1', text: '完全没有', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较多', value: 4 }, { id: '5', text: '非常多', value: 5 }] },
    { id: 'sex-15', type: 'likert-5', text: '你了解安全措施的重要性和正确使用方法吗？', reverseScored: false, dimension: 'theoretical', options: [{ id: '1', text: '完全不了解', value: 1 }, { id: '2', text: '不太了解', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较了解', value: 4 }, { id: '5', text: '非常了解', value: 5 }] },
    { id: 'sex-16', type: 'likert-5', text: '你能理解不同人的性需求差异吗？', reverseScored: false, dimension: 'theoretical', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    
    // technique - 技术水平 (17-24)
    { id: 'sex-17', type: 'likert-5', text: '你能营造浪漫的氛围吗？', reverseScored: false, dimension: 'technique', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    { id: 'sex-18', type: 'likert-5', text: '你知道如何让对方感到舒适和愉悦吗？', reverseScored: false, dimension: 'technique', options: [{ id: '1', text: '完全不知道', value: 1 }, { id: '2', text: '不太知道', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较知道', value: 4 }, { id: '5', text: '非常知道', value: 5 }] },
    { id: 'sex-19', type: 'likert-5', text: '你善于在亲密关系中调情和暧昧吗？', reverseScored: false, dimension: 'technique', options: [{ id: '1', text: '完全不善于', value: 1 }, { id: '2', text: '不太善于', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较善于', value: 4 }, { id: '5', text: '非常善于', value: 5 }] },
    { id: 'sex-20', type: 'likert-5', text: '你能灵活调整节奏和方式来适应对方吗？', reverseScored: false, dimension: 'technique', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    { id: 'sex-21', type: 'likert-5', text: '你懂得前戏的重要性和技巧吗？', reverseScored: false, dimension: 'technique', options: [{ id: '1', text: '完全不懂', value: 1 }, { id: '2', text: '不太懂', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较懂', value: 4 }, { id: '5', text: '非常懂', value: 5 }] },
    { id: 'sex-22', type: 'likert-5', text: '你能通过非语言方式传达你的意图吗？', reverseScored: false, dimension: 'technique', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    { id: 'sex-23', type: 'likert-5', text: '你善于处理亲密关系中的尴尬场面吗？', reverseScored: false, dimension: 'technique', options: [{ id: '1', text: '完全不善于', value: 1 }, { id: '2', text: '不太善于', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较善于', value: 4 }, { id: '5', text: '非常善于', value: 5 }] },
    { id: 'sex-24', type: 'likert-5', text: '你能让对方体验到多重愉悦吗？', reverseScored: false, dimension: 'technique', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    
    // diversity - 涉猎广度 (25-32)
    { id: 'sex-25', type: 'likert-5', text: '你尝试过不同的亲密方式吗？', reverseScored: false, dimension: 'diversity', options: [{ id: '1', text: '完全没有', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较多', value: 4 }, { id: '5', text: '非常多', value: 5 }] },
    { id: 'sex-26', type: 'likert-5', text: '你愿意探索新的亲密体验吗？', reverseScored: false, dimension: 'diversity', options: [{ id: '1', text: '完全不愿意', value: 1 }, { id: '2', text: '不太愿意', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较愿意', value: 4 }, { id: '5', text: '非常愿意', value: 5 }] },
    { id: 'sex-27', type: 'likert-5', text: '你对不同的性取向有了解和包容吗？', reverseScored: false, dimension: 'diversity', options: [{ id: '1', text: '完全没有', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较多', value: 4 }, { id: '5', text: '非常多', value: 5 }] },
    { id: 'sex-28', type: 'likert-5', text: '你了解不同文化对性的态度差异吗？', reverseScored: false, dimension: 'diversity', options: [{ id: '1', text: '完全不了解', value: 1 }, { id: '2', text: '不太了解', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较了解', value: 4 }, { id: '5', text: '非常了解', value: 5 }] },
    { id: 'sex-29', type: 'likert-5', text: '你尝试过在不同场景下的亲密接触吗？', reverseScored: false, dimension: 'diversity', options: [{ id: '1', text: '完全没有', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较多', value: 4 }, { id: '5', text: '非常多', value: 5 }] },
    { id: 'sex-30', type: 'likert-5', text: '你了解不同的亲密关系模式吗（如开放式关系等）？', reverseScored: false, dimension: 'diversity', options: [{ id: '1', text: '完全不了解', value: 1 }, { id: '2', text: '不太了解', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较了解', value: 4 }, { id: '5', text: '非常了解', value: 5 }] },
    { id: 'sex-31', type: 'likert-5', text: '你对性玩具等辅助工具有所了解吗？', reverseScored: false, dimension: 'diversity', options: [{ id: '1', text: '完全不了解', value: 1 }, { id: '2', text: '不太了解', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较了解', value: 4 }, { id: '5', text: '非常了解', value: 5 }] },
    { id: 'sex-32', type: 'likert-5', text: '你能接受与自己习惯不同的亲密方式吗？', reverseScored: false, dimension: 'diversity', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    
    // openness - 观念开放度 (33-40)
    { id: 'sex-33', type: 'likert-5', text: '你觉得性是一个可以正常讨论的话题吗？', reverseScored: false, dimension: 'openness', options: [{ id: '1', text: '完全不是', value: 1 }, { id: '2', text: '不太是', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较是', value: 4 }, { id: '5', text: '非常是', value: 5 }] },
    { id: 'sex-34', type: 'likert-5', text: '你能接受婚前性行为吗？', reverseScored: false, dimension: 'openness', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    { id: 'sex-35', type: 'likert-5', text: '你认为性是亲密关系中重要的一部分吗？', reverseScored: false, dimension: 'openness', options: [{ id: '1', text: '完全不认为', value: 1 }, { id: '2', text: '不太认为', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较认为', value: 4 }, { id: '5', text: '非常认为', value: 5 }] },
    { id: 'sex-36', type: 'likert-5', text: '你能接受和朋友讨论性话题吗？', reverseScored: false, dimension: 'openness', options: [{ id: '1', text: '完全不能', value: 1 }, { id: '2', text: '不太能', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能', value: 4 }, { id: '5', text: '非常能', value: 5 }] },
    { id: 'sex-37', type: 'likert-5', text: '你认为性和爱可以分开吗？', reverseScored: false, dimension: 'openness', options: [{ id: '1', text: '完全不认为', value: 1 }, { id: '2', text: '不太认为', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较认为', value: 4 }, { id: '5', text: '非常认为', value: 5 }] },
    { id: 'sex-38', type: 'likert-5', text: '你对性少数群体持什么态度？', reverseScored: false, dimension: 'openness', options: [{ id: '1', text: '完全不接受', value: 1 }, { id: '2', text: '不太接受', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较接受', value: 4 }, { id: '5', text: '非常接受并支持', value: 5 }] },
    { id: 'sex-39', type: 'likert-5', text: '你认为性需求是正常的生理需求吗？', reverseScored: false, dimension: 'openness', options: [{ id: '1', text: '完全不认为', value: 1 }, { id: '2', text: '不太认为', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较认为', value: 4 }, { id: '5', text: '非常认为', value: 5 }] },
    { id: 'sex-40', type: 'likert-5', text: '你愿意接受自己和他人在性方面的差异吗？', reverseScored: false, dimension: 'openness', options: [{ id: '1', text: '完全不愿意', value: 1 }, { id: '2', text: '不太愿意', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较愿意', value: 4 }, { id: '5', text: '非常愿意', value: 5 }] },
  ],
  scoringInstructions: '按维度累加得分，用于计算性经验指数',
  resultInterpretation: '性经验指数测评旨在帮助你了解自己在亲密关系方面的经验、知识和观念，结果仅供娱乐，不代表任何专业评估。',
  calculatorId: 'sexual-experience-calculator',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  tags: ['性经验', '亲密关系', '趣味测评', '娱乐'],
}
