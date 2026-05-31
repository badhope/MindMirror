from typing import Dict, List, Any, Tuple
from app.models.result import AssessmentResult
from app.models.assessment import Question, Option


def calculate_big5_scores(answers: List[Tuple[Question, List[Option]]]) -> Dict[str, float]:
    """
    计算大五人格分数
    """
    # 初始化各维度分数
    dimension_scores = {
        "O": 0.0,  # 开放性
        "C": 0.0,  # 尽责性
        "E": 0.0,  # 外向性
        "A": 0.0,  # 宜人性
    }
    
    # 统计各维度的题数
    dimension_counts = {
        "O": 0,
        "C": 0,
        "E": 0,
        "A": 0,
    }
    
    for question, selected_options in answers:
        if not selected_options:
            continue
        
        # 获取选项
        option = selected_options[0]
        dimension = option.dimension
        
        if dimension and dimension in dimension_scores:
            dimension_scores[dimension] += option.score_value
            dimension_counts[dimension] += 1
    
    # 计算百分比
    percentage_scores = {}
    for dim in dimension_scores:
        if dimension_counts[dim] > 0:
            # 每题最高分5分，计算百分比
            max_possible = dimension_counts[dim] * 5
            percentage_scores[dim] = (dimension_scores[dim] / max_possible) * 100
        else:
            percentage_scores[dim] = 0.0
    
    return percentage_scores


def generate_big5_description(percentages: Dict[str, float]) -> str:
    """
    根据大五人格分数生成详细描述
    """
    descriptions = []
    
    # 开放性 (O)
    o_score = percentages.get("O", 50)
    if o_score >= 75:
        descriptions.append("你是一个非常开放的人。你对新思想、新文化和新体验充满好奇，喜欢探索和学习。你的想象力丰富，容易接受不同的观点和生活方式。")
    elif o_score >= 50:
        descriptions.append("你是一个相对开放的人。你对新事物保持一定的好奇心，但同时也重视传统和习惯。你愿意尝试新东西，但不会过于激进。")
    elif o_score >= 25:
        descriptions.append("你是一个比较传统的人。你更喜欢熟悉、稳定的环境，对新事物会谨慎尝试。你重视实用和可靠。")
    else:
        descriptions.append("你是一个非常传统和务实的人。你喜欢熟悉的事物，对变化保持谨慎。你看重安全和稳定。")
    
    # 尽责性 (C)
    c_score = percentages.get("C", 50)
    if c_score >= 75:
        descriptions.append("你是一个非常尽责的人。你有条理、可靠，对自己要求高。你善于规划和坚持，做事认真负责，值得信赖。")
    elif c_score >= 50:
        descriptions.append("你是一个比较尽责的人。你大多数时候都很可靠，但在某些情况下也会比较灵活。你有基本的自律性。")
    elif c_score >= 25:
        descriptions.append("你是一个比较随性的人。你喜欢灵活和自由，不太喜欢被规则束缚。你可能有时会拖延，但能在需要时完成任务。")
    else:
        descriptions.append("你是一个非常随性的人。你喜欢顺其自然，不喜欢太多计划。你更看重当下的快乐。")
    
    # 外向性 (E)
    e_score = percentages.get("E", 50)
    if e_score >= 75:
        descriptions.append("你是一个非常外向的人。你喜欢与人交往，充满活力，容易成为焦点。你在社交场合中感到自在和充实。")
    elif e_score >= 50:
        descriptions.append("你是一个比较外向的人。你喜欢和人在一起，但也需要独处的时间。你在社交中能适应得不错。")
    elif e_score >= 25:
        descriptions.append("你是一个比较内向的人。你更喜欢独处或和少数几个亲密的朋友在一起。社交可能会让你感到有些疲劳。")
    else:
        descriptions.append("你是一个非常内向的人。你在独处时最能恢复精力。安静、深度的交流让你更舒适。")
    
    # 宜人性 (A)
    a_score = percentages.get("A", 50)
    if a_score >= 75:
        descriptions.append("你是一个非常宜人的人。你善良、有同情心，总是愿意帮助他人。你看重合作和和谐，容易和人相处。")
    elif a_score >= 50:
        descriptions.append("你是一个比较宜人的人。你对人友善，愿意合作，但也会在需要时维护自己的利益。你有基本的同理心。")
    elif a_score >= 25:
        descriptions.append("你是一个更注重现实的人。你会考虑自己的利益，有时会显得比较直接。你更看重公平而不是和谐。")
    else:
        descriptions.append("你是一个很务实的人。你看重结果和效率，有时会显得比较直接。你不害怕表达不同意见。")
    
    return " ".join(descriptions)


def generate_recommendations(percentages: Dict[str, float]) -> List[str]:
    """
    生成个性化的建议
    """
    recommendations = []
    
    o_score = percentages.get("O", 50)
    if o_score < 40:
        recommendations.append("试着每周尝试一件新事物，可能会给你带来意外的惊喜。")
    elif o_score > 70:
        recommendations.append("你有很好的开放性，可以考虑学习一门新艺术或语言。")
    
    c_score = percentages.get("C", 50)
    if c_score < 40:
        recommendations.append("试着为自己的生活建立一些简单的规律，会让你更有掌控感。")
    elif c_score > 70:
        recommendations.append("你对自己要求很高，记得偶尔放松一下，不要太追求完美。")
    
    e_score = percentages.get("E", 50)
    if e_score < 40:
        recommendations.append("社交可能让你感到疲惫，但偶尔和朋友小聚也会带来快乐。")
    elif e_score > 70:
        recommendations.append("你喜欢与人交往，可以考虑加入一些兴趣小组或社群。")
    
    a_score = percentages.get("A", 50)
    if a_score < 40:
        recommendations.append("试着在争论中站在对方的角度想一想，可能会有新的理解。")
    elif a_score > 70:
        recommendations.append("你很善良，但记得也要为自己考虑，设定健康的边界。")
    
    return recommendations


def generate_big5_report(percentages: Dict[str, float]) -> Dict[str, Any]:
    """
    生成完整的大五人格报告
    """
    total_score = sum(percentages.values()) / len(percentages) if percentages else 0
    
    report = {
        "total_score": total_score,
        "dimension_scores": percentages,
        "result_summary": f"你的性格综合得分是 {total_score:.1f}%",
        "detailed_analysis": generate_big5_description(percentages),
        "recommendations": generate_recommendations(percentages)
    }
    
    return report


def format_dimension_display(score: float) -> str:
    """
    格式化维度分数显示
    """
    if score >= 75:
        return f"{score:.1f}% - 高"
    elif score >= 50:
        return f"{score:.1f}% - 中等偏高"
    elif score >= 25:
        return f"{score:.1f}% - 中等偏低"
    else:
        return f"{score:.1f}% - 低"
