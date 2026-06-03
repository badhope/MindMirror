"""Seed data for the assessment catalog.

This file mirrors the questionnaires the React app ships in
``src/data/`` so the backend's ``/api/v1/assessments/`` endpoints have
something useful to return out of the box (a freshly-deployed server
without seeding returns an empty list, which is confusing).

Two design rules keep this file from drifting away from the frontend:

1. ``assessment_id`` strings are the same slugs the frontend hard-codes
   in its ``AssessmentResult`` payload ("big-five", "stress-test",
   "anxiety-gad7"). That way the slug round-trips end-to-end.
2. Question text and option labels are the same Chinese strings used
   in the UI. The backend is read-only w.r.t. these; the actual
   scoring still happens client-side via the corresponding
   ``*Scoring.ts`` modules.

If you change a question here, change it in ``src/data/`` too — the
tests in ``tests/test_seed_assessments.py`` will tell you if you
forgot.
"""
from __future__ import annotations

from typing import Dict, List, TypedDict


class _OptionSpec(TypedDict):
    label: str
    value: int


class _QuestionSpec(TypedDict):
    text: str
    trait: str
    reverse: bool


# ---------------------------------------------------------------------------
# Big Five (BFI-60, 12 items per trait, 6 forward + 6 reverse each)
# ---------------------------------------------------------------------------

