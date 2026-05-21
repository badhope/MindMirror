from typing import Dict, Any, List
from .base import BaseCalculator


class SDSCalculator(BaseCalculator):
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
                "description": "您的抑郁水平在正常范围内，情绪状态良好。",
                "suggestion": "继续保持积极的生活态度和健康习惯。",
            },
            "mild": {
                "title": "轻度抑郁",
                "description": "您可能偶尔感到情绪低落或失去兴趣，这是正常的情绪波动。",
                "suggestion": "关注自己的情绪变化，与亲友多交流。",
            },
            "moderate": {
                "title": "中度抑郁",
                "description": "您的抑郁情绪较为明显，可能影响到日常生活和工作。",
                "suggestion": "建议寻求专业心理咨询帮助。",
            },
            "severe": {
                "title": "重度抑郁",
                "description": "您的抑郁水平较高，可能严重影响到日常生活和身心健康。",
                "suggestion": "强烈建议立即寻求专业心理健康服务。",
            },
        }
        return level_descriptions.get(level, level_descriptions["normal"])

    def get_recommendations(self, result: Dict[str, Any]) -> List[str]:
        level = result.get("level", "normal")
        
        if level == "severe":
            return [
                "立即寻求专业心理健康服务",
                "告知亲友您的状况",
                "避免独处，保持社交联系",
                "进行适度的户外活动",
            ]
        elif level == "moderate":
            return [
                "寻求心理咨询师帮助",
                "建立规律的日常生活",
                "保持适度运动",
                "与信任的人分享感受",
            ]
        elif level == "mild":
            return [
                "保持规律作息",
                "进行喜欢的活动",
                "与朋友保持联系",
                "练习正念或冥想",
            ]
        else:
            return [
                "继续保持积极的生活态度",
                "保持社交活动",
                "定期自我检查情绪状态",
            ]
