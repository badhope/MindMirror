from typing import Dict, Any, List
from .base import BaseCalculator


class SASCalculator(BaseCalculator):
    def calculate(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        total_score = sum(answer.get("value", 0) for answer in answers)
        question_count = len(answers)
        
        if question_count == 0:
            return {"total_score": 0, "level": "normal"}

        mean_score = total_score / question_count
        
        if mean_score >= 4:
            level = "severe"
        elif mean_score >= 3:
            level = "moderate"
        elif mean_score >= 2:
            level = "mild"
        else:
            level = "normal"

        return {
            "total_score": total_score,
            "mean_score": round(mean_score, 2),
            "level": level,
            "question_count": question_count,
        }

    def get_interpretation(self, result: Dict[str, Any]) -> Dict[str, Any]:
        level = result.get("level", "normal")
        level_descriptions = {
            "normal": {
                "title": "正常范围",
                "description": "您的焦虑水平在正常范围内，情绪状态良好。",
                "suggestion": "继续保持良好的生活习惯和心态。",
            },
            "mild": {
                "title": "轻度焦虑",
                "description": "您可能偶尔感到紧张或担忧，这在日常生活中是正常的。",
                "suggestion": "尝试通过运动、冥想或兴趣爱好来放松身心。",
            },
            "moderate": {
                "title": "中度焦虑",
                "description": "您的焦虑情绪较为明显，可能影响到日常生活和工作。",
                "suggestion": "建议寻求专业心理咨询或尝试放松技巧。",
            },
            "severe": {
                "title": "重度焦虑",
                "description": "您的焦虑水平较高，可能严重影响到日常生活。",
                "suggestion": "强烈建议寻求专业心理健康服务。",
            },
        }
        return level_descriptions.get(level, level_descriptions["normal"])

    def get_recommendations(self, result: Dict[str, Any]) -> List[str]:
        level = result.get("level", "normal")
        
        if level == "severe":
            return [
                "寻求专业心理健康服务",
                "与信任的人交流您的感受",
                "尝试深呼吸和冥想练习",
                "保持规律的作息和运动",
            ]
        elif level == "moderate":
            return [
                "考虑咨询心理咨询师",
                "学习放松技巧如深呼吸",
                "保持规律运动",
                "建立支持性的社交关系",
            ]
        elif level == "mild":
            return [
                "练习正念冥想",
                "保持规律的运动习惯",
                "培养放松的兴趣爱好",
                "保证充足的睡眠",
            ]
        else:
            return [
                "继续保持健康的生活方式",
                "定期进行自我反思",
                "保持社交联系",
            ]
