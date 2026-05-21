from typing import Dict, Any, List
from .base import BaseCalculator


class BigFiveCalculator(BaseCalculator):
    def calculate(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        scores = {"O": 0, "C": 0, "E": 0, "A": 0, "N": 0}
        counts = {"O": 0, "C": 0, "E": 0, "A": 0, "N": 0}

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

        return {
            "scores": normalized,
            "raw_scores": scores,
            "counts": counts,
        }

    def get_interpretation(self, result: Dict[str, Any]) -> Dict[str, Any]:
        scores = result.get("scores", {})
        interpretation = {}

        for trait, score in scores.items():
            if score >= 70:
                level = "高"
            elif score >= 40:
                level = "中"
            else:
                level = "低"

            trait_names = {
                "O": "开放性",
                "C": "尽责性",
                "E": "外向性",
                "A": "宜人性",
                "N": "神经质",
            }

            descriptions = {
                "O": {
                    "高": "富有想象力和创造力",
                    "中": "平衡的开放态度",
                    "低": "务实和传统",
                },
                "C": {
                    "高": "组织有序且可靠",
                    "中": "适度的责任感",
                    "低": "灵活随性",
                },
                "E": {
                    "高": "外向社交",
                    "中": "平衡的社交能力",
                    "低": "内向安静",
                },
                "A": {
                    "高": "友善合作",
                    "中": "平衡的人际态度",
                    "低": "独立直接",
                },
                "N": {
                    "高": "情绪敏感",
                    "中": "平衡的情绪稳定性",
                    "低": "情绪稳定",
                },
            }

            interpretation[trait] = {
                "name": trait_names.get(trait, trait),
                "level": level,
                "score": score,
                "description": descriptions.get(trait, {}).get(level, ""),
            }

        return interpretation

    def get_recommendations(self, result: Dict[str, Any]) -> List[str]:
        scores = result.get("scores", {})
        recommendations = []

        if scores.get("O", 0) < 40:
            recommendations.append("尝试新的体验和活动")
        if scores.get("C", 0) < 40:
            recommendations.append("建立日常计划和目标")
        if scores.get("E", 0) < 40:
            recommendations.append("逐步增加社交互动")
        if scores.get("A", 0) < 40:
            recommendations.append("练习同理心和倾听")
        if scores.get("N", 0) > 70:
            recommendations.append("练习正念和放松技巧")

        if not recommendations:
            recommendations = ["你的人格特质均衡发展", "继续保持自我成长"]

        return recommendations