BIG_FIVE_QUESTIONS: List[_QuestionSpec] = [
    # Openness (O)
    {"text": "面对一份从未尝试过的异国料理，我的第一反应是好奇而非警惕。", "trait": "O", "reverse": False},
    {"text": "读完一本好书后，我常会花很长时间思考其中蕴含的深层含义。", "trait": "O", "reverse": False},
    {"text": "在博物馆里，我常常因为一件作品驻足很久，沉浸在它传达的情感中。", "trait": "O", "reverse": False},
    {"text": "当大多数人认同某个观点时，我反而会想去探究反面论据。", "trait": "O", "reverse": False},
    {"text": "如果有机会去一个文化完全不同的地方生活三个月，我会毫不犹豫地接受。", "trait": "O", "reverse": False},
    {"text": "我经常在脑海中构建虚构的场景和故事，并乐在其中。", "trait": "O", "reverse": False},
    {"text": "当一种做事方法已经行之有效时，我觉得没有必要去寻找替代方案。", "trait": "O", "reverse": True},
    {"text": "面对抽象的哲学讨论，我通常觉得离实际生活太远而提不起兴趣。", "trait": "O", "reverse": True},
    {"text": "旅行时，我更倾向于重游熟悉的地方，而非探索完全陌生的目的地。", "trait": "O", "reverse": True},
    {"text": "我很少被音乐、电影或艺术作品触动到落泪或起鸡皮疙瘩。", "trait": "O", "reverse": True},
    {"text": "当有人提出一个颠覆常识的新理论时，我的第一反应是怀疑而非好奇。", "trait": "O", "reverse": True},
    {"text": "在讨论中，我更享受那些没有标准答案的话题，而非有明确结论的议题。", "trait": "O", "reverse": False},
    # Conscientiousness (C)
    {"text": "即使没有人监督，我也能严格按照既定计划推进工作。", "trait": "C", "reverse": False},
    {"text": "我的文件和物品都有固定的归放位置，很少需要翻找。", "trait": "C", "reverse": False},
    {"text": "一旦对他人做出承诺，即使后来发现很麻烦，我也会坚持兑现。", "trait": "C", "reverse": False},
    {"text": "在提交任何工作成果前，我都会反复检查细节，即使已经花了很多时间。", "trait": "C", "reverse": False},
    {"text": "出发旅行前，我通常会提前列好详细的行李清单和行程安排。", "trait": "C", "reverse": False},
    {"text": "当一个长期项目看不到即时回报时，我仍能保持稳定的投入节奏。", "trait": "C", "reverse": False},
    {"text": "我经常在截止日期前才开始赶工，尽管之前有充足的时间。", "trait": "C", "reverse": True},
    {"text": "打开我的衣柜或抽屉，你很难找到两件按类别整齐排列的物品。", "trait": "C", "reverse": True},
    {"text": "我有时会为了眼前的轻松而推迟重要的任务，即使知道以后会更麻烦。", "trait": "C", "reverse": True},
    {"text": "在需要长时间专注的任务中，我经常中途被其他事情吸引走。", "trait": "C", "reverse": True},
    {"text": "我有不少开了头但始终没有完成的项目或计划。", "trait": "C", "reverse": True},
    {"text": "做重要决定时，我会系统性地列出利弊，而不是凭直觉行事。", "trait": "C", "reverse": False},
    # Extraversion (E)
    {"text": "在持续社交三小时后，我通常感到精力充沛而非疲惫。", "trait": "E", "reverse": False},
    {"text": "参加一个几乎不认识任何人的聚会，我会主动找人攀谈而非等待被搭话。", "trait": "E", "reverse": False},
    {"text": "在团队讨论中，我通常是率先发言并引导话题方向的那个人。", "trait": "E", "reverse": False},
    {"text": "当所有人的目光聚焦在我身上时，我感到兴奋而非不安。", "trait": "E", "reverse": False},
    {"text": "周末如果没有社交活动，我会觉得少了点什么。", "trait": "E", "reverse": False},
    {"text": "和陌生人聊天时，我很快就能找到共同话题并聊得热络。", "trait": "E", "reverse": False},
    {"text": "经过一天与人频繁互动后，我最渴望的是一个人安静地待着。", "trait": "E", "reverse": True},
    {"text": "在群体中，我更倾向于观察和倾听，而非主动表达自己的观点。", "trait": "E", "reverse": True},
    {"text": "我经常选择用文字消息而非电话来沟通，因为说话更费精力。", "trait": "E", "reverse": True},
    {"text": "如果可以自由选择，我更愿意独自完成一个项目而非与人合作。", "trait": "E", "reverse": True},
    {"text": "被突然推到台前即兴发言时，我需要好一会儿才能组织好语言。", "trait": "E", "reverse": True},
    {"text": "我喜欢在朋友圈或社交平台上分享自己的日常和想法。", "trait": "E", "reverse": False},
    # Agreeableness (A)
    {"text": "即使曾被某人辜负，我仍倾向于给予第二次机会。", "trait": "A", "reverse": False},
    {"text": "当朋友深夜来电倾诉烦恼时，我的第一反应是倾听而非建议。", "trait": "A", "reverse": False},
    {"text": "在意见分歧时，我更愿意寻找折中方案，而非坚持己见。", "trait": "A", "reverse": False},
    {"text": "看到陌生人在公共场合遇到困难，我会不假思索地上前帮忙。", "trait": "A", "reverse": False},
    {"text": "即使对方的观点我不认同，我也能理解他们为何那样想。", "trait": "A", "reverse": False},
    {"text": "在团队合作中，我更在意维持良好氛围，而非证明自己是对的。", "trait": "A", "reverse": False},
    {"text": "当有人反复抱怨同一件事时，我很难保持耐心继续倾听。", "trait": "A", "reverse": True},
    {"text": "我认为在谈判中适度夸大自己的立场是合理的策略。", "trait": "A", "reverse": True},
    {"text": "如果同事犯了影响我的错误，我会直接指出而非委婉暗示。", "trait": "A", "reverse": True},
    {"text": "我倾向于认为大多数人在背后都有自己的算盘。", "trait": "A", "reverse": True},
    {"text": "面对别人的批评，我的第一反应是为自己辩护而非反思。", "trait": "A", "reverse": True},
    {"text": "我很难对别人的请求说\u201c不\u201d，即使那会给自己带来不便。", "trait": "A", "reverse": False},
    # Neuroticism (N) — reverse-flagged in the UI for "emotional stability"
    {"text": "在做出重要决定后，我经常反复质疑自己是否做了正确的选择。", "trait": "N", "reverse": True},
    {"text": "别人一句无心的评价，可能会让我在意好几天。", "trait": "N", "reverse": True},
    {"text": "在等待重要结果公布的那段时间，我几乎无法集中精力做其他事。", "trait": "N", "reverse": True},
    {"text": "当事情没有按预期发展时，我很难迅速调整心态继续前进。", "trait": "N", "reverse": True},
    {"text": "我有时会在深夜突然回想起白天的尴尬瞬间，并为此辗转难眠。", "trait": "N", "reverse": True},
    {"text": "面对多个待办事项时，我常感到不知所措，不知从何开始。", "trait": "N", "reverse": True},
    {"text": "在突发状况面前，我通常能很快冷静下来并找到应对方法。", "trait": "N", "reverse": False},
    {"text": "即使经历了糟糕的一天，我也能在睡前把负面情绪放下。", "trait": "N", "reverse": False},
    {"text": "面对他人的批评，我能比较客观地评估其合理性，而非被情绪裹挟。", "trait": "N", "reverse": False},
    {"text": "在高压环境下，我反而比平时更加专注和高效。", "trait": "N", "reverse": False},
    {"text": "当计划突然被打乱时，我很少感到沮丧，而是迅速想替代方案。", "trait": "N", "reverse": False},
    {"text": "在社交场合中，我时常担心别人在评判我的一言一行。", "trait": "N", "reverse": True},
]

