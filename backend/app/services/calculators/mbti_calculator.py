from typing import Dict, Any, List
from .base import BaseCalculator


class MBTICalculator(BaseCalculator):
    def calculate(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        scores = {"E": 0, "I": 0, "S": 0, "N": 0, "T": 0, "F": 0, "J": 0, "P": 0}
        
        for answer in answers:
            trait = answer.get("trait", "")
            value = answer.get("value", 0)
            
            if trait == "EI":
                if value <= 2:
                    scores["I"] += (3 - value)
                else:
                    scores["E"] += (value - 2)
            elif trait == "SN":
                if value <= 2:
                    scores["S"] += (3 - value)
                else:
                    scores["N"] += (value - 2)
            elif trait == "TF":
                if value <= 2:
                    scores["F"] += (3 - value)
                else:
                    scores["T"] += (value - 2)
            elif trait == "JP":
                if value <= 2:
                    scores["P"] += (3 - value)
                else:
                    scores["J"] += (value - 2)

        type_code = ""
        type_code += "E" if scores["E"] >= scores["I"] else "I"
        type_code += "S" if scores["S"] >= scores["N"] else "N"
        type_code += "T" if scores["T"] >= scores["F"] else "F"
        type_code += "J" if scores["J"] >= scores["P"] else "P"

        return {
            "type": type_code,
            "scores": scores,
            "raw_scores": scores,
        }

    def get_interpretation(self, result: Dict[str, Any]) -> Dict[str, Any]:
        type_code = result.get("type", "")
        interpretations = {
            "ISTJ": {"description": "务实有序", "strengths": ["可靠", "负责", "细致"]},
            "ISFJ": {"description": "温暖关怀", "strengths": ["体贴", "耐心", "可靠"]},
            "INFJ": {"description": "洞察深刻", "strengths": ["直觉", "创意", "理想"]},
            "INTJ": {"description": "战略远见", "strengths": ["分析", "独立", "果断"]},
            "ISTP": {"description": "灵活务实", "strengths": ["务实", "灵活", "好奇"]},
            "ISFP": {"description": "艺术敏感", "strengths": ["艺术", "敏感", "真诚"]},
            "INFP": {"description": "理想主义", "strengths": ["理想", "忠诚", "创意"]},
            "INTP": {"description": "逻辑分析", "strengths": ["逻辑", "好奇", "创新"]},
            "ESTP": {"description": "精力充沛", "strengths": ["活力", "实际", "适应"]},
            "ESFP": {"description": "热情友好", "strengths": ["热情", "社交", "灵活"]},
            "ENFP": {"description": "热情创意", "strengths": ["热情", "创意", "乐观"]},
            "ENTP": {"description": "机智创新", "strengths": ["创新", "机智", "好奇"]},
            "ESTJ": {"description": "组织高效", "strengths": ["组织", "负责", "务实"]},
            "ESFJ": {"description": "热心助人", "strengths": ["热心", "合作", "组织"]},
            "ENFJ": {"description": "鼓舞领袖", "strengths": ["鼓舞", "热情", "负责"]},
            "ENTJ": {"description": "果断领袖", "strengths": ["果断", "战略", "自信"]},
        }
        return interpretations.get(type_code, {"description": "未定义", "strengths": []})

    def get_recommendations(self, result: Dict[str, Any]) -> List[str]:
        type_code = result.get("type", "")
        recommendations = {
            "ISTJ": ["制定清晰的计划", "学会放松", "培养灵活性"],
            "ISFJ": ["照顾自己", "学会拒绝", "表达需求"],
            "INFJ": ["保护精力", "寻找理解者", "实践想法"],
            "INTJ": ["学会耐心", "倾听他人", "享受过程"],
            "ISTP": ["关注细节", "考虑后果", "建立深度"],
            "ISFP": ["表达想法", "设定边界", "坚持目标"],
            "INFP": ["行动起来", "接受现实", "保护热情"],
            "INTP": ["完成项目", "关注他人", "建立结构"],
            "ESTP": ["考虑影响", "培养耐心", "深入思考"],
            "ESFP": ["规划未来", "专注深度", "控制冲动"],
            "ENFP": ["完成计划", "关注细节", "学会拒绝"],
            "ENTP": ["专注执行", "关注他人", "完成承诺"],
            "ESTJ": ["倾听意见", "培养同理心", "学会放松"],
            "ESFJ": ["关注自我", "学会拒绝", "发展独立性"],
            "ENFJ": ["保护隐私", "设定边界", "接受不完美"],
            "ENTJ": ["倾听他人", "培养耐心", "关注感受"],
        }
        return recommendations.get(type_code, ["了解自己的优势", "持续成长"])
