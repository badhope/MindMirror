import json
import re
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import SessionLocal, engine, Base
from app.models.assessment import AssessmentMetadata


def parse_ts_export(file_path: Path) -> dict:
    content = file_path.read_text(encoding='utf-8')
    
    match = re.search(r'export\s+const\s+\w+\s*=\s*(\{[\s\S]*?\})', content)
    if match:
        ts_dict_str = match.group(1)
        ts_dict_str = ts_dict_str.replace("'", "\"")
        ts_dict_str = re.sub(r'(\w+):', r'"\1":', ts_dict_str)
        ts_dict_str = ts_dict_str.replace('true', 'true').replace('false', 'false')
        
        try:
            return json.loads(ts_dict_str)
        except json.JSONDecodeError:
            pass
    
    return {}


def migrate_assessments():
    frontend_data = Path("src/data/assessments/")
    backend_data = Path("backend/app/data/assessments/")
    backend_data.mkdir(parents=True, exist_ok=True)
    
    for ts_file in frontend_data.glob("*.ts"):
        assessment_id = ts_file.stem
        data = parse_ts_export(ts_file)
        
        if data:
            output_path = backend_data / f"{assessment_id}.json"
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Migrated: {assessment_id}")


def init_metadata():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    backend_data = Path("backend/app/data/assessments/")
    for json_file in backend_data.glob("*.json"):
        assessment_id = json_file.stem
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        existing = db.query(AssessmentMetadata).filter(AssessmentMetadata.id == assessment_id).first()
        if not existing:
            metadata = AssessmentMetadata(
                id=assessment_id,
                title=data.get('title', ''),
                description=data.get('description', ''),
                category=data.get('category', ''),
                subcategory=data.get('subcategory', ''),
                difficulty=data.get('difficulty', 'medium'),
                question_count=len(data.get('questions', [])),
                estimated_time=data.get('estimatedTime', 5),
                tags=data.get('tags', []),
            )
            db.add(metadata)
    
    db.commit()
    db.close()
    print("Metadata initialized")


if __name__ == "__main__":
    migrate_assessments()
    init_metadata()
