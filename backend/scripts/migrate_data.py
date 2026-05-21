import json
import re
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.database import SessionLocal, engine, Base
from app.models.assessment import AssessmentMetadata


def parse_ts_file(content: str) -> dict:
    lines = content.split('\n')
    
    start_line = -1
    for i, line in enumerate(lines):
        if 'export const' in line and 'Assessment' in line:
            start_line = i
            break
    
    if start_line == -1:
        return None
    
    brace_count = 0
    started = False
    obj_lines = []
    
    for i in range(start_line, len(lines)):
        line = lines[i]
        obj_lines.append(line)
        
        for c in line:
            if c == '{':
                brace_count += 1
                started = True
            elif c == '}':
                brace_count -= 1
        
        if started and brace_count == 0:
            break
    
    obj_str = '\n'.join(obj_lines)
    
    obj_str = obj_str.replace("'", '"')
    obj_str = re.sub(r'export\s+const\s+\w+\s*:\s*Assessment\s*=\s*', '', obj_str)
    obj_str = obj_str.rstrip(',; \n')
    obj_str = re.sub(r':\s*\w+\s*([,\}])', r'\1', obj_str)
    
    try:
        return json.loads(obj_str)
    except json.JSONDecodeError:
        return None


def migrate_assessments():
    backend_dir = Path(__file__).parent.parent
    workspace_root = backend_dir.parent
    frontend_data = workspace_root / "src/data/assessments"
    backend_data = backend_dir / "app/data/assessments"
    backend_data.mkdir(parents=True, exist_ok=True)
    
    migrated = []
    failed = []
    
    for ts_file in sorted(frontend_data.glob("*.ts")):
        if ts_file.name == 'index.ts':
            continue
        
        try:
            content = ts_file.read_text()
            data = parse_ts_file(content)
            
            if data and 'id' in data:
                assessment_id = data.get('id', ts_file.stem)
                output_path = backend_data / f"{assessment_id}.json"
                
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                migrated.append(assessment_id)
            else:
                failed.append(ts_file.name)
        except Exception as e:
            failed.append(f"{ts_file.name}: {e}")
    
    print(f"Migrated: {len(migrated)}")
    if migrated:
        print(f"Examples: {', '.join(migrated[:5])}")
    print(f"Failed: {len(failed)}")
    if failed:
        print(f"Examples: {', '.join(failed[:5])}")
    
    return migrated, failed


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
        
        existing = db.query(AssessmentMetadata).filter(
            AssessmentMetadata.id == json_file.stem
        ).first()
        
        if not existing:
            duration = 5
            if isinstance(data.get('duration'), int):
                duration = data['duration']
            elif isinstance(data.get('duration'), str):
                try:
                    duration = int(data['duration'].replace('分钟', '').replace('min', ''))
                except:
                    pass
            
            metadata = AssessmentMetadata(
                id=json_file.stem,
                title=data.get('title', json_file.stem),
                description=data.get('description', ''),
                category=data.get('category', '其他'),
                subcategory=data.get('subcategory', ''),
                difficulty=data.get('difficulty', 'medium'),
                question_count=data.get('questionCount', len(data.get('questions', []))),
                estimated_time=duration,
                tags=data.get('tags', []),
            )
            db.add(metadata)
            count += 1
    
    db.commit()
    db.close()
    print(f"Metadata: {count} records")


if __name__ == "__main__":
    print("=" * 60)
    print("MindMirror Data Migration")
    print("=" * 60)
    
    print("\n[1/2] Migrating...")
    migrate_assessments()
    
    print("\n[2/2] Metadata...")
    init_metadata()
    
    print("\nDone!")