BIG_FIVE_RESPONSE_OPTIONS: List[_OptionSpec] = [
    {"value": 1, "label": "非常不同意"},
    {"value": 2, "label": "不同意"},
    {"value": 3, "label": "中立"},
    {"value": 4, "label": "同意"},
    {"value": 5, "label": "非常同意"},
]

# ---------------------------------------------------------------------------
# PSS-30 (expanded Perceived Stress Scale, 30 items)
# ---------------------------------------------------------------------------

STRESS_QUESTIONS: List[_QuestionSpec] = [
    # 知觉压力感受 (negative)
    {"text": "在过去一个月里，你有多少时间感到生活中重要的事情正脱离你的掌控，而你对此无能为力？", "trait": "perceivedStress", "reverse": False},
    {"text": "在过去一个月里，你有多少时间感到一种持续的紧绷感，好像随时有一根弦绷在脑子里？", "trait": "perceivedStress", "reverse": False},
    {"text": "在过去一个月里，你有多少时间感到神经像被拉满的弓弦，一点小小的刺激就会弹起来？", "trait": "perceivedStress", "reverse": False},
    {"text": "在过去一个月里，你有多少时间感到事情正朝着你无法预料的方向发展，而你只能被动承受？", "trait": "perceivedStress", "reverse": False},
    {"text": "在过去一个月里，你有多少时间面对待办事项清单感到窒息，觉得即使不睡觉也做不完？", "trait": "perceivedStress", "reverse": False},
    {"text": "在过去一个月里，你有多少时间感到问题像滚雪球一样越滚越大，每解决一个又冒出两个新的？", "trait": "perceivedStress", "reverse": False},
    # 应对能力 (positive -> reverse scored)
    {"text": "在过去一个月里，你有多少时间感到面对生活的重大变化时，你有足够的资源和能力去适应？", "trait": "coping", "reverse": True},
    {"text": "在过去一个月里，你有多少时间感到遇到问题时，你相信自己能找到解决的办法？", "trait": "coping", "reverse": True},
    {"text": "在过去一个月里，你有多少时间感到生活的节奏在你的掌控之中，而不是被推着走？", "trait": "coping", "reverse": True},
    {"text": "在过去一个月里，你有多少时间感到即使遇到挫折，你也能在合理时间内让自己的情绪平复下来？", "trait": "coping", "reverse": True},
    {"text": "在过去一个月里，你有多少时间感到即使出现意外，你也有余力去调整和应对？", "trait": "coping", "reverse": True},
    {"text": "在过去一个月里，你有多少时间感到面对困难时，你能够冷静分析并采取行动，而不是陷入无助？", "trait": "coping", "reverse": True},
    # 工作压力
    {"text": "我经常在下班后仍无法停止思考工作中的问题，即使那并不是紧急事务", "trait": "workStress", "reverse": False},
    {"text": "截止日期临近时，我会感到一种窒息般的紧迫感，即使提前开始了也觉得来不及", "trait": "workStress", "reverse": False},
    {"text": "工作中某些人的态度或行为让我消耗大量精力去应对，以至于正事反而做不好", "trait": "workStress", "reverse": False},
    {"text": "看到同龄人的职业进展，我会陷入自我怀疑，不确定自己是否走在了正确的路上", "trait": "workStress", "reverse": False},
    {"text": "我发现自己已经很久没有纯粹地享受一个没有工作打扰的周末了", "trait": "workStress", "reverse": False},
    # 关系/家庭压力
    {"text": "与家人或伴侣的某些对话总是以争吵或冷战收场，让我在开口之前就开始紧张", "trait": "relationshipStress", "reverse": False},
    {"text": "我承担的家庭责任让我几乎没有属于自己的时间，有时候会感到喘不过气", "trait": "relationshipStress", "reverse": False},
    {"text": "维护社交关系让我感到疲惫，有时候宁愿独处也不愿赴约，但独处时又觉得孤独", "trait": "relationshipStress", "reverse": False},
    {"text": "遇到困难时，我翻遍通讯录却找不到一个可以毫无顾虑倾诉的人", "trait": "relationshipStress", "reverse": False},
    # 健康压力
    {"text": "每当身体出现一点小症状，我就会忍不住往最坏的方向想，即使理智告诉我可能没什么", "trait": "healthStress", "reverse": False},
    {"text": "躺在床上脑子里还在不停转，好不容易睡着了又容易醒来，第二天像没睡一样", "trait": "healthStress", "reverse": False},
    {"text": "即使没有做太多事情，我也经常感到一种深入骨髓的疲惫，休息似乎也无法恢复精力", "trait": "healthStress", "reverse": False},
    # 财务压力
    {"text": "即使目前的财务状况尚可，我仍会为未来可能的经济风险而辗转难眠", "trait": "financeStress", "reverse": False},
    {"text": "每次看到物价上涨或经济新闻，我都会重新计算自己的存款还能撑多久", "trait": "financeStress", "reverse": False},
    {"text": "每到还款日前后，我都会感到一阵焦虑，有时候不得不拆东墙补西墙", "trait": "financeStress", "reverse": False},
    # 生理反应
    {"text": "我经常在傍晚发现肩膀僵硬得像石头，或者太阳穴隐隐作痛，才意识到自己又紧张了一整天", "trait": "physiological", "reverse": False},
    {"text": "压力大的时候，我要么完全吃不下东西，要么不自觉地暴吃零食，很难保持正常的饮食习惯", "trait": "physiological", "reverse": False},
    {"text": "在压力特别大的时期，我的肠胃就像有了自己的情绪，稍微吃点东西就不舒服", "trait": "physiological", "reverse": False},
    # 情绪反应
    {"text": "一些以前能轻松应对的小事，现在却会让我瞬间火冒三丈，事后又觉得自己反应过度", "trait": "emotional", "reverse": False},
    {"text": "有时候并没有发生什么特别的事，但我就是感到一阵莫名的低落，对什么都提不起兴趣", "trait": "emotional", "reverse": False},
    {"text": "我的情绪像坐过山车，早上还觉得一切还好，下午就突然陷入低谷，自己也说不清为什么", "trait": "emotional", "reverse": False},
]

