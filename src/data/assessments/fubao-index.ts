/**
 * ==============================================
 * 💰 福报指数测评 - 题目定义文件
 * ==============================================
 * 【测评设计】
 * - 总题数：40题
 * - 维度：5维度 × 8题/维度
 * - 题型：李克特5点量表
 * 
 * 【五大维度】【⚠️  与计算器严格对应！改了这里要改计算器！】
 * - overtimeAcceptance: 加班接受度
 * - bossWorship: 老板崇拜度
 * - sacrificeWillingness: 牺牲意愿
 * - gratitudeLevel: 感恩等级
 * - struggleBelief: 奋斗信仰
 * 
 * 【设计说明】职场PUA感染程度鉴定
 */

import type { Assessment } from '../../types'
import { calculateFuBao } from '../../utils/calculators/fubao-calculator'

export const fubaoIndexAssessment: Assessment = {
  id: 'fubao-index',
  title: '福报指数测评',
  description: '基于当代企业文化的深度职业心态测评',
  longDescription: '福报指数测评是一个趣味职业心态测试，通过40道题目，从加班接受度、老板崇拜、牺牲意愿、感恩等级和奋斗信仰五个维度，全面了解你对当代职场文化的适应程度。这是一个娱乐性质的测评，请勿当真！',
  category: '职业发展',
  subcategory: '企业文化',
  difficulty: 'standard',
  duration: 6,
  questionCount: 40,
  quality: '娱乐',
  isFree: true,
  requiresSubscription: false,
  dimensions: ['overtimeAcceptance', 'bossWorship', 'sacrificeWillingness', 'gratitudeLevel', 'struggleBelief'],
  resultCalculator: calculateFuBao,
  questions: [
    // overtimeAcceptance - 加班接受度 (1-8)
    { id: 'fubao-1', type: 'likert-5', text: '周五下午6点，大家都还没走，你会怎么做？', reverseScored: false, dimension: 'overtimeAcceptance', options: [{ id: '1', text: '到点就走，绝不回头', value: 1 }, { id: '2', text: '收拾东西，默默溜了', value: 2 }, { id: '3', text: '再等15分钟，没人走就溜', value: 3 }, { id: '4', text: '老板不走我不走', value: 4 }, { id: '5', text: '主动问老板今晚需不需要加班', value: 5 }] },
    { id: 'fubao-2', type: 'likert-5', text: '你觉得加班是正常的吗？', reverseScored: false, dimension: 'overtimeAcceptance', options: [{ id: '1', text: '完全不正常', value: 1 }, { id: '2', text: '不太正常', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较正常', value: 4 }, { id: '5', text: '非常正常，不加班才不正常', value: 5 }] },
    { id: 'fubao-3', type: 'likert-5', text: '周末收到工作消息，你会？', reverseScored: false, dimension: 'overtimeAcceptance', options: [{ id: '1', text: '假装没看见，周一再说', value: 1 }, { id: '2', text: '看心情回复', value: 2 }, { id: '3', text: '简单回复一下', value: 3 }, { id: '4', text: '认真处理，必要时打开电脑', value: 4 }, { id: '5', text: '立刻响应，随时待命', value: 5 }] },
    { id: 'fubao-4', type: 'likert-5', text: '你能接受连续加班吗？', reverseScored: false, dimension: 'overtimeAcceptance', options: [{ id: '1', text: '完全不能接受', value: 1 }, { id: '2', text: '不太能接受', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较能接受', value: 4 }, { id: '5', text: '非常能接受，以公司为家', value: 5 }] },
    { id: 'fubao-5', type: 'likert-5', text: '你觉得加班应该有加班费吗？', reverseScored: true, dimension: 'overtimeAcceptance', options: [{ id: '1', text: '当然要有，天经地义', value: 1 }, { id: '2', text: '最好有', value: 2 }, { id: '3', text: '无所谓', value: 3 }, { id: '4', text: '有没有都行', value: 4 }, { id: '5', text: '能为公司做贡献还要什么钱', value: 5 }] },
    { id: 'fubao-6', type: 'likert-5', text: '你会主动申请加班吗？', reverseScored: false, dimension: 'overtimeAcceptance', options: [{ id: '1', text: '绝不会', value: 1 }, { id: '2', text: '很少会', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较会', value: 4 }, { id: '5', text: '经常主动加班', value: 5 }] },
    { id: 'fubao-7', type: 'likert-5', text: '你如何看待"996是福报"这句话？', reverseScored: false, dimension: 'overtimeAcceptance', options: [{ id: '1', text: '完全是扯淡', value: 1 }, { id: '2', text: '不太认同', value: 2 }, { id: '3', text: '一半一半', value: 3 }, { id: '4', text: '比较认同', value: 4 }, { id: '5', text: '太对了，说到我心坎里了', value: 5 }] },
    { id: 'fubao-8', type: 'likert-5', text: '你愿意为了工作牺牲休息时间吗？', reverseScored: false, dimension: 'overtimeAcceptance', options: [{ id: '1', text: '完全不愿意', value: 1 }, { id: '2', text: '不太愿意', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较愿意', value: 4 }, { id: '5', text: '非常愿意，工作就是生活', value: 5 }] },
    
    // bossWorship - 老板崇拜度 (9-16)
    { id: 'fubao-9', type: 'likert-5', text: '你觉得老板说的话都是对的吗？', reverseScored: false, dimension: 'bossWorship', options: [{ id: '1', text: '当然不是，老板也会犯错', value: 1 }, { id: '2', text: '大部分时候不对', value: 2 }, { id: '3', text: '一半一半', value: 3 }, { id: '4', text: '大部分时候是对的', value: 4 }, { id: '5', text: '老板永远是对的', value: 5 }] },
    { id: 'fubao-10', type: 'likert-5', text: '你会主动点赞老板的朋友圈吗？', reverseScored: false, dimension: 'bossWorship', options: [{ id: '1', text: '从不点赞', value: 1 }, { id: '2', text: '很少点赞', value: 2 }, { id: '3', text: '偶尔点赞', value: 3 }, { id: '4', text: '经常点赞', value: 4 }, { id: '5', text: '每条都点赞并评论', value: 5 }] },
    { id: 'fubao-11', type: 'likert-5', text: '你如何看待老板的批评？', reverseScored: false, dimension: 'bossWorship', options: [{ id: '1', text: '老板凭什么批评我', value: 1 }, { id: '2', text: '心里不爽但不说', value: 2 }, { id: '3', text: '听听就算了', value: 3 }, { id: '4', text: '认真听取，努力改进', value: 4 }, { id: '5', text: '老板批评我是为我好，感恩！', value: 5 }] },
    { id: 'fubao-12', type: 'likert-5', text: '你会模仿老板的言行吗？', reverseScored: false, dimension: 'bossWorship', options: [{ id: '1', text: '完全不会', value: 1 }, { id: '2', text: '不太会', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较会', value: 4 }, { id: '5', text: '老板就是我的偶像，向他看齐', value: 5 }] },
    { id: 'fubao-13', type: 'likert-5', text: '你觉得能跟着这样的老板工作是幸运的吗？', reverseScored: false, dimension: 'bossWorship', options: [{ id: '1', text: '完全不觉得', value: 1 }, { id: '2', text: '不太觉得', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较觉得', value: 4 }, { id: '5', text: '太幸运了，上辈子修来的福气', value: 5 }] },
    { id: 'fubao-14', type: 'likert-5', text: '你会主动向老板汇报工作进度吗？', reverseScored: false, dimension: 'bossWorship', options: [{ id: '1', text: '从不，老板问了再说', value: 1 }, { id: '2', text: '很少主动', value: 2 }, { id: '3', text: '偶尔汇报', value: 3 }, { id: '4', text: '经常汇报', value: 4 }, { id: '5', text: '随时向老板汇报，让他知道我在努力', value: 5 }] },
    { id: 'fubao-15', type: 'likert-5', text: '老板加班时你会？', reverseScored: false, dimension: 'bossWorship', options: [{ id: '1', text: '到点就走，跟我没关系', value: 1 }, { id: '2', text: '假装收拾东西慢一点', value: 2 }, { id: '3', text: '再待一会儿', value: 3 }, { id: '4', text: '主动留下来陪老板', value: 4 }, { id: '5', text: '老板不走我绝对不走', value: 5 }] },
    { id: 'fubao-16', type: 'likert-5', text: '你觉得老板的成功主要是因为什么？', reverseScored: false, dimension: 'bossWorship', options: [{ id: '1', text: '运气好而已', value: 1 }, { id: '2', text: '时机好', value: 2 }, { id: '3', text: '一半努力一半运气', value: 3 }, { id: '4', text: '个人能力很强', value: 4 }, { id: '5', text: '老板是天选之人，太厉害了', value: 5 }] },
    
    // sacrificeWillingness - 牺牲意愿 (17-24)
    { id: 'fubao-17', type: 'likert-5', text: '你愿意为了工作牺牲和家人相处的时间吗？', reverseScored: false, dimension: 'sacrificeWillingness', options: [{ id: '1', text: '完全不愿意', value: 1 }, { id: '2', text: '不太愿意', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较愿意', value: 4 }, { id: '5', text: '非常愿意，工作最重要', value: 5 }] },
    { id: 'fubao-18', type: 'likert-5', text: '婚假/产假你会休多久？', reverseScored: false, dimension: 'sacrificeWillingness', options: [{ id: '1', text: '休满所有假期', value: 1 }, { id: '2', text: '休大部分', value: 2 }, { id: '3', text: '休一半', value: 3 }, { id: '4', text: '休一小部分', value: 4 }, { id: '5', text: '不休了，公司需要我', value: 5 }] },
    { id: 'fubao-19', type: 'likert-5', text: '你愿意为了项目延期个人计划吗？', reverseScored: false, dimension: 'sacrificeWillingness', options: [{ id: '1', text: '完全不愿意', value: 1 }, { id: '2', text: '不太愿意', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较愿意', value: 4 }, { id: '5', text: '非常愿意，项目永远第一', value: 5 }] },
    { id: 'fubao-20', type: 'likert-5', text: '你愿意为了公司利益牺牲个人利益吗？', reverseScored: false, dimension: 'sacrificeWillingness', options: [{ id: '1', text: '绝对不愿意', value: 1 }, { id: '2', text: '不太愿意', value: 2 }, { id: '3', text: '看情况', value: 3 }, { id: '4', text: '比较愿意', value: 4 }, { id: '5', text: '非常愿意，公司就是我的家', value: 5 }] },
    { id: 'fubao-21', type: 'likert-5', text: '生病时你会坚持上班吗？', reverseScored: false, dimension: 'sacrificeWillingness', options: [{ id: '1', text: '当然要请假休息', value: 1 }, { id: '2', text: '严重的话会请假', value: 2 }, { id: '3', text: '看情况', value: 3 }, { id: '4', text: '小病都会坚持上班', value: 4 }, { id: '5', text: '发烧40度也要坚守岗位', value: 5 }] },
    { id: 'fubao-22', type: 'likert-5', text: '你会为了工作放弃自己的爱好吗？', reverseScored: false, dimension: 'sacrificeWillingness', options: [{ id: '1', text: '绝不会', value: 1 }, { id: '2', text: '不太会', value: 2 }, { id: '3', text: '看情况', value: 3 }, { id: '4', text: '比较会', value: 4 }, { id: '5', text: '爱好算什么，工作最重要', value: 5 }] },
    { id: 'fubao-23', type: 'likert-5', text: '你愿意为了工作搬到另一个城市吗？', reverseScored: false, dimension: 'sacrificeWillingness', options: [{ id: '1', text: '完全不愿意', value: 1 }, { id: '2', text: '不太愿意', value: 2 }, { id: '3', text: '看情况', value: 3 }, { id: '4', text: '比较愿意', value: 4 }, { id: '5', text: '公司让我去哪我就去哪', value: 5 }] },
    { id: 'fubao-24', type: 'likert-5', text: '你觉得为公司牺牲是值得的吗？', reverseScored: false, dimension: 'sacrificeWillingness', options: [{ id: '1', text: '完全不值得', value: 1 }, { id: '2', text: '不太值得', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较值得', value: 4 }, { id: '5', text: '太值得了，我愿意奉献一切', value: 5 }] },
    
    // gratitudeLevel - 感恩等级 (25-32)
    { id: 'fubao-25', type: 'likert-5', text: '你感恩公司给你这份工作吗？', reverseScored: false, dimension: 'gratitudeLevel', options: [{ id: '1', text: '这是我凭能力挣来的，凭什么感恩', value: 1 }, { id: '2', text: '不太感恩', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较感恩', value: 4 }, { id: '5', text: '太感恩了，公司是我的再生父母', value: 5 }] },
    { id: 'fubao-26', type: 'likert-5', text: '你觉得公司给你的待遇如何？', reverseScored: true, dimension: 'gratitudeLevel', options: [{ id: '1', text: '太低了，完全配不上我的能力', value: 1 }, { id: '2', text: '不太满意', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较满意', value: 4 }, { id: '5', text: '太满意了，公司给我的太多了', value: 5 }] },
    { id: 'fubao-27', type: 'likert-5', text: '你会经常感谢老板吗？', reverseScored: false, dimension: 'gratitudeLevel', options: [{ id: '1', text: '从不', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '偶尔', value: 3 }, { id: '4', text: '经常', value: 4 }, { id: '5', text: '每天都在心里感恩', value: 5 }] },
    { id: 'fubao-28', type: 'likert-5', text: '你觉得公司培养了你吗？', reverseScored: false, dimension: 'gratitudeLevel', options: [{ id: '1', text: '完全没有，都是我自己努力', value: 1 }, { id: '2', text: '不太有', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较有', value: 4 }, { id: '5', text: '公司就是我的母校，再造之恩', value: 5 }] },
    { id: 'fubao-29', type: 'likert-5', text: '即使离职了，你还会感恩前公司吗？', reverseScored: false, dimension: 'gratitudeLevel', options: [{ id: '1', text: '不吐槽就不错了', value: 1 }, { id: '2', text: '不太会', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较会', value: 4 }, { id: '5', text: '永远感恩，一日公司终身公司', value: 5 }] },
    { id: 'fubao-30', type: 'likert-5', text: '你如何看待公司给你的"锻炼机会"？', reverseScored: false, dimension: 'gratitudeLevel', options: [{ id: '1', text: '不就是让我多干活嘛', value: 1 }, { id: '2', text: '不太觉得是机会', value: 2 }, { id: '3', text: '一半一半', value: 3 }, { id: '4', text: '确实是锻炼机会', value: 4 }, { id: '5', text: '太感谢公司给我这个机会了', value: 5 }] },
    { id: 'fubao-31', type: 'likert-5', text: '你会向朋友炫耀自己的公司吗？', reverseScored: false, dimension: 'gratitudeLevel', options: [{ id: '1', text: '从不，嫌丢人', value: 1 }, { id: '2', text: '很少', value: 2 }, { id: '3', text: '偶尔', value: 3 }, { id: '4', text: '经常', value: 4 }, { id: '5', text: '逢人就说，我公司天下第一', value: 5 }] },
    { id: 'fubao-32', type: 'likert-5', text: '你觉得能在这家公司工作是一种荣幸吗？', reverseScored: false, dimension: 'gratitudeLevel', options: [{ id: '1', text: '完全不是', value: 1 }, { id: '2', text: '不太是', value: 2 }, { id: '3', text: '一般', value: 3 }, { id: '4', text: '比较是', value: 4 }, { id: '5', text: '太荣幸了，祖坟冒青烟', value: 5 }] },
    
    // struggleBelief - 奋斗信仰 (33-40)
    { id: 'fubao-33', type: 'likert-5', text: '你相信"今天的奋斗是明天的福报"吗？', reverseScored: false, dimension: 'struggleBelief', options: [{ id: '1', text: '完全不相信', value: 1 }, { id: '2', text: '不太相信', value: 2 }, { id: '3', text: '一半一半', value: 3 }, { id: '4', text: '比较相信', value: 4 }, { id: '5', text: '深信不疑', value: 5 }] },
    { id: 'fubao-34', type: 'likert-5', text: '你觉得年轻人就应该多奋斗吗？', reverseScored: false, dimension: 'struggleBelief', options: [{ id: '1', text: '凭什么，年轻人也要生活', value: 1 }, { id: '2', text: '不太认同', value: 2 }, { id: '3', text: '一半一半', value: 3 }, { id: '4', text: '比较认同', value: 4 }, { id: '5', text: '太对了，年轻不奋斗什么时候奋斗', value: 5 }] },
    { id: 'fubao-35', type: 'likert-5', text: '你如何看待"躺平"？', reverseScored: false, dimension: 'struggleBelief', options: [{ id: '1', text: '躺平万岁，这才是人生', value: 1 }, { id: '2', text: '偶尔躺平也挺好', value: 2 }, { id: '3', text: '看情况', value: 3 }, { id: '4', text: '不太应该躺平', value: 4 }, { id: '5', text: '躺平就是堕落，年轻人要奋斗', value: 5 }] },
    { id: 'fubao-36', type: 'likert-5', text: '你觉得努力奋斗就能成功吗？', reverseScored: false, dimension: 'struggleBelief', options: [{ id: '1', text: '努力有什么用，都是命', value: 1 }, { id: '2', text: '不太觉得', value: 2 }, { id: '3', text: '一半一半', value: 3 }, { id: '4', text: '比较觉得', value: 4 }, { id: '5', text: '当然，只要努力就能成功', value: 5 }] },
    { id: 'fubao-37', type: 'likert-5', text: '你会为了未来牺牲现在的享受吗？', reverseScored: false, dimension: 'struggleBelief', options: [{ id: '1', text: '绝不会，活在当下', value: 1 }, { id: '2', text: '不太会', value: 2 }, { id: '3', text: '看情况', value: 3 }, { id: '4', text: '比较会', value: 4 }, { id: '5', text: '现在苦一点没关系，未来会好的', value: 5 }] },
    { id: 'fubao-38', type: 'likert-5', text: '你觉得比你优秀的人比你还努力吗？', reverseScored: false, dimension: 'struggleBelief', options: [{ id: '1', text: '那又怎样，跟我没关系', value: 1 }, { id: '2', text: '不太觉得', value: 2 }, { id: '3', text: '一半一半', value: 3 }, { id: '4', text: '比较觉得', value: 4 }, { id: '5', text: '太对了，我还有什么理由不努力', value: 5 }] },
    { id: 'fubao-39', type: 'likert-5', text: '你如何看待"不要只看眼前的工资"？', reverseScored: false, dimension: 'struggleBelief', options: [{ id: '1', text: '不看工资看什么，画饼吗', value: 1 }, { id: '2', text: '不太认同', value: 2 }, { id: '3', text: '一半一半', value: 3 }, { id: '4', text: '比较认同', value: 4 }, { id: '5', text: '太对了，成长比工资重要', value: 5 }] },
    { id: 'fubao-40', type: 'likert-5', text: '你愿意为了"美好未来"现在多吃苦吗？', reverseScored: false, dimension: 'struggleBelief', options: [{ id: '1', text: '不愿意，现在就要快乐', value: 1 }, { id: '2', text: '不太愿意', value: 2 }, { id: '3', text: '看情况', value: 3 }, { id: '4', text: '比较愿意', value: 4 }, { id: '5', text: '非常愿意，吃得苦中苦方为人上人', value: 5 }] },
  ],
  scoringInstructions: '按维度累加得分，用于计算福报指数',
  resultInterpretation: '福报指数测评是一个趣味测试，旨在娱乐大家，请勿对号入座。工作重要，但生活和健康更重要！',
  calculatorId: 'fubao-calculator',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  tags: ['福报', '职场', '趣味测评', 'PUA', '打工'],
}
