from typing import Dict, Any, List
from .base import BaseCalculator


class HollandCalculator(BaseCalculator):
    def calculate(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        scores = {"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}
        
        for answer in answers:
            trait = answer.get("trait", "")
            value = answer.get("value", 0)
            
            if trait in scores:
                scores[trait] += value

        sorted_types = sorted(scores.items(), key=lambda x: -x[1])
        top3 = [t[0] for t in sorted_types[:3]]
        
        code = "".join(top3)
        
        return {
            "code": code,
            "scores": scores,
            "top3": top3,
        }

    def get_interpretation(self, result: Dict[str, Any]) -> Dict[str, Any]:
        code = result.get("code", "")
        type_names = {
            "R": "现实型",
            "I": "研究型",
            "A": "艺术型",
            "S": "社会型",
            "E": "企业型",
            "C": "常规型",
        }
        
        descriptions = {
            "R": "喜欢具体的、实际操作性的工作",
            "I": "喜欢研究和解决抽象问题",
            "A": "喜欢艺术创作和表达",
            "S": "喜欢与人打交道和帮助他人",
            "E": "喜欢领导和影响他人",
            "C": "喜欢有条理和结构化的工作",
        }
        
        top3 = result.get("top3", [])
        interpretation = {
            "code": code,
            "types": [
                {"type": t, "name": type_names.get(t, t), "description": descriptions.get(t, "")}
                for t in top3
            ],
        }
        
        return interpretation

    def get_recommendations(self, result: Dict[str, Any]) -> List[str]:
        code = result.get("code", "")
        recommendations = {
            "R": ["考虑技术类职业", "发展动手技能", "关注工程领域"],
            "I": ["考虑科研类职业", "培养分析能力", "关注学术领域"],
            "A": ["考虑创意类职业", "发展艺术才能", "关注文化领域"],
            "S": ["考虑服务类职业", "培养沟通能力", "关注教育领域"],
            "E": ["考虑管理类职业", "发展领导能力", "关注商业领域"],
            "C": ["考虑事务类职业", "培养组织能力", "关注金融领域"],
        }
        
        top3 = result.get("top3", [])
        recs = []
        for t in top3:
            recs.extend(recommendations.get(t, []))
        
        if not recs:
            recs = ["探索多种职业可能性", "了解自己的兴趣方向"]
        
        return recs[:6]