STRESS_RESPONSE_OPTIONS: List[_OptionSpec] = [
    {"value": 0, "label": "从未"},
    {"value": 1, "label": "偶尔"},
    {"value": 2, "label": "有时"},
    {"value": 3, "label": "经常"},
    {"value": 4, "label": "总是"},
]

# ---------------------------------------------------------------------------
# GAD-7+ (Generalized Anxiety Disorder, 28 items in 7 dimensions of 4 each)
# ---------------------------------------------------------------------------

GAD7_QUESTIONS: List[_QuestionSpec] = [
    # 过度担忧
    {"text": "即使在没有任何明确威胁的情况下，我也会感到一种说不清的不安，仿佛有什么不好的事即将发生", "trait": "worries", "reverse": False},
    {"text": "我明明知道某件事不值得担心，但大脑就是自动开始反复推演各种可能的坏结果", "trait": "worries", "reverse": False},
    {"text": "我会为一些别人觉得微不足道的事情提前做最坏的打算，比如出门前反复确认门窗是否锁好", "trait": "worries", "reverse": False},
    {"text": "当一件事情还没有确定结果时，我会忍不住在脑海中预演所有可能的糟糕结局，即使大多数都不会发生", "trait": "worries", "reverse": False},
    # 运动性紧张
    {"text": "即使是在周末或假期，我的大脑也像一台关不掉的机器，不停地运转，无法真正享受休息", "trait": "tension", "reverse": False},
    {"text": "在需要安静坐着的场合（如开会、看电影），我会不自觉地抖腿、搓手或频繁变换姿势", "trait": "tension", "reverse": False},
    {"text": "到了晚上才发现自己肩膀一直紧绷着，或者下颌因为长时间咬紧而酸痛", "trait": "tension", "reverse": False},
    {"text": "等待结果或消息时，我会反复查看手机、来回踱步，或者不自觉地咬嘴唇、抠手指", "trait": "tension", "reverse": False},
    # 易激惹
    {"text": "当事情没有按预期发展时，我需要比以前更长的时间才能恢复平静", "trait": "irritability", "reverse": False},
    {"text": "别人一句无心的话或一个小小的延误，就能让我瞬间爆发强烈的烦躁感", "trait": "irritability", "reverse": False},
    {"text": "排队等待、交通堵塞或网速变慢这些日常小事，现在会让我感到难以忍受", "trait": "irritability", "reverse": False},
    {"text": "事后回想起来，我发现自己对亲近的人说了过分的话，但当时就是控制不住语气", "trait": "irritability", "reverse": False},
    # 恐惧/焦虑感受
    {"text": "有时候会突然涌上一股莫名的恐惧感，心跳加速，但完全说不清在怕什么", "trait": "fear", "reverse": False},
    {"text": "在某些安全的环境里（如家中、办公室），我也会突然感到一种不真实的威胁感，好像周围的一切随时会崩塌", "trait": "fear", "reverse": False},
    {"text": "我担心自己会在公共场合突然失控——比如晕倒、崩溃或做出丢脸的事", "trait": "fear", "reverse": False},
    {"text": "我会刻意回避某些特定的场景（如密闭空间、高处、人多的地方），因为一想到要去就感到窒息般的恐惧", "trait": "fear", "reverse": False},
    # 躯体症状
    {"text": "在没有进行体力活动的情况下，我会突然感到心脏砰砰跳，甚至能感觉到脉搏在脖子上跳动", "trait": "physical", "reverse": False},
    {"text": "有时候会觉得空气不够用，需要深吸一口气才能缓解胸口那种被压住的感觉", "trait": "physical", "reverse": False},
    {"text": "在并不热的房间里，我的手心却不断冒汗，或者手指冰凉到握不住笔", "trait": "physical", "reverse": False},
    {"text": "一遇到紧张的事情，我的胃就会先有反应——要么翻江倒海，要么完全吃不下东西", "trait": "physical", "reverse": False},
    # 认知症状
    {"text": "阅读同一段文字需要反复看好几遍，因为思绪总是飘到别的事情上", "trait": "cognitive", "reverse": False},
    {"text": "面对需要做决定的时候，脑子里同时涌出太多想法，反而什么都想不清楚", "trait": "cognitive", "reverse": False},
    {"text": "某件已经过去的事会在脑海中反复回放，我告诉自己别想了，但过一会儿它又冒出来", "trait": "cognitive", "reverse": False},
    {"text": "即使一切顺利，我也会忍不住想\u201c万一出了问题怎么办\u201d，这种念头像背景噪音一样挥之不去", "trait": "cognitive", "reverse": False},
    # 社会功能影响
    {"text": "收到聚会邀请时，我的第一反应是找理由推掉，即使去了也一直在想什么时候能离开", "trait": "social", "reverse": False},
    {"text": "因为焦虑的干扰，完成同样的任务需要比以前花更多时间，而且经常出错", "trait": "social", "reverse": False},
    {"text": "以前喜欢的事情（如运动、画画、旅行），现在提不起劲去做，总觉得\u201c算了，太麻烦\u201d", "trait": "social", "reverse": False},
    {"text": "我会绕远路避开某些地方，或者提前规划好逃跑路线，只为了不去面对那种被围困的感觉", "trait": "social", "reverse": False},
]

