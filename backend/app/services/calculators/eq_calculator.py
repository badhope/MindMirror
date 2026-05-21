from typing import Dict, Any, List
from .base import BaseCalculator


class EQCalculator(BaseCalculator):
    def calculate(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        scores = {"self_awareness": 0, "self_management": 0, "social_awareness": 0, "relationship_management": 0}
        counts = {"self_awareness": 0, "self_management": 0, "social_awareness": 0, "relationship_management": 0}
        
        for answer in answers:
            trait = answer.get("trait", "")
            value = answer.get("value", 0)
            
            if trait in scores:
                scores[trait] += value
                counts[trait] += 1
        
        normalized = {}
        for trait in scores:
            if counts[trait] > 0:
                normalized[trait] = round((scores[trait] / (counts[trait] * 5)) * 100, 1)
            else:
                normalized[trait] = 50
        
        overall = round(sum(normalized.values()) / len(normalized), 1)
        
        return {
            "overall": overall,
            "scores": normalized,
            "raw_scores": scores,
        }

    def get_interpretation(self, result: Dict[str, Any]) -> Dict[str, Any]:
        overall = result.get("overall", 50)
        scores = result.get("scores", {})
        
        if overall >= 80:
            level = "高"
            description = "您的情商很高，善于理解和管理情绪"
        elif overall >= 60:
            level = "中高"
            description = "您的情商良好，有较好的情绪管理能力"
        elif overall >= 40:
            level = "中等"
            description = "您的情商中等，有提升空间"
        else:
            level = "需提升"
            description = "建议关注情商发展"
        
        trait_names = {
            "self_awareness": "自我觉察",
            "self_management": "自我管理",
            "social_awareness": "社交觉察",
            "relationship_management": "关系管理",
        }
        
        details = {
            trait: {
                "name": trait_names.get(trait, trait),
                "score": scores.get(trait, 0),
            }
            for trait in scores
        }
        
        return {
            "overall": overall,
            "level": level,
            "description": description,
            "details": details,
        }

    def get_recommendations(self, result: Dict[str, Any]) -> List[str]:
        scores = result.get("scores", {})
        recommendations = []
        
        if scores.get("self_awareness", 0) < 50:
            recommendations.append("练习自我反思和情绪觉察")
        if scores.get("self_management", 0) < 50:
            recommendations.append("学习情绪调节技巧")
        if scores.get("social_awareness", 0) < 50:
            recommendations.append("练习同理心和倾听")
        if scores.get("relationship_management", 0) < 50:
            recommendations.append("提升沟通和人际关系技巧")
        
        if not recommendations:
            recommendations = ["你的情商发展良好", "继续保持自我成长"]
        
        return recommendations
