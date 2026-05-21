import json
import re
from pathlib import Path
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.assessment import AssessmentMetadata


class AssessmentDataService:
    def __init__(self, data_dir: Optional[Path] = None):
        self.data_dir = data_dir or Path("app/data/assessments")
        self._cache: Dict[str, Any] = {}
        # 从后端根目录定位前端数据
        self._frontend_data_dir = Path(__file__).parent.parent.parent.parent / "src/data/assessments"

    def _parse_ts_file(self, file_path: Path) -> Dict[str, Any]:
        content = file_path.read_text(encoding='utf-8')
        match = re.search(r'export\s+const\s+\w+\s*=\s*(\{[\s\S]*?\})', content)
        if match:
            ts_dict_str = match.group(1)
            ts_dict_str = ts_dict_str.replace("'", '"')
            ts_dict_str = re.sub(r'(\w+):', r'"\1":', ts_dict_str)
            ts_dict_str = ts_dict_str.replace('true', 'true').replace('false', 'false')
            try:
                return json.loads(ts_dict_str)
            except json.JSONDecodeError:
                pass
        return {}

    def load_assessment(self, assessment_id: str) -> Dict[str, Any]:
        if assessment_id in self._cache:
            return self._cache[assessment_id]

        # 优先从后端目录读取
        file_path = self.data_dir / f"{assessment_id}.json"
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self._cache[assessment_id] = data
                return data
        
        # 从前端目录读取
        frontend_path = self._frontend_data_dir / f"{assessment_id}.ts"
        if frontend_path.exists():
            data = self._parse_ts_file(frontend_path)
            if data:
                self._cache[assessment_id] = data
                return data
        
        return {}

    def load_assessment_schema(self, assessment_id: str) -> Dict[str, Any]:
        return self.load_assessment(assessment_id)

    def list_assessments(self) -> List[Dict[str, Any]]:
        assessments = []
        
        # 从前端数据目录读取
        if self._frontend_data_dir.exists():
            for ts_file in self._frontend_data_dir.glob("*.ts"):
                data = self._parse_ts_file(ts_file)
                if data and 'id' in data:
                    assessments.append(data)
        
        return assessments

    def get_categories(self) -> List[str]:
        categories = set()
        assessments = self.list_assessments()
        for a in assessments:
            if 'category' in a:
                categories.add(a['category'])
        return sorted(categories)

    def get_assessment_metadata(self, db: Session, assessment_id: str) -> Optional[AssessmentMetadata]:
        return db.query(AssessmentMetadata).filter(AssessmentMetadata.id == assessment_id).first()

    def get_all_metadata(self, db: Session) -> List[AssessmentMetadata]:
        return db.query(AssessmentMetadata).all()
