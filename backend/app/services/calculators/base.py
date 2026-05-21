from abc import ABC, abstractmethod
from typing import Dict, Any, List


class BaseCalculator(ABC):
    @abstractmethod
    def calculate(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_interpretation(self, result: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_recommendations(self, result: Dict[str, Any]) -> List[str]:
        pass
