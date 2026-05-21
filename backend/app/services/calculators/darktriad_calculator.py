from typing import Dict, Any, List
from .base import BaseCalculator


class DarkTriadCalculator(BaseCalculator):
    def calculate(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        scores = {"narcissism": 0, "machiavellianism": 0, "psychopathy": 0}
        counts = {"narcissism": 0, "machiavellianism": 0, "psychopathy": 0}
        
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
                normalized[trait] = 0
        
        return {
            "scores": normalized,
            "raw_scores": scores,
            "counts": counts,
        }

    def get_interpretation(self, result: Dict[str, Any]) -> Dict[str, Any]:
        scores = result.get("scores", {})
        interpretation = {}
        
        trait_info = {
            "narcissism": {
                "name": "自恋",
                "high": "倾向于自我中心和优越感",
                "medium": "适度的自信",
                "low": "较为谦逊和自我批判",
            },
            "machiavellianism": {
                "name": "马基雅维利主义",
                "high": "倾向于操纵和策略性",
                "medium": "有一定的策略意识",
                "low": "较为直接和真诚",
            },
            "psychopathy": {
                "name": "心理变态",
                "high": "倾向于冷漠和冲动",
                "medium": "有时缺乏同理心",
                "low": "富有同情心和责任感",
            },
        }
        
        for trait, score in scores.items():
            if score >= 60:
                level = "high"
            elif score >= 40:
                level = "medium"
            else:
                level = "low"
            
            info = trait_info.get(trait, {"name": trait})
            interpretation[trait] = {
                "name": info.get("name", trait),
                "level": level,
                "score": score,
                "description": info.get(level, ""),
            }
        
        return interpretation

    def get_recommendations(self, result: Dict[str, Any]) -> List[str]:
        scores = result.get("scores", {})
        recommendations = []
        
        if scores.get("narcissism", 0) >= 60:
            recommendations.append("练习倾听和关注他人")
        if scores.get("machiavellianism", 0) >= 60:
            recommendations.append("更加真诚和透明")
        if scores.get("psychopathy", 0) >= 60:
            recommendations.append("培养同理心和责任感")
        
        if not recommendations:
            recommendations = ["你的人格健康发展", "继续保持自我觉察"]
        
        return recommendations