GAD7_RESPONSE_OPTIONS: List[_OptionSpec] = [
    {"value": 0, "label": "完全不会"},
    {"value": 1, "label": "好几天"},
    {"value": 2, "label": "超过一半的天数"},
    {"value": 3, "label": "几乎每天"},
]

# ---------------------------------------------------------------------------
# Catalog metadata
# ---------------------------------------------------------------------------


class _AssessmentSpec(TypedDict):
    id: str
    title: str
    description: str
    category: str
    questions: List[_QuestionSpec]
    options: List[_OptionSpec]
    version: str


ASSESSMENT_CATALOG: List[_AssessmentSpec] = [
    {
        "id": "big-five",
        "title": "完整大五人格测评",
        "description": "基于大五人格理论的60题专业性格测评，全面了解你的性格特质。",
        "category": "性格",
        "questions": BIG_FIVE_QUESTIONS,
        "options": BIG_FIVE_RESPONSE_OPTIONS,
        "version": "1.0",
    },
    {
        "id": "stress-test",
        "title": "全面压力水平测试",
        "description": "基于PSS量表的扩展版压力测评，深入分析压力源和应对能力，获得专业的分析和建议。",
        "category": "健康",
        "questions": STRESS_QUESTIONS,
        "options": STRESS_RESPONSE_OPTIONS,
        "version": "1.0",
    },
    {
        "id": "anxiety-gad7",
        "title": "全面焦虑水平测试",
        "description": "基于GAD-7等多个专业量表的综合焦虑评估，帮助您深入了解过去2周内的焦虑状况。",
        "category": "心理健康",
        "questions": GAD7_QUESTIONS,
        "options": GAD7_RESPONSE_OPTIONS,
        "version": "1.0",
    },
]


def get_assessment_count_by_id() -> Dict[str, int]:
    """Convenience for the seed tests."""
    return {a["id"]: len(a["questions"]) for a in ASSESSMENT_CATALOG}
