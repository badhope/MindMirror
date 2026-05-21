from typing import Dict, Type
from app.services.calculators import (
    BaseCalculator,
    MBTICalculator,
    BigFiveCalculator,
    SASCalculator,
    SDSCalculator,
    HollandCalculator,
    DarkTriadCalculator,
    EQCalculator,
)


class CalculatorFactory:
    _calculators: Dict[str, Type[BaseCalculator]] = {
        "sbti-personality": MBTICalculator,
        "ocean-bigfive": BigFiveCalculator,
        "sas-anxiety": SASCalculator,
        "sds-depression": SDSCalculator,
        "holland-career": HollandCalculator,
        "dark-triad": DarkTriadCalculator,
        "eq-emotional": EQCalculator,
    }

    @classmethod
    def get_calculator(cls, assessment_id: str) -> BaseCalculator:
        calculator_class = cls._calculators.get(assessment_id)
        if calculator_class:
            return calculator_class()
        return DefaultCalculator()


class DefaultCalculator(BaseCalculator):
    def calculate(self, answers):
        scores = {}
        for answer in answers:
            trait = answer.get("trait", "unknown")
            value = answer.get("value", 0)
            scores[trait] = scores.get(trait, 0) + value
        return {"scores": scores}

    def get_interpretation(self, result):
        return {"description": "测评结果分析", "scores": result.get("scores", {})}

    def get_recommendations(self, result):
        return ["继续保持自我觉察", "关注个人成长"]
