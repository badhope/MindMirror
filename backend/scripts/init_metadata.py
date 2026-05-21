import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import SessionLocal, engine, Base
from app.models.assessment import AssessmentMetadata

def init_metadata():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    backend_data = Path(__file__).parent.parent / "app/data/assessments"
    count = 0
    
    for json_file in sorted(backend_data.glob("*.json")):
        if json_file.name == 'index.json':
            continue
        
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        assessment_id = json_file.stem
        
        existing = db.query(AssessmentMetadata).filter(
            AssessmentMetadata.id == assessment_id
        ).first()
        
        if not existing:
            duration = 5
            if 'duration' in data:
                if isinstance(data['duration'], int):
                    duration = data['duration']
                elif isinstance(data['duration'], str):
                    try:
                        duration = int(data['duration'].replace('分钟', '').replace('min', ''))
                    except:
                        duration = 5
            
            question_count = 0
            if 'questions' in data and isinstance(data['questions'], list):
                question_count = len(data['questions'])
            elif 'questionCount' in data:
                question_count = data['questionCount']
            
            metadata = AssessmentMetadata(
                id=assessment_id,
                title=data.get('title', assessment_id),
                description=data.get('description', ''),
                category=data.get('category', '其他'),
                subcategory=data.get('subcategory', ''),
                difficulty=data.get('difficulty', 'medium'),
                question_count=question_count,
                estimated_time=duration,
                tags=data.get('tags', []),
            )
            db.add(metadata)
            count += 1
            print(f"✓ {assessment_id}")
    
    db.commit()
    db.close()
    print(f"\nTotal: {count} records added")

if __name__ == "__main__":
    print("=" * 60)
    print("Initializing Assessment Metadata")
    print("=" * 60)
    init_metadata()
