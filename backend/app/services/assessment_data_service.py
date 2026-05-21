import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.assessment import AssessmentMetadata


class AssessmentDataService:
    def __init__(self, data_dir: Optional[Path] = None):
        self.data_dir = data_dir or Path("app/data/assessments")
        self._cache: Dict[str, Any] = {}

    def load_assessment(self, assessment_id: str) -> Dict[str, Any]:
        if assessment_id in self._cache:
            return self._cache[assessment_id]

        file_path = self.data_dir / f"{assessment_id}.json"
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self._cache[assessment_id] = data
                return data
        return {}

    def list_assessments(self) -> List[str]:
        if not self.data_dir.exists():
            return []
        return [p.stem for p in self.data_dir.glob("*.json")]

    def get_assessment_metadata(self, db: Session, assessment_id: str) -> Optional[AssessmentMetadata]:
        return db.query(AssessmentMetadata).filter(AssessmentMetadata.id == assessment_id).first()

    def get_all_metadata(self, db: Session) -> List[AssessmentMetadata]:
        return db.query(AssessmentMetadata).all()
